import { cn } from '@/lib/utils'

export type RobJudgement = 'low' | 'some' | 'high' | 'ni'

export const ROB_META: Record<RobJudgement, { label: string; symbol: string; cls: string; bar: string }> = {
  low: { label: 'Low risk', symbol: '+', cls: 'bg-good text-white', bar: 'bg-good' },
  some: { label: 'Some concerns', symbol: '!', cls: 'bg-warn text-black', bar: 'bg-warn' },
  high: { label: 'High risk', symbol: '−', cls: 'bg-bad text-white', bar: 'bg-bad' },
  ni: { label: 'No information', symbol: '?', cls: 'bg-surface-2 text-muted border border-border', bar: 'bg-muted/40' },
}

export const ROB2_DOMAINS = [
  { id: 'D1', name: 'Randomization process' },
  { id: 'D2', name: 'Deviations from intended interventions' },
  { id: 'D3', name: 'Missing outcome data' },
  { id: 'D4', name: 'Measurement of the outcome' },
  { id: 'D5', name: 'Selection of the reported result' },
]

export function RobDot({ j, size = 'md' }: { j: RobJudgement; size?: 'sm' | 'md' }) {
  const m = ROB_META[j]
  return (
    <span className={cn('inline-flex items-center justify-center rounded-full font-bold', m.cls, size === 'sm' ? 'h-5 w-5 text-xs' : 'h-7 w-7 text-sm')} title={m.label} aria-label={m.label}>
      {m.symbol}
    </span>
  )
}

export function TrafficLight({ rows, domains = ROB2_DOMAINS }: { rows: { study: string; d: RobJudgement[]; overall: RobJudgement }[]; domains?: { id: string; name: string }[] }) {
  return (
    <div className="space-y-3">
      <div className="relative overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface-2">
            <tr>
              <th scope="col" className="px-3 py-2 text-left font-semibold">Study</th>
              {domains.map((d) => (
                <th key={d.id} scope="col" className="px-2 py-2 text-center font-semibold" title={d.name}>{d.id}</th>
              ))}
              <th scope="col" className="px-2 py-2 text-center font-semibold">Overall</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.study} className="border-t border-border">
                <th scope="row" className="px-3 py-1.5 text-left font-medium whitespace-nowrap">{r.study}</th>
                {r.d.map((j, i) => (
                  <td key={i} className="px-2 py-1.5 text-center"><RobDot j={j} size="sm" /></td>
                ))}
                <td className="px-2 py-1.5 text-center"><RobDot j={r.overall} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid gap-1 text-xs text-muted sm:grid-cols-2">
        {domains.map((d) => <div key={d.id}><span className="font-semibold text-fg">{d.id}</span> {d.name}</div>)}
      </div>
    </div>
  )
}

export function RobSummaryBars({ rows, domains = ROB2_DOMAINS }: { rows: { d: RobJudgement[]; overall: RobJudgement }[]; domains?: { id: string; name: string }[] }) {
  const order: RobJudgement[] = ['low', 'some', 'high', 'ni']
  const lines = [...domains.map((d, i) => ({ name: d.name, js: rows.map((r) => r.d[i]) })), { name: 'Overall', js: rows.map((r) => r.overall) }]
  return (
    <div className="space-y-2">
      {lines.map((l) => (
        <div key={l.name} className="grid grid-cols-[minmax(0,11rem)_1fr] items-center gap-3 text-xs sm:grid-cols-[16rem_1fr]">
          <div className={cn('truncate', l.name === 'Overall' && 'font-semibold')}>{l.name}</div>
          <div className="flex h-5 overflow-hidden rounded">
            {order.map((o) => {
              const n = l.js.filter((j) => j === o).length
              return n ? <div key={o} className={ROB_META[o].bar} style={{ width: `${(n / l.js.length) * 100}%` }} title={`${ROB_META[o].label}: ${n}`} /> : null
            })}
          </div>
        </div>
      ))}
      <div className="flex flex-wrap gap-3 pt-1 text-xs text-muted">
        {order.slice(0, 3).map((o) => <span key={o} className="inline-flex items-center gap-1"><span className={cn('h-3 w-3 rounded-sm', ROB_META[o].bar)} />{ROB_META[o].label}</span>)}
      </div>
    </div>
  )
}
