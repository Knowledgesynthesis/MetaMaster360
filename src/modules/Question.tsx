import { Section, Prose, KeyPoints, Pitfalls, InfoCard, Grid } from '@/components/learn/Section'
import { Callout, Table } from '@/components/ui'
import { Refs, Cite } from '@/components/learn/Refs'
import { QuestionBuilder } from '@/labs/QuestionBuilder'
import { ReviewTypeSelector } from '@/labs/ReviewTypeSelector'
import { CASE_QUESTION } from '@/content/case'

export default function Question() {
  return (
    <>
      <Section id="why" title="The question decides everything downstream">
        <Prose>
          <p>
            The review question fixes the eligibility criteria, the search concepts, which outcomes are extracted, which comparisons are made, and how
            results are grouped. Changing it after you have seen study results lets those results shape the review — a direct route to bias. So the
            question is settled, written down and registered <strong>before</strong> screening starts (<Cite k="handbook">Handbook ch. 3</Cite>).
          </p>
        </Prose>
        <Callout kind="tip" title="Check first: does this review already exist?">
          Search PROSPERO, the Cochrane Library and Epistemonikos for completed and ongoing reviews. If a recent, high-quality review exists, an update,
          an overview, or a different question is usually the better use of effort.
        </Callout>
      </Section>

      <Section id="frameworks" title="Pick the framework that matches the question type">
        <Table
          head={['Question type', 'Framework', 'Example']}
          rows={[
            ['Effect of an intervention', 'PICO (+ timing, setting, study design)', 'Exercise vs usual care for depressive symptoms in adults'],
            ['Exposure, harm, etiology', 'PECO', 'Night-shift work vs day work and breast cancer incidence'],
            ['Diagnostic accuracy', 'Population · Index test · Reference standard · Target condition', 'Lung ultrasound vs chest radiograph for paediatric pneumonia'],
            ['Prognostic factor', 'PICOTS', 'Diabetes and 12-month mortality after stroke'],
            ['Experiences, acceptability', 'SPIDER or PICo', 'Experiences of exercise programmes in people with depression'],
            ['Mapping a field', 'PCC (Population, Concept, Context)', 'Digital mental-health interventions for adolescents'],
          ]}
        />
        <Prose>
          <p>Our running case — used in every module — is an intervention question:</p>
        </Prose>
        <Grid>
          <InfoCard title="P · Population">{CASE_QUESTION.P}</InfoCard>
          <InfoCard title="I · Intervention">{CASE_QUESTION.I}</InfoCard>
          <InfoCard title="C · Comparator">{CASE_QUESTION.C}</InfoCard>
          <InfoCard title="O · Outcomes">{CASE_QUESTION.O}</InfoCard>
        </Grid>
      </Section>

      <Section id="criteria" title="From question to eligibility criteria">
        <Prose>
          <p>Each element becomes an explicit inclusion/exclusion rule that two independent screeners would apply identically.</p>
          <ul>
            <li><strong>Population:</strong> how the condition is diagnosed (criteria, cut-offs), age, setting. Decide in advance what to do with studies where only part of the sample is eligible (e.g., include if ≥ 80% eligible, or if subgroup data are available).</li>
            <li><strong>Intervention and comparator:</strong> minimum dose/duration, delivery, co-interventions allowed. Usual care, waiting list, attention control and placebo answer different questions — list which are eligible and plan whether to analyse them separately.</li>
            <li><strong>Study design:</strong> state it (e.g., RCTs only; or RCTs plus specified non-randomized designs if randomized evidence is expected to be scarce or harms are rare).</li>
            <li><strong>Outcomes:</strong> name primary and secondary outcomes, measurement and timing — but outcomes normally define what you analyse, <em>not</em> which studies you include. Excluding studies that measured but did not report an outcome introduces reporting bias (<Cite k="handbook">Handbook 3.2.4.1</Cite>).</li>
            <li><strong>Do not restrict by language or publication status</strong> without strong justification; use translation (including machine translation) and include unpublished data.</li>
          </ul>
        </Prose>
        <Callout kind="key" title="Lumping vs splitting">
          A broad question (“any exercise for any depression”) gives generalisable answers and lets you explore variation, but risks combining
          interventions that work differently. A narrow one is cleaner but may find few studies. Either is legitimate if you <strong>pre-specify how
          studies will be grouped for each synthesis</strong> (PRISMA 2020 item 5).
        </Callout>
      </Section>

      <Section id="lab-question" title="Lab: build and critique a question">
        <QuestionBuilder />
      </Section>

      <Section id="review-types" title="Choose the type of review">
        <Prose>
          <p>The question type determines the review type, its methods handbook and its reporting guideline. Combining is common — for example, a living
          systematic review with network meta-analysis.</p>
        </Prose>
        <ReviewTypeSelector />
      </Section>

      <Section id="pitfalls" title="Pitfalls">
        <Pitfalls items={[
          { wrong: 'Starting the search with only a topic (“exercise and depression”).', right: 'Write and register a structured question with every element defined.' },
          { wrong: 'Comparator listed as “control”.', right: 'Name eligible comparators; usual care and waiting list can give different effects.' },
          { wrong: 'Excluding trials that did not report the primary outcome.', right: 'Include on PICO and design; record missing outcomes and assess them as missing evidence.' },
          { wrong: 'Refining the question after reading early results.', right: 'Fix it in the protocol; report and justify any later change as an amendment.' },
          { wrong: 'English-only inclusion to save time.', right: 'Search without language limits; translate eligible non-English reports.' },
          { wrong: 'Choosing a scoping review because a systematic review sounds hard.', right: 'Scoping reviews answer mapping questions; if you need an effect estimate you need a systematic review.' },
        ]} />
      </Section>

      <KeyPoints items={[
        'Match the framework to the question type: PICO, PECO, DTA elements, PICOTS, SPIDER/PICo or PCC.',
        'Every element becomes an explicit, testable eligibility criterion; outcomes usually are not inclusion criteria.',
        'Pre-specify how studies will be grouped for synthesis.',
        'Check for existing and ongoing reviews before you start.',
      ]} />

      <Refs keys={['handbook', 'prisma2020', 'jbiScoping', 'dtaHandbook', 'prisma2020ee']} />
    </>
  )
}
