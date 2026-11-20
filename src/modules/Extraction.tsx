import { Section, Prose, KeyPoints, Pitfalls, Grid, InfoCard } from '@/components/learn/Section'
import { Callout, Table } from '@/components/ui'
import { Refs, Cite } from '@/components/learn/Refs'
import { ExtractionExercise } from '@/labs/ExtractionExercise'
import { ConversionCalcs } from '@/labs/ConversionCalcs'

export default function Extraction() {
  return (
    <>
      <Section id="form" title="Design the form, pilot it, extract in duplicate">
        <Prose>
          <p>
            Extraction errors are common and propagate straight into the pooled estimate. Use a structured form, pilot it on 2–3 studies, and have two
            people extract independently (at least for outcome data), then reconcile. Single extraction produces more errors than double extraction
            (<Cite k="buscemi2006" />). Share the forms and extracted data (PRISMA item 27).
          </p>
        </Prose>
        <Table
          head={['Domain', 'Extract']}
          rows={[
            ['Identification', 'All linked reports, registration number, funding source, conflicts of interest'],
            ['Methods', 'Design (parallel, cluster, crossover), unit of randomisation, analysis population (ITT/per-protocol), follow-up'],
            ['Participants', 'Eligibility, diagnosis method, baseline characteristics (age, sex, severity), setting, country'],
            ['Interventions', 'Each arm in replicable detail (TIDieR: what, who, how, where, when and how much, tailoring, adherence)'],
            ['Outcomes', 'Definition, instrument, direction (is higher better?), time points, who assessed'],
            ['Results', 'Per arm: n analysed and mean & SD (continuous) or events/total (binary); or adjusted estimate with CI; missing data per arm'],
            ['Risk-of-bias information', 'Quotes supporting each signalling question (allocation concealment, blinding, missing data, analysis plan)'],
          ]}
        />
      </Section>

      <Section id="numbers" title="Getting the right numbers">
        <Grid>
          <InfoCard title="SE, CI, t and p → SD">Papers often report SEs or CIs instead of SDs. Convert (calculators below). A suspiciously small “SD” is usually an SE.</InfoCard>
          <InfoCard title="Medians and IQRs">Estimate mean and SD (Luo 2018; Wan 2014) only if the distribution is roughly symmetric. For outcomes that cannot be negative, a mean smaller than twice its SD suggests skew.</InfoCard>
          <InfoCard title="Change vs final scores">Both are valid for MD and can be combined in an MD analysis. Do not mix them in an SMD analysis: their SDs measure different things (<Cite k="handbook">Handbook 10.5.2</Cite>).</InfoCard>
          <InfoCard title="Direction of scales">If higher is better on some scales and worse on others, multiply the means (not the SDs) of the reversed scales by −1 before computing SMDs.</InfoCard>
          <InfoCard title="Missing SDs">Compute from other statistics first; ask authors; impute (e.g., from similar studies) only as a last resort and test the impact in a sensitivity analysis.</InfoCard>
          <InfoCard title="Figures only">Digitise plots with tools such as WebPlotDigitizer, record it, and ask authors for exact numbers.</InfoCard>
        </Grid>
      </Section>

      <Section id="unit" title="Unit-of-analysis problems">
        <Table
          head={['Situation', 'Problem', 'Fix']}
          rows={[
            ['Cluster-randomised trial analysed per individual', 'CI too narrow; study over-weighted', 'Use a cluster-adjusted estimate, or divide n (and events) by the design effect 1 + (m − 1)·ICC'],
            ['Multi-arm trial, two eligible arms vs one control', 'Control participants counted twice', 'Combine eligible arms, or split the control group between comparisons'],
            ['Crossover trial', 'Within-person correlation ignored or carry-over', 'Use paired analysis data; otherwise first-period data or a correlation-based adjustment'],
            ['Several time points or scales', 'Same participants entered more than once', 'One result per study per analysis, chosen by the protocol hierarchy'],
          ]}
        />
      </Section>

      <Section id="lab-extract" title="Lab: extract four results with traps">
        <ExtractionExercise />
        <ConversionCalcs />
      </Section>

      <Section id="integrity" title="Integrity and AI-assisted extraction">
        <Callout kind="pitfall" title="Check that included studies are trustworthy">
          Check each included report for retractions, expressions of concern, and implausible data (identical baseline SDs across arms, impossible
          percentages, results too good to be true). Cochrane has a policy for managing potentially problematic studies; record what you checked.
        </Callout>
        <Callout kind="tip" title="Using LLMs to extract">
          Treat LLM output as a draft from an unvalidated extractor: verify every number against the source and report the tool, version and how outputs
          were checked (<Cite k="aiPosition2025">2025 joint position</Cite>).
        </Callout>
      </Section>

      <Section id="pitfalls" title="Pitfalls">
        <Pitfalls items={[
          { wrong: 'Entering “mean ± SEM” values as SDs.', right: 'Convert: SD = SE × √n.' },
          { wrong: 'Entering both arms of a three-arm trial against the same control.', right: 'Combine arms or split the shared group.' },
          { wrong: 'Using per-patient results of a cluster trial unadjusted.', right: 'Apply the design effect or use a cluster-adjusted estimate.' },
          { wrong: 'Mixing change and final scores in an SMD analysis.', right: 'Use one type for SMD (final values are usually more available); either is fine for MD.' },
          { wrong: 'Extracting the “most significant” of several time points.', right: 'Apply the pre-specified time-point and scale hierarchy.' },
        ]} />
      </Section>

      <KeyPoints items={[
        'Pilot the form; extract outcome data in duplicate.',
        'Convert SE/CI/medians with stated assumptions and test them in sensitivity analyses.',
        'Fix unit-of-analysis errors before pooling: clusters, multi-arm trials, crossovers, repeated measures.',
        'Check study integrity; verify any AI-extracted value against the source.',
      ]} />
      <Refs keys={['handbook', 'buscemi2006', 'wan2014', 'luo2018', 'prisma2020', 'aiPosition2025']} />
    </>
  )
}
