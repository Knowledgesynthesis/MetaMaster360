import { useMemo, useState } from 'react'
import { CheckCircle2, AlertTriangle } from 'lucide-react'
import { Button, CopyButton, Lab, Select, TextArea, Table } from '@/components/ui'
import { CASE_QUESTION } from '@/content/case'

type QType = 'intervention' | 'exposure' | 'diagnostic' | 'prognosis' | 'qualitative' | 'scoping'

const FRAMEWORKS: Record<QType, { name: string; fields: { key: string; label: string; placeholder: string }[]; template: (v: Record<string, string>) => string }> = {
  intervention: {
    name: 'PICO (+ study design)',
    fields: [
      { key: 'P', label: 'Population', placeholder: 'Adults ≥ 18 y with a current major depressive episode (DSM-5)' },
      { key: 'I', label: 'Intervention', placeholder: 'Structured exercise ≥ 8 weeks' },
      { key: 'C', label: 'Comparator', placeholder: 'Usual care or waiting list' },
      { key: 'O', label: 'Outcomes (with timing)', placeholder: 'Depressive symptoms at end of treatment' },
      { key: 'S', label: 'Study designs', placeholder: 'Randomized controlled trials' },
    ],
    template: (v) => `In ${v.P || '[population]'}, what are the effects of ${v.I || '[intervention]'} compared with ${v.C || '[comparator]'} on ${v.O || '[outcomes]'}?`,
  },
  exposure: {
    name: 'PECO',
    fields: [
      { key: 'P', label: 'Population', placeholder: 'Women aged 20–65 in paid employment' },
      { key: 'E', label: 'Exposure', placeholder: 'Night-shift work ≥ 3 nights/month for ≥ 1 year' },
      { key: 'C', label: 'Comparator', placeholder: 'Day work only' },
      { key: 'O', label: 'Outcome (with timing)', placeholder: 'Incident breast cancer during follow-up' },
      { key: 'S', label: 'Study designs', placeholder: 'Prospective cohort and nested case-control studies' },
    ],
    template: (v) => `Among ${v.P || '[population]'}, is ${v.E || '[exposure]'} compared with ${v.C || '[comparator]'} associated with ${v.O || '[outcome]'}?`,
  },
  diagnostic: {
    name: 'Population · Index test · Reference standard · Target condition',
    fields: [
      { key: 'P', label: 'Population & setting', placeholder: 'Children presenting to the emergency department with suspected pneumonia' },
      { key: 'I', label: 'Index test(s)', placeholder: 'Point-of-care lung ultrasound' },
      { key: 'R', label: 'Reference standard', placeholder: 'Chest radiograph plus clinical adjudication' },
      { key: 'T', label: 'Target condition', placeholder: 'Community-acquired pneumonia' },
    ],
    template: (v) => `What is the diagnostic accuracy (sensitivity and specificity) of ${v.I || '[index test]'} for ${v.T || '[target condition]'} in ${v.P || '[population]'}, using ${v.R || '[reference standard]'} as the reference standard?`,
  },
  prognosis: {
    name: 'PICOTS (prognostic factor)',
    fields: [
      { key: 'P', label: 'Population', placeholder: 'Adults with first ischaemic stroke' },
      { key: 'I', label: 'Index prognostic factor', placeholder: 'Diabetes at admission' },
      { key: 'C', label: 'Comparator factor', placeholder: 'No diabetes' },
      { key: 'O', label: 'Outcome', placeholder: 'All-cause mortality' },
      { key: 'T', label: 'Timing', placeholder: 'At 12 months' },
      { key: 'S', label: 'Setting', placeholder: 'Hospital stroke units' },
    ],
    template: (v) => `In ${v.P || '[population]'} (${v.S || '[setting]'}), is ${v.I || '[prognostic factor]'} versus ${v.C || '[comparator]'} associated with ${v.O || '[outcome]'} ${v.T || '[timing]'}?`,
  },
  qualitative: {
    name: 'SPIDER',
    fields: [
      { key: 'S', label: 'Sample', placeholder: 'Adults living with depression' },
      { key: 'PI', label: 'Phenomenon of interest', placeholder: 'Taking part in exercise programmes' },
      { key: 'D', label: 'Design', placeholder: 'Interviews, focus groups' },
      { key: 'E', label: 'Evaluation', placeholder: 'Experiences, barriers, facilitators' },
      { key: 'R', label: 'Research type', placeholder: 'Qualitative and mixed methods' },
    ],
    template: (v) => `What are the ${v.E || '[experiences]'} of ${v.S || '[sample]'} regarding ${v.PI || '[phenomenon]'}, as reported in ${v.R || '[research type]'} studies using ${v.D || '[design]'}?`,
  },
  scoping: {
    name: 'PCC (JBI scoping reviews)',
    fields: [
      { key: 'P', label: 'Population', placeholder: 'Adolescents aged 10–19' },
      { key: 'C1', label: 'Concept', placeholder: 'Digital mental health interventions and the outcomes measured' },
      { key: 'C2', label: 'Context', placeholder: 'School and community settings, any country' },
    ],
    template: (v) => `What is known about ${v.C1 || '[concept]'} for ${v.P || '[population]'} in ${v.C2 || '[context]'}, and where are the evidence gaps?`,
  },
}

interface Check { ok: boolean; text: string }

function critique(type: QType, v: Record<string, string>): Check[] {
  const has = (k: string) => (v[k] ?? '').trim().length > 0
  const words = (k: string) => (v[k] ?? '').trim().split(/\s+/).filter(Boolean).length
  const timing = /(week|month|year|day|end of (treatment|follow)|follow-up|at \d|≥|>=|hour)/i
  const checks: Check[] = []
  const fw = FRAMEWORKS[type]
  const missing = fw.fields.filter((f) => !has(f.key)).map((f) => f.label)
  checks.push({ ok: missing.length === 0, text: missing.length ? `Missing: ${missing.join(', ')}.` : 'Every element is specified.' })
  if (has('P')) checks.push({ ok: words('P') >= 4, text: words('P') >= 4 ? 'Population is defined beyond a single label.' : 'Population is thin — add how the condition is defined (criteria/cut-off), age range and setting.' })
  if (type === 'intervention' || type === 'exposure') {
    const c = (v.C ?? '').toLowerCase()
    if (has('C')) checks.push({ ok: !/^(control|controls|any|standard)$/.test(c.trim()), text: /^(control|controls|any|standard)$/.test(c.trim()) ? '“Control” is not a comparator. Name eligible comparators (placebo, usual care, waiting list, active treatment) — they answer different questions.' : 'Comparator is explicit.' })
    const iKey = type === 'intervention' ? 'I' : 'E'
    if (has(iKey)) checks.push({ ok: /(\d|week|month|dose|session|mg|daily|minimum|≥|at least)/i.test(v[iKey]), text: /(\d|week|month|dose|session|mg|daily|minimum|≥|at least)/i.test(v[iKey]) ? 'Intervention/exposure has a dose, duration or intensity.' : 'Add minimum dose, duration or intensity so screeners can decide consistently.' })
    if (has('O')) checks.push({ ok: timing.test(v.O), text: timing.test(v.O) ? 'Outcome timing is stated.' : 'State when outcomes are measured (e.g., end of treatment, 6–12 months) — timing changes the answer.' })
    if (has('O')) {
      const multi = /,|;| and /i.test(v.O)
      checks.push({ ok: !multi || /primary/i.test(v.O), text: !multi || /primary/i.test(v.O) ? 'Outcome hierarchy is clear.' : 'Several outcomes listed: label one (or two) as primary and include at least one harm.' })
    }
    if (has('S')) checks.push({ ok: true, text: 'Eligible study designs are stated.' })
  }
  if (type === 'diagnostic' && has('R')) checks.push({ ok: !/(index|same)/i.test(v.R), text: 'Reference standard should be the best available method, independent of the index test.' })
  checks.push({ ok: true, text: 'Reminder: outcomes define what you analyse, not which studies you include — do not exclude studies just because they did not report an outcome.' })
  return checks
}

export function QuestionBuilder() {
  const [type, setType] = useState<QType>('intervention')
  const [vals, setVals] = useState<Record<string, string>>({})
  const fw = FRAMEWORKS[type]
  const question = fw.template(vals)
  const checks = useMemo(() => critique(type, vals), [type, vals])
  const criteria = fw.fields.map((f) => [f.label, vals[f.key]?.trim() || <span className="text-muted">—</span>])

  return (
    <Lab
      title="Question builder & critic"
      subtitle="Pick the question type, fill each element, and fix what the critic flags."
      actions={type === 'intervention' && <Button size="sm" variant="outline" onClick={() => setVals({ ...CASE_QUESTION })}>Load running case</Button>}
    >
      <Select label="Question type" value={type} onChange={(e) => { setType(e.target.value as QType); setVals({}) }}>
        <option value="intervention">Effect of an intervention</option>
        <option value="exposure">Effect of an exposure / harm / etiology</option>
        <option value="diagnostic">Diagnostic test accuracy</option>
        <option value="prognosis">Prognostic factor</option>
        <option value="qualitative">Experiences / qualitative</option>
        <option value="scoping">Map the evidence (scoping)</option>
      </Select>
      <div className="text-xs font-medium text-muted">Framework: {fw.name}</div>
      <div className="grid gap-3 md:grid-cols-2">
        {fw.fields.map((f) => (
          <TextArea key={f.key} label={f.label} placeholder={f.placeholder} rows={2} value={vals[f.key] ?? ''} onChange={(e) => setVals({ ...vals, [f.key]: e.target.value })} />
        ))}
      </div>
      <div className="rounded-lg border border-primary/40 bg-primary-soft/40 p-4">
        <div className="mb-1 flex items-center justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-primary">Review question</span>
          <CopyButton text={question} />
        </div>
        <p className="text-base leading-relaxed">{question}</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <div className="mb-2 text-sm font-semibold">Critic</div>
          <ul className="space-y-1.5 text-sm">
            {checks.map((c, i) => (
              <li key={i} className="flex gap-2">
                {c.ok ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-good" /> : <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warn" />}
                <span>{c.text}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="mb-2 text-sm font-semibold">Eligibility criteria draft</div>
          <Table head={['Element', 'Criterion']} rows={criteria} />
        </div>
      </div>
    </Lab>
  )
}
