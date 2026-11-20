import { Link } from 'react-router'
import { ArrowRight, BookOpenCheck, Calculator, CheckCircle2, CircleDot, Clock, FlaskConical, GraduationCap, Sparkles } from 'lucide-react'
import { MODULES, PHASES, modulePath } from '@/content/modules'
import { QUIZ } from '@/content/quiz'
import { useProgress } from '@/store/progress'
import { Badge, Card, CardBody, buttonClasses } from '@/components/ui'
import { cn } from '@/lib/utils'

const UPDATES = [
  ['Random effects', 'REML τ² by default; HKSJ confidence intervals when τ² > 0 and k > 2; prediction intervals (Cochrane RevMan methods).'],
  ['Risk of bias', 'RoB 2; ROBINS-I V2 revised draft (Nov 2025); ROBINS-E (2024); ROB-ME for missing evidence (2023); PROBAST+AI (2025).'],
  ['Certainty', 'Core GRADE series (BMJ 2025): choosing the target of the rating, imprecision against thresholds, inconsistency.'],
  ['Reporting', 'PRISMA 2020 with PRISMA-S, PRISMA-LSR (2024) and PRISMA-C (2026); SWiM; TARCiS for citation searching (2024).'],
  ['AI', 'Joint Cochrane–Campbell–JBI–CEE position on AI in evidence synthesis (Nov 2025, endorsing RAISE).'],
  ['Registration', 'New PROSPERO platform (2025) with automatic publication and duplicate-topic flagging.'],
]

export function Home() {
  const scores = useProgress((s) => s.scores)
  const visited = useProgress((s) => s.visited)
  const last = useProgress((s) => s.lastModule)
  const missed = useProgress((s) => Object.keys(s.missed).length)
  const exams = useProgress((s) => s.exams)
  const mastered = MODULES.filter((m) => scores[m.id]?.passed).length
  const next = MODULES.find((m) => !scores[m.id]?.passed) ?? MODULES[0]
  const resume = last && !scores[last]?.passed ? MODULES.find((m) => m.id === last)! : next
  const totalQ = Object.values(QUIZ).reduce((a, q) => a + q.length, 0)
  const bestExam = exams.length ? Math.max(...exams.map((e) => e.correct / e.total)) : null

  return (
    <div className="space-y-12">
      <section className="grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-5">
          <Badge tone="primary"><Sparkles className="h-3.5 w-3.5" />Current to Cochrane Handbook v6.5, PRISMA 2020 and Core GRADE 2025</Badge>
          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">Learn systematic reviews and meta-analysis <span className="text-primary">by doing one.</span></h1>
          <p className="max-w-2xl text-lg leading-relaxed text-muted">
            Seventeen modules take one review from question to Summary of findings. Every concept comes with a working lab — search builder,
            deduplication, screening, extraction traps, RoB 2, a meta-analysis engine validated against published results, GRADE and PRISMA tools —
            and a mastery check that explains every answer.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to={modulePath(resume.id)} className={buttonClasses('primary', 'lg')}>{mastered || last ? 'Continue' : 'Start'}: {resume.n}. {resume.short}<ArrowRight className="h-4 w-4" /></Link>
            <Link to="/tools" className={buttonClasses('outline', 'lg')}><Calculator className="h-4 w-4" />Open the toolkit</Link>
          </div>
        </div>
        <Card>
          <CardBody className="space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-sm font-medium text-muted">Mastery</div>
                <div className="text-3xl font-bold tabular">{mastered}<span className="text-lg text-muted"> / {MODULES.length}</span></div>
              </div>
              <ProgressRing value={mastered / MODULES.length} />
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-lg bg-surface-2 p-2"><div className="text-lg font-semibold tabular">{totalQ}</div>questions</div>
              <div className="rounded-lg bg-surface-2 p-2"><div className="text-lg font-semibold tabular">{missed}</div>to review</div>
              <div className="rounded-lg bg-surface-2 p-2"><div className="text-lg font-semibold tabular">{bestExam === null ? '—' : `${Math.round(bestExam * 100)}%`}</div>best exam</div>
            </div>
            <Link to="/exam" className={buttonClasses('secondary', 'md', 'w-full')}><GraduationCap className="h-4 w-4" />{missed ? `Review ${missed} missed question${missed > 1 ? 's' : ''}` : 'Mastery exam'}</Link>
          </CardBody>
        </Card>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        {[
          { icon: BookOpenCheck, title: 'Learn', text: 'Short, sourced explanations of what to do and why — no padding.' },
          { icon: FlaskConical, title: 'Practise', text: 'Labs on one running case; reuse every calculator on your own review.' },
          { icon: CheckCircle2, title: 'Prove it', text: '80% on a module check marks it mastered; the capstone and exam integrate everything.' },
        ].map((x) => (
          <div key={x.title} className="flex gap-3 rounded-xl border border-border bg-surface p-4">
            <x.icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div><div className="font-semibold">{x.title}</div><div className="text-sm text-muted">{x.text}</div></div>
          </div>
        ))}
      </section>

      <section className="space-y-6" aria-labelledby="path">
        <h2 id="path" className="text-2xl font-bold tracking-tight">The learning path</h2>
        {PHASES.map((p, pi) => (
          <div key={p.id} className="grid gap-3 lg:grid-cols-[14rem_1fr]">
            <div className="lg:pt-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-primary">Phase {pi + 1}</div>
              <div className="text-lg font-semibold">{p.label}</div>
              <div className="text-sm text-muted">{p.blurb}</div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {MODULES.filter((m) => m.phase === p.id).map((m) => {
                const s = scores[m.id]
                const status = s?.passed ? 'mastered' : visited[m.id] ? 'started' : 'new'
                return (
                  <Link key={m.id} to={modulePath(m.id)} className={cn('group rounded-xl border bg-surface p-4 transition-colors hover:border-primary', status === 'mastered' ? 'border-good/50' : 'border-border')}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold tabular', status === 'mastered' ? 'bg-good text-white' : 'bg-primary-soft text-primary')}>{m.n}</span>
                        <span className="font-semibold leading-snug group-hover:text-primary">{m.title}</span>
                      </div>
                      {status === 'mastered' ? <CheckCircle2 className="h-5 w-5 shrink-0 text-good" aria-label="Mastered" /> : status === 'started' ? <CircleDot className="h-5 w-5 shrink-0 text-warn" aria-label="Started" /> : null}
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{m.summary}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted">
                      <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{m.minutes} min</span>
                      <span>·</span><span>{m.labs.length} lab{m.labs.length > 1 ? 's' : ''}</span>
                      {s && <><span>·</span><span>best {Math.round(s.best * 100)}%</span></>}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </section>

      <section className="space-y-3" aria-labelledby="current">
        <h2 id="current" className="text-2xl font-bold tracking-tight">What’s current (reviewed November 2026)</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {UPDATES.map(([t, d]) => (
            <div key={t} className="rounded-xl border border-border bg-surface p-4">
              <div className="font-semibold">{t}</div>
              <div className="mt-1 text-sm text-muted">{d}</div>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted">Every claim links to its source — see <Link to="/references" className="text-primary underline underline-offset-2">Sources</Link>. Studies in the running case are synthetic.</p>
      </section>
    </div>
  )
}

function ProgressRing({ value }: { value: number }) {
  const r = 26
  const c = 2 * Math.PI * r
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" role="img" aria-label={`${Math.round(value * 100)}% mastered`}>
      <circle cx="32" cy="32" r={r} fill="none" stroke="var(--surface-2)" strokeWidth="7" />
      {value > 0 && <circle cx="32" cy="32" r={r} fill="none" stroke="var(--good)" strokeWidth="7" strokeDasharray={`${c * value} ${c}`} strokeLinecap="round" transform="rotate(-90 32 32)" />}
      <text x="32" y="36" textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--fg)">{Math.round(value * 100)}%</text>
    </svg>
  )
}
