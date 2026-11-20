import { Section, Prose, KeyPoints, Pitfalls, Grid, InfoCard } from '@/components/learn/Section'
import { Callout, Formula } from '@/components/ui'
import { Refs, Cite } from '@/components/learn/Refs'
import { SofBuilder } from '@/labs/SofBuilder'

export default function Sof() {
  return (
    <>
      <Section id="purpose" title="One table that carries the conclusion">
        <Prose>
          <p>
            A Summary of findings (SoF) table presents, for the most important outcomes, the relative effect, the absolute effect for a realistic
            baseline risk, the amount of evidence, and its certainty. It is where readers make decisions — so it must be complete (benefits and harms)
            and honest about uncertainty (<Cite k="handbook">Handbook ch. 14</Cite>; <Cite k="gradeHandbook" />).
          </p>
        </Prose>
        <Grid>
          <InfoCard title="Which outcomes">Up to seven outcomes that matter to patients, chosen at protocol stage — including harms — even if no study reported them (then say so).</InfoCard>
          <InfoCard title="Assumed comparator risk">The risk without the intervention: the median control-group risk across trials, or better, risk from representative observational data. Show low/high-risk rows if baseline risk varies.</InfoCard>
          <InfoCard title="Continuous outcomes">Give the comparator mean and the MD in natural units; for SMDs, re-express in a familiar instrument’s units.</InfoCard>
          <InfoCard title="Footnotes">Every rating down or up has a short, specific reason. Readers should be able to disagree with you.</InfoCard>
        </Grid>
        <Formula label="Absolute effects from a relative effect (per 1000)">{'Risk with intervention = comparator risk × RR       (apply to CI limits too)\nWith an OR:  risk = OR·CR / (1 − CR + OR·CR)\nDifference  = (risk with intervention − comparator risk) × 1000'}</Formula>
      </Section>

      <Section id="lab-sof" title="Lab: build the running-case SoF table">
        <SofBuilder />
        <Callout kind="tip">Change the comparator risk of “Response” from 0.28 to 0.10: the same RR now yields far fewer additional responders per 1000. Absolute effects — and decisions — depend on baseline risk.</Callout>
      </Section>

      <Section id="statements" title="Plain-language statements">
        <Prose>
          <p>GRADE’s informative statements tie wording to certainty and effect size (<Cite k="grade26" />): high — “results in”; moderate — “probably”; low — “may”; very low — “the evidence is very uncertain”. When the effect is trivial or the CI centres on no effect, say “little to no difference”. Keep the same wording in the abstract, plain-language summary and conclusions.</p>
        </Prose>
      </Section>

      <Section id="pitfalls" title="Pitfalls">
        <Pitfalls items={[
          { wrong: 'Omitting harms because few trials reported them.', right: 'Include the row; report “not measured” or very low certainty.' },
          { wrong: 'Only relative effects in the table.', right: 'Always show absolute effects for a stated baseline risk.' },
          { wrong: 'Choosing SoF outcomes after seeing results.', right: 'Pre-specify them in the protocol.' },
          { wrong: 'Using the trial-pooled control risk when your population is lower risk.', right: 'Use representative baseline risks; add rows for different risk groups.' },
        ]} />
      </Section>

      <KeyPoints items={[
        '≤ 7 patient-important outcomes, benefits and harms, chosen in advance.',
        'Absolute effect = comparator risk × relative effect, with CI.',
        'Certainty symbol + footnotes for every outcome.',
        'Statements match certainty: results in · probably · may · very uncertain.',
      ]} />
      <Refs keys={['handbook', 'gradeHandbook', 'grade26', 'coreGrade1']} />
    </>
  )
}
