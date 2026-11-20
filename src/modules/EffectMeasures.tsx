import { Section, Prose, KeyPoints, Pitfalls, Grid, InfoCard } from '@/components/learn/Section'
import { Callout, Table, Formula } from '@/components/ui'
import { Refs, Cite } from '@/components/learn/Refs'
import { EffectSizeCalc, OrRrExplorer } from '@/labs/EffectSizeCalc'

export default function EffectMeasures() {
  return (
    <>
      <Section id="choose" title="Choose the measure from the outcome type">
        <Table
          head={['Outcome', 'Measures', 'Use when']}
          rows={[
            ['Continuous, same scale', 'Mean difference (MD)', 'All studies use the same instrument (or convertible units). Keeps clinical units.'],
            ['Continuous, different scales', 'SMD (Hedges’ g); ratio of means', 'Studies measure the same construct with different instruments (HAM-D, MADRS, BDI-II).'],
            ['Binary', 'Risk ratio (RR), odds ratio (OR), risk difference (RD)', 'Pool on a relative scale (RR or OR); present absolute effects too.'],
            ['Time-to-event', 'Hazard ratio (HR)', 'Outcomes with variable follow-up and censoring; extract ln(HR) and SE.'],
            ['Counts / rates', 'Rate ratio', 'Events per person-time (e.g., exacerbations, falls).'],
          ]}
        />
        <Callout kind="key" title="Relative to pool, absolute to decide">
          Relative effects (RR, OR) tend to be more consistent across studies with different baseline risks than risk differences, so they are usually
          the pooling scale. Decisions need absolute effects: apply the pooled RR to a realistic baseline risk (Summary of findings module).
        </Callout>
      </Section>

      <Section id="formulas" title="Formulas you should be able to reproduce">
        <Grid>
          <InfoCard title="Mean difference"><Formula>{'MD = M₁ − M₂\nSE = √(SD₁²/n₁ + SD₂²/n₂)'}</Formula></InfoCard>
          <InfoCard title="SMD (Hedges’ g)"><Formula>{'g = J × (M₁ − M₂) / s_pooled\nJ = 1 − 3/(4N − 9)'}</Formula>J corrects the upward bias of Cohen’s d in small samples.</InfoCard>
          <InfoCard title="Risk ratio (log scale)"><Formula>{'ln RR = ln[(a/n₁)/(c/n₂)]\nSE = √(1/a − 1/n₁ + 1/c − 1/n₂)'}</Formula></InfoCard>
          <InfoCard title="Odds ratio (log scale)"><Formula>{'ln OR = ln(ad / bc)\nSE = √(1/a + 1/b + 1/c + 1/d)'}</Formula></InfoCard>
        </Grid>
        <Prose>
          <p>Ratio measures are analysed on the log scale, where their sampling distribution is approximately normal and confidence intervals are symmetric; results are exponentiated for presentation. With a zero cell, 0.5 is added to every cell of that study; studies with no events in either arm carry no information on a ratio measure and drop out (<Cite k="handbook">Handbook 10.4.4</Cite>).</p>
        </Prose>
      </Section>

      <Section id="lab-calc" title="Lab: calculate with every step shown">
        <EffectSizeCalc />
      </Section>

      <Section id="interpret" title="Interpreting the numbers">
        <Grid>
          <InfoCard title="Re-express SMDs in familiar units">Multiply the SMD by a typical SD of a well-known instrument: SMD −0.35 × PHQ-9 SD ≈ 5.3 ≈ −1.9 PHQ-9 points. Compare with that instrument’s minimal important difference.</InfoCard>
          <InfoCard title="SMD ↔ odds ratio">ln(OR) ≈ SMD × π/√3 ≈ 1.81 × SMD (<Cite k="chinn2000" />) — useful to combine or explain mixed outcome types, assuming logistic distributions.</InfoCard>
          <InfoCard title="NNT depends on baseline risk">NNT = 1/|RD|. Never pool NNTs; compute them from the pooled RR applied to a stated baseline risk, and report NNTB or NNTH with the time frame.</InfoCard>
          <InfoCard title="Direction of the event">The RR for “response” is not the reciprocal of the RR for “non-response”. Choose the event (usually the adverse one, or as pre-specified) before analysing.</InfoCard>
        </Grid>
        <OrRrExplorer />
      </Section>

      <Section id="pitfalls" title="Pitfalls">
        <Pitfalls items={[
          { wrong: 'Describing OR 0.40 as “60% lower risk” when control risk is 60%.', right: 'Convert: at 60% baseline risk, OR 0.40 ≈ RR 0.63 — a 37% relative risk reduction.' },
          { wrong: 'Labelling SMD 0.3 “small, so unimportant”.', right: 'Re-express in instrument units and compare with the minimal important difference.' },
          { wrong: 'Pooling NNTs from different trials.', right: 'Pool RR, then derive NNT for a specified baseline risk and time frame.' },
          { wrong: 'Treating time-to-event outcomes as binary at different follow-up times.', right: 'Use HRs (ln HR and SE), from the paper, log-rank statistics or reconstructed survival data.' },
        ]} />
      </Section>

      <KeyPoints items={[
        'MD for one scale; SMD (Hedges’ g) for different scales of one construct; RR/OR/RD for binary; HR for time-to-event.',
        'Pool ratios on the log scale; present both relative and absolute effects.',
        'ORs diverge from RRs when events are common.',
        'Interpret against minimal important differences, not generic size labels.',
      ]} />
      <Refs keys={['handbook', 'chinn2000']} />
    </>
  )
}
