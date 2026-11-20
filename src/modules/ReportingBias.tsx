import { Section, Prose, KeyPoints, Pitfalls, Grid, InfoCard, Steps } from '@/components/learn/Section'
import { Table } from '@/components/ui'
import { Refs, Cite } from '@/components/learn/Refs'
import { PubBiasSim } from '@/labs/PubBiasSim'
import { FunnelPlot } from '@/components/plots/FunnelPlot'
import { CASE_STUDIES } from '@/content/case'
import { hedgesG, metaAnalyze } from '@/lib/stats'

export default function ReportingBias() {
  const pts = CASE_STUDIES.map((c) => { const g = hedgesG(c.m1, c.sd1, c.n1, c.m2, c.sd2, c.n2); return { id: c.id, label: c.label, yi: g.yi, vi: g.vi } })
  const fe = metaAnalyze(pts).common.est
  return (
    <>
      <Section id="types" title="Missing evidence is not missing at random">
        <Prose>
          <p>
            Results that are statistically significant or favourable are more likely to be published, published quickly, in English, in high-visibility
            journals and cited — and within published studies, favourable outcomes are more likely to be reported. Whole studies missing
            (<strong>publication bias</strong>) and results missing within studies (<strong>selective outcome reporting</strong>) both push meta-analyses
            toward exaggerated benefit (<Cite k="handbook">Handbook ch. 13</Cite>).
          </p>
          <p>Prevention beats detection: search trial registers and regulatory documents, request unpublished data, and compare registered with reported outcomes.</p>
        </Prose>
      </Section>

      <Section id="funnel" title="Funnel plots: what asymmetry can and cannot tell you">
        <Prose><p>A funnel plot shows each study’s effect against its standard error. Without bias, small studies scatter widely and symmetrically around the pooled effect. Asymmetry signals <strong>small-study effects</strong> — of which publication bias is only one cause (<Cite k="sterne2011" />).</p></Prose>
        <Table
          head={['Cause of asymmetry', 'Example']}
          rows={[
            ['Reporting biases', 'Small null studies unpublished or outcomes selectively reported'],
            ['Poor methods in small studies', 'Small trials with inadequate concealment or unblinded subjective outcomes show larger effects'],
            ['True heterogeneity', 'Small trials used more intensive interventions or higher-risk patients'],
            ['Artefact', 'For ORs and SMDs the estimate and its SE are correlated'],
            ['Chance', 'Especially with few studies'],
          ]}
        />
        <Grid>
          <InfoCard title="Use tests only when they work">Egger’s test (continuous outcomes), Harbord’s or Peters’ tests (binary) need at least 10 studies, should not be used when studies are of similar size, and have low power — a non-significant test does not exclude bias.</InfoCard>
          <InfoCard title="Contour-enhanced funnels">Shading marks regions of statistical significance. If the “missing” area is where results would be non-significant, publication bias is a plausible cause; if it is in significant regions, look for other causes (<Cite k="peters2008" />).</InfoCard>
          <InfoCard title="Adjustment methods">Trim-and-fill, PET-PEESE and selection models rest on strong assumptions (e.g., that asymmetry is entirely publication bias). Use them as sensitivity analyses, never as the answer.</InfoCard>
          <InfoCard title="ROB-ME">A structured judgement of risk of bias due to missing evidence for each meta-analysis: known missing results (studies that measured but did not report the outcome) plus the potential for unknown missing studies → Low / Some concerns / High (<Cite k="robme" />).</InfoCard>
        </Grid>
      </Section>

      <Section id="lab-sim" title="Lab: create publication bias and watch it work">
        <PubBiasSim />
      </Section>

      <Section id="case" title="Running case: what should we conclude?">
        <FunnelPlot points={pts.map((p) => ({ yi: p.yi, sei: Math.sqrt(p.vi), label: p.label }))} center={fe} xLabel="SMD (negative favours exercise)" contours />
        <Steps items={[
          { title: 'Count studies', body: 'k = 8: below 10, so no formal asymmetry test.' },
          { title: 'Look anyway', body: 'The three smallest trials (Brennan, Eze, Haddad) show the largest benefits; no small trial shows a null result.' },
          { title: 'Link to risk of bias', body: 'Those same three trials are at high risk of bias; restricting to the others gives SMD −0.22 instead of −0.35.' },
          { title: 'Known missing results', body: 'Registry searches found two completed trials (about 180 participants) with no results posted or published three years after completion; Haddad reported PHQ-9 instead of the registered BDI-II.' },
          { title: 'Judgement', body: 'ROB-ME: high risk of bias due to missing evidence. GRADE: publication bias strongly suspected — rate down one level (module 13), noting that the small-study pattern overlaps with risk of bias.' },
        ]} />
      </Section>

      <Section id="pitfalls" title="Pitfalls">
        <Pitfalls items={[
          { wrong: 'Running Egger’s test on 6 studies and reporting “no publication bias (p = 0.4)”.', right: 'With < 10 studies the test is uninformative; state that and judge qualitatively.' },
          { wrong: '“The funnel is asymmetric, so there is publication bias.”', right: 'Consider small-study bias, heterogeneity, artefact and chance.' },
          { wrong: 'Reporting the trim-and-fill estimate as the corrected effect.', right: 'Present it as a sensitivity analysis with its assumptions.' },
          { wrong: 'Assessing publication bias only with plots.', right: 'Search registers; list studies with known missing results; use ROB-ME.' },
        ]} />
      </Section>

      <KeyPoints items={[
        'Publication and outcome-reporting biases exaggerate benefits; prevent them with comprehensive searching.',
        'Funnel asymmetry = small-study effects; publication bias is only one cause.',
        'Asymmetry tests need ≥ 10 studies and still have low power.',
        'Judge missing evidence per meta-analysis with ROB-ME and carry it into GRADE.',
      ]} />
      <Refs keys={['handbook', 'sterne2011', 'egger1997', 'peters2008', 'robme', 'coreGrade4']} />
    </>
  )
}
