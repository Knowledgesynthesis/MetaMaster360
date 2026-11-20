import { Section, Prose, KeyPoints, Pitfalls, Grid, InfoCard } from '@/components/learn/Section'
import { Callout } from '@/components/ui'
import { Refs, Cite } from '@/components/learn/Refs'
import { DedupLab } from '@/labs/DedupLab'

export default function Records() {
  return (
    <>
      <Section id="units" title="Records, reports and studies">
        <Grid cols={3}>
          <InfoCard title="Record">A title/abstract entry exported from a database or register. The same article indexed in MEDLINE and Embase gives two records.</InfoCard>
          <InfoCard title="Report">A document with information about a study: journal article, conference abstract, registry entry, erratum, clinical study report, thesis.</InfoCard>
          <InfoCard title="Study">The investigation itself (e.g., one trial and its participants). The unit of synthesis.</InfoCard>
        </Grid>
        <Prose>
          <p>
            PRISMA 2020 counts <strong>records</strong> at identification and screening, <strong>reports</strong> at full-text assessment, and
            <strong> studies</strong> (with their reports) at inclusion (<Cite k="prisma2020" />). Deduplication removes duplicate <em>records</em>; linking
            groups <em>reports</em> into studies. Confusing the two either throws away useful reports or double-counts participants.
          </p>
        </Prose>
        <Callout kind="evidence" title="Why double counting matters">
          In a case study of ondansetron trials, covertly duplicated publications of the same patients inflated the apparent benefit when they were
          analysed as separate trials (<Cite k="tramer1997" />). Linking every report to its study is a bias-control step, not admin.
        </Callout>
      </Section>

      <Section id="workflow" title="A defensible workflow">
        <Prose>
          <ol>
            <li>Export complete records (with abstracts, DOIs, PMIDs, accession numbers) from each source; save the raw files and per-source counts (PRISMA-S).</li>
            <li>Import into a reference manager (Zotero, EndNote) or screening platform (Covidence, Rayyan, EPPI-Reviewer).</li>
            <li>Deduplicate in passes: exact identifiers (DOI/PMID) → normalised title + first author + year → fuzzy title matching; manually review borderline matches.</li>
            <li>Record the number of duplicates removed and any records removed for other reasons — these go in the PRISMA flow diagram.</li>
            <li>During screening, link reports (abstracts, registry entries, errata, secondary analyses) to their study; extract from all of them.</li>
            <li>Check retraction status and integrity concerns of included reports (retraction notices, expressions of concern).</li>
          </ol>
        </Prose>
      </Section>

      <Section id="lab-dedup" title="Lab: deduplicate a real-looking export">
        <DedupLab />
      </Section>

      <Section id="pitfalls" title="Pitfalls">
        <Pitfalls items={[
          { wrong: 'Deleting a conference abstract because the full paper is included.', right: 'Keep it linked to the study; it may report outcomes or time points missing from the paper.' },
          { wrong: 'Trusting the software’s duplicate list blindly.', right: 'Review borderline matches; DOI-less, typo-ridden and translated titles defeat exact matching.' },
          { wrong: 'Counting two papers from one trial as two studies.', right: 'Group reports by study using registration numbers, authors, setting, dates and sample sizes.' },
          { wrong: 'Judging eligibility during deduplication.', right: 'Deduplicate first; exclusions happen at screening with recorded reasons.' },
        ]} />
      </Section>

      <KeyPoints items={[
        'Records are deduplicated; reports are linked; studies are synthesised.',
        'Deduplicate in passes (identifiers → normalised metadata → fuzzy) and check borderline matches manually.',
        'Keep raw exports and per-source counts for PRISMA-S and the flow diagram.',
        'Duplicate publication of the same participants biases meta-analyses.',
      ]} />
      <Refs keys={['prisma2020', 'prismaS', 'handbook', 'tramer1997']} />
    </>
  )
}
