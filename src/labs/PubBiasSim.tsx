import { useMemo, useState } from 'react'
import { Shuffle } from 'lucide-react'
import { Button, Callout, Lab, Stat } from '@/components/ui'
import { FunnelPlot } from '@/components/plots/FunnelPlot'
import { eggerTest, fmt, pEq, metaAnalyze, simulateLiterature } from '@/lib/stats'

export function Slider({ label, value, set, min, max, step }: { label: string; value: number; set: (v: number) => void; min: number; max: number; step: number }) {
  return (
    <label className="space-y-1 text-sm"><span className="font-medium">{label}</span><input type="range" min={min} max={max} step={step} value={value} onChange={(e) => set(Number(e.target.value))} className="w-full accent-[var(--primary)]" /></label>
  )
}

export function PubBiasSim() {
  const [trueEffect, setTrue] = useState(-0.1)
  const [tau, setTau] = useState(0.05)
  const [selection, setSelection] = useState(0.8)
  const [candidates, setCandidates] = useState(40)
  const [seed, setSeed] = useState(7)
  const [reveal, setReveal] = useState(false)
  const [contours, setContours] = useState(true)
  const sims = useMemo(() => simulateLiterature({ trueEffect, tau, candidates, selection, minN: 10, maxN: 400, seed }), [trueEffect, tau, candidates, selection, seed])
  const pub = sims.filter((s) => s.published)
  const toInput = (xs: typeof sims) => xs.map((s) => ({ id: s.id, label: s.id, yi: s.yi, vi: s.vi }))
  const rPub = pub.length ? metaAnalyze(toInput(pub)) : null
  const rAll = metaAnalyze(toInput(sims))
  const egger = pub.length >= 3 ? eggerTest(pub) : null
  return (
    <Lab title="Publication-bias simulator" subtitle="Generate a literature, suppress non-significant studies, and see what the funnel and the pooled estimate do. Negative SMD = benefit."
      actions={<Button size="sm" variant="outline" onClick={() => setSeed(seed + 1)}><Shuffle className="h-4 w-4" />New sample</Button>}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Slider label={`True mean effect (SMD): ${trueEffect.toFixed(2)}`} value={trueEffect} set={setTrue} min={-0.6} max={0.2} step={0.05} />
        <Slider label={`True heterogeneity τ: ${tau.toFixed(2)}`} value={tau} set={setTau} min={0} max={0.4} step={0.01} />
        <Slider label={`Selection: ${Math.round(selection * 100)}% of non-significant studies stay unpublished`} value={selection} set={setSelection} min={0} max={1} step={0.05} />
        <Slider label={`Studies conducted: ${candidates}`} value={candidates} set={setCandidates} min={10} max={80} step={1} />
      </div>
      <div className="flex flex-wrap gap-4 text-sm">
        <label className="inline-flex items-center gap-2"><input type="checkbox" checked={reveal} onChange={(e) => setReveal(e.target.checked)} />Reveal unpublished studies</label>
        <label className="inline-flex items-center gap-2"><input type="checkbox" checked={contours} onChange={(e) => setContours(e.target.checked)} />Contour-enhanced</label>
      </div>
      <FunnelPlot points={sims.map((s) => ({ yi: s.yi, sei: Math.sqrt(s.vi), label: s.id, hidden: !s.published }))} showHidden={reveal} contours={contours} center={rPub?.common.est} xLabel="SMD" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Truth" value={fmt(trueEffect)} sub={`${sims.length} studies conducted`} />
        <Stat label="Pooled (published only)" tone={rPub && Math.abs(rPub.random.est - trueEffect) > 0.1 ? 'warn' : 'primary'} value={rPub ? fmt(rPub.random.est) : '—'} sub={rPub ? `k = ${rPub.k}; 95% CI ${fmt(rPub.random.lower)} to ${fmt(rPub.random.upper)}` : 'no studies'} />
        <Stat label="Pooled (all conducted)" value={fmt(rAll.random.est)} sub={`k = ${rAll.k}`} />
        <Stat label="Egger test (published)" value={egger ? `${pEq(egger.p)}` : '—'} sub={egger ? `intercept ${fmt(egger.intercept)}${egger.lowPower ? ' · k < 10: do not use' : ''}` : 'needs ≥ 3'} tone={egger && egger.p < 0.1 && !egger.lowPower ? 'warn' : undefined} />
      </div>
      <Callout kind="note">With a null true effect and strong selection, the published studies alone produce a convincing “benefit”. Small studies only get published when their effect is large, which carves out the lower-right of the funnel. Set selection to 0% to see a symmetric funnel; set τ high to see that heterogeneity alone widens the funnel without asymmetry.</Callout>
    </Lab>
  )
}
