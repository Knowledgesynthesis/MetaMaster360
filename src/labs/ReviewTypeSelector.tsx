import { useState } from 'react'
import { Lab, Segmented, Badge } from '@/components/ui'

type Purpose = 'effect' | 'map' | 'accuracy' | 'prognosis' | 'experience'

const OUT: Record<string, { type: string; guide: string; method: string; why: string }> = {
  scoping: { type: 'Scoping review', guide: 'PRISMA-ScR', method: 'JBI scoping review guidance (Peters 2020)', why: 'You want to map concepts, evidence types and gaps, not estimate an effect. Critical appraisal is optional; no pooled estimate.' },
  dta: { type: 'Diagnostic test accuracy review', guide: 'PRISMA-DTA', method: 'Cochrane DTA Handbook v2 (2023); QUADAS-2', why: 'The target is sensitivity/specificity, pooled with bivariate or HSROC models.' },
  prog: { type: 'Prognostic factor review', guide: 'PRISMA 2020 (+ prognosis guidance)', method: 'QUIPS for risk of bias; PICOTS framing', why: 'The target is an association between a factor and a future outcome, usually adjusted estimates.' },
  qes: { type: 'Qualitative evidence synthesis', guide: 'ENTREQ / PRISMA 2020 where applicable', method: 'Cochrane–Campbell QES guidance; GRADE-CERQual', why: 'You want experiences, acceptability or implementation insights, synthesised thematically.' },
  nma: { type: 'Systematic review with network meta-analysis', guide: 'PRISMA-NMA', method: 'Handbook ch. 11; CINeMA for confidence', why: 'Several competing interventions must be compared, including ones never compared head-to-head. Requires transitivity.' },
  overview: { type: 'Overview of reviews (umbrella review)', guide: 'PRIOR', method: 'Handbook ch. V; AMSTAR 2 / ROBIS for included reviews', why: 'High-quality reviews already exist for the components; you summarise across them, watching for overlapping primary studies.' },
  rapid: { type: 'Rapid review', guide: 'PRISMA 2020 (report every shortcut)', method: 'Cochrane Rapid Reviews Methods Group (Garritty 2024)', why: 'A decision is needed within weeks; streamline (e.g., single screening with verification) and report every shortcut.' },
  living: { type: 'Living systematic review', guide: 'PRISMA 2020 + PRISMA-LSR (2024)', method: 'Pre-specify search frequency and update triggers', why: 'Evidence is changing fast and the question remains a priority; updates are continuous.' },
  ipd: { type: 'Individual participant data (IPD) meta-analysis', guide: 'PRISMA-IPD', method: 'Handbook ch. 26', why: 'You need consistent outcome definitions, time-to-event analyses or participant-level effect modification.' },
  sr: { type: 'Systematic review (with meta-analysis if appropriate)', guide: 'PRISMA 2020', method: 'Cochrane Handbook v6.5', why: 'A focused effect question; pool if studies are sufficiently similar, otherwise synthesise per SWiM.' },
}

function Row({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5 border-b border-border py-2.5 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm">{q}</span>
      {children}
    </div>
  )
}

export function ReviewTypeSelector() {
  const [purpose, setPurpose] = useState<Purpose>('effect')
  const [many, setMany] = useState<'no' | 'yes'>('no')
  const [reviews, setReviews] = useState<'no' | 'yes'>('no')
  const [urgent, setUrgent] = useState<'no' | 'yes'>('no')
  const [moving, setMoving] = useState<'no' | 'yes'>('no')
  const [ipd, setIpd] = useState<'no' | 'yes'>('no')

  const results: string[] = []
  if (purpose === 'map') results.push('scoping')
  else if (purpose === 'accuracy') results.push('dta')
  else if (purpose === 'prognosis') results.push('prog')
  else if (purpose === 'experience') results.push('qes')
  else {
    if (reviews === 'yes') results.push('overview')
    else if (many === 'yes') results.push('nma')
    else results.push('sr')
    if (ipd === 'yes') results.push('ipd')
  }
  if (urgent === 'yes') results.push('rapid')
  if (moving === 'yes') results.push('living')

  const yn = [{ value: 'no' as const, label: 'No' }, { value: 'yes' as const, label: 'Yes' }]

  return (
    <Lab title="Which kind of review?" subtitle="Answer for your project; the recommendation updates live.">
      <div>
        <Row q="What do you want to know?">
          <Segmented size="sm" value={purpose} onChange={setPurpose} label="Purpose" options={[
            { value: 'effect', label: 'Effect' }, { value: 'map', label: 'Map evidence' }, { value: 'accuracy', label: 'Test accuracy' },
            { value: 'prognosis', label: 'Prognosis' }, { value: 'experience', label: 'Experiences' },
          ]} />
        </Row>
        {purpose === 'effect' && (
          <>
            <Row q="Several competing interventions to compare or rank?"><Segmented size="sm" value={many} onChange={setMany} options={yn} label="Many interventions" /></Row>
            <Row q="Up-to-date systematic reviews already cover the sub-questions?"><Segmented size="sm" value={reviews} onChange={setReviews} options={yn} label="Existing reviews" /></Row>
            <Row q="Need participant-level data (time-to-event, effect modifiers)?"><Segmented size="sm" value={ipd} onChange={setIpd} options={yn} label="IPD" /></Row>
          </>
        )}
        <Row q="Decision needed within weeks?"><Segmented size="sm" value={urgent} onChange={setUrgent} options={yn} label="Urgent" /></Row>
        <Row q="Evidence changing fast and the question stays a priority?"><Segmented size="sm" value={moving} onChange={setMoving} options={yn} label="Fast-moving" /></Row>
      </div>
      <div className="space-y-3">
        {results.map((r, i) => (
          <div key={r} className="rounded-lg border border-border bg-surface-2/60 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold">{OUT[r].type}</span>
              {i > 0 && <Badge tone="accent">combine with the above</Badge>}
            </div>
            <p className="mt-1 text-sm text-fg/85">{OUT[r].why}</p>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              <Badge tone="primary">Report with: {OUT[r].guide}</Badge>
              <Badge>Method: {OUT[r].method}</Badge>
            </div>
          </div>
        ))}
      </div>
    </Lab>
  )
}
