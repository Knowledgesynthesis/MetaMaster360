import { fmt } from '@/lib/stats'
import { niceTicks, ratioTicks, useWidth } from './useWidth'

export interface FunnelPoint {
  yi: number
  sei: number
  label?: string
  hidden?: boolean
}

export function FunnelPlot({ points, center, ratio = false, contours = false, showHidden = true, xLabel = 'Effect estimate' }: {
  points: FunnelPoint[]
  center?: number
  ratio?: boolean
  contours?: boolean
  showHidden?: boolean
  xLabel?: string
}) {
  const [ref, width] = useWidth<HTMLDivElement>()
  const height = Math.min(380, Math.max(260, width * 0.62))
  const m = { l: 44, r: 12, t: 12, b: 40 }
  const visible = points.filter((p) => showHidden || !p.hidden)
  const seMax = Math.max(0.05, ...visible.map((p) => p.sei)) * 1.08
  const c = center ?? 0
  const spread = 1.96 * seMax
  const xs = visible.map((p) => p.yi)
  let lo = Math.min(c - spread, contours ? -2.576 * seMax : Infinity, ...xs)
  let hi = Math.max(c + spread, contours ? 2.576 * seMax : -Infinity, ...xs)
  const pad = (hi - lo) * 0.04
  lo -= pad
  hi += pad
  const W = width - m.l - m.r
  const H = height - m.t - m.b
  const X = (v: number) => m.l + ((v - lo) / (hi - lo)) * W
  const Y = (se: number) => m.t + (se / seMax) * H
  const xt = ratio ? ratioTicks(lo, hi).map((t) => ({ v: Math.log(t), l: String(t) })) : niceTicks(lo, hi, 5).map((t) => ({ v: t, l: fmt(t, 1) }))
  const yt = niceTicks(0, seMax, 4)
  const tri = (z: number, at: number) => `M${X(at)} ${Y(0)} L${X(at - z * seMax)} ${Y(seMax)} L${X(at + z * seMax)} ${Y(seMax)} Z`

  return (
    <div ref={ref} className="w-full">
      <svg width={width} height={height} role="img" aria-label="Funnel plot of effect estimate against standard error" className="text-[11px]" style={{ color: 'var(--plot-ink)' }}>
        <defs>
          <clipPath id="funnel-area"><rect x={m.l} y={m.t} width={W} height={H} /></clipPath>
        </defs>
        <g clipPath="url(#funnel-area)">
          {contours && (
            <g>
              <rect x={m.l} y={m.t} width={W} height={H} fill="var(--primary)" opacity={0.4} />
              <path d={tri(2.576, 0)} fill="var(--surface)" />
              <path d={tri(2.576, 0)} fill="var(--primary)" opacity={0.25} />
              <path d={tri(1.96, 0)} fill="var(--surface)" />
              <path d={tri(1.96, 0)} fill="var(--primary)" opacity={0.1} />
              <path d={tri(1.645, 0)} fill="var(--surface)" />
            </g>
          )}
          {!contours && <path d={tri(1.96, c)} fill="var(--primary)" opacity={0.06} />}
          <path d={`M${X(c)} ${Y(0)} L${X(c - 1.96 * seMax)} ${Y(seMax)} M${X(c)} ${Y(0)} L${X(c + 1.96 * seMax)} ${Y(seMax)}`} stroke="currentColor" strokeDasharray="4 3" fill="none" opacity={0.6} />
          <line x1={X(c)} x2={X(c)} y1={Y(0)} y2={Y(seMax)} stroke="currentColor" opacity={0.7} />
          {contours && <line x1={X(0)} x2={X(0)} y1={Y(0)} y2={Y(seMax)} stroke="currentColor" strokeWidth={0.8} opacity={0.4} />}
          {visible.map((p, i) => (
            <circle key={i} cx={X(p.yi)} cy={Y(p.sei)} r={4.2} fill={p.hidden ? 'none' : 'var(--primary)'} stroke={p.hidden ? 'var(--bad)' : 'var(--surface)'} strokeWidth={p.hidden ? 1.4 : 1} strokeDasharray={p.hidden ? '2 1.5' : undefined}>
              <title>{`${p.label ?? 'Study'}: ${fmt(ratio ? Math.exp(p.yi) : p.yi)} (SE ${fmt(p.sei, 3)})${p.hidden ? ' — unpublished' : ''}`}</title>
            </circle>
          ))}
        </g>
        <line x1={m.l} x2={m.l + W} y1={m.t + H} y2={m.t + H} stroke="currentColor" />
        <line x1={m.l} x2={m.l} y1={m.t} y2={m.t + H} stroke="currentColor" />
        {xt.map((t) => (
          <g key={t.v}>
            <line x1={X(t.v)} x2={X(t.v)} y1={m.t + H} y2={m.t + H + 4} stroke="currentColor" />
            <text x={X(t.v)} y={m.t + H + 15} textAnchor="middle" fill="currentColor" className="tabular">{t.l}</text>
          </g>
        ))}
        {yt.map((t) => (
          <g key={t}>
            <line x1={m.l - 4} x2={m.l} y1={Y(t)} y2={Y(t)} stroke="currentColor" />
            <text x={m.l - 6} y={Y(t) + 4} textAnchor="end" fill="currentColor" className="tabular">{fmt(t, 2)}</text>
          </g>
        ))}
        <text x={m.l + W / 2} y={height - 4} textAnchor="middle" fill="currentColor">{xLabel}</text>
        <text transform={`translate(11 ${m.t + H / 2}) rotate(-90)`} textAnchor="middle" fill="currentColor">Standard error</text>
      </svg>
      {contours && (
        <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted">
          <span className="inline-flex items-center gap-1"><span className="h-3 w-3 rounded-sm border border-border bg-surface" />p &gt; 0.10</span>
          <span className="inline-flex items-center gap-1"><span className="h-3 w-3 rounded-sm bg-primary/10" />0.05 – 0.10</span>
          <span className="inline-flex items-center gap-1"><span className="h-3 w-3 rounded-sm bg-primary/25" />0.01 – 0.05</span>
          <span className="inline-flex items-center gap-1"><span className="h-3 w-3 rounded-sm bg-primary/40" />p &lt; 0.01</span>
        </div>
      )}
    </div>
  )
}
