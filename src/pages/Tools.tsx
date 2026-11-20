import { lazy, Suspense, useEffect } from 'react'
import { Link, useParams } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonClasses } from '@/components/ui'

const T = {
  'meta-analysis': { name: 'Meta-analysis engine', desc: 'Continuous, binary or estimate + CI; REML/DL, HKSJ/Wald, prediction interval, subgroups, CSV import/export.', group: 'Synthesis', C: lazy(() => import('@/labs/MetaLab').then((m) => ({ default: () => <m.MetaLab /> }))) },
  'effect-size': { name: 'Effect-size calculator', desc: 'MD, Hedges’ g, RR, OR, RD, NNT, and ln estimate + SE from any CI.', group: 'Synthesis', C: lazy(() => import('@/labs/EffectSizeCalc').then((m) => ({ default: () => <m.EffectSizeCalc /> }))) },
  conversions: { name: 'Data-conversion calculators', desc: 'SE/CI → SD, median/IQR → mean/SD, combine arms, change-score SD, cluster design effect.', group: 'Data', C: lazy(() => import('@/labs/ConversionCalcs').then((m) => ({ default: () => <m.ConversionCalcs /> }))) },
  'publication-bias': { name: 'Publication-bias simulator', desc: 'Funnel and contour-enhanced funnel plots, Egger test, hidden studies.', group: 'Synthesis', C: lazy(() => import('@/labs/PubBiasSim').then((m) => ({ default: () => <m.PubBiasSim /> }))) },
  'vote-counting': { name: 'Vote counting by direction', desc: 'Sign test, Wilson interval and effect-direction plot.', group: 'Synthesis', C: lazy(() => import('@/labs/VoteCounting').then((m) => ({ default: () => <m.VoteCounting /> }))) },
  'indirect': { name: 'Indirect comparison (Bucher)', desc: 'A vs B through a common comparator C.', group: 'Synthesis', C: lazy(() => import('@/labs/AdvancedLabs').then((m) => ({ default: () => <m.BucherCalc /> }))) },
  grade: { name: 'GRADE certainty rater', desc: 'Start level, five reasons down, three up, footnotes and informative statement.', group: 'Certainty', C: lazy(() => import('@/labs/GradeLabs').then((m) => ({ default: () => <m.GradeRater /> }))) },
  imprecision: { name: 'Imprecision assistant', desc: 'Core GRADE: CI vs null or MID; optimal information size.', group: 'Certainty', C: lazy(() => import('@/labs/GradeLabs').then((m) => ({ default: () => <m.ImprecisionAssistant /> }))) },
  sof: { name: 'Summary of findings builder', desc: 'Absolute effects per 1000, certainty, statements; Markdown and CSV export.', group: 'Certainty', C: lazy(() => import('@/labs/SofBuilder').then((m) => ({ default: () => <m.SofBuilder /> }))) },
  question: { name: 'Question builder & critic', desc: 'PICO, PECO, DTA, PICOTS, SPIDER, PCC with eligibility table.', group: 'Planning', C: lazy(() => import('@/labs/QuestionBuilder').then((m) => ({ default: () => <m.QuestionBuilder /> }))) },
  protocol: { name: 'Protocol generator', desc: 'PRISMA-P sections; downloads Markdown ready for registration.', group: 'Planning', C: lazy(() => import('@/labs/ProtocolGenerator').then((m) => ({ default: () => <m.ProtocolGenerator /> }))) },
  search: { name: 'Search builder & linter', desc: 'PubMed and Ovid MEDLINE syntax, Cochrane RCT filter, PRESS-style checks.', group: 'Planning', C: lazy(() => import('@/labs/SearchBuilder').then((m) => ({ default: () => <m.SearchBuilder /> }))) },
  kappa: { name: 'Screening agreement (κ)', desc: 'Cohen’s kappa with CI and PABAK.', group: 'Selection', C: lazy(() => import('@/labs/KappaCalc').then((m) => ({ default: () => <m.KappaCalc /> }))) },
  'prisma-flow': { name: 'PRISMA 2020 flow builder', desc: 'Flow diagram with arithmetic consistency checks.', group: 'Selection', C: lazy(() => import('@/labs/PrismaBuilder').then((m) => ({ default: () => <m.PrismaBuilder /> }))) },
  'prisma-checklist': { name: 'PRISMA 2020 checklist', desc: '27-item self-audit with locations; exports Markdown.', group: 'Reporting', C: lazy(() => import('@/labs/ReportingLabs').then((m) => ({ default: () => <m.PrismaChecklist /> }))) },
} as const

type ToolId = keyof typeof T
const GROUPS = ['Planning', 'Selection', 'Data', 'Synthesis', 'Certainty', 'Reporting']

export default function Tools() {
  const { tool } = useParams()
  const current = tool && tool in T ? (tool as ToolId) : null
  useEffect(() => { document.title = `${current ? T[current].name : 'Toolkit'} — MetaMaster360` }, [current])
  if (current) {
    const { C, name } = T[current]
    return (
      <div className="space-y-4">
        <Link to="/tools" className={buttonClasses('ghost', 'sm')}><ArrowLeft className="h-4 w-4" />All tools</Link>
        <h1 className="sr-only">{name}</h1>
        <Suspense fallback={<div className="h-64 animate-pulse rounded-xl bg-surface-2" />}><C /></Suspense>
      </div>
    )
  }
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Toolkit</h1>
        <p className="max-w-2xl text-muted">Every lab from the course as a standalone tool for your own review. Calculations run in your browser; nothing is uploaded.</p>
      </header>
      {GROUPS.map((g) => (
        <section key={g} className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-primary">{g}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {(Object.entries(T) as [ToolId, (typeof T)[ToolId]][]).filter(([, t]) => t.group === g).map(([id, t]) => (
              <Link key={id} to={`/tools/${id}`} className={cn('rounded-xl border border-border bg-surface p-4 transition-colors hover:border-primary')}>
                <div className="font-semibold">{t.name}</div>
                <div className="mt-1 text-sm text-muted">{t.desc}</div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
