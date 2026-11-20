import { useState } from 'react'
import { Lab, NumberField, Segmented, Formula, Stat, Callout } from '@/components/ui'
import { combineGroups, designEffect, fmt, meanSdFromMedian, sdChange, sdFromMDCI, sdFromMeanCI, sdFromSE } from '@/lib/stats'

type Tool = 'se' | 'ci' | 'mdci' | 'median' | 'combine' | 'change' | 'cluster'

function useCalc<T>(fn: () => T): { value: T | null; error: string | null } {
  try {
    return { value: fn(), error: null }
  } catch (e) {
    return { value: null, error: (e as Error).message }
  }
}

export function ConversionCalcs({ initial = 'se' }: { initial?: Tool }) {
  const [tool, setTool] = useState<Tool>(initial)
  return (
    <Lab title="Data-conversion calculators" subtitle="Get from what papers report to what meta-analysis needs. Formulas follow Cochrane Handbook §6.5.2 and §23.1.">
      <Segmented size="sm" value={tool} onChange={setTool} label="Calculator" options={[
        { value: 'se', label: 'SE → SD' }, { value: 'ci', label: 'CI of a mean → SD' }, { value: 'mdci', label: 'CI of MD → SD' },
        { value: 'median', label: 'Median/IQR → mean/SD' }, { value: 'combine', label: 'Combine arms' }, { value: 'change', label: 'Change-score SD' }, { value: 'cluster', label: 'Cluster trial' },
      ]} />
      {tool === 'se' && <SeTool />}
      {tool === 'ci' && <CiTool />}
      {tool === 'mdci' && <MdCiTool />}
      {tool === 'median' && <MedianTool />}
      {tool === 'combine' && <CombineTool />}
      {tool === 'change' && <ChangeTool />}
      {tool === 'cluster' && <ClusterTool />}
    </Lab>
  )
}

function Err({ e }: { e: string | null }) {
  return e ? <Callout kind="bad">{e}</Callout> : null
}

function SeTool() {
  const [se, setSe] = useState(0.44)
  const [n, setN] = useState(150)
  const r = useCalc(() => sdFromSE(se, n))
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3"><NumberField label="SE of the group mean" value={se} onChange={setSe} /><NumberField label="n in group" value={n} onChange={setN} /></div>
      <Formula>SD = SE × √n</Formula>
      <Err e={r.error} />
      {r.value !== null && <Stat label="SD" value={fmt(r.value, 2)} tone="primary" />}
      <p className="text-sm text-muted">Trap: “mean ± x” is often an SE. If x is implausibly small relative to the scale (e.g., ± 0.44 on PHQ-9 with n = 150), check the methods or table footnote.</p>
    </div>
  )
}

function CiTool() {
  const [lo, setLo] = useState(8.5)
  const [hi, setHi] = useState(10.3)
  const [n, setN] = useState(150)
  const r = useCalc(() => sdFromMeanCI(lo, hi, n))
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3"><NumberField label="95% CI lower" value={lo} onChange={setLo} /><NumberField label="95% CI upper" value={hi} onChange={setHi} /><NumberField label="n" value={n} onChange={setN} /></div>
      <Formula>{'SD = √n × (upper − lower) / (2 × crit)\ncrit = 1.96, or t(0.975, n−1) when n < 60'}</Formula>
      <Err e={r.error} />
      {r.value && <div className="grid grid-cols-2 gap-3"><Stat label="SD" value={fmt(r.value.sd, 2)} tone="primary" /><Stat label="Critical value" value={fmt(r.value.crit, 3)} sub={r.value.usedT ? 't distribution (small n)' : 'normal'} /></div>}
    </div>
  )
}

function MdCiTool() {
  const [lo, setLo] = useState(-4.2)
  const [hi, setHi] = useState(-0.6)
  const [n1, setN1] = useState(42)
  const [n2, setN2] = useState(40)
  const r = useCalc(() => sdFromMDCI(lo, hi, n1, n2))
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4"><NumberField label="MD CI lower" value={lo} onChange={setLo} /><NumberField label="MD CI upper" value={hi} onChange={setHi} /><NumberField label="n₁" value={n1} onChange={setN1} /><NumberField label="n₂" value={n2} onChange={setN2} /></div>
      <Formula>{'SE(MD) = (upper − lower) / (2 × crit)\nSD = SE / √(1/n₁ + 1/n₂)   (assumes equal SDs in both groups)'}</Formula>
      <Err e={r.error} />
      {r.value && <div className="grid grid-cols-2 gap-3"><Stat label="SE of MD" value={fmt(r.value.se, 3)} /><Stat label="SD (each group)" value={fmt(r.value.sd, 2)} tone="primary" sub={r.value.usedT ? `t, ${n1 + n2 - 2} df` : 'normal'} /></div>}
    </div>
  )
}

function MedianTool() {
  const [n, setN] = useState(55)
  const [m, setM] = useState(16)
  const [q1, setQ1] = useState(11)
  const [q3, setQ3] = useState(21.5)
  const [a, setA] = useState(NaN)
  const [b, setB] = useState(NaN)
  const r = useCalc(() => meanSdFromMedian({ n, median: m, q1: Number.isFinite(q1) ? q1 : undefined, q3: Number.isFinite(q3) ? q3 : undefined, min: Number.isFinite(a) ? a : undefined, max: Number.isFinite(b) ? b : undefined }))
  const skew = Number.isFinite(q1) && Number.isFinite(q3) ? Math.abs((q3 - m) - (m - q1)) / Math.max(1e-9, q3 - q1) : 0
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        <NumberField label="n" value={n} onChange={setN} /><NumberField label="Median" value={m} onChange={setM} />
        <NumberField label="Q1" value={q1} onChange={setQ1} /><NumberField label="Q3" value={q3} onChange={setQ3} />
        <NumberField label="Min" hint="(opt.)" value={a} onChange={setA} /><NumberField label="Max" hint="(opt.)" value={b} onChange={setB} />
      </div>
      <Formula>{'Mean (Luo 2018, IQR): w·(Q1+Q3)/2 + (1−w)·median,  w = 0.7 + 0.39/n\nSD (Wan 2014, IQR):  (Q3 − Q1) / [2·Φ⁻¹((0.75n − 0.125)/(n + 0.25))]'}</Formula>
      <Err e={r.error} />
      {r.value && <div className="grid grid-cols-3 gap-3"><Stat label="Estimated mean" value={fmt(r.value.mean, 2)} tone="primary" /><Stat label="Estimated SD" value={fmt(r.value.sd, 2)} tone="primary" /><Stat label="Inputs used" value={r.value.scenario} /></div>}
      {skew > 0.25 && <Callout kind="pitfall">The median is far from the middle of the IQR — the data look skewed, and these normal-theory estimates may be poor. Consider a sensitivity analysis excluding this study or methods that allow skewness.</Callout>}
    </div>
  )
}

function CombineTool() {
  const [v, setV] = useState({ n1: 32, m1: 11.6, s1: 6.0, n2: 32, m2: 12.4, s2: 6.2 })
  const r = useCalc(() => combineGroups(v.n1, v.m1, v.s1, v.n2, v.m2, v.s2))
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3">
        <NumberField label="Arm 1 n" value={v.n1} onChange={(n1) => setV({ ...v, n1 })} /><NumberField label="Arm 1 mean" value={v.m1} onChange={(m1) => setV({ ...v, m1 })} /><NumberField label="Arm 1 SD" value={v.s1} onChange={(s1) => setV({ ...v, s1 })} />
        <NumberField label="Arm 2 n" value={v.n2} onChange={(n2) => setV({ ...v, n2 })} /><NumberField label="Arm 2 mean" value={v.m2} onChange={(m2) => setV({ ...v, m2 })} /><NumberField label="Arm 2 SD" value={v.s2} onChange={(s2) => setV({ ...v, s2 })} />
      </div>
      <Formula>{'N = N₁ + N₂     Mean = (N₁M₁ + N₂M₂)/N\nSD = √{ [(N₁−1)SD₁² + (N₂−1)SD₂² + (N₁N₂/N)(M₁² + M₂² − 2M₁M₂)] / (N − 1) }'}</Formula>
      <Err e={r.error} />
      {r.value && <div className="grid grid-cols-3 gap-3"><Stat label="Combined n" value={r.value.n} /><Stat label="Combined mean" value={fmt(r.value.mean, 2)} tone="primary" /><Stat label="Combined SD" value={fmt(r.value.sd, 2)} tone="primary" /></div>}
      <p className="text-sm text-muted">Use for multi-arm trials when both arms are eligible against a shared control. For binary data, simply add events and totals.</p>
    </div>
  )
}

function ChangeTool() {
  const [b, setB] = useState(6.5)
  const [f, setF] = useState(6.0)
  const [r0, setR] = useState(0.5)
  const r = useCalc(() => sdChange(b, f, r0))
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3"><NumberField label="Baseline SD" value={b} onChange={setB} /><NumberField label="Final SD" value={f} onChange={setF} /><NumberField label="Correlation r" value={r0} onChange={setR} /></div>
      <Formula>SD(change) = √(SD_baseline² + SD_final² − 2·r·SD_baseline·SD_final)</Formula>
      <Err e={r.error} />
      {r.value !== null && <Stat label="SD of change" value={fmt(r.value, 2)} tone="primary" />}
      <p className="text-sm text-muted">r is rarely reported; borrow it from a study that reports all three SDs, and run a sensitivity analysis across plausible values (e.g., 0.3–0.8).</p>
    </div>
  )
}

function ClusterTool() {
  const [m, setM] = useState(11)
  const [icc, setIcc] = useState(0.03)
  const [n1, setN1] = useState(110)
  const [n2, setN2] = useState(108)
  const r = useCalc(() => designEffect(m, icc))
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4"><NumberField label="Mean cluster size m" value={m} onChange={setM} /><NumberField label="ICC" value={icc} onChange={setIcc} /><NumberField label="n (intervention)" value={n1} onChange={setN1} /><NumberField label="n (control)" value={n2} onChange={setN2} /></div>
      <Formula>{'Design effect = 1 + (m − 1) × ICC\nEffective n = n / design effect   (divide events too, for binary outcomes)'}</Formula>
      <Err e={r.error} />
      {r.value !== null && <div className="grid grid-cols-3 gap-3"><Stat label="Design effect" value={fmt(r.value, 2)} tone="primary" /><Stat label="Effective n (intervention)" value={fmt(n1 / r.value, 1)} /><Stat label="Effective n (control)" value={fmt(n2 / r.value, 1)} /></div>}
      <p className="text-sm text-muted">Needed only when the trial ignored clustering. If it reports an analysis that accounts for clustering (e.g., mixed model), use that estimate and its SE directly.</p>
    </div>
  )
}
