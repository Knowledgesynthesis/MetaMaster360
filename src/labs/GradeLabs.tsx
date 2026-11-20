import { useState } from 'react'
import { Button, Callout, Lab, Segmented, Select, TextArea, NumberField, Badge } from '@/components/ui'
import { cn } from '@/lib/utils'

export const CERTAINTY = [
  { level: 1, label: 'Very low', symbol: '⊕◯◯◯', verb: 'The evidence is very uncertain about the effect of', tone: 'bad' as const },
  { level: 2, label: 'Low', symbol: '⊕⊕◯◯', verb: 'may', tone: 'warn' as const },
  { level: 3, label: 'Moderate', symbol: '⊕⊕⊕◯', verb: 'probably', tone: 'primary' as const },
  { level: 4, label: 'High', symbol: '⊕⊕⊕⊕', verb: '', tone: 'good' as const },
]

const DOWN = [
  { key: 'rob', label: 'Risk of bias', hint: 'Limitations of the studies contributing most weight' },
  { key: 'inc', label: 'Inconsistency', hint: 'Unexplained variation in point estimates relative to thresholds; non-overlapping CIs' },
  { key: 'ind', label: 'Indirectness', hint: 'Population, intervention, comparator or outcome differ from the question' },
  { key: 'imp', label: 'Imprecision', hint: 'CI crosses the decision threshold; optimal information size not met' },
  { key: 'pub', label: 'Publication bias', hint: 'Missing studies or results suspected' },
] as const
const UP = [
  { key: 'large', label: 'Large magnitude of effect', hint: 'RR > 2 or < 0.5 (+1); > 5 or < 0.2 (+2)' },
  { key: 'dose', label: 'Dose–response gradient', hint: '' },
  { key: 'conf', label: 'Plausible confounding would reduce the effect', hint: 'or would suggest an effect where none was observed' },
] as const

type DownKey = (typeof DOWN)[number]['key']
type UpKey = (typeof UP)[number]['key']

const CASE_PRESET = {
  start: 'rct' as const,
  down: { rob: 1, inc: 0, ind: 0, imp: 0, pub: 1 } as Record<DownKey, number>,
  notes: {
    rob: 'Three of eight trials (20% of the weight) at high risk of bias and most others with some concerns (unblinded self-report); restricting to trials without high risk reduces the SMD from −0.35 to −0.22.',
    inc: 'Not rated down: point estimates all favour exercise, CIs overlap, τ² small (I² 34%); variation largely explained by risk of bias.',
    ind: 'Not rated down: populations, interventions and outcomes match the question.',
    imp: 'Not rated down for the target “any benefit”: the 95% CI (−0.56 to −0.14) excludes no effect. If the target were an important effect (MID), the CI includes trivial effects → rate down.',
    pub: 'Rated down: two completed registered trials (~180 participants) unpublished; small trials show the largest effects.',
  } as Record<string, string>,
}

export function GradeRater() {
  const [start, setStart] = useState<'rct' | 'nrs' | 'nrs-robins'>('rct')
  const [down, setDown] = useState<Record<DownKey, number>>({ rob: 0, inc: 0, ind: 0, imp: 0, pub: 0 })
  const [up, setUp] = useState<Record<UpKey, number>>({ large: 0, dose: 0, conf: 0 })
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [outcome, setOutcome] = useState('depressive symptoms')
  const [interv, setInterv] = useState('exercise')
  const [dir, setDir] = useState(0)
  const base = start === 'nrs' ? 2 : 4
  const totalDown = Object.values(down).reduce((a, b) => a + b, 0)
  const canUp = start !== 'rct'
  const totalUp = canUp ? Object.values(up).reduce((a, b) => a + b, 0) : 0
  const level = Math.max(1, Math.min(4, base - totalDown + totalUp))
  const c = CERTAINTY[level - 1]
  const [third, baseVerb] = VERBS[dir]
  const statement =
    level === 4 ? `${cap(interv)} ${third} ${outcome} (high-certainty evidence).` :
    level === 3 ? `${cap(interv)} probably ${third} ${outcome} (moderate-certainty evidence).` :
    level === 2 ? `${cap(interv)} may ${baseVerb} ${outcome} (low-certainty evidence).` :
    `The evidence is very uncertain about the effect of ${interv} on ${outcome} (very low-certainty evidence).`

  return (
    <Lab title="GRADE certainty rater" subtitle="One outcome at a time. Each level down or up needs a written justification."
      actions={<Button size="sm" variant="outline" onClick={() => { setStart(CASE_PRESET.start); setDown(CASE_PRESET.down); setUp({ large: 0, dose: 0, conf: 0 }); setNotes(CASE_PRESET.notes); setOutcome('depressive symptoms'); setInterv('exercise'); setDir(0) }}>Load running case (expert rating)</Button>}>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Select label="Body of evidence" value={start} onChange={(e) => setStart(e.target.value as typeof start)}>
          <option value="rct">Randomized trials — start High</option>
          <option value="nrs">Non-randomized studies — start Low</option>
          <option value="nrs-robins">Non-randomized, assessed with ROBINS-I — start High</option>
        </Select>
        <div className="space-y-1"><label className="text-sm font-medium" htmlFor="g-int">Intervention</label><input id="g-int" className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm" value={interv} onChange={(e) => setInterv(e.target.value)} /></div>
        <div className="space-y-1"><label className="text-sm font-medium" htmlFor="g-out">Outcome</label><input id="g-out" className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm" value={outcome} onChange={(e) => setOutcome(e.target.value)} /></div>
        <Select label="Direction of the estimate" value={String(dir)} onChange={(e) => setDir(Number(e.target.value))}>
          {VERBS.map(([t], i) => <option key={t} value={i}>{t}</option>)}
        </Select>
      </div>
      {start === 'nrs-robins' && <Callout kind="note">When ROBINS-I is used, non-randomized evidence starts at high and is usually rated down for risk of bias (often two levels for serious risk), arriving where traditional GRADE would start.</Callout>}
      <div className="space-y-2">
        <div className="text-sm font-semibold">Reasons to rate down</div>
        {DOWN.map((d) => (
          <div key={d.key} className="rounded-lg border border-border p-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm"><span className="font-medium">{d.label}</span> <span className="text-muted">— {d.hint}</span></div>
              <Segmented size="sm" value={String(down[d.key])} onChange={(v) => setDown({ ...down, [d.key]: Number(v) })} label={d.label} options={[{ value: '0', label: 'Not serious' }, { value: '1', label: 'Serious (−1)' }, { value: '2', label: 'Very serious (−2)' }]} />
            </div>
            {(down[d.key] > 0 || notes[d.key]) && <TextArea className="mt-2" rows={2} aria-label={`${d.label} justification`} placeholder="Footnote: why?" value={notes[d.key] ?? ''} onChange={(e) => setNotes({ ...notes, [d.key]: e.target.value })} />}
          </div>
        ))}
      </div>
      <div className={cn('space-y-2', !canUp && 'opacity-50')}>
        <div className="text-sm font-semibold">Reasons to rate up {!canUp && <span className="font-normal text-muted">(normally only for non-randomized evidence without serious limitations)</span>}</div>
        {UP.map((u) => (
          <div key={u.key} className="flex flex-col gap-2 rounded-lg border border-border p-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm"><span className="font-medium">{u.label}</span>{u.hint && <span className="text-muted"> — {u.hint}</span>}</div>
            <Segmented size="sm" value={String(canUp ? up[u.key] : 0)} onChange={(v) => canUp && setUp({ ...up, [u.key]: Number(v) })} label={u.label} options={u.key === 'large' ? [{ value: '0', label: 'No' }, { value: '1', label: '+1' }, { value: '2', label: '+2' }] : [{ value: '0', label: 'No' }, { value: '1', label: '+1' }]} />
          </div>
        ))}
      </div>
      <div className="rounded-xl border-2 border-primary/40 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-2xl tracking-wider text-primary" aria-hidden>{c.symbol}</span>
          <span className="text-xl font-bold">{c.label} certainty</span>
          <Badge>{base === 4 ? 'Start High' : 'Start Low'} · −{totalDown} {totalUp ? `· +${totalUp}` : ''}</Badge>
        </div>
        <p className="mt-2 text-sm"><span className="font-semibold">Informative statement:</span> {statement}</p>
        {Object.entries(notes).filter(([, v]) => v).length > 0 && (
          <ol className="mt-2 list-[lower-alpha] space-y-1 pl-5 text-xs text-fg/85">
            {DOWN.filter((d) => notes[d.key]).map((d) => <li key={d.key}><span className="font-semibold">{d.label}:</span> {notes[d.key]}</li>)}
          </ol>
        )}
      </div>
    </Lab>
  )
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
const VERBS: [string, string][] = [['reduces', 'reduce'], ['increases', 'increase'], ['improves', 'improve'], ['worsens', 'worsen'], ['results in little to no difference in', 'result in little to no difference in']]

export function ImprecisionAssistant() {
  const [est, setEst] = useState(-0.35)
  const [lo, setLo] = useState(-0.56)
  const [hi, setHi] = useState(-0.14)
  const [lowerBetter, setLowerBetter] = useState<'yes' | 'no'>('yes')
  const [target, setTarget] = useState<'null' | 'mid'>('null')
  const [mid, setMid] = useState(0.2)
  const [harmMid, setHarmMid] = useState(0.2)
  const [n, setN] = useState(934)
  const [ois, setOis] = useState(400)
  const sign = lowerBetter === 'yes' ? -1 : 1
  const benefitT = sign * mid
  const harmT = -sign * harmMid
  const inBenefit = (x: number) => (sign < 0 ? x <= benefitT : x >= benefitT)
  const inHarm = (x: number) => (sign < 0 ? x >= harmT : x <= harmT)
  const valid = lo < hi && lo <= est && est <= hi
  const ciHasBenefit = inBenefit(lo) || inBenefit(hi)
  const ciHasHarm = inHarm(lo) || inHarm(hi)
  const crossesNull = lo < 0 && hi > 0
  const crossesMid = (lo - benefitT) * (hi - benefitT) < 0
  let rating = 0
  let why: string
  if (target === 'null') {
    if (crossesNull) {
      rating = ciHasBenefit && ciHasHarm ? 2 : 1
      why = rating === 2 ? 'The CI includes both important benefit and important harm.' : 'The CI includes no effect (crosses the null).'
    } else why = 'The CI excludes no effect: no rating down for imprecision against the null.'
  } else {
    if (crossesMid) {
      rating = ciHasHarm ? 2 : 1
      why = rating === 2 ? 'The CI spans important benefit, trivial effects and important harm.' : 'The CI includes both important and unimportant effects (crosses the MID).'
    } else why = inBenefit(est) ? 'The whole CI lies beyond the MID: confident the effect is important.' : 'The whole CI lies on the unimportant side of the MID.'
  }
  const oisMissed = n < ois
  return (
    <Lab title="Imprecision assistant (Core GRADE 2)" subtitle="Imprecision depends on the target: is there an effect at all, or is it important? Use a difference scale (MD, SMD, or risk difference per 1000 — convert ratios first). Prefilled with the running case (SMD).">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <NumberField label="Point estimate" value={est} onChange={setEst} />
        <NumberField label="95% CI lower" value={lo} onChange={setLo} />
        <NumberField label="95% CI upper" value={hi} onChange={setHi} />
        <Select label="Lower values are" value={lowerBetter} onChange={(e) => setLowerBetter(e.target.value as 'yes' | 'no')}><option value="yes">better</option><option value="no">worse</option></Select>
        <NumberField label="MID for benefit (magnitude)" value={mid} onChange={setMid} />
        <NumberField label="Threshold for important harm" value={harmMid} onChange={setHarmMid} />
        <NumberField label="Total participants" value={n} onChange={setN} />
        <NumberField label="Optimal information size" value={ois} onChange={setOis} />
      </div>
      <Segmented value={target} onChange={setTarget} label="Target of certainty rating" options={[{ value: 'null', label: 'Is there any effect? (null)' }, { value: 'mid', label: 'Is the effect important? (MID)' }]} />
      {!valid ? <Callout kind="bad">The estimate must lie within its confidence interval.</Callout> : (
        <Callout kind={rating === 0 ? 'good' : 'pitfall'} title={rating === 0 ? 'Do not rate down for imprecision' : `Rate down ${rating} level${rating > 1 ? 's' : ''} for imprecision`}>
          <p>{why}</p>
          {oisMissed && rating === 0 && <p>But the total sample ({n}) is below the optimal information size ({ois}): consider rating down anyway, particularly when a large effect comes from few small trials.</p>}
        </Callout>
      )}
      <p className="text-sm text-muted">Switch the target to “important effect” with MID 0.2 SMD: the same CI (−0.56 to −0.14) now includes unimportant effects, so you would rate down. State the target explicitly in the SoF footnote.</p>
    </Lab>
  )
}
