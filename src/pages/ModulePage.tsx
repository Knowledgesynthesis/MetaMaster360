import { Suspense, useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router'
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, FlaskConical, Target } from 'lucide-react'
import { MODULES, MODULE_BY_ID, PASS_MARK, PHASES, modulePath } from '@/content/modules'
import type { ModuleId } from '@/content/types'
import { MODULE_CONTENT } from '@/modules'
import { QUIZ } from '@/content/quiz'
import { useProgress } from '@/store/progress'
import { QuizRunner } from '@/components/learn/QuizRunner'
import { Toc, useToc } from '@/components/learn/Toc'
import { Badge, Card, CardBody, buttonClasses } from '@/components/ui'
import { NotFound } from './NotFound'

export function ModulePage() {
  const { id } = useParams()
  const meta = id ? MODULE_BY_ID[id as ModuleId] : undefined
  const visit = useProgress((s) => s.visit)
  const recordQuiz = useProgress((s) => s.recordQuiz)
  const score = useProgress((s) => (meta ? s.scores[meta.id] : undefined))
  const contentRef = useRef<HTMLDivElement>(null)
  const toc = useToc(contentRef, id ?? '')

  // Scroll to a deep-linked section once the lazily loaded content has rendered.
  const scrolledFor = useRef<string | null>(null)
  useEffect(() => {
    const hash = window.location.hash.slice(1)
    if (!hash || scrolledFor.current === id + hash) return
    const el = document.getElementById(hash)
    if (el) {
      el.scrollIntoView()
      scrolledFor.current = id + hash
    }
  }, [toc, id])

  useEffect(() => {
    if (meta) {
      visit(meta.id)
      document.title = `${meta.n}. ${meta.title} — MetaMaster360`
    }
  }, [meta, visit])

  if (!meta) return <NotFound />
  const Content = MODULE_CONTENT[meta.id]
  const questions = QUIZ[meta.id]
  const idx = MODULES.findIndex((m) => m.id === meta.id)
  const prev = MODULES[idx - 1]
  const next = MODULES[idx + 1]
  const phase = PHASES.find((p) => p.id === meta.phase)!

  return (
    <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_13rem] xl:gap-10">
      <article className="min-w-0 space-y-10" ref={contentRef}>
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-muted">
            <span className="uppercase tracking-wider text-primary">{phase.label}</span>
            <span aria-hidden>·</span>
            <span>Module {meta.n} of {MODULES.length}</span>
            <span aria-hidden>·</span>
            <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{meta.minutes} min</span>
            {score?.passed && <Badge tone="good"><CheckCircle2 className="h-3.5 w-3.5" />Mastered · best {Math.round(score.best * 100)}%</Badge>}
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{meta.title}</h1>
          <p className="max-w-3xl text-lg leading-relaxed text-muted">{meta.summary}</p>
          <Card>
            <CardBody className="grid gap-4 md:grid-cols-[1fr_auto]">
              <div>
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold"><Target className="h-4 w-4 text-primary" />After this module you can</div>
                <ul className="space-y-1.5 text-sm leading-relaxed">
                  {meta.objectives.map((o) => (
                    <li key={o} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />{o}</li>
                  ))}
                </ul>
              </div>
              <div className="md:w-56 md:border-l md:border-border md:pl-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold"><FlaskConical className="h-4 w-4 text-accent" />Labs</div>
                <ul className="space-y-1 text-sm text-muted">{meta.labs.map((l) => <li key={l}>{l}</li>)}</ul>
              </div>
            </CardBody>
          </Card>
        </header>

        <Suspense fallback={<div className="h-64 animate-pulse rounded-xl bg-surface-2" aria-label="Loading module" />}>
          <Content />
        </Suspense>

        {questions?.length > 0 && (
          <section id="mastery-check" data-toc="Mastery check" className="scroll-mt-20 space-y-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-primary">Retrieval practice</div>
              <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Mastery check</h2>
              <p className="mt-1 text-sm text-muted">{questions.length} questions · {Math.round(PASS_MARK * 100)}% marks the module complete · every answer is explained.</p>
            </div>
            <Card>
              <CardBody>
                <QuizRunner key={meta.id} questions={questions} seed={meta.n} onFinish={(r) => recordQuiz(meta.id, r)} />
              </CardBody>
            </Card>
          </section>
        )}

        <nav className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:justify-between" aria-label="Module navigation">
          {prev ? (
            <Link to={modulePath(prev.id)} className={buttonClasses('outline', 'lg', 'justify-start')}><ArrowLeft className="h-4 w-4" /><span className="truncate">{prev.n}. {prev.title}</span></Link>
          ) : <span />}
          {next && (
            <Link to={modulePath(next.id)} className={buttonClasses('primary', 'lg', 'justify-end')}><span className="truncate">{next.n}. {next.title}</span><ArrowRight className="h-4 w-4" /></Link>
          )}
        </nav>
      </article>
      <aside className="hidden xl:block">
        <div className="sticky top-20 max-h-[calc(100dvh-6rem)] overflow-y-auto"><Toc items={toc} /></div>
      </aside>
    </div>
  )
}
