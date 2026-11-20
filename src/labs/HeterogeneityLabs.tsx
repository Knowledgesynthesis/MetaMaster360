import { useMemo, useState } from 'react'
import { Lab, Stat, Segmented, Callout, Table } from '@/components/ui'
import { CASE_STUDIES } from '@/content/case'
import { fmt, hedgesG, leaveOneOut, metaAnalyze } from '@/lib/stats'
import { cn } from '@/lib/utils'

export function I2Explorer() {
  const [tau, setTau] = useState(0.15)
  const [n, setN] = useState(50)
  const s2 = 2 / n
  const tau2 = tau * tau
  const i2 = tau2 / (tau2 + s2)
  const mu = -0.3
  const half = 1.96 * Math.sqrt(tau2 + s2 / 20)
  return (
    <Lab title="I² is not τ²" subtitle="20 studies with the same true spread of effects (τ) — change only how large the studies are.">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1 text-sm"><span className="font-medium">True between-study SD τ = {tau.toFixed(2)} (SMD units)</span><input type="range" min={0} max={0.5} step={0.01} value={tau} onChange={(e) => setTau(Number(e.target.value))} className="w-full accent-[var(--primary)]" /></label>
        <label className="space-y-1 text-sm"><span className="font-medium">Participants per arm n = {n}</span><input type="range" min={10} max={2000} step={10} value={n} onChange={(e) => setN(Number(e.target.value))} className="w-full accent-[var(--primary)]" /></label>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="I²" value={`${Math.round(i2 * 100)}%`} tone={i2 > 0.75 ? 'warn' : 'primary'} sub="τ² / (τ² + typical within-study variance)" />
        <Stat label="τ (SMD units)" value={fmt(tau, 2)} tone="primary" sub="unchanged by study size" />
        <Stat label="Approx. 95% prediction interval" value={`${fmt(mu - half)} to ${fmt(mu + half)}`} sub="around a mean SMD of −0.30" />
      </div>
      <p className="text-sm text-fg/85">Push n to 2000 with τ = 0.10: I² climbs above 80% although true effects only vary by ±0.2 SMD — clinically trivial. With small studies, a large τ can hide behind a modest I². Report τ and the prediction interval; treat I² as relative.</p>
    </Lab>
  )
}

export function LeaveOneOutLab() {
  const studies = useMemo(() => CASE_STUDIES.map((c) => { const g = hedgesG(c.m1, c.sd1, c.n1, c.m2, c.sd2, c.n2); return { id: c.id, label: c.label, yi: g.yi, vi: g.vi, group: c.delivery } }), [])
  const full = useMemo(() => metaAnalyze(studies), [studies])
  const loo = useMemo(() => leaveOneOut(studies), [studies])
  const highRob = CASE_STUDIES.filter((c) => c.robOverall === 'high').map((c) => c.id)
  const noHigh = useMemo(() => metaAnalyze(studies.filter((s) => !highRob.includes(s.id))), [studies]) // eslint-disable-line react-hooks/exhaustive-deps
  const row = (label: string, r: { est: number; lower: number; upper: number }, i2: number, k: number, emph = false) => [
    <span className={cn(emph && 'font-semibold')}>{label}</span>, k, `${fmt(r.est)} [${fmt(r.lower)}, ${fmt(r.upper)}]`, `${Math.round(i2 * 100)}%`,
  ]
  return (
    <Lab title="Sensitivity analyses on the running case" subtitle="Random effects, REML + HKSJ. SMD < 0 favours exercise.">
      <Table head={['Analysis', 'k', 'SMD [95% CI]', 'I²']} rows={[
        row('All studies (primary)', full.random, full.heterogeneity.I2, full.k, true),
        row('Excluding high risk of bias', noHigh.random, noHigh.heterogeneity.I2, noHigh.k, true),
        ...loo.map((l) => row(`Omitting ${l.omitted.label}`, l.random, l.I2, full.k - 1)),
      ]} />
      <Callout kind="key">No single study drives the result, but restricting to studies without high risk of bias shrinks the effect by about a third (−0.35 → −0.22) and removes the heterogeneity. Bias, not true variation, may explain much of the spread — a point GRADE will pick up.</Callout>
    </Lab>
  )
}

const ICEMAN = [
  'Is the effect modification based on comparisons within studies rather than only between studies?',
  'Was the subgroup hypothesis specified before the analysis, with the direction of effect predicted?',
  'Is there a strong prior rationale (biological, clinical, or from previous studies)?',
  'Does the test for subgroup differences suggest chance is an unlikely explanation?',
  'Were only a small number of effect modifiers examined?',
  'Is the comparison free of confounding by other study features (risk of bias, size, population)?',
  'If the modifier is continuous, were arbitrary cut-points avoided?',
]

export function SubgroupCredibility() {
  const [a, setA] = useState<Record<number, 'yes' | 'no' | 'unclear'>>({ 0: 'no', 1: 'yes', 2: 'yes', 3: 'yes', 4: 'yes', 5: 'no', 6: 'yes' })
  const yes = Object.values(a).filter((x) => x === 'yes').length
  const critical = a[0] === 'no' && a[5] === 'no'
  const verdict = critical ? 'Low' : yes >= 6 ? 'High' : yes >= 4 ? 'Moderate' : 'Low'
  return (
    <Lab title="Is this subgroup effect credible?" subtitle="Prefilled for the running case: supervised vs home-based exercise (p = 0.02). Questions adapted from ICEMAN.">
      <div>
        {ICEMAN.map((q, i) => (
          <div key={i} className="flex flex-col gap-2 border-b border-border py-2.5 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm">{q}</span>
            <Segmented size="sm" value={a[i] ?? ('' as 'yes')} onChange={(v) => setA({ ...a, [i]: v })} label={q} options={[{ value: 'yes', label: 'Yes' }, { value: 'unclear', label: 'Unclear' }, { value: 'no', label: 'No' }]} />
          </div>
        ))}
      </div>
      <Callout kind={verdict === 'High' ? 'good' : verdict === 'Moderate' ? 'note' : 'pitfall'} title={`Credibility: ${verdict}`}>
        {critical
          ? 'Only between-study evidence, and the subgroups differ in other ways (both home-based trials are large, with lower risk of bias). The apparent modification may reflect small-study bias rather than delivery mode. Report it as hypothesis-generating.'
          : 'Weigh the answers as a whole; between-study comparisons are observational even when every trial is randomized.'}
      </Callout>
    </Lab>
  )
}
