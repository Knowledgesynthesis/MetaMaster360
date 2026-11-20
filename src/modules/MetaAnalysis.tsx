import { Section, Prose, KeyPoints, Pitfalls, Grid, InfoCard } from '@/components/learn/Section'
import { Callout, Formula, Table } from '@/components/ui'
import { Refs, Cite } from '@/components/learn/Refs'
import { MetaLab, WeightExplorer } from '@/labs/MetaLab'

export default function MetaAnalysis() {
  return (
    <>
      <Section id="when" title="When to pool — and when not to">
        <Prose>
          <p>
            Meta-analysis increases precision and lets you examine consistency. It is appropriate when studies are similar enough in participants,
            interventions, comparators and outcomes that a combined estimate answers a meaningful question. It does not fix poor inputs: pooling biased
            studies yields a precise, wrong answer, and pooling incompatible interventions yields a number that applies to nothing. If pooling is not
            sensible, synthesise without meta-analysis (SWiM, module 12).
          </p>
        </Prose>
      </Section>

      <Section id="models" title="Two models, two questions">
        <Grid>
          <InfoCard title="Common-effect (fixed-effect)">
            <p>Assumes every study estimates the same true effect θ; differences are sampling error only.</p>
            <Formula>{'wᵢ = 1/vᵢ\nθ = Σwᵢyᵢ / Σwᵢ      SE(θ) = 1/√Σwᵢ'}</Formula>
            <p>Answers: “what is the best estimate of the common effect?” Large studies dominate.</p>
          </InfoCard>
          <InfoCard title="Random-effects">
            <p>Assumes true effects vary across studies around a mean μ with between-study variance τ².</p>
            <Formula>{'wᵢ* = 1/(vᵢ + τ²)\nμ = Σwᵢ*yᵢ / Σwᵢ*      SE(μ) = 1/√Σwᵢ*'}</Formula>
            <p>Answers: “what is the average effect across settings like these, and how much does it vary?”</p>
          </InfoCard>
        </Grid>
        <Callout kind="key" title="Current Cochrane methods (RevMan)">
          <ul>
            <li><strong>τ² estimator:</strong> REML is the default and recommended; DerSimonian–Laird remains available but tends to underestimate τ², especially with few studies.</li>
            <li><strong>Confidence interval:</strong> HKSJ is recommended when τ² &gt; 0 and there are more than two studies; otherwise the Wald-type interval.</li>
            <li><strong>Prediction interval:</strong> optional, recommended to show how much effects vary — interpret with caution when studies are few.</li>
            <li><strong>τ² uncertainty:</strong> a Q-profile confidence interval can be displayed.</li>
          </ul>
          <p className="mt-2">Sources: <Cite k="reExplainer">Cochrane RE methods explainer</Cite>; <Cite k="veroniki2016" />; <Cite k="veroniki2019" />; <Cite k="inthout2014" />.</p>
        </Callout>
        <Formula label="HKSJ and the prediction interval">{'HKSJ:  SE_HK = √[ Σwᵢ*(yᵢ − μ)² / ((k − 1)·Σwᵢ*) ],   CI = μ ± t(k−1) × SE_HK\nPI:    μ ± t(k−2) × √(τ² + SE(μ)²)        (all quantities are estimates)'}</Formula>
        <WeightExplorer />
      </Section>

      <Section id="forest" title="Reading a forest plot">
        <Table
          head={['Element', 'Meaning']}
          rows={[
            ['Square', 'Study estimate; area proportional to its weight'],
            ['Horizontal line', 'Study 95% confidence interval (arrows if it runs off the axis)'],
            ['Vertical line', 'No effect (0 for differences, 1 for ratios — plotted on a log axis)'],
            ['Diamond', 'Pooled estimate (centre) and its 95% CI (width)'],
            ['Prediction-interval bar', 'Range of true effects expected in a new, similar setting'],
            ['Axis labels', 'Which side favours which group — always check; it flips with outcome direction'],
          ]}
        />
      </Section>

      <Section id="lab-meta" title="Lab: run the meta-analysis">
        <Prose><p>Start with the running case (SMD). Then switch the τ² estimator and CI method and watch what changes; load the BCG data to see high heterogeneity; untick high risk-of-bias studies; turn on subgroups.</p></Prose>
        <MetaLab />
      </Section>

      <Section id="special" title="Special situations">
        <Grid>
          <InfoCard title="Few studies (k &lt; 5)">τ² is estimated very imprecisely; I² and prediction intervals are unreliable. HKSJ intervals can be very wide (k = 2: use Wald). Consider whether pooling is sensible; Bayesian methods with informative priors for τ² are an option.</InfoCard>
          <InfoCard title="Binary outcomes and rare events">RevMan’s default fixed-effect method for binary data is Mantel–Haenszel. With rare events, Peto’s OR works when arms are balanced and effects are modest; otherwise use MH without continuity correction or exact/likelihood-based models. Inverse variance (used here) gives similar results unless events are sparse.</InfoCard>
          <InfoCard title="Software">RevMan, R (<code>metafor</code>, <code>meta</code>), Stata (<code>meta</code>), JASP/jamovi. Report software, model, estimator and CI method (PRISMA item 13d).</InfoCard>
          <InfoCard title="Significance is not importance">A CI excluding no effect says the direction is fairly clear, not that the effect matters. A CI including no effect is not evidence of no effect (<Cite k="altman1995" />).</InfoCard>
        </Grid>
      </Section>

      <Section id="pitfalls" title="Pitfalls">
        <Pitfalls items={[
          { wrong: 'Switching to random effects “because I² is high”.', right: 'Pre-specify the model from assumptions; investigate heterogeneity; consider not pooling.' },
          { wrong: 'Reporting only the CI of the random-effects mean.', right: 'Also report τ (or τ²) and the prediction interval to show how much effects vary.' },
          { wrong: 'Using DerSimonian–Laird with Wald CI by default.', right: 'Use REML and HKSJ (when τ² > 0 and k > 2), as in current Cochrane guidance.' },
          { wrong: '“No significant difference, so the treatments are equivalent.”', right: 'Describe the CI: which effects are compatible with the data?' },
        ]} />
      </Section>

      <KeyPoints items={[
        'Inverse-variance weighting; random effects adds τ² to every study’s variance.',
        'Common-effect estimates one effect; random-effects estimates the mean of a distribution of effects.',
        'REML for τ², HKSJ CI when τ² > 0 and k > 2, and a prediction interval.',
        'Interpret the CI and PI, not the p-value.',
      ]} />
      <Refs keys={['handbook', 'reExplainer', 'veroniki2016', 'veroniki2019', 'inthout2014', 'higgins2009', 'inthout2016', 'altman1995', 'colditz1994']} />
    </>
  )
}
