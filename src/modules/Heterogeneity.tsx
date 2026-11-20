import { Section, Prose, KeyPoints, Pitfalls, Grid, InfoCard } from '@/components/learn/Section'
import { Callout, Table } from '@/components/ui'
import { Refs, Cite } from '@/components/learn/Refs'
import { I2Explorer, LeaveOneOutLab, SubgroupCredibility } from '@/labs/HeterogeneityLabs'
import { MetaLab } from '@/labs/MetaLab'

export default function Heterogeneity() {
  return (
    <>
      <Section id="kinds" title="Where variation comes from">
        <Grid cols={3}>
          <InfoCard title="Clinical diversity">Different participants, intervention doses or delivery, comparators, outcome definitions.</InfoCard>
          <InfoCard title="Methodological diversity">Different designs and risk of bias (e.g., unconcealed allocation, unblinded self-report).</InfoCard>
          <InfoCard title="Statistical heterogeneity">True effects differ more than chance would explain — the consequence of the two above.</InfoCard>
        </Grid>
      </Section>

      <Section id="stats" title="Four statistics, four questions">
        <Table
          head={['Statistic', 'Question it answers', 'Caveat']}
          rows={[
            ['Cochran’s Q (χ² test)', 'Is there more variation than chance would produce?', 'Low power with few studies, high power with many; a non-significant Q does not show homogeneity.'],
            ['I²', 'What share of the observed variation reflects real differences rather than chance?', 'Relative, not absolute: it rises with study precision. Uncertain when k is small.'],
            ['τ² / τ', 'How much do true effects vary, in effect-size units?', 'Absolute and interpretable (τ is an SD of true effects), but imprecise with few studies — report its CI.'],
            ['95% prediction interval', 'Where is the true effect in a new similar setting likely to be?', 'The most decision-relevant; unreliable with very few studies.'],
          ]}
        />
        <Callout kind="note" title="Cochrane’s rough guide to I² (deliberately overlapping)">
          0–40% might not be important; 30–60% may represent moderate heterogeneity; 50–90% substantial; 75–100% considerable. Importance also
          depends on the size and direction of effects and on the strength of evidence for heterogeneity (<Cite k="handbook">Handbook 10.10.2</Cite>;
          <Cite k="higgins2003" />).
        </Callout>
        <I2Explorer />
        <Prose><p>Borenstein and colleagues showed why I² is so often misread as “amount of heterogeneity” (<Cite k="borenstein2017" />). Core GRADE’s inconsistency guidance also focuses on how much point estimates differ relative to decision thresholds and how far CIs overlap, using I² only as a supplement (<Cite k="coreGrade3" />).</p></Prose>
      </Section>

      <Section id="subgroups" title="Investigating heterogeneity">
        <Grid>
          <InfoCard title="Subgroup analysis">Compare pooled effects between groups of studies with a <strong>test for subgroup differences</strong>. Never infer a difference because one subgroup is “significant” and the other is not.</InfoCard>
          <InfoCard title="Meta-regression">Relates effect size to study-level covariates. Needs roughly ≥ 10 studies per covariate; prone to confounding and ecological (aggregation) bias — study-average age says little about age as a modifier within studies.</InfoCard>
          <InfoCard title="Within- vs between-study evidence">Comparisons across trials are observational even if every trial is randomized. Within-trial subgroup data (or IPD) are far more credible.</InfoCard>
          <InfoCard title="Credibility">Few, pre-specified, directional hypotheses with a rationale; low probability of chance; consistent across studies; not confounded (<Cite k="iceman" />).</InfoCard>
        </Grid>
        <MetaLab initial="case-smd" subgroupsDefault />
        <SubgroupCredibility />
      </Section>

      <Section id="sensitivity" title="Sensitivity analysis">
        <Prose>
          <p>A sensitivity analysis repeats the primary analysis under different, defensible decisions — restricting to low risk of bias, excluding imputed
          data or cluster trials, changing the model or estimator, using alternative correlation values. It asks whether conclusions are robust, not
          whether effects differ between groups (that is a subgroup analysis). Pre-specify the important ones; report all.</p>
        </Prose>
        <LeaveOneOutLab />
      </Section>

      <Section id="pitfalls" title="Pitfalls">
        <Pitfalls items={[
          { wrong: '“I² = 0%, so there is no heterogeneity.”', right: 'With few or small studies, I² and τ² are imprecise; check their CIs and the PI.' },
          { wrong: '“The effect was significant in men but not women.”', right: 'Test the difference between subgroups (interaction).' },
          { wrong: 'Running 15 subgroup analyses and reporting the significant one.', right: 'Pre-specify a few; treat the rest as exploratory and say so.' },
          { wrong: 'Removing outlying studies until I² is low.', right: 'Investigate why they differ; show results with and without as a sensitivity analysis.' },
        ]} />
      </Section>

      <KeyPoints items={[
        'Q tests, I² describes the proportion, τ measures spread, the PI predicts — report τ and the PI.',
        'I² depends on study precision; it is not an absolute measure.',
        'Use tests for subgroup differences; judge credibility (within-study, pre-specified, directional, unconfounded).',
        'Sensitivity analyses check robustness to decisions.',
      ]} />
      <Refs keys={['handbook', 'higgins2003', 'borenstein2017', 'iceman', 'coreGrade3', 'inthout2016']} />
    </>
  )
}
