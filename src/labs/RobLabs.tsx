import { useState } from 'react'
import { Button, Lab, Segmented, Callout, Badge } from '@/components/ui'
import { ROB2_DOMAINS, ROB_META, RobDot, type RobJudgement } from '@/components/plots/RobPlots'
import { cn } from '@/lib/utils'

type A = 'Y' | 'PY' | 'PN' | 'N' | 'NI'
const ANSWERS: { value: A; label: string; title: string }[] = [
  { value: 'Y', label: 'Y', title: 'Yes' }, { value: 'PY', label: 'PY', title: 'Probably yes' }, { value: 'PN', label: 'PN', title: 'Probably no' },
  { value: 'N', label: 'N', title: 'No' }, { value: 'NI', label: 'NI', title: 'No information' },
]
const yes = (a?: A) => a === 'Y' || a === 'PY'
const no = (a?: A) => a === 'N' || a === 'PN'

/** RoB 2 domain 1 algorithm (Sterne et al. 2019, full guidance). */
export function rob2Domain1(q11?: A, q12?: A, q13?: A): { j: RobJudgement; path: string } | null {
  if (!q11 || !q12 || !q13) return null
  if (no(q12)) return { j: 'high', path: 'Allocation was not concealed (1.2 = N/PN) → High risk.' }
  if (yes(q12)) {
    if (yes(q13)) return { j: 'some', path: 'Concealed allocation, but baseline differences suggest a problem (1.3 = Y/PY) → Some concerns.' }
    if (no(q11)) return { j: 'some', path: 'Concealed allocation and no baseline problem, but the sequence was not random (1.1 = N/PN) → Some concerns.' }
    return { j: 'low', path: 'Concealed allocation, random (or unreported but plausible) sequence, no baseline problem → Low risk.' }
  }
  // 1.2 NI
  if (yes(q13)) return { j: 'high', path: 'No information on concealment and baseline differences suggest a problem → High risk.' }
  return { j: 'some', path: 'No information on concealment, no baseline problem → Some concerns.' }
}

export function Rob2Domain1Lab() {
  const [a, setA] = useState<{ q11?: A; q12?: A; q13?: A }>({})
  const r = rob2Domain1(a.q11, a.q12, a.q13)
  return (
    <Lab title="RoB 2 domain 1: bias arising from the randomization process" subtitle="Answer the signalling questions; the official algorithm proposes a judgement.">
      <div>
        {([
          ['q11', '1.1 Was the allocation sequence random?'],
          ['q12', '1.2 Was the allocation sequence concealed until participants were enrolled and assigned?'],
          ['q13', '1.3 Did baseline differences between groups suggest a problem with the randomization process?'],
        ] as const).map(([id, text]) => (
          <div key={id} className="flex flex-col gap-2 border-b border-border py-2.5 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm">{text}</span>
            <Segmented size="sm" value={a[id] ?? ('' as A)} onChange={(v) => setA({ ...a, [id]: v })} options={ANSWERS} label={text} />
          </div>
        ))}
      </div>
      {r ? (
        <div className="flex items-start gap-3 rounded-lg border border-border bg-surface-2/60 p-3">
          <RobDot j={r.j} />
          <div className="text-sm"><div className="font-semibold">{ROB_META[r.j].label}</div><div className="text-fg/85">{r.path}</div></div>
        </div>
      ) : <p className="text-sm text-muted">Answer all three questions.</p>}
      <Callout kind="note">Try: computer-generated sequence (Y), sealed opaque envelopes managed by the recruiter with no further detail (NI), balanced baseline (N). Then try alternation (N for 1.1, N for 1.2).</Callout>
    </Lab>
  )
}

interface Vignette {
  study: string
  text: string[]
  key: RobJudgement[]
  why: string[]
  overall: RobJudgement
}

const VIGNETTES: Vignette[] = [
  {
    study: 'Dimitrov 2019',
    text: [
      'Randomisation by a central web system with permuted blocks; allocation revealed after enrolment. Baseline characteristics similar.',
      'Participants and instructors aware of allocation (unavoidable). No cross-over or co-interventions beyond usual care; all randomised participants analysed in their allocated groups.',
      'Outcome data for 124/130 (95%), similar across arms.',
      'HAM-D rated by clinicians blinded to allocation.',
      'Statistical analysis plan published before unblinding; HAM-D at 10 weeks was the registered primary outcome.',
    ],
    key: ['low', 'low', 'low', 'low', 'low'],
    why: ['Random, concealed, balanced.', 'Lack of blinding alone is not a deviation; no trial-context deviations and ITT analysis → low.', 'Near-complete data.', 'Blinded assessor.', 'Pre-specified outcome and analysis.'],
    overall: 'low',
  },
  {
    study: 'Eze 2020',
    text: [
      '“Participants were randomly assigned.” No description of sequence generation or concealment. Baseline similar.',
      'Unblinded. Some control participants joined local exercise classes; numbers not reported. Analysis of available cases.',
      'Outcome data for 41/59 (69%): 21% missing in exercise, 41% in control; control dropouts were described as “feeling worse”.',
      'BDI-II self-completed by participants who knew their allocation.',
      'No protocol or analysis plan available; only BDI-II reported.',
    ],
    key: ['some', 'some', 'high', 'some', 'some'],
    why: ['1.2 = NI with no baseline problem → some concerns.', 'Possible trial-context deviations with no information on balance → some concerns.', 'Substantial, unbalanced missingness likely related to the true outcome (worsening) → high.', 'Self-report by aware participants: assessment could be influenced; judged not clearly likely → some concerns (many reviewers would rate high).', 'No pre-specified plan to check against → some concerns.'],
    overall: 'high',
  },
  {
    study: 'Haddad 2023',
    text: [
      'Computer-generated sequence; “allocation was concealed” with no method given. Baseline balanced.',
      'Unblinded; waiting-list control. No information on deviations; per-protocol analysis excluding 3 non-adherent exercise participants.',
      'Outcome data for 34/36.',
      'PHQ-9 self-completed by aware participants.',
      'Registry listed BDI-II as primary outcome at 8 weeks; paper reports PHQ-9 as primary and mentions BDI-II was “also collected”.',
    ],
    key: ['some', 'some', 'low', 'some', 'high'],
    why: ['Random sequence but no information on how concealment was achieved → judged some concerns (a credible statement could support low).', 'Per-protocol exclusion when estimating the effect of assignment → some concerns.', 'Near-complete.', 'Self-report by aware participants → some concerns.', 'Result likely selected from multiple eligible outcome measurements → high.'],
    overall: 'high',
  },
]

export function overallRob2(ds: RobJudgement[]): { j: RobJudgement; note: string } {
  if (ds.some((d) => d === 'high')) return { j: 'high', note: 'At least one domain at high risk → high.' }
  const some = ds.filter((d) => d === 'some').length
  if (some === 0) return { j: 'low', note: 'All domains low → low.' }
  if (some >= 3) return { j: 'some', note: 'Some concerns in several domains: reviewers may judge this high if the concerns together substantially lower confidence in the result.' }
  return { j: 'some', note: 'Some concerns in at least one domain and no high-risk domain → some concerns.' }
}

export function RobAppraisalLab() {
  const [idx, setIdx] = useState(0)
  const [ans, setAns] = useState<Record<string, RobJudgement[]>>({})
  const [shown, setShown] = useState<Record<string, boolean>>({})
  const v = VIGNETTES[idx]
  const mine = ans[v.study] ?? []
  const complete = mine.filter(Boolean).length === 5
  const ov = complete ? overallRob2(mine) : null
  const opts: { value: RobJudgement; label: string }[] = [{ value: 'low', label: 'Low' }, { value: 'some', label: 'Some concerns' }, { value: 'high', label: 'High' }]
  return (
    <Lab title="Appraise three trials (RoB 2, effect of assignment)" subtitle="Outcome: depressive symptoms at end of treatment. Judge each domain, then compare with the expert key."
      actions={<Segmented size="sm" value={String(idx)} onChange={(x) => setIdx(Number(x))} label="Trial" options={VIGNETTES.map((x, i) => ({ value: String(i), label: x.study }))} />}>
      <div className="space-y-3">
        {ROB2_DOMAINS.map((d, i) => {
          const right = shown[v.study] && mine[i] === v.key[i]
          const wrong = shown[v.study] && mine[i] !== v.key[i]
          return (
            <div key={d.id} className={cn('rounded-lg border p-3', right ? 'border-good/50 bg-good-soft/30' : wrong ? 'border-bad/50 bg-bad-soft/30' : 'border-border')}>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="text-sm"><span className="font-semibold">{d.id} {d.name}.</span> <span className="text-fg/85">{v.text[i]}</span></div>
                <Segmented size="sm" value={mine[i] ?? ('' as RobJudgement)} onChange={(j) => { const next = [...mine]; next[i] = j; setAns({ ...ans, [v.study]: next }) }} options={opts} label={`${d.id} judgement`} />
              </div>
              {shown[v.study] && <div className="mt-2 flex items-center gap-2 border-t border-border pt-2 text-xs"><RobDot j={v.key[i]} size="sm" /><span><span className="font-semibold">Key: {ROB_META[v.key[i]].label}.</span> {v.why[i]}</span></div>}
            </div>
          )
        })}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button disabled={!complete} onClick={() => setShown({ ...shown, [v.study]: true })}>Compare with key</Button>
        {ov && <span className="inline-flex items-center gap-2 text-sm">Your overall: <RobDot j={ov.j} size="sm" /> {ROB_META[ov.j].label}</span>}
        {shown[v.study] && <Badge tone={v.overall === 'high' ? 'bad' : v.overall === 'some' ? 'warn' : 'good'}>Key overall: {ROB_META[v.overall].label}</Badge>}
      </div>
      {ov && <p className="text-xs text-muted">{ov.note}</p>}
    </Lab>
  )
}
