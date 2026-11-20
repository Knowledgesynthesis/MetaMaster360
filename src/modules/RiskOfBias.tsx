import { Section, Prose, KeyPoints, Pitfalls, Grid, InfoCard } from '@/components/learn/Section'
import { Callout, Table } from '@/components/ui'
import { Refs, Cite } from '@/components/learn/Refs'
import { Rob2Domain1Lab, RobAppraisalLab } from '@/labs/RobLabs'
import { TrafficLight, RobSummaryBars } from '@/components/plots/RobPlots'
import { CASE_STUDIES } from '@/content/case'

export default function RiskOfBias() {
  const rows = CASE_STUDIES.map((s) => ({ study: s.label, d: s.rob, overall: s.robOverall }))
  return (
    <>
      <Section id="what" title="What risk of bias is — and is not">
        <Prose>
          <p>
            Bias is a systematic error: a tendency for a result to differ from the truth in a particular direction. Risk-of-bias tools judge how likely
            that is for a <strong>specific result</strong> (an outcome at a time point), because the same trial can have a blinded, objective mortality
            outcome and an unblinded, self-reported symptom outcome.
          </p>
          <ul>
            <li><strong>Not imprecision:</strong> a small trial can be unbiased; precision is handled by the confidence interval and GRADE imprecision.</li>
            <li><strong>Not reporting quality:</strong> poor reporting means “no information”, not automatically high risk.</li>
            <li><strong>Not a score:</strong> summary quality scores weight items arbitrarily; different scales lead to opposite conclusions (<Cite k="juni1999" />). Use domain-based judgements.</li>
          </ul>
        </Prose>
      </Section>

      <Section id="tools" title="Choose the tool by design and question">
        <Table
          head={['Evidence', 'Tool', 'Judgements']}
          rows={[
            ['Randomized trials (parallel; variants for cluster and crossover)', 'RoB 2 (2019)', 'Low · Some concerns · High'],
            ['Non-randomized studies of interventions', 'ROBINS-I (2016); ROBINS-I V2 posted as a revised draft, Nov 2025', 'Low · Moderate · Serious · Critical'],
            ['Non-randomized studies of exposures', 'ROBINS-E (2024)', 'Low · Some concerns · High · Very high'],
            ['Diagnostic accuracy', 'QUADAS-2 (QUADAS-C for comparative accuracy)', 'Risk of bias + applicability concerns'],
            ['Prognostic factor studies', 'QUIPS', 'Low · Moderate · High'],
            ['Prediction models (regression or AI)', 'PROBAST+AI (2025)', 'Quality, risk of bias, applicability'],
            ['Systematic reviews (overviews)', 'ROBIS; AMSTAR 2', 'Risk of bias / confidence in the review'],
            ['Missing evidence in a meta-analysis', 'ROB-ME (2023)', 'Low · Some concerns · High'],
          ]}
        />
        <Callout kind="note" title="ROBINS-I V2 in one paragraph">
          The revised tool (draft, 20 Nov 2025) adds a triage section that can route a result straight to critical risk, algorithms that map
          signalling-question answers to domain judgements, and two variants of the confounding domain (intention-to-treat vs per-protocol effects).
          Its domains cover confounding, classification of interventions, selection of participants, missing data, measurement of the outcome and
          selection of the reported result; immortal-time bias is explicitly addressed (<Cite k="robinsIv2" />). Check the site for the current version.
        </Callout>
      </Section>

      <Section id="rob2" title="RoB 2: five domains, one overall judgement">
        <Grid>
          <InfoCard title="D1 Randomization process">Random sequence? Concealed until assignment? Baseline imbalance suggesting a problem? Alternation, date of birth or open lists are not concealed.</InfoCard>
          <InfoCard title="D2 Deviations from intended interventions">Two versions: effect of <em>assignment</em> (ITT — were there trial-context deviations; was the analysis appropriate?) or effect of <em>adhering</em> (were co-interventions balanced, was adherence adequate?). Lack of blinding alone is not a deviation.</InfoCard>
          <InfoCard title="D3 Missing outcome data">Data for nearly all? If not, evidence the result is unbiased? Could missingness depend on the true outcome — and is that likely?</InfoCard>
          <InfoCard title="D4 Measurement of the outcome">Appropriate and equal measurement across groups? Were assessors aware (for self-report: the participant)? Could and likely would that influence the result?</InfoCard>
          <InfoCard title="D5 Selection of the reported result">Analysed per a plan finalised before unblinded data were available? Result selected from multiple measures or analyses? Compare with registry and protocol.</InfoCard>
          <InfoCard title="Overall">Low only if all domains are low. High if any domain is high — or several domains have some concerns that together substantially lower confidence. Otherwise some concerns.</InfoCard>
        </Grid>
        <Rob2Domain1Lab />
        <RobAppraisalLab />
      </Section>

      <Section id="display" title="Display judgements per result">
        <Prose><p>Running case, outcome = depressive symptoms at end of treatment. Traffic-light plots show each study; summary bars show the distribution per domain.</p></Prose>
        <TrafficLight rows={rows} />
        <RobSummaryBars rows={rows} />
        <Callout kind="key" title="Using judgements in the synthesis">
          Pre-specify one approach: a primary analysis of all studies with a sensitivity analysis restricted to low-risk (or low + some concerns)
          results; or stratifying by risk of bias. The judgements then feed GRADE’s risk-of-bias domain. In the running case, excluding the three
          high-risk trials shrinks the pooled SMD from −0.35 to −0.22 — a warning sign.
        </Callout>
      </Section>

      <Section id="pitfalls" title="Pitfalls">
        <Pitfalls items={[
          { wrong: 'One judgement per study for all outcomes.', right: 'Assess per result: blinding and missing data differ across outcomes.' },
          { wrong: '“Not blinded, therefore high risk” for every domain.', right: 'Blinding matters in D2 (trial-context deviations) and D4 (subjective outcomes); an objective outcome measured blind can be low risk.' },
          { wrong: 'Using the Newcastle–Ottawa scale score for non-randomized studies.', right: 'Use ROBINS-I (interventions) or ROBINS-E (exposures): domain-based, anchored to a target trial.' },
          { wrong: 'Excluding high-risk studies silently.', right: 'Follow the pre-specified plan and show the effect of including/excluding them.' },
        ]} />
      </Section>

      <KeyPoints items={[
        'Risk of bias is judged per result, by domain — never as a summary score.',
        'Match the tool to design: RoB 2, ROBINS-I (V2 draft), ROBINS-E, QUADAS-2, QUIPS, PROBAST+AI, ROB-ME.',
        'RoB 2 overall: low only if all domains low; high if any domain high.',
        'Use judgements in sensitivity analyses and GRADE, as pre-specified.',
      ]} />
      <Refs keys={['rob2', 'robinsI', 'robinsIv2', 'robinsE', 'quadas2', 'probastAI', 'amstar2', 'robme', 'juni1999', 'handbook']} />
    </>
  )
}
