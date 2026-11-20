import { useMemo, useState } from 'react'
import { ArrowRight, CheckCircle2, RotateCcw, XCircle } from 'lucide-react'
import type { QuizQuestion } from '@/content/types'
import { Button, Badge } from '@/components/ui'
import { cn, seededShuffle } from '@/lib/utils'
import { PASS_MARK } from '@/content/modules'

export interface QuizResult {
  questionId: string
  correct: boolean
}

export function QuizRunner({ questions, onFinish, passMark = PASS_MARK, title, seed: seedProp }: {
  questions: QuizQuestion[]
  onFinish?: (results: QuizResult[]) => void
  passMark?: number
  title?: string
  seed?: number
}) {
  const [attempt, setAttempt] = useState(0)
  const seed = (seedProp ?? 7) + attempt * 101
  const order = useMemo(() => seededShuffle(questions, seed), [questions, seed])
  const [idx, setIdx] = useState(0)
  const [chosen, setChosen] = useState<number | null>(null)
  const [results, setResults] = useState<QuizResult[]>([])
  const done = results.length === order.length && order.length > 0

  const q = order[idx]
  const optionOrder = useMemo(() => (q ? seededShuffle(q.options.map((_, i) => i), seed + idx * 13) : []), [q, seed, idx])

  if (!order.length) return null

  const submit = (opt: number) => {
    if (chosen !== null) return
    setChosen(opt)
  }
  const next = () => {
    const r = [...results, { questionId: q.id, correct: chosen === q.answer }]
    setResults(r)
    setChosen(null)
    if (r.length === order.length) onFinish?.(r)
    else setIdx(idx + 1)
  }
  const restart = () => {
    setAttempt(attempt + 1)
    setIdx(0)
    setChosen(null)
    setResults([])
  }

  if (done) {
    const correct = results.filter((r) => r.correct).length
    const score = correct / results.length
    const passed = score >= passMark
    const missed = order.filter((qq) => !results.find((r) => r.questionId === qq.id)?.correct)
    return (
      <div className="space-y-4">
        <div className={cn('rounded-xl border p-5 text-center', passed ? 'border-good/50 bg-good-soft/60' : 'border-warn/50 bg-warn-soft/60')}>
          <div className="text-3xl font-bold tabular">{correct} / {results.length}</div>
          <div className="mt-1 text-sm font-medium">{passed ? 'Mastery reached' : `Not yet — ${Math.round(passMark * 100)}% needed`}</div>
          <div className="mt-1 text-xs text-muted">{passed ? 'Module marked complete.' : 'Review the explanations below, revisit the relevant section, and retry. Questions and options are reshuffled.'}</div>
        </div>
        {missed.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-semibold">Review what you missed</div>
            {missed.map((m) => (
              <div key={m.id} className="rounded-lg border border-border bg-surface p-3 text-sm">
                <div className="font-medium">{m.stem}</div>
                <div className="mt-1 text-good">✓ {m.options[m.answer]}</div>
                <div className="mt-1 text-muted">{m.explain}</div>
              </div>
            ))}
          </div>
        )}
        <Button variant="outline" onClick={restart}><RotateCcw className="h-4 w-4" />Retry</Button>
      </div>
    )
  }

  const answered = chosen !== null
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-medium text-muted">{title ?? 'Question'} {idx + 1} of {order.length}</span>
        <div className="h-1.5 w-32 overflow-hidden rounded-full bg-surface-2" aria-hidden>
          <div className="h-full bg-primary transition-all" style={{ width: `${(idx / order.length) * 100}%` }} />
        </div>
      </div>
      <fieldset>
        <legend className="mb-3 text-base font-medium leading-relaxed">{q.stem}</legend>
        <div className="space-y-2">
          {optionOrder.map((oi) => {
            const isAnswer = oi === q.answer
            const isChosen = oi === chosen
            return (
              <button
                key={oi}
                type="button"
                disabled={answered}
                onClick={() => submit(oi)}
                aria-pressed={isChosen}
                className={cn(
                  'flex w-full items-start gap-3 rounded-lg border p-3 text-left text-sm leading-relaxed transition-colors disabled:cursor-default',
                  !answered && 'border-border bg-surface hover:border-primary hover:bg-primary-soft/40',
                  answered && isAnswer && 'border-good bg-good-soft/70',
                  answered && isChosen && !isAnswer && 'border-bad bg-bad-soft/70',
                  answered && !isAnswer && !isChosen && 'border-border opacity-60',
                )}
              >
                <span className="mt-0.5 shrink-0">
                  {answered && isAnswer ? <CheckCircle2 className="h-4 w-4 text-good" /> : answered && isChosen ? <XCircle className="h-4 w-4 text-bad" /> : <span className="block h-4 w-4 rounded-full border border-border" />}
                </span>
                <span>{q.options[oi]}</span>
              </button>
            )
          })}
        </div>
      </fieldset>
      {answered && (
        <div className={cn('rounded-lg border p-3 text-sm leading-relaxed', chosen === q.answer ? 'border-good/40 bg-good-soft/50' : 'border-bad/40 bg-bad-soft/50')} role="status">
          <div className="mb-1 font-semibold">{chosen === q.answer ? 'Correct' : 'Incorrect'}</div>
          {q.explain}
        </div>
      )}
      <div className="flex items-center justify-between">
        {q.level && <Badge tone={q.level === 3 ? 'warn' : q.level === 2 ? 'primary' : 'neutral'}>{['', 'Recall', 'Application', 'Analysis'][q.level]}</Badge>}
        <Button className="ml-auto" disabled={!answered} onClick={next}>
          {idx + 1 === order.length ? 'See results' : 'Next'} <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
