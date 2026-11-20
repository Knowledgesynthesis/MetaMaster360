import { Section, Prose, KeyPoints, Pitfalls, Grid, InfoCard } from '@/components/learn/Section'
import { Callout, Table } from '@/components/ui'
import { Refs, Cite } from '@/components/learn/Refs'
import { ProtocolGenerator } from '@/labs/ProtocolGenerator'

export default function Protocol() {
  return (
    <>
      <Section id="why" title="Why decide everything in advance">
        <Prose>
          <p>
            Almost every step of a review involves choices — which outcome, which time point, which scale, which model, which subgroups. If those choices
            are made after seeing results, they can be bent toward a preferred answer, consciously or not. A protocol fixes them beforehand; registration
            makes them public so readers can compare what was planned with what was done (PRISMA 2020 items 24a–c).
          </p>
        </Prose>
      </Section>

      <Section id="contents" title="What a protocol must pin down">
        <Prose><p>Use PRISMA-P 2015 (17 items) as the checklist (<Cite k="prismaP" />). The decisions that most often go wrong when left open:</p></Prose>
        <Grid>
          <InfoCard title="Outcome hierarchy">If a trial reports several scales or time points, which one do you take? Write the order (e.g., clinician-rated before self-report; time point closest to 12 weeks). Without it, you can cherry-pick.</InfoCard>
          <InfoCard title="Criteria for pooling">When are studies similar enough to combine, and what happens otherwise (synthesis without meta-analysis per SWiM)?</InfoCard>
          <InfoCard title="Model and methods">Effect measures, random-effects estimator (REML) and interval method (HKSJ when τ² &gt; 0 and k &gt; 2), prediction interval, handling of zero events and of cluster or multi-arm trials.</InfoCard>
          <InfoCard title="Subgroup hypotheses">Few (≤ 3–5), each with an expected direction and a rationale. Unplanned subgroup findings are hypothesis-generating at most.</InfoCard>
          <InfoCard title="How risk of bias is used">Which tool, per result, and whether you restrict to low-risk results, run sensitivity analyses, or only feed GRADE.</InfoCard>
          <InfoCard title="Certainty and SoF">Which outcomes go into the Summary of findings table, and the decision thresholds (minimal important differences) for rating imprecision.</InfoCard>
        </Grid>
        <Callout kind="pitfall" title="Do not choose the model from I²">
          Rules such as “random-effects if I² &gt; 50%” are discouraged: the choice should reflect whether you believe studies share one true effect,
          and should be pre-specified rather than triggered by a heterogeneity statistic (<Cite k="handbook">Handbook 10.10.4.1</Cite>). Most intervention
          reviews pre-specify random-effects because clinical diversity is expected.
        </Callout>
      </Section>

      <Section id="register" title="Where and when to register">
        <Table
          head={['Registry', 'Use for', 'Notes']}
          rows={[
            ['PROSPERO', 'Systematic reviews with a health-related outcome', 'New platform launched 2025: records are published automatically once checked and approved by all authors, and similar existing registrations are flagged at submission. Does not accept scoping reviews.'],
            ['OSF Registries', 'Scoping reviews, reviews outside PROSPERO’s remit, any protocol', 'Free, timestamped, can embargo; upload the full protocol.'],
            ['Cochrane / Campbell / JBI', 'Reviews produced with those organisations', 'Protocol is peer-reviewed and published (e.g., in the Cochrane Library).'],
          ]}
        />
        <Callout kind="key">
          Register <strong>before screening against eligibility criteria begins</strong>, and certainly before data extraction. Registration after
          results are known gives no protection against bias.
        </Callout>
        <Prose>
          <h3>Amendments</h3>
          <p>Changes are allowed when justified — new information, infeasibility, errors. Record the date, what changed and why; update the registry;
          report it in the review (PRISMA item 24c). If a change could plausibly be data-driven, show results under both the original and amended plan.</p>
        </Prose>
      </Section>

      <Section id="lab-protocol" title="Lab: draft and export a protocol">
        <ProtocolGenerator />
      </Section>

      <Section id="pitfalls" title="Pitfalls">
        <Pitfalls items={[
          { wrong: '“Outcomes: depression.”', right: 'Name the construct, eligible measures in priority order, time point and direction of benefit.' },
          { wrong: '“Subgroup analyses will be performed as appropriate.”', right: 'List each subgroup, expected direction and rationale; everything else is post hoc.' },
          { wrong: 'Registering after extraction “to tick the box”.', right: 'Register before screening; report the date.' },
          { wrong: 'Silently switching the primary outcome.', right: 'Report the amendment with its reason and present the original outcome too.' },
        ]} />
      </Section>

      <KeyPoints items={[
        'A protocol pre-specifies the choices that results could otherwise steer: outcomes, hierarchy, model, subgroups, sensitivity analyses.',
        'Register before screening (PROSPERO for health outcomes; OSF for scoping reviews and other types).',
        'Pre-specify the model from assumptions, not from I².',
        'Amend transparently: date, change, reason — and report it.',
      ]} />
      <Refs keys={['prismaP', 'prisma2020', 'prospero', 'handbook', 'iceman']} />
    </>
  )
}
