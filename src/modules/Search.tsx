import { Section, Prose, KeyPoints, Pitfalls, Grid, InfoCard, Steps } from '@/components/learn/Section'
import { Callout, Formula, Table } from '@/components/ui'
import { Refs, Cite } from '@/components/learn/Refs'
import { SearchBuilder, HSSS_PUBMED } from '@/labs/SearchBuilder'

export default function Search() {
  return (
    <>
      <Section id="goal" title="Aim for sensitivity, then manage the volume">
        <Prose>
          <p>
            A systematic review search tries to find <strong>all</strong> eligible studies. Missing studies is not random: unpublished, non-English and
            negative studies are the ones most easily missed, so an incomplete search biases the result. Expect low precision (often well under 5% of
            records are eligible); screening tools handle volume, nothing recovers a study you never retrieved.
          </p>
          <p>Work with an information specialist. It is the single most effective way to improve search quality.</p>
        </Prose>
      </Section>

      <Section id="sources" title="Where to search">
        <Table
          head={['Source', 'Why']}
          rows={[
            ['CENTRAL, MEDLINE, Embase', 'Minimum set for Cochrane intervention reviews; Embase adds substantial European and pharmacological coverage beyond MEDLINE.'],
            ['Subject databases (e.g., APA PsycInfo, CINAHL)', 'Topic-specific coverage not indexed elsewhere.'],
            ['Trial registers: ClinicalTrials.gov, WHO ICTRP', 'Unpublished and ongoing trials; registered outcomes to compare against publications (reporting bias).'],
            ['Regulatory sources (FDA, EMA clinical study reports)', 'For drugs and devices: fuller results than journal articles.'],
            ['Citation searching (backward and forward)', 'Reference lists and citing articles of included studies — report per TARCiS (2024).'],
            ['Grey literature, conference abstracts, experts', 'Theses, reports, and studies in progress.'],
          ]}
        />
      </Section>

      <Section id="structure" title="How a strategy is built">
        <Steps items={[
          { title: 'Choose concepts', body: 'Usually Population AND Intervention, plus a study-design filter if appropriate. Leave out outcomes and comparators: they are often absent from titles and abstracts.' },
          { title: 'Collect subject headings', body: 'MeSH for MEDLINE, Emtree for Embase. Check scope notes and the tree; headings explode to narrower terms by default.' },
          { title: 'Collect free-text synonyms', body: 'Synonyms, spelling variants (randomised/randomized), abbreviations, truncation (depress*), phrases, and proximity operators (Ovid adj3; PubMed "term term"[tiab:~3]).' },
          { title: 'Combine', body: 'OR within a concept, AND between concepts. Avoid NOT except the standard animal-only exclusion.' },
          { title: 'Test', body: 'Check that a set of known eligible studies is retrieved. If one is missed, find out why and fix the strategy.' },
          { title: 'Peer review and translate', body: 'PRESS checklist review, then translate syntax and vocabulary for every database (Emtree ≠ MeSH).' },
        ]} />
        <Formula label="Cochrane Highly Sensitive Search Strategy for RCTs — sensitivity- and precision-maximizing version (2008 revision), PubMed">{HSSS_PUBMED}</Formula>
        <Callout kind="note">
          The filter’s final line removes records indexed as animal-only while keeping those indexed as both animal and human. Writing “NOT animals”
          alone would delete eligible human studies that also mention animals.
        </Callout>
      </Section>

      <Section id="lab-search" title="Lab: build, translate and lint a strategy">
        <SearchBuilder />
      </Section>

      <Section id="report" title="Peer review, reporting and updating">
        <Grid>
          <InfoCard title="PRESS 2015">Peer reviewers check: translation of the question, Boolean and proximity operators, subject headings, text-word searching, spelling/syntax/line numbers, and limits/filters (<Cite k="press" />).</InfoCard>
          <InfoCard title="PRISMA-S">Report every database and platform, the full strategy for each, limits and filters, dates searched, other methods (registers, citation searching, contacts) and how records were deduplicated (<Cite k="prismaS" />).</InfoCard>
          <InfoCard title="Rerun before publication">Searches age quickly. Cochrane expects searches to be rerun within 12 months of publication; screen new records with the same methods.</InfoCard>
          <InfoCard title="AI-generated strategies">Language models can suggest synonyms but invent subject headings and mis-nest Boolean logic. Verify every heading in the thesaurus and test retrieval; the review team remains accountable (<Cite k="aiPosition2025">2025 joint position</Cite>).</InfoCard>
        </Grid>
      </Section>

      <Section id="pitfalls" title="Pitfalls">
        <Pitfalls items={[
          { wrong: 'Searching only MEDLINE/PubMed.', right: 'Use CENTRAL, MEDLINE, Embase, relevant subject databases and trial registers at minimum.' },
          { wrong: 'Adding an outcome concept (“AND depressive symptoms”).', right: 'Search Population AND Intervention; let screening handle outcomes.' },
          { wrong: '“exercise NOT review” to cut volume.', right: 'NOT removes eligible trials that mention reviews. Use filters designed and validated for the purpose.' },
          { wrong: 'Copying the MEDLINE strategy into Embase unchanged.', right: 'Translate headings to Emtree and syntax to the platform.' },
          { wrong: 'Reporting “we searched PubMed using terms such as…”.', right: 'Publish the full line-by-line strategy for every source with dates (PRISMA item 7).' },
        ]} />
      </Section>

      <KeyPoints items={[
        'Sensitivity first: missed studies are systematically different from found ones.',
        'Subject headings AND free text within each concept; OR within, AND between.',
        'Search trial registers and use citation searching; avoid language limits.',
        'PRESS peer review before running; full strategies reported per PRISMA-S.',
      ]} />
      <Refs keys={['handbook', 'prismaS', 'press', 'tarcis', 'aiPosition2025']} />
    </>
  )
}
