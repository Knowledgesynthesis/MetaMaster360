import { useMemo, useState } from 'react'
import { Download } from 'lucide-react'
import { Button, CopyButton, Lab, TextArea, TextInput } from '@/components/ui'
import { downloadText } from '@/lib/utils'
import { CASE_QUESTION } from '@/content/case'

const FIELDS: { key: string; label: string; hint?: string; prismaP: string; rows?: number }[] = [
  { key: 'title', label: 'Title', prismaP: '1a', hint: 'identify as a systematic review (protocol)', rows: 1 },
  { key: 'registry', label: 'Registration', prismaP: '2', hint: 'registry and number, or planned registry', rows: 1 },
  { key: 'question', label: 'Objective / question', prismaP: '7', rows: 2 },
  { key: 'eligibility', label: 'Eligibility criteria (PICO + design, setting, timing, language, publication status)', prismaP: '8', rows: 4 },
  { key: 'sources', label: 'Information sources (databases, registers, other) with planned dates', prismaP: '9', rows: 3 },
  { key: 'search', label: 'Search strategy (draft for one database, appended in full)', prismaP: '10', rows: 2 },
  { key: 'selection', label: 'Selection process', prismaP: '11b', rows: 2 },
  { key: 'extraction', label: 'Data collection process and items', prismaP: '11c, 12', rows: 3 },
  { key: 'outcomes', label: 'Outcomes and prioritisation (primary, secondary, timing, hierarchy of measures)', prismaP: '13', rows: 3 },
  { key: 'rob', label: 'Risk of bias in individual studies', prismaP: '14', rows: 2 },
  { key: 'synthesis', label: 'Data synthesis (criteria for pooling, effect measures, model, heterogeneity)', prismaP: '15a–c', rows: 4 },
  { key: 'subgroups', label: 'Planned subgroup analyses — each with expected direction and rationale', prismaP: '15c', rows: 3 },
  { key: 'sensitivity', label: 'Sensitivity analyses', prismaP: '15c', rows: 2 },
  { key: 'metabias', label: 'Meta-bias (reporting bias) assessment', prismaP: '16', rows: 2 },
  { key: 'certainty', label: 'Confidence in cumulative evidence', prismaP: '17', rows: 2 },
]

const EXAMPLE: Record<string, string> = {
  title: 'Structured exercise versus usual care for adults with depression: protocol for a systematic review and meta-analysis',
  registry: 'PROSPERO (to be registered before screening begins)',
  question: 'In adults with a current major depressive episode, what are the effects of structured exercise (≥ 8 weeks) compared with usual care on depressive symptoms, response, adverse events and dropout?',
  eligibility: `Population: ${CASE_QUESTION.P}.\nIntervention: ${CASE_QUESTION.I}.\nComparator: ${CASE_QUESTION.C}.\nDesign: ${CASE_QUESTION.S}. No language or publication-status restrictions; non-English reports translated.`,
  sources: 'CENTRAL, MEDLINE (Ovid), Embase (Ovid), APA PsycInfo, CINAHL; ClinicalTrials.gov and WHO ICTRP; backward and forward citation searching of included studies; contact with trial authors.',
  search: 'Concepts: depression AND exercise AND RCT filter (Cochrane HSSS). Draft MEDLINE strategy peer-reviewed with PRESS before running.',
  selection: 'Two reviewers independently screen titles/abstracts and full texts; disagreements resolved by discussion or a third reviewer; pilot on 50 records; reasons for full-text exclusion recorded.',
  extraction: 'Piloted form; two reviewers extract independently (study design, setting, participants, intervention dose, comparator, outcomes, results, funding, conflicts). Authors contacted for missing data.',
  outcomes: 'Primary: depressive symptoms at end of treatment. Scale hierarchy: clinician-rated (HAM-D > MADRS) before self-report (BDI-II > PHQ-9). Time point closest to 12 weeks. Secondary: response (≥ 50% reduction), adverse events, dropout.',
  rob: 'RoB 2 per result (effect of assignment), assessed independently by two reviewers; overall judgement used in sensitivity analysis and GRADE.',
  synthesis: 'Pool if ≥ 2 studies are sufficiently similar. Continuous: SMD (Hedges’ g) when scales differ; binary: RR. Random-effects model with REML τ² and HKSJ confidence interval (Wald if τ² = 0 or k = 2); report τ², I² and 95% prediction interval. Otherwise synthesise per SWiM.',
  subgroups: '1) Supervised vs home-based delivery — expect larger effect with supervision (adherence). 2) Baseline severity (moderate vs severe) — expect larger effect in moderate. Test for subgroup differences; credibility judged with ICEMAN.',
  sensitivity: 'Excluding high risk-of-bias results; excluding cluster trials; using correlation r = 0.3 and 0.7 for imputed change-score SDs.',
  metabias: 'Compare registered vs reported outcomes; ROB-ME per meta-analysis; funnel plot and Egger test only if ≥ 10 studies.',
  certainty: 'GRADE (Core GRADE 2025) for each outcome in the Summary of findings table; imprecision rated against a pre-specified minimal important difference.',
}

export function ProtocolGenerator() {
  const [v, setV] = useState<Record<string, string>>({})
  const done = FIELDS.filter((f) => (v[f.key] ?? '').trim().length > 10).length
  const md = useMemo(
    () =>
      `# ${v.title || 'Untitled protocol'}\n\n` +
      FIELDS.filter((f) => f.key !== 'title')
        .map((f) => `## ${f.label.split(' (')[0]} (PRISMA-P ${f.prismaP})\n\n${(v[f.key] ?? '').trim() || '_To be completed._'}\n`)
        .join('\n') +
      `\n## Amendments\n\n| Date | Section | Change | Reason |\n|---|---|---|---|\n|  |  |  |  |\n`,
    [v],
  )
  return (
    <Lab
      title="Protocol generator"
      subtitle={`${done} of ${FIELDS.length} PRISMA-P elements drafted. Export when complete, then register.`}
      actions={
        <>
          <Button size="sm" variant="outline" onClick={() => setV(EXAMPLE)}>Load running case</Button>
          <Button size="sm" variant="outline" onClick={() => setV({})}>Clear</Button>
        </>
      }
    >
      <div className="h-2 overflow-hidden rounded-full bg-surface-2" aria-hidden><div className="h-full bg-primary transition-all" style={{ width: `${(done / FIELDS.length) * 100}%` }} /></div>
      <div className="grid gap-3 md:grid-cols-2">
        {FIELDS.map((f) =>
          f.rows === 1 ? (
            <TextInput key={f.key} label={f.label} hint={`· P-${f.prismaP}${f.hint ? ' · ' + f.hint : ''}`} value={v[f.key] ?? ''} onChange={(e) => setV({ ...v, [f.key]: e.target.value })} />
          ) : (
            <TextArea key={f.key} className={f.rows && f.rows >= 4 ? 'md:col-span-2' : ''} rows={f.rows} label={f.label} hint={`· P-${f.prismaP}`} value={v[f.key] ?? ''} onChange={(e) => setV({ ...v, [f.key]: e.target.value })} />
          ),
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => downloadText(md, 'protocol.md', 'text/markdown')}><Download className="h-4 w-4" />Download Markdown</Button>
        <CopyButton text={md} label="Copy Markdown" />
      </div>
    </Lab>
  )
}
