import type { ReactNode } from 'react'

export interface PrismaCounts {
  databases: number
  registers: number
  duplicates: number
  automation: number
  otherRemoved: number
  screened: number
  excludedScreening: number
  soughtRetrieval: number
  notRetrieved: number
  assessed: number
  excludedReasons: { reason: string; n: number }[]
  studiesIncluded: number
  reportsIncluded: number
}

function Box({ title, children, tone = 'main' }: { title?: string; children: ReactNode; tone?: 'main' | 'side' | 'phase' }) {
  if (tone === 'phase') return <div className="flex items-center justify-center rounded-md bg-primary px-1 py-2 text-[0.7rem] font-semibold uppercase tracking-wider text-primary-fg [writing-mode:vertical-rl] rotate-180">{children}</div>
  return (
    <div className={tone === 'main' ? 'rounded-lg border-2 border-primary/50 bg-surface p-2.5 text-xs leading-snug sm:text-sm' : 'rounded-lg border border-border bg-surface-2 p-2.5 text-xs leading-snug sm:text-sm'}>
      {title && <div className="font-semibold">{title}</div>}
      {children}
    </div>
  )
}

const Arrow = () => <div className="mx-auto h-4 w-px bg-fg/50" aria-hidden />

export function PrismaFlow({ c }: { c: PrismaCounts }) {
  const exclTotal = c.excludedReasons.reduce((a, b) => a + b.n, 0)
  return (
    <div className="grid grid-cols-[1.75rem_1fr] gap-x-2 gap-y-0" role="figure" aria-label="PRISMA 2020 flow diagram">
      <Box tone="phase">Identification</Box>
      <div className="grid gap-2 py-1 sm:grid-cols-2">
        <Box title="Records identified from:">Databases (n = {c.databases})<br />Registers (n = {c.registers})</Box>
        <Box tone="side" title="Records removed before screening:">Duplicates (n = {c.duplicates})<br />Marked ineligible by automation tools (n = {c.automation})<br />Removed for other reasons (n = {c.otherRemoved})</Box>
      </div>
      <div /><div className="sm:w-1/2"><Arrow /></div>
      <Box tone="phase">Screening</Box>
      <div className="space-y-0 py-1">
        <div className="grid gap-2 sm:grid-cols-2">
          <Box>Records screened (n = {c.screened})</Box>
          <Box tone="side">Records excluded (n = {c.excludedScreening})</Box>
        </div>
        <div className="sm:w-1/2"><Arrow /></div>
        <div className="grid gap-2 sm:grid-cols-2">
          <Box>Reports sought for retrieval (n = {c.soughtRetrieval})</Box>
          <Box tone="side">Reports not retrieved (n = {c.notRetrieved})</Box>
        </div>
        <div className="sm:w-1/2"><Arrow /></div>
        <div className="grid gap-2 sm:grid-cols-2">
          <Box>Reports assessed for eligibility (n = {c.assessed})</Box>
          <Box tone="side" title={`Reports excluded (n = ${exclTotal}):`}>
            {c.excludedReasons.filter((r) => r.n > 0).map((r) => <div key={r.reason}>{r.reason} (n = {r.n})</div>)}
          </Box>
        </div>
      </div>
      <div /><div className="sm:w-1/2"><Arrow /></div>
      <Box tone="phase">Included</Box>
      <div className="py-1 sm:w-1/2">
        <Box>Studies included in review (n = {c.studiesIncluded})<br />Reports of included studies (n = {c.reportsIncluded})</Box>
      </div>
    </div>
  )
}

/** Arithmetic checks a PRISMA flow must satisfy. */
export function prismaChecks(c: PrismaCounts): { ok: boolean; msg: string }[] {
  const identified = c.databases + c.registers
  const removed = c.duplicates + c.automation + c.otherRemoved
  const exclTotal = c.excludedReasons.reduce((a, b) => a + b.n, 0)
  return [
    { ok: identified - removed === c.screened, msg: `Identified (${identified}) − removed before screening (${removed}) should equal records screened (${c.screened}).` },
    { ok: c.screened - c.excludedScreening === c.soughtRetrieval, msg: `Screened (${c.screened}) − excluded (${c.excludedScreening}) should equal reports sought (${c.soughtRetrieval}).` },
    { ok: c.soughtRetrieval - c.notRetrieved === c.assessed, msg: `Sought (${c.soughtRetrieval}) − not retrieved (${c.notRetrieved}) should equal reports assessed (${c.assessed}).` },
    { ok: c.assessed - exclTotal === c.reportsIncluded, msg: `Assessed (${c.assessed}) − excluded (${exclTotal}) should equal reports of included studies (${c.reportsIncluded}).` },
    { ok: c.studiesIncluded <= c.reportsIncluded, msg: `Studies (${c.studiesIncluded}) cannot exceed reports (${c.reportsIncluded}); several reports can describe one study.` },
  ]
}
