import { useState } from 'react'
import { Lab, NumberField, Segmented, Formula, Stat, Callout, Select } from '@/components/ui'
import { binaryEffect, ciFrom, fmt, fromConfidenceInterval, hedgesG, meanDifference, nntFromRR, type Measure } from '@/lib/stats'

type Mode = 'continuous' | 'binary' | 'ci'

export function EffectSizeCalc() {
  const [mode, setMode] = useState<Mode>('continuous')
  return (
    <Lab title="Effect-size calculator" subtitle="Every result shows the formula with your numbers substituted.">
      <Segmented value={mode} onChange={setMode} label="Data type" options={[{ value: 'continuous', label: 'Continuous (means)' }, { value: 'binary', label: 'Binary (2×2)' }, { value: 'ci', label: 'From estimate + CI' }]} />
      {mode === 'continuous' && <Continuous />}
      {mode === 'binary' && <Binary />}
      {mode === 'ci' && <FromCI />}
    </Lab>
  )
}

function Continuous() {
  const [v, setV] = useState({ m1: 11.2, sd1: 5.9, n1: 42, m2: 14.1, sd2: 6.3, n2: 40 })
  let md, g, err = ''
  try {
    md = meanDifference(v.m1, v.sd1, v.n1, v.m2, v.sd2, v.n2)
    g = hedgesG(v.m1, v.sd1, v.n1, v.m2, v.sd2, v.n2)
  } catch (e) { err = (e as Error).message }
  const N = v.n1 + v.n2
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <NumberField label="Mean (intervention)" value={v.m1} onChange={(m1) => setV({ ...v, m1 })} />
        <NumberField label="SD (intervention)" value={v.sd1} onChange={(sd1) => setV({ ...v, sd1 })} />
        <NumberField label="n (intervention)" value={v.n1} onChange={(n1) => setV({ ...v, n1 })} />
        <NumberField label="Mean (control)" value={v.m2} onChange={(m2) => setV({ ...v, m2 })} />
        <NumberField label="SD (control)" value={v.sd2} onChange={(sd2) => setV({ ...v, sd2 })} />
        <NumberField label="n (control)" value={v.n2} onChange={(n2) => setV({ ...v, n2 })} />
      </div>
      {err && <Callout kind="bad">{err}</Callout>}
      {md && g && (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            <Stat tone="primary" label="Mean difference (MD)" value={fmt(md.yi, 2)} sub={`95% CI ${fmt(ciFrom(md.yi, md.sei).lower)} to ${fmt(ciFrom(md.yi, md.sei).upper)} · SE ${fmt(md.sei, 3)}`} />
            <Stat tone="primary" label="SMD (Hedges’ g)" value={fmt(g.yi, 2)} sub={`95% CI ${fmt(ciFrom(g.yi, g.sei).lower)} to ${fmt(ciFrom(g.yi, g.sei).upper)} · SE ${fmt(g.sei, 3)}`} />
          </div>
          <Formula label="Steps">
            {`MD = ${v.m1} − ${v.m2} = ${fmt(md.yi, 2)};  SE = √(${v.sd1}²/${v.n1} + ${v.sd2}²/${v.n2}) = ${fmt(md.sei, 3)}\n` +
              `s_pooled = √[((${v.n1}−1)·${v.sd1}² + (${v.n2}−1)·${v.sd2}²) / (${N}−2)] = ${fmt(g.sPooled, 3)}\n` +
              `d = MD / s_pooled = ${fmt(g.d, 4)};  J = 1 − 3/(4·${N} − 9) = ${fmt(g.J, 4)};  g = J·d = ${fmt(g.yi, 4)}\n` +
              `SE(g) = √(${N}/(${v.n1}·${v.n2}) + g²/(2·(${N} − 3.94))) = ${fmt(g.sei, 4)}`}
          </Formula>
          <p className="text-sm text-fg/85">Interpretation: the intervention group scored {fmt(Math.abs(md.yi), 1)} points {md.yi < 0 ? 'lower' : 'higher'} on average ({fmt(Math.abs(g.yi), 2)} pooled SDs). Whether that matters depends on the scale’s minimal important difference — not on Cohen’s 0.2/0.5/0.8 labels, which are a last resort.</p>
        </>
      )}
    </div>
  )
}

function Binary() {
  const [v, setV] = useState({ e1: 18, n1: 42, e2: 10, n2: 40 })
  let rr, or, rd, err = ''
  try {
    rr = binaryEffect(v, 'RR')
    or = binaryEffect(v, 'OR')
    rd = binaryEffect(v, 'RD')
  } catch (e) { err = (e as Error).message }
  const ci = (y: number, se: number, exp = true) => {
    const c = ciFrom(y, se)
    return exp ? `${fmt(Math.exp(c.lower))} to ${fmt(Math.exp(c.upper))}` : `${fmt(c.lower, 3)} to ${fmt(c.upper, 3)}`
  }
  const nnt = rr && !rr.excluded ? nntFromRR(rr.risk2, Math.exp(rr.yi)) : null
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <NumberField label="Events (intervention)" value={v.e1} onChange={(e1) => setV({ ...v, e1 })} />
        <NumberField label="Total (intervention)" value={v.n1} onChange={(n1) => setV({ ...v, n1 })} />
        <NumberField label="Events (control)" value={v.e2} onChange={(e2) => setV({ ...v, e2 })} />
        <NumberField label="Total (control)" value={v.n2} onChange={(n2) => setV({ ...v, n2 })} />
      </div>
      {err && <Callout kind="bad">{err}</Callout>}
      {rr && or && rd && (
        <>
          {[...rr.notes, ...(rr.excluded ? [] : or.notes.filter((n) => !rr.notes.includes(n)))].map((n) => <Callout key={n} kind="note">{n}</Callout>)}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Stat tone="primary" label="Risk ratio" value={rr.excluded ? '—' : fmt(Math.exp(rr.yi), 2)} sub={rr.excluded ? 'not estimable' : `95% CI ${ci(rr.yi, rr.sei)}`} />
            <Stat tone="primary" label="Odds ratio" value={or.excluded ? '—' : fmt(Math.exp(or.yi), 2)} sub={or.excluded ? 'not estimable' : `95% CI ${ci(or.yi, or.sei)}`} />
            <Stat tone="primary" label="Risk difference" value={fmt(rd.yi, 3)} sub={`95% CI ${ci(rd.yi, rd.sei, false)}`} />
            <Stat label={nnt?.label === 'NNTH' ? 'NNT to harm' : 'NNT to benefit'} value={nnt && Number.isFinite(nnt.nnt) ? Math.ceil(nnt.nnt) : '—'} sub="= 1 / |RD|, rounded up" />
          </div>
          {!rr.excluded && (
            <Formula label="Steps (log scale for ratios)">
              {`Risk: ${v.e1}/${v.n1} = ${fmt(rr.risk1, 3)} vs ${v.e2}/${v.n2} = ${fmt(rr.risk2, 3)}\n` +
                `ln RR = ${fmt(rr.yi, 4)};  SE = √(1/a − 1/n₁ + 1/c − 1/n₂) = ${fmt(rr.sei, 4)}\n` +
                `ln OR = ${fmt(or.yi, 4)};  SE = √(1/a + 1/b + 1/c + 1/d) = ${fmt(or.sei, 4)}\n` +
                `RD = ${fmt(rd.yi, 4)};  SE = √(p₁(1−p₁)/n₁ + p₂(1−p₂)/n₂) = ${fmt(rd.sei, 4)}`}
            </Formula>
          )}
        </>
      )}
    </div>
  )
}

function FromCI() {
  const [measure, setMeasure] = useState<Measure>('HR')
  const [v, setV] = useState({ est: 0.75, lo: 0.6, hi: 0.94 })
  let r, err = ''
  try { r = fromConfidenceInterval(v.est, v.lo, v.hi, measure) } catch (e) { err = (e as Error).message }
  const ratio = measure === 'HR' || measure === 'RR' || measure === 'OR'
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Select label="Measure" value={measure} onChange={(e) => setMeasure(e.target.value as Measure)}>
          <option value="HR">Hazard ratio</option><option value="RR">Risk ratio</option><option value="OR">Odds ratio</option><option value="MD">Mean difference</option><option value="SMD">SMD</option>
        </Select>
        <NumberField label="Estimate" value={v.est} onChange={(est) => setV({ ...v, est })} />
        <NumberField label="95% CI lower" value={v.lo} onChange={(lo) => setV({ ...v, lo })} />
        <NumberField label="95% CI upper" value={v.hi} onChange={(hi) => setV({ ...v, hi })} />
      </div>
      {err && <Callout kind="bad">{err}</Callout>}
      {r && (
        <>
          {r.notes.map((n) => <Callout key={n} kind="pitfall">{n}</Callout>)}
          <div className="grid gap-3 sm:grid-cols-2">
            <Stat tone="primary" label={ratio ? 'ln(estimate) — enter as yi' : 'Estimate — enter as yi'} value={fmt(r.yi, 4)} />
            <Stat tone="primary" label="Standard error — enter as SE" value={fmt(r.sei, 4)} />
          </div>
          <Formula>{ratio ? 'SE = [ln(upper) − ln(lower)] / (2 × 1.96)' : 'SE = (upper − lower) / (2 × 1.96)'}</Formula>
          <p className="text-sm text-muted">Use these in the meta-analysis engine’s “generic inverse variance” mode — the standard route for hazard ratios and adjusted estimates.</p>
        </>
      )}
    </div>
  )
}

export function OrRrExplorer() {
  const [cr, setCr] = useState(0.3)
  const [rr, setRr] = useState(0.7)
  const p1 = Math.min(0.999, cr * rr)
  const or = (p1 / (1 - p1)) / (cr / (1 - cr))
  const W = 520, H = 200, m = { l: 36, r: 10, t: 10, b: 30 }
  const xs = Array.from({ length: 90 }, (_, i) => 0.01 + i * 0.01).filter((x) => x * rr < 0.999)
  const ors = xs.map((x) => { const q = x * rr; return (q / (1 - q)) / (x / (1 - x)) })
  const yMin = Math.min(rr, ...ors) * 0.95, yMax = Math.max(rr, ...ors, 1) * 1.02
  const X = (x: number) => m.l + ((x - 0.01) / 0.89) * (W - m.l - m.r)
  const Y = (y: number) => m.t + (1 - (y - yMin) / (yMax - yMin)) * (H - m.t - m.b)
  return (
    <Lab title="Odds ratio vs risk ratio" subtitle="Hold the risk ratio fixed and change the baseline (control) risk.">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1 text-sm"><span className="font-medium">Control risk: {(cr * 100).toFixed(0)}%</span><input type="range" min={0.01} max={0.9} step={0.01} value={cr} onChange={(e) => setCr(Number(e.target.value))} className="w-full accent-[var(--primary)]" /></label>
        <label className="space-y-1 text-sm"><span className="font-medium">Risk ratio: {rr.toFixed(2)}</span><input type="range" min={0.2} max={1.5} step={0.01} value={rr} onChange={(e) => setRr(Number(e.target.value))} className="w-full accent-[var(--primary)]" /></label>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Intervention risk" value={`${(p1 * 100).toFixed(1)}%`} />
        <Stat label="Risk ratio" value={fmt(rr, 2)} tone="primary" />
        <Stat label="Odds ratio" value={fmt(or, 2)} tone={Math.abs(Math.log(or) - Math.log(rr)) > 0.1 ? 'warn' : 'primary'} sub={Math.abs(Math.log(rr)) > 0.01 ? `${Math.abs(Math.log(or) / Math.log(rr)).toFixed(1)}× further from 1 on the log scale` : 'no effect: OR = RR = 1'} />
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Odds ratio as a function of control risk at a fixed risk ratio" style={{ color: 'var(--plot-ink)' }}>
        <line x1={m.l} x2={W - m.r} y1={Y(rr)} y2={Y(rr)} stroke="var(--accent)" strokeWidth={2} />
        <polyline fill="none" stroke="var(--primary)" strokeWidth={2} points={xs.map((x, i) => `${X(x)},${Y(ors[i])}`).join(' ')} />
        <circle cx={X(cr)} cy={Y(or)} r={4} fill="var(--primary)" />
        <line x1={m.l} x2={W - m.r} y1={H - m.b} y2={H - m.b} stroke="currentColor" />
        {[0.1, 0.3, 0.5, 0.7, 0.9].map((t) => <text key={t} x={X(t)} y={H - 10} fontSize={11} textAnchor="middle" fill="currentColor">{t * 100}%</text>)}
        <text x={W - m.r} y={Y(rr) - 5} fontSize={11} textAnchor="end" fill="var(--accent)">RR {rr.toFixed(2)}</text>
        <text x={X(0.6)} y={Y(ors[59] ?? rr) + 14} fontSize={11} fill="var(--primary)">OR</text>
      </svg>
      <p className="text-sm text-fg/85">When events are rare (&lt; ~10%), OR ≈ RR. As baseline risk rises, the OR moves further from 1 than the RR. Reading an OR as if it were an RR therefore exaggerates benefit or harm for common outcomes.</p>
    </Lab>
  )
}
