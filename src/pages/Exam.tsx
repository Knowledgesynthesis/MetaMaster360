import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import { GraduationCap, RotateCcw, Target } from 'lucide-react'
import { ALL_QUESTIONS } from '@/content/quiz'
import { MODULES, PASS_MARK, modulePath } from '@/content/modules'
import type { ModuleId } from '@/content/types'
import { useProgress } from '@/store/progress'
import { QuizRunner, type QuizResult } from '@/components/learn/QuizRunner'
import { Button, Card, CardBody, Badge } from '@/components/ui'
import { seededShuffle, cn } from '@/lib/utils'

type Mode = 'menu' | 'exam' | 'review' | 'done'

/** One question from every module, then fill to n with random others. */
function buildExam(seed: number, n = 30) {
  const byModule = MODULES.map((m) => seededShuffle(ALL_QUESTIONS.filter((q) => q.module === m.id), seed + m.n))
  const first = byModule.map((qs) => qs[0]).filter(Boolean)
  const rest = seededShuffle(byModule.flatMap((qs) => qs.slice(1)), seed)
  return [...first, ...rest].slice(0, n)
}

export default function Exam() {
  const missed = useProgress((s) => s.missed)
  const exams = useProgress((s) => s.exams)
  const recordExam = useProgress((s) => s.recordExam)
  const recordAnswers = useProgress((s) => s.recordAnswers)
  const [mode, setMode] = useState<Mode>('menu')
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 1e6))
  const [results, setResults] = useState<QuizResult[]>([])
  useEffect(() => { document.title = 'Mastery exam — MetaMaster360' }, [])

  const exam = useMemo(() => buildExam(seed), [seed])
  const [reviewSet, setReviewSet] = useState(() => ALL_QUESTIONS.filter((q) => missed[q.id]))

  const finishExam = (r: QuizResult[]) => {
    recordExam(r.filter((x) => x.correct).length, r.length)
    recordAnswers(r)
    setResults(r)
    setMode('done')
  }

  const breakdown = useMemo(() => {
    const map = new Map<ModuleId, { c: number; t: number }>()
    for (const r of results) {
      const q = ALL_QUESTIONS.find((x) => x.id === r.questionId)
      if (!q) continue
      const e = map.get(q.module) ?? { c: 0, t: 0 }
      e.t++
      if (r.correct) e.c++
      map.set(q.module, e)
    }
    return MODULES.filter((m) => map.has(m.id)).map((m) => ({ m, ...map.get(m.id)! }))
  }, [results])

  if (mode === 'exam' || mode === 'review') {
    const qs = mode === 'exam' ? exam : reviewSet
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-2xl font-bold tracking-tight">{mode === 'exam' ? 'Mastery exam' : 'Review missed questions'}</h1>
          <Button variant="ghost" size="sm" onClick={() => setMode('menu')}>Leave</Button>
        </div>
        <Card><CardBody><QuizRunner key={mode + seed} title="Question" seed={seed} questions={qs} onFinish={(r) => (mode === 'exam' ? finishExam(r) : recordAnswers(r))} /></CardBody></Card>
      </div>
    )
  }

  if (mode === 'done') {
    const correct = results.filter((r) => r.correct).length
    const pct = correct / Math.max(1, results.length)
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Exam result</h1>
        <Card className={pct >= PASS_MARK ? 'border-good/50' : 'border-warn/50'}>
          <CardBody className="space-y-1 text-center">
            <div className="text-4xl font-bold tabular">{correct} / {results.length}</div>
            <div className="text-sm text-muted">{pct >= PASS_MARK ? 'Pass — you can run and defend a systematic review and meta-analysis.' : `Below ${Math.round(PASS_MARK * 100)}%: revisit the modules below, then retake.`}</div>
          </CardBody>
        </Card>
        <div className="space-y-2">
          <h2 className="font-semibold">By module</h2>
          {breakdown.map(({ m, c, t }) => (
            <Link key={m.id} to={modulePath(m.id)} className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-lg border border-border bg-surface px-3 py-2 text-sm hover:border-primary">
              <span>{m.n}. {m.title}</span>
              <Badge tone={c === t ? 'good' : c === 0 ? 'bad' : 'warn'}>{c}/{t}</Badge>
            </Link>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => { setSeed(seed + 1); setMode('exam') }}><RotateCcw className="h-4 w-4" />New exam</Button>
          <Button variant="outline" onClick={() => setMode('menu')}>Back</Button>
        </div>
      </div>
    )
  }

  const missedCount = Object.keys(missed).length
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Mastery exam</h1>
        <p className="text-muted">30 questions drawn across all {MODULES.length} modules (at least one from each), reshuffled every attempt, every answer explained. Pass mark {Math.round(PASS_MARK * 100)}%.</p>
      </header>
      <div className="grid gap-3 sm:grid-cols-2">
        <Card>
          <CardBody className="space-y-3">
            <GraduationCap className="h-6 w-6 text-primary" />
            <div className="font-semibold">Full exam</div>
            <div className="text-sm text-muted">{ALL_QUESTIONS.length} questions in the bank; recall, application and analysis items.</div>
            <Button className="w-full" onClick={() => { setSeed(Math.floor(Math.random() * 1e6)); setMode('exam') }}>Start exam</Button>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="space-y-3">
            <Target className="h-6 w-6 text-accent" />
            <div className="font-semibold">Spaced review</div>
            <div className="text-sm text-muted">{missedCount ? `${missedCount} question${missedCount > 1 ? 's' : ''} you missed. Answer correctly to clear them.` : 'Nothing to review — questions you miss anywhere land here.'}</div>
            <Button className="w-full" variant="secondary" disabled={!missedCount} onClick={() => { setReviewSet(ALL_QUESTIONS.filter((q) => missed[q.id])); setMode('review') }}>Review missed</Button>
          </CardBody>
        </Card>
      </div>
      {exams.length > 0 && (
        <div className="space-y-2">
          <h2 className="font-semibold">History</h2>
          <div className="flex flex-wrap gap-2">
            {exams.slice().reverse().map((e, i) => (
              <span key={i} className={cn('rounded-md border px-2 py-1 text-xs tabular', e.correct / e.total >= PASS_MARK ? 'border-good/50' : 'border-border')}>
                {new Date(e.date).toLocaleDateString()} · {e.correct}/{e.total}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
