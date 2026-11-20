import { Section, Prose, KeyPoints, Pitfalls, Grid, InfoCard } from '@/components/learn/Section'
import { Callout, Table } from '@/components/ui'
import { Refs, Cite } from '@/components/learn/Refs'
import { VoteCounting } from '@/labs/VoteCounting'

export default function Narrative() {
  return (
    <>
      <Section id="when" title="When meta-analysis is not the right tool">
        <Prose>
          <ul>
            <li>Outcomes or interventions too diverse for any combined estimate to be meaningful.</li>
            <li>Effect estimates or their variances cannot be obtained, even after conversion and contacting authors.</li>
            <li>Results reported only as p-values, directions or “no significant difference”.</li>
            <li>Too few comparable studies, or a dominant concern about bias that pooling would hide.</li>
          </ul>
          <p>“Narrative synthesis” has often meant unstructured description. Instead, synthesise with explicit, reproducible methods and report them with SWiM (<Cite k="swim" />).</p>
        </Prose>
      </Section>

      <Section id="methods" title="Acceptable methods">
        <Table
          head={['Method', 'Answers', 'Limitations']}
          rows={[
            ['Summary statistics of effect estimates (median, IQR, range; box plot)', 'What is the typical effect and its spread?', 'Needs a standardised metric; ignores precision'],
            ['Combining p-values (Fisher, Stouffer)', 'Is there evidence of an effect in at least one study?', 'No magnitude; sensitive to study size'],
            ['Vote counting by direction of effect + sign test', 'Is there evidence of an effect in either direction?', 'No magnitude; ignores size and precision'],
          ]}
        />
        <Callout kind="pitfall" title="Never vote-count by statistical significance">
          Counting “significant vs not significant” treats underpowered studies as evidence of no effect. With many small studies, it can conclude “no
          effect” even when every study points the same way (<Cite k="handbook">Handbook 12.2</Cite>).
        </Callout>
        <Grid cols={3}>
          <InfoCard title="Effect direction plot">Arrows per study and outcome, sized by study size, shaded by risk of bias.</InfoCard>
          <InfoCard title="Harvest plot">Bars grouped by direction of effect, height by study quality — shows the shape of the evidence.</InfoCard>
          <InfoCard title="Albatross plot">p-values against sample size with effect-size contours — for when only p-values are available.</InfoCard>
        </Grid>
      </Section>

      <Section id="lab-vote" title="Lab: synthesise a non-poolable outcome">
        <VoteCounting />
      </Section>

      <Section id="swim" title="SWiM: nine reporting items">
        <Table
          head={['#', 'Item']}
          rows={[
            ['1', 'How studies were grouped for synthesis, with rationale'],
            ['2', 'Standardised metric used and how results were transformed'],
            ['3', 'Synthesis method used (and why)'],
            ['4', 'Criteria used to prioritise results for summary and synthesis'],
            ['5', 'How heterogeneity in reported effects was investigated'],
            ['6', 'How certainty of evidence was assessed'],
            ['7', 'Data presentation methods (tables, plots)'],
            ['8', 'Reporting of results, linked to the methods'],
            ['9', 'Limitations of the synthesis'],
          ]}
        />
      </Section>

      <Section id="pitfalls" title="Pitfalls">
        <Pitfalls items={[
          { wrong: 'Describing studies one by one and concluding “mixed evidence”.', right: 'Group studies, use a standardised metric or direction, and apply a stated method.' },
          { wrong: '“3 of 8 studies found a significant benefit, so evidence is weak.”', right: 'Count directions with a sign test, or better, obtain effect estimates.' },
          { wrong: 'Skipping certainty assessment because there is no meta-analysis.', right: 'Rate certainty with GRADE for narratively synthesised outcomes too.' },
        ]} />
      </Section>

      <KeyPoints items={[
        'If pooling is inappropriate, synthesise with explicit methods and report per SWiM.',
        'Acceptable: summary statistics of effects, combining p-values, vote counting by direction with a sign test.',
        'Unacceptable: vote counting by statistical significance.',
        'Visualise: effect direction, harvest or albatross plots; still apply GRADE.',
      ]} />
      <Refs keys={['swim', 'handbook']} />
    </>
  )
}
