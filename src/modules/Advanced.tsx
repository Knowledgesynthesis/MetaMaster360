import { Section, Prose, KeyPoints, Grid, InfoCard } from '@/components/learn/Section'
import { Callout, Table } from '@/components/ui'
import { Refs, Cite } from '@/components/learn/Refs'
import { BucherCalc, AiUseLab } from '@/labs/AdvancedLabs'
import { ReviewTypeSelector } from '@/labs/ReviewTypeSelector'

export default function Advanced() {
  return (
    <>
      <Section id="nma" title="Network meta-analysis">
        <Prose>
          <p>NMA combines direct and indirect evidence across a network of interventions to estimate every pairwise effect and, optionally, a ranking (<Cite k="handbook">Handbook ch. 11</Cite>).</p>
          <ul>
            <li><strong>Transitivity:</strong> effect modifiers are similarly distributed across comparisons — a clinical judgement made before analysis.</li>
            <li><strong>Consistency (coherence):</strong> direct and indirect estimates agree — checked statistically (node-splitting, design-by-treatment models).</li>
            <li><strong>Rankings</strong> (SUCRA, P-scores) ignore effect sizes and certainty; never interpret them alone.</li>
            <li>Rate confidence with CINeMA or GRADE for NMA (<Cite k="cinema" />); report with PRISMA-NMA (<Cite k="prismaNMA" />).</li>
          </ul>
        </Prose>
        <BucherCalc />
      </Section>

      <Section id="types" title="Other review types at a glance">
        <Table
          head={['Type', 'Key methods', 'Appraisal / certainty', 'Reporting']}
          rows={[
            ['Diagnostic test accuracy', 'Pool sensitivity and specificity jointly (bivariate or HSROC models); explore threshold effects', 'QUADAS-2; GRADE for DTA', 'PRISMA-DTA'],
            ['Individual participant data', 'Re-analyse raw data with consistent definitions; one- or two-stage models; within-trial interactions', 'RoB 2 with IPD checks', 'PRISMA-IPD'],
            ['Prognostic factor / prediction model', 'Adjusted estimates; calibration and discrimination for models', 'QUIPS; PROBAST+AI (2025)', 'PRISMA 2020 + TRIPOD-SRMA'],
            ['Qualitative evidence synthesis', 'Thematic synthesis, framework synthesis, meta-ethnography', 'GRADE-CERQual', 'ENTREQ / PRISMA 2020'],
            ['Scoping review', 'Map concepts and evidence; charting', 'Appraisal optional', 'PRISMA-ScR'],
            ['Rapid review', 'Pre-specified streamlining (e.g., single screening with verification)', 'As for full reviews, reported as limitations', 'PRISMA 2020'],
            ['Living review', 'Continuous surveillance and updating with pre-set triggers', 'GRADE per update', 'PRISMA 2020 + PRISMA-LSR'],
            ['Overview / umbrella review', 'Synthesise reviews; manage overlap of primary studies', 'AMSTAR 2 or ROBIS', 'PRIOR'],
          ]}
        />
        <Grid>
          <InfoCard title="Bayesian meta-analysis">Useful when studies are few: informative priors for τ² (derived from large collections of meta-analyses) stabilise estimates. Report priors and sensitivity to them.</InfoCard>
          <InfoCard title="Cochrane DTA Handbook v2 (2023)">The current reference for test-accuracy reviews (<Cite k="dtaHandbook" />). Never pool sensitivity and specificity in separate univariate analyses.</InfoCard>
        </Grid>
        <ReviewTypeSelector />
      </Section>

      <Section id="ai" title="AI in evidence synthesis (2025 position)">
        <Callout kind="key" title="Joint position of Cochrane, Campbell, JBI and CEE (November 2025)">
          Endorsing the RAISE recommendations: review authors remain <strong>accountable</strong> for their synthesis; AI and automation are used with
          <strong> human oversight</strong>; tools should be shown to be fit for purpose; and any AI that makes or suggests judgements is
          <strong> fully and transparently reported</strong>. Developers are asked to document limitations and potential biases (<Cite k="aiPosition2025" />).
        </Callout>
        <Grid>
          <InfoCard title="Where AI already helps">Search-term suggestion, translation, deduplication, screening prioritisation and RCT classification, draft data extraction, plain-language drafting.</InfoCard>
          <InfoCard title="Where it fails silently">Invented references and subject headings, mis-read numbers (SE vs SD), confident errors in risk-of-bias judgements, inconsistent results across runs and versions.</InfoCard>
        </Grid>
        <AiUseLab />
      </Section>

      <KeyPoints items={[
        'NMA rests on transitivity (judged) and consistency (tested); rankings need effect sizes and certainty beside them.',
        'Each review type has its own methods handbook, appraisal tool and reporting extension.',
        'AI: humans accountable, validated tools, human oversight, transparent reporting.',
      ]} />
      <Refs keys={['handbook', 'cinema', 'prismaNMA', 'dtaHandbook', 'probastAI', 'cerqual', 'jbiScoping', 'rapid2024', 'prismaLSR', 'amstar2', 'aiPosition2025']} />
    </>
  )
}
