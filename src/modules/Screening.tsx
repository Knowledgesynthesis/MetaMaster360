import { Section, Prose, KeyPoints, Pitfalls, Grid, InfoCard, Steps } from '@/components/learn/Section'
import { Callout } from '@/components/ui'
import { Refs, Cite } from '@/components/learn/Refs'
import { ScreeningSim } from '@/labs/ScreeningSim'
import { KappaCalc } from '@/labs/KappaCalc'
import { PrismaBuilder } from '@/labs/PrismaBuilder'

export default function Screening() {
  return (
    <>
      <Section id="process" title="Two stages, two independent reviewers">
        <Steps items={[
          { title: 'Pilot the criteria', body: 'Screen 50–100 records together or in parallel, compare, and rewrite ambiguous criteria. Turn the protocol criteria into a short eligibility form with one question per criterion.' },
          { title: 'Title/abstract screening', body: 'Two reviewers independently. Be inclusive: anything possibly eligible or unclear goes to full text. No reasons need to be recorded at this stage.' },
          { title: 'Retrieve full texts', body: 'Obtain every forwarded report (interlibrary loan, authors). Count reports not retrieved.' },
          { title: 'Full-text assessment', body: 'Two reviewers independently against every criterion; record one reason per excluded report using a pre-set order (e.g., design → population → intervention → comparator) so counts add up.' },
          { title: 'Resolve disagreements', body: 'Discussion, then a third reviewer. Contact study authors when eligibility depends on missing information.' },
        ]} />
        <Callout kind="evidence" title="Why two reviewers">
          In a randomized trial of screening approaches, single-reviewer title/abstract screening missed 13% of relevant studies on average, versus
          3% for dual screening (<Cite k="gartlehner2020" />). Cochrane requires at least two people working independently for inclusion decisions.
        </Callout>
        <Callout kind="tip" title="When time is short (rapid reviews)">
          The Cochrane Rapid Reviews Methods Group suggests dual screening of at least a calibration sample, then single screening with a second
          reviewer checking excluded records — reported explicitly as a limitation (<Cite k="rapid2024" />).
        </Callout>
      </Section>

      <Section id="lab-screen" title="Lab: screen 16 records">
        <ScreeningSim />
      </Section>

      <Section id="agreement" title="Measuring agreement">
        <Prose>
          <p>Cohen’s κ corrects raw agreement for agreement expected by chance. Use it on the pilot to calibrate, not as a pass mark — Landis–Koch labels
          (“substantial” = 0.61–0.80) are conventions. With rare includes, κ can look poor despite near-perfect agreement; report percentage agreement
          and the number of disagreements as well.</p>
        </Prose>
        <KappaCalc />
      </Section>

      <Section id="automation" title="Automation and AI in screening">
        <Grid>
          <InfoCard title="Prioritisation (active learning)">Tools such as ASReview or EPPI-Reviewer rank records so eligible ones surface early (<Cite k="asreview" />). The hard part is stopping: use a pre-specified, validated stopping rule and keep screening a buffer of consecutive irrelevant records.</InfoCard>
          <InfoCard title="Classifiers">The Cochrane RCT classifier removes records very unlikely to be randomized trials. Removed records are reported as “marked ineligible by automation tools” in the PRISMA flow.</InfoCard>
          <InfoCard title="Large language models">Promising as a second screener, but performance varies by topic and prompt. Under the 2025 joint position, use them with human oversight, validate on your own data, and report exactly how they were used (<Cite k="aiPosition2025" />).</InfoCard>
          <InfoCard title="Report it">PRISMA 2020 item 8 asks how many reviewers screened each record, whether independently, and the details of any automation tools.</InfoCard>
        </Grid>
      </Section>

      <Section id="lab-prisma" title="Lab: build a PRISMA 2020 flow diagram">
        <Prose><p>The diagram counts records at identification and screening, reports at retrieval and eligibility, and both studies and reports at inclusion. Arithmetic errors in published diagrams are common — the builder checks every link.</p></Prose>
        <PrismaBuilder />
      </Section>

      <Section id="pitfalls" title="Pitfalls">
        <Pitfalls items={[
          { wrong: 'Excluding at title/abstract because the abstract does not mention the outcome.', right: 'Forward it: outcomes are often missing from abstracts and are not eligibility criteria.' },
          { wrong: 'Excluding a trial for high risk of bias.', right: 'Risk of bias is assessed after inclusion and handled in synthesis and GRADE, unless the protocol explicitly restricts by design feature.' },
          { wrong: 'Listing several reasons per excluded report so totals exceed the number excluded.', right: 'Record one reason per report using a pre-specified order.' },
          { wrong: 'Dropping protocols and registry entries without results.', right: 'List them as ongoing studies or awaiting classification; they inform reporting-bias judgements.' },
        ]} />
      </Section>

      <KeyPoints items={[
        'Two independent reviewers at both stages; resolve disagreements by discussion or a third reviewer.',
        'Be inclusive at title/abstract; apply every criterion strictly at full text and record one reason per exclusion.',
        'κ is a calibration tool; report raw agreement too.',
        'Automation is acceptable with validation, human oversight and transparent reporting.',
      ]} />
      <Refs keys={['handbook', 'prisma2020', 'gartlehner2020', 'rapid2024', 'asreview', 'aiPosition2025']} />
    </>
  )
}
