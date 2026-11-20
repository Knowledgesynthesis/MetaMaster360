import { useMemo } from 'react'
import { fmt } from '@/lib/stats'
import { niceTicks, ratioTicks, useWidth } from './useWidth'

export interface ForestRow {
  label: string
  est: number
  lower: number
  upper: number
  weight?: number
  muted?: boolean
}

export interface ForestSummary {
  label: string
  est: number
  lower: number
  upper: number
  pi?: { lower: number; upper: number } | null
  tone?: 'primary' | 'accent'
}

export interface ForestGroup {
  title?: string
  rows: ForestRow[]
  summaries?: ForestSummary[]
}

const ROW = 24

export function ForestPlot({ groups, ratio = false, leftLabel = 'Favours intervention', rightLabel = 'Favours control', digits = 2, measureLabel, footer }: {
  groups: ForestGroup[]
  ratio?: boolean
  leftLabel?: string
  rightLabel?: string
  digits?: number
  measureLabel?: string
  footer?: string
}) {
  const [ref, width] = useWidth<HTMLDivElement>()
  const compact = width < 560
  const labelW = Math.min(220, Math.max(96, width * (compact ? 0.3 : 0.27)))
  const textW = compact ? 104 : 132
  const weightW = width < 640 ? 0 : 52
  const plotX0 = labelW + 8
  const plotX1 = width - textW - weightW - 8
  const plotW = Math.max(80, plotX1 - plotX0)

  const all = groups.flatMap((g) => [...g.rows, ...(g.summaries ?? [])])
  const extent = useMemo(() => {
    const xs = all.flatMap((r) => [r.lower, r.upper, ...('pi' in r && r.pi ? [r.pi.lower, r.pi.upper] : [])]).filter(Number.isFinite)
    let lo = Math.min(0, ...xs)
    let hi = Math.max(0, ...xs)
    if (hi - lo < 1e-9) { lo -= 1; hi += 1 }
    const pad = (hi - lo) * 0.05
    return [lo - pad, hi + pad] as const
  }, [all])
  const x = (v: number) => plotX0 + ((Math.min(Math.max(v, extent[0]), extent[1]) - extent[0]) / (extent[1] - extent[0])) * plotW
  const ticks = ratio ? ratioTicks(extent[0], extent[1]).map((t) => ({ v: Math.log(t), label: String(t) })) : niceTicks(extent[0], extent[1], compact ? 4 : 6).map((t) => ({ v: t, label: fmt(t, Math.abs(t) < 1 && t !== 0 ? 1 : 0) }))
  const maxW = Math.max(...all.map((r) => ('weight' in r && r.weight) || 0), 0.0001)
  const show = (v: number) => fmt(ratio ? Math.exp(v) : v, digits)

  type Line = { kind: 'title'; text: string } | { kind: 'row'; r: ForestRow } | { kind: 'sum'; s: ForestSummary } | { kind: 'pi'; s: ForestSummary } | { kind: 'gap' }
  const lines: Line[] = []
  groups.forEach((g, gi) => {
    if (g.title) lines.push({ kind: 'title', text: g.title })
    g.rows.forEach((r) => lines.push({ kind: 'row', r }))
    g.summaries?.forEach((s) => {
      lines.push({ kind: 'sum', s })
      if (s.pi) lines.push({ kind: 'pi', s })
    })
    if (gi < groups.length - 1) lines.push({ kind: 'gap' })
  })
  const top = 30
  const height = top + lines.length * ROW + 52
  const clipped = (r: { lower: number; upper: number }) => ({ left: r.lower < extent[0], right: r.upper > extent[1] })
  const trunc = (s: string) => {
    const max = Math.floor(labelW / 6.6)
    return s.length > max ? s.slice(0, max - 1) + '…' : s
  }

  return (
    <div ref={ref} className="w-full">
      <svg width={width} height={height} role="img" aria-label={`Forest plot${measureLabel ? ` (${measureLabel})` : ''}`} className="text-[11px] sm:text-xs" style={{ color: 'var(--plot-ink)' }}>
        <text x={0} y={16} fontWeight={600} fill="currentColor">Study</text>
        {!compact && <text x={plotX0 + plotW / 2} y={16} textAnchor="middle" fontWeight={600} fill="currentColor">{measureLabel ?? (ratio ? 'Ratio' : 'Difference')} (95% CI)</text>}
        <text x={width - weightW - 4} y={16} textAnchor="end" fontWeight={600} fill="currentColor">{compact ? '95% CI' : 'Estimate [95% CI]'}</text>
        {weightW > 0 && <text x={width - 2} y={16} textAnchor="end" fontWeight={600} fill="currentColor">Weight</text>}
        {ticks.map((t) => (
          <line key={t.v} x1={x(t.v)} x2={x(t.v)} y1={top - 4} y2={top + lines.length * ROW} stroke="var(--plot-grid)" strokeDasharray="2 3" />
        ))}
        <line x1={x(0)} x2={x(0)} y1={top - 6} y2={top + lines.length * ROW + 4} stroke="currentColor" strokeWidth={1.2} />
        {lines.map((ln, i) => {
          const cy = top + i * ROW + ROW / 2
          if (ln.kind === 'gap') return null
          if (ln.kind === 'title') return <text key={i} x={0} y={cy + 4} fontWeight={600} fill="currentColor">{trunc(ln.text)}</text>
          if (ln.kind === 'row') {
            const r = ln.r
            const side = 4 + 10 * Math.sqrt((r.weight ?? maxW) / maxW)
            const c = clipped(r)
            return (
              <g key={i} opacity={r.muted ? 0.35 : 1}>
                <title>{`${r.label}: ${show(r.est)} [${show(r.lower)}, ${show(r.upper)}]`}</title>
                <text x={0} y={cy + 4} fill="currentColor">{trunc(r.label)}</text>
                <line x1={x(r.lower)} x2={x(r.upper)} y1={cy} y2={cy} stroke="currentColor" strokeWidth={1.3} />
                {c.left && <path d={`M${x(extent[0])} ${cy} l6 -4 v8 z`} fill="currentColor" />}
                {c.right && <path d={`M${x(extent[1])} ${cy} l-6 -4 v8 z`} fill="currentColor" />}
                <rect x={x(r.est) - side / 2} y={cy - side / 2} width={side} height={side} fill="var(--primary)" />
                <text x={width - weightW - 4} y={cy + 4} textAnchor="end" className="tabular" fill="currentColor">{show(r.est)} [{show(r.lower)}, {show(r.upper)}]</text>
                {weightW > 0 && <text x={width - 2} y={cy + 4} textAnchor="end" className="tabular" fill="currentColor">{r.weight !== undefined ? `${(r.weight * 100).toFixed(1)}%` : ''}</text>}
              </g>
            )
          }
          if (ln.kind === 'sum') {
            const s = ln.s
            const fill = s.tone === 'accent' ? 'var(--accent)' : 'var(--fg)'
            return (
              <g key={i}>
                <title>{`${s.label}: ${show(s.est)} [${show(s.lower)}, ${show(s.upper)}]`}</title>
                <text x={0} y={cy + 4} fontWeight={600} fill="currentColor">{trunc(s.label)}</text>
                <path d={`M${x(s.lower)} ${cy} L${x(s.est)} ${cy - 7} L${x(s.upper)} ${cy} L${x(s.est)} ${cy + 7} Z`} fill={fill} />
                <text x={width - weightW - 4} y={cy + 4} textAnchor="end" fontWeight={600} className="tabular" fill="currentColor">{show(s.est)} [{show(s.lower)}, {show(s.upper)}]</text>
                {weightW > 0 && <text x={width - 2} y={cy + 4} textAnchor="end" className="tabular" fill="currentColor">100%</text>}
              </g>
            )
          }
          const s = ln.s
          return (
            <g key={i}>
              <text x={0} y={cy + 4} fill="currentColor" opacity={0.8}>{compact ? '95% PI' : 'Prediction interval'}</text>
              <line x1={x(s.pi!.lower)} x2={x(s.pi!.upper)} y1={cy} y2={cy} stroke="var(--accent)" strokeWidth={3} strokeLinecap="round" opacity={0.85} />
              <text x={width - weightW - 4} y={cy + 4} textAnchor="end" className="tabular" fill="currentColor" opacity={0.8}>[{show(s.pi!.lower)}, {show(s.pi!.upper)}]</text>
            </g>
          )
        })}
        {(() => {
          const yAxis = top + lines.length * ROW + 8
          return (
            <g>
              <line x1={plotX0} x2={plotX0 + plotW} y1={yAxis} y2={yAxis} stroke="currentColor" />
              {ticks.map((t) => (
                <g key={t.v}>
                  <line x1={x(t.v)} x2={x(t.v)} y1={yAxis} y2={yAxis + 4} stroke="currentColor" />
                  <text x={x(t.v)} y={yAxis + 15} textAnchor="middle" className="tabular" fill="currentColor">{t.label}</text>
                </g>
              ))}
              <text x={x(0) - 6} y={yAxis + 32} textAnchor="end" fill="currentColor" opacity={0.75}>← {leftLabel}</text>
              <text x={x(0) + 6} y={yAxis + 32} fill="currentColor" opacity={0.75}>{rightLabel} →</text>
            </g>
          )
        })()}
      </svg>
      {footer && <p className="mt-1 text-xs text-muted">{footer}</p>}
    </div>
  )
}
