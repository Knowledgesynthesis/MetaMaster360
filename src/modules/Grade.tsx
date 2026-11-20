import { Section, Prose, KeyPoints, Pitfalls, Grid, InfoCard } from '@/components/learn/Section'
import { Callout, Table } from '@/components/ui'
import { Refs, Cite } from '@/components/learn/Refs'
import { GradeRater, ImprecisionAssistant } from '@/labs/GradeLabs'

export default function Grade() {
  return (
    <>
      <Section id="what" title="What certainty means">
        <Prose>
          <p>
            Certainty of evidence is the extent of confidence that the true effect lies on one side of a threshold or within a range. It is rated
            <strong> per outcome, across studies</strong> — a review can have high-certainty evidence for mortality and very low for quality of life.
            In 2025 the GRADE Working Group published <strong>Core GRADE</strong>, a streamlined statement of the essentials (<Cite k="coreGrade1" />).
          </p>
        </Prose>
        <Table
          head={['Level', 'Meaning', 'Statement wording']}
          rows={[
            ['⊕⊕⊕⊕ High', 'Very confident the true effect is close to the estimate', '“X reduces Y”'],
            ['⊕⊕⊕◯ Moderate', 'Moderately confident; the true effect is probably close', '“X probably reduces Y” / “likely”'],
            ['⊕⊕◯◯ Low', 'Limited confidence; the true effect may be substantially different', '“X may reduce Y”'],
            ['⊕◯◯◯ Very low', 'Very little confidence', '“The evidence is very uncertain about the effect of X on Y”'],
          ]}
        />
      </Section>

      <Section id="target" title="First choose the target of the rating">
        <Prose>
          <p>Core GRADE asks you to state what you are certain <em>about</em> (<Cite k="coreGrade2" />):</p>
          <ul>
            <li><strong>Non-null target:</strong> is there any effect? Threshold = no effect.</li>
            <li><strong>Importance target:</strong> is the effect important? Threshold = the minimal important difference (MID) for patients.</li>
          </ul>
          <p>The same confidence interval can be precise for one target and imprecise for the other. Systematic reviews often use the non-null target or a range; guideline panels use thresholds relevant to decisions.</p>
        </Prose>
      </Section>

      <Section id="domains" title="Start, then rate down or up">
        <Grid>
          <InfoCard title="Starting level">Randomized trials start at high. Non-randomized studies start at low — or at high if risk of bias is assessed with ROBINS-I, which then usually rates them down.</InfoCard>
          <InfoCard title="Risk of bias">Rate down when results carrying substantial weight are at high risk (or some concerns) and this plausibly changes the estimate — sensitivity analyses tell you (<Cite k="coreGrade4" />).</InfoCard>
          <InfoCard title="Inconsistency">Look at how much point estimates differ relative to the thresholds and whether CIs overlap; use τ, the PI and I² as supporting information. Explained heterogeneity (credible subgroups) is not inconsistency (<Cite k="coreGrade3" />).</InfoCard>
          <InfoCard title="Indirectness">Population, intervention, comparator or outcome differ from the question (e.g., surrogate outcomes; indirect comparisons).</InfoCard>
          <InfoCard title="Imprecision">Rate down if the 95% CI crosses the threshold for your target; rate down twice if it includes both important benefit and important harm. If the CI looks fine but the total sample is below the optimal information size, consider rating down (<Cite k="grade6" />).</InfoCard>
          <InfoCard title="Publication bias">Rate down when missing studies or results are suspected: small-study effects, unpublished registered trials, industry-funded small trials only. Avoid counting the same problem twice under risk of bias.</InfoCard>
        </Grid>
        <Callout kind="note" title="Rating up (mainly non-randomized evidence without serious limitations)">
          Large magnitude of effect (e.g., RR &gt; 2 or &lt; 0.5: +1; &gt; 5 or &lt; 0.2: +2), a dose–response gradient, or residual confounding that
          would reduce a demonstrated effect.
        </Callout>
      </Section>

      <Section id="lab-grade" title="Lab: rate the running case">
        <Prose><p>Rate depressive symptoms for exercise vs usual care using what you found in modules 7–11, then load the expert rating and compare the footnotes.</p></Prose>
        <GradeRater />
        <ImprecisionAssistant />
      </Section>

      <Section id="pitfalls" title="Pitfalls">
        <Pitfalls items={[
          { wrong: 'Rating the whole review as “moderate quality”.', right: 'Rate certainty per outcome, and show it per outcome in the SoF table.' },
          { wrong: 'Rating down for imprecision because p > 0.05.', right: 'Compare the CI with the threshold of your stated target.' },
          { wrong: 'Rating down for both risk of bias and publication bias for one small-study problem.', right: 'Rate the underlying concern once, and explain.' },
          { wrong: '“Low certainty” conclusions written as “X is effective”.', right: 'Use the matching informative statement: “X may …”.' },
          { wrong: 'Rating up an RCT body because the effect is large.', right: 'Rating up applies mainly to non-randomized evidence without serious limitations.' },
        ]} />
      </Section>

      <KeyPoints items={[
        'Certainty is rated per outcome; state the target (non-null or MID).',
        'RCTs start high; non-randomized studies start low (or high with ROBINS-I).',
        'Five reasons to rate down, three to rate up; justify every change in a footnote.',
        'Words must match certainty: results in · probably · may · very uncertain.',
      ]} />
      <Refs keys={['coreGrade1', 'coreGrade2', 'coreGrade3', 'coreGrade4', 'grade6', 'grade26', 'gradeHandbook']} />
    </>
  )
}
