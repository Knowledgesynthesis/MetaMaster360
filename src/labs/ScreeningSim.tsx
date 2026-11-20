import { useState } from 'react'
import { Button, Callout, Lab, Segmented, Select, Badge } from '@/components/ui'
import { CASE_QUESTION } from '@/content/case'
import { cn } from '@/lib/utils'

type Ta = 'include' | 'unsure' | 'exclude'
const REASONS = ['Eligible — include', 'Wrong study design', 'Wrong population', 'Wrong intervention', 'Wrong comparator', 'Ongoing study (no results yet)'] as const
type Reason = (typeof REASONS)[number]

interface Abstract {
  id: string
  cite: string
  title: string
  abstract: string
  ta: 'forward' | 'exclude'
  taWhy: string
  ft: Reason
  ftWhy: string
  fullText: string
}

export const ABSTRACTS: Abstract[] = [
  { id: 'A', cite: 'Alvarez 2016', title: 'Supervised aerobic exercise for major depression: a randomised controlled trial', abstract: '82 adults (18–64 y) with DSM-5 major depressive disorder were randomised to 12 weeks of supervised aerobic exercise (3×/week) or usual care. Primary outcome: HAM-D at 12 weeks.', ta: 'forward', taWhy: 'Matches P, I, C and design.' , ft: 'Eligible — include', ftWhy: 'All criteria met.', fullText: 'Methods confirm DSM-5 MDD, 12 weeks of supervised exercise, usual-care control.' },
  { id: 'B', cite: 'Ivanova 2019', title: 'Exercise and mood in older adults: a narrative review', abstract: 'We summarise studies of exercise and mood in people over 65, including observational and experimental research.', ta: 'exclude', taWhy: 'Not a primary study. Before discarding, scan its reference list for eligible trials (citation searching).' , ft: 'Wrong study design', ftWhy: 'Narrative review.', fullText: 'No methods section; a narrative overview.' },
  { id: 'C', cite: 'Okafor 2020', title: 'School-based exercise for adolescents with depression: a cluster randomised trial', abstract: 'Students aged 12–17 with PHQ-A ≥ 10 in 14 schools were randomised to a 10-week exercise programme or usual school curriculum.', ta: 'exclude', taWhy: 'Population: adolescents, not adults ≥ 18.' , ft: 'Wrong population', ftWhy: 'Adolescents.', fullText: 'All participants were 12–17 years old.' },
  { id: 'D', cite: 'Lindqvist 2018', title: 'Yoga for adults with depression: a randomised trial', abstract: '96 adults with major depression received 10 weeks of yoga or a control condition. Depressive symptoms were measured with BDI-II.', ta: 'forward', taWhy: 'The “control condition” is unclear in the abstract. When in doubt, retrieve the full text.' , ft: 'Wrong comparator', ftWhy: 'Full text: the control group received a matched health-education programme (attention control), which the protocol excludes.', fullText: 'Methods: the control group attended weekly health-education sessions matched for contact time.' },
  { id: 'E', cite: 'Brennan 2017', title: 'Group exercise for depression in community mental health: a randomised trial', abstract: '49 adults with major depression were allocated to 12 weeks of group exercise or usual care; BDI-II at end of treatment.', ta: 'forward', taWhy: 'Looks eligible.' , ft: 'Eligible — include', ftWhy: 'Eligible. (Allocation by alternation is a risk-of-bias issue, not an eligibility issue — RoB is assessed later.)', fullText: 'Participants were allocated by alternation (odd/even registration number).' },
  { id: 'F', cite: 'Moreau 2019', title: 'Exercise versus sertraline for major depressive disorder: a randomised non-inferiority trial', abstract: '210 adults with MDD were randomised to 16 weeks of exercise or sertraline 50–200 mg.', ta: 'exclude', taWhy: 'Comparator is an active treatment (antidepressant) — a different question. Consider for a separate comparison if your protocol had one.' , ft: 'Wrong comparator', ftWhy: 'Active comparator (sertraline).', fullText: 'Comparator: sertraline 50–200 mg daily.' },
  { id: 'G', cite: 'Chen 2021', title: 'Cardiac rehabilitation exercise and depressive symptoms after myocardial infarction: randomised trial', abstract: '300 patients after MI were randomised to exercise-based rehabilitation or usual care; depressive symptoms (BDI-II) were a secondary outcome.', ta: 'forward', taWhy: 'Unclear whether participants had depression. Retrieve the full text — do not exclude because depression was a secondary outcome.' , ft: 'Wrong population', ftWhy: 'Full text: no depression diagnosis or cut-off was required (mean baseline BDI-II 9), so participants do not meet the population criterion.', fullText: 'Eligibility required only a recent MI; depression was not an inclusion criterion; mean baseline BDI-II 9.' },
  { id: 'H', cite: 'Eze 2020', title: 'Exercise for adults with major depression in Nigeria: a pragmatic randomised trial', abstract: '59 adults with MDD; 12 weeks of supervised exercise vs usual care; BDI-II at 12 weeks.', ta: 'forward', taWhy: 'Looks eligible.' , ft: 'Eligible — include', ftWhy: 'Eligible.', fullText: 'Methods confirm adults with MDD, 12 weeks supervised exercise, usual care.' },
  { id: 'I', cite: 'Patel 2022', title: 'A six-week walking programme for depression: randomised trial', abstract: '120 adults with major depression; six weeks of brisk walking vs usual care.', ta: 'exclude', taWhy: 'Intervention: six weeks is below the protocol minimum of eight.' , ft: 'Wrong intervention', ftWhy: 'Six weeks is below the eight-week minimum.', fullText: 'Intervention lasted six weeks.' },
  { id: 'J', cite: 'Haddad 2023', title: 'Brief supervised exercise for depression in young adults: a pilot randomised trial', abstract: '36 adults aged 18–25 with MDD; 8 weeks of supervised exercise vs waiting list; PHQ-9.', ta: 'forward', taWhy: 'Pilot RCTs are still RCTs.' , ft: 'Eligible — include', ftWhy: 'Eligible; small size affects precision and weight, not eligibility.', fullText: 'Pilot RCT, 36 participants, waiting-list control, 8 weeks.' },
  { id: 'K', cite: 'Sato 2020', title: 'Protocol for a randomised trial of high-intensity interval training for depression', abstract: 'This protocol describes a planned RCT of HIIT vs usual care in adults with MDD. Recruitment begins in 2021.', ta: 'exclude', taWhy: 'A protocol without results: list it under ongoing studies, check the registry for results and contact the authors — do not silently discard it.' , ft: 'Ongoing study (no results yet)', ftWhy: 'Protocol only — list under ongoing studies.', fullText: 'Protocol; recruitment had not finished. Registry shows no results yet.' },
  { id: 'L', cite: 'Gallagher 2022', title: 'Group exercise added to usual care for depression: randomised trial', abstract: '112 adults with MDD; 12 weeks of group exercise plus usual care vs usual care; MADRS.', ta: 'forward', taWhy: 'Looks eligible.' , ft: 'Eligible — include', ftWhy: 'Eligible.', fullText: 'Methods confirm adults with MDD, 12 weeks group exercise added to usual care vs usual care.' },
  { id: 'M', cite: 'Weber 2019', title: 'Physical activity and depression: a cross-sectional survey of 10,412 adults', abstract: 'Self-reported activity was inversely associated with PHQ-9 scores.', ta: 'exclude', taWhy: 'Design: cross-sectional, not an RCT.' , ft: 'Wrong study design', ftWhy: 'Cross-sectional survey.', fullText: 'Cross-sectional survey; no intervention assigned.' },
  { id: 'N', cite: 'Fujita 2021', title: 'Smartphone-guided home exercise for adults with depression: a randomised controlled trial', abstract: '298 adults with MDD; 12 weeks of app-guided home exercise vs usual care; PHQ-9.', ta: 'forward', taWhy: 'Looks eligible.' , ft: 'Eligible — include', ftWhy: 'Eligible.', fullText: 'Methods confirm adults with MDD, 12 weeks app-guided home exercise, usual care.' },
  { id: 'O', cite: 'Dimitrov 2019', title: 'Aerobic versus resistance training for depression: a three-arm randomised trial', abstract: '130 adults with MDD randomised to aerobic training, resistance training or usual care for 10 weeks.', ta: 'forward', taWhy: 'Both exercise arms are eligible versus usual care.' , ft: 'Eligible — include', ftWhy: 'Eligible — a multi-arm trial needs care at extraction (combine arms or split the control group).', fullText: 'Three arms: aerobic (n = 32), resistance (n = 32), usual care (n = 66).' },
  { id: 'P', cite: 'Chowdhury 2018', title: 'Home-based exercise delivered through primary care for depression: a cluster randomised trial', abstract: '20 practices (218 adults with MDD) randomised to home-based exercise support or usual care for 12 weeks.', ta: 'forward', taWhy: 'Cluster RCTs are eligible designs.' , ft: 'Eligible — include', ftWhy: 'Eligible — adjust for clustering at extraction.', fullText: 'Cluster randomised: 20 practices, mean 11 patients per practice.' },
]

export function ScreeningSim() {
  const [stage, setStage] = useState<'ta' | 'ft' | 'done'>('ta')
  const [ta, setTa] = useState<Record<string, Ta>>({})
  const [ft, setFt] = useState<Record<string, Reason>>({})
  const forwarded = ABSTRACTS.filter((a) => ta[a.id] && ta[a.id] !== 'exclude')
  const lost = ABSTRACTS.filter((a) => a.ft === 'Eligible — include' && ta[a.id] === 'exclude')
  const taCorrect = ABSTRACTS.filter((a) => (a.ta === 'forward') === (ta[a.id] !== 'exclude')).length
  const ftCorrect = forwarded.filter((a) => ft[a.id] === a.ft).length

  return (
    <Lab
      title="Screening simulator"
      subtitle="Stage 1: titles/abstracts against the running-case criteria. Stage 2: full texts of what you forward."
      actions={<Button size="sm" variant="outline" onClick={() => { setStage('ta'); setTa({}); setFt({}) }}>Restart</Button>}
    >
      <div className="grid gap-2 rounded-lg border border-border bg-surface-2/50 p-3 text-xs sm:grid-cols-2">
        {Object.entries(CASE_QUESTION).map(([k, v]) => <div key={k}><span className="font-semibold">{k}:</span> {v}</div>)}
      </div>
      {stage === 'ta' && (
        <>
          <div className="space-y-2">
            {ABSTRACTS.map((a) => (
              <div key={a.id} className="rounded-lg border border-border bg-surface p-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 text-sm">
                    <div className="font-medium">{a.title}</div>
                    <div className="mt-1 text-fg/80">{a.abstract}</div>
                  </div>
                  <Segmented size="sm" value={ta[a.id] ?? ('' as Ta)} onChange={(v) => setTa({ ...ta, [a.id]: v })} label={`Decision for ${a.cite}`} options={[{ value: 'include', label: 'Include' }, { value: 'unsure', label: 'Unsure' }, { value: 'exclude', label: 'Exclude' }]} />
                </div>
              </div>
            ))}
          </div>
          <Button disabled={Object.keys(ta).length < ABSTRACTS.length} onClick={() => setStage('ft')}>Finish title/abstract stage ({Object.keys(ta).length}/{ABSTRACTS.length})</Button>
        </>
      )}
      {stage !== 'ta' && (
        <div className="space-y-3">
          <div className="text-sm font-semibold">Stage 1 feedback: {taCorrect}/{ABSTRACTS.length} decisions matched the key (“include” and “unsure” both forward the record).</div>
          {lost.length > 0 && <Callout kind="bad" title={`You lost ${lost.length} eligible stud${lost.length > 1 ? 'ies' : 'y'}`}>{lost.map((l) => l.cite).join(', ')} — excluding an eligible study at this stage is unrecoverable. Forwarding an ineligible record only costs a full-text read. Be inclusive at title/abstract.</Callout>}
          <div className="space-y-1.5">
            {ABSTRACTS.map((a) => {
              const ok = (a.ta === 'forward') === (ta[a.id] !== 'exclude')
              return (
                <div key={a.id} className={cn('rounded-md border px-3 py-2 text-xs', ok ? 'border-good/40 bg-good-soft/40' : 'border-bad/40 bg-bad-soft/40')}>
                  <span className="font-semibold">{a.cite}</span> — you: {ta[a.id]}; key: {a.ta === 'forward' ? 'retrieve full text' : 'exclude'}. {a.taWhy}
                </div>
              )
            })}
          </div>
        </div>
      )}
      {stage === 'ft' && (
        <>
          <div className="text-sm font-semibold">Stage 2: full-text decisions ({forwarded.length} reports)</div>
          <div className="space-y-2">
            {forwarded.map((a) => (
              <div key={a.id} className="grid gap-2 rounded-lg border border-border bg-surface p-3 sm:grid-cols-[1fr_16rem] sm:items-center">
                <div className="text-sm"><span className="font-medium">{a.cite}</span> — <span className="text-fg/80">{a.fullText}</span></div>
                <Select aria-label={`Full-text decision for ${a.cite}`} value={ft[a.id] ?? ''} onChange={(e) => setFt({ ...ft, [a.id]: e.target.value as Reason })}>
                  <option value="" disabled>Decide…</option>
                  {REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
                </Select>
              </div>
            ))}
          </div>
          <Button disabled={forwarded.some((a) => !ft[a.id])} onClick={() => setStage('done')}>Finish full-text stage</Button>
        </>
      )}
      {stage === 'done' && (
        <div className="space-y-2">
          <div className="text-sm font-semibold">Stage 2 feedback: {ftCorrect}/{forwarded.length} correct.</div>
          {forwarded.map((a) => (
            <div key={a.id} className={cn('rounded-md border px-3 py-2 text-xs', ft[a.id] === a.ft ? 'border-good/40 bg-good-soft/40' : 'border-bad/40 bg-bad-soft/40')}>
              <span className="font-semibold">{a.cite}</span> — you: {ft[a.id]}; key: {a.ft}. {a.ftWhy}
            </div>
          ))}
          <div className="flex flex-wrap gap-2 pt-1 text-xs">
            <Badge tone="good">Key: 8 studies included</Badge>
            <Badge>Your included: {forwarded.filter((a) => ft[a.id] === 'Eligible — include').length}</Badge>
          </div>
        </div>
      )}
    </Lab>
  )
}
