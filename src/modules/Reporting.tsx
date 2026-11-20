import { Section, Prose, KeyPoints, Pitfalls, Grid, InfoCard } from '@/components/learn/Section'
import { Callout, Table } from '@/components/ui'
import { Refs, Cite } from '@/components/learn/Refs'
import { PrismaChecklist, SpinSpotter } from '@/labs/ReportingLabs'

export default function Reporting() {
  return (
    <>
      <Section id="prisma" title="PRISMA 2020 and its extensions">
        <Prose>
          <p>
            PRISMA 2020 is the reporting standard for systematic reviews: a 27-item checklist (42 with sub-items), a 12-item abstract checklist and the
            flow diagram (<Cite k="prisma2020" />). The explanation and elaboration paper gives examples of good reporting for every item
            (<Cite k="prisma2020ee" />). Submit the completed checklist with page numbers.
          </p>
        </Prose>
        <Table
          head={['Extension', 'For']}
          rows={[
            ['PRISMA-P 2015', 'Protocols'],
            ['PRISMA-S 2021', 'Literature searches'],
            ['PRISMA-ScR 2018', 'Scoping reviews'],
            ['PRISMA-NMA 2015', 'Network meta-analyses'],
            ['PRISMA-DTA 2018', 'Diagnostic test accuracy reviews'],
            ['PRISMA-IPD 2015', 'Individual participant data meta-analyses'],
            ['PRISMA-LSR 2024', 'Living systematic reviews (4 additional items)'],
            ['PRISMA-C 2026', 'Reviews of interventions in children and adolescents'],
            ['SWiM 2020', 'Synthesis without meta-analysis'],
          ]}
        />
      </Section>

      <Section id="lab-prisma" title="Lab: audit a manuscript against PRISMA 2020">
        <PrismaChecklist />
      </Section>

      <Section id="writing" title="Writing results and conclusions">
        <Grid>
          <InfoCard title="Results">Flow diagram → characteristics of included studies → risk of bias → for each outcome: effect with CI, heterogeneity (τ², I², PI), subgroup and sensitivity results, reporting-bias assessment, certainty. Lead with the primary outcome.</InfoCard>
          <InfoCard title="Abstract">Structured per PRISMA 2020 for Abstracts: objectives, eligibility, sources with dates, risk-of-bias method, synthesis methods, number of studies and participants, main results with CIs and certainty, limitations, funding, registration.</InfoCard>
          <InfoCard title="Discussion">Summary of main results with certainty; limitations of the evidence and of the review process (e.g., single screening, language restrictions); agreement with other reviews; implications for practice and research.</InfoCard>
          <InfoCard title="Openness">Share forms, extracted data, analysis data and code (item 27) — e.g., on OSF. Report any AI tools, their version, purpose and how outputs were verified (<Cite k="aiPosition2025">2025 position statement</Cite>).</InfoCard>
        </Grid>
        <Callout kind="key" title="Interpretation rules">
          <ul>
            <li>Describe effects by their magnitude and CI, not by p-values.</li>
            <li>Match wording to certainty (module 14).</li>
            <li>“No significant difference” ≠ “no difference” (<Cite k="altman1995" />).</li>
            <li>Conclusions for practice must reflect benefits, harms and certainty together.</li>
          </ul>
        </Callout>
      </Section>

      <Section id="lab-spin" title="Lab: spot the spin">
        <Prose><p>Spin is reporting that makes results look more favourable than they are. A consensus classification identified 39 types; Cochrane members ranked as most severe: recommendations for practice not supported by the findings, misleading titles, and selective reporting (<Cite k="spin" />).</p></Prose>
        <SpinSpotter />
      </Section>

      <Section id="pitfalls" title="Pitfalls">
        <Pitfalls items={[
          { wrong: '“The full search strategy is available on request.”', right: 'Publish all strategies (supplement or repository).' },
          { wrong: 'Abstract reports only statistically significant outcomes.', right: 'Report the primary outcome(s) and key harms with certainty, whatever the result.' },
          { wrong: 'No mention of protocol deviations.', right: 'Report every amendment and its reason (item 24c).' },
          { wrong: 'Unshared extraction data.', right: 'Make data and code available so the analysis is reproducible.' },
        ]} />
      </Section>

      <KeyPoints items={[
        'Report to PRISMA 2020 (+ the extension for your review type) and submit the checklist.',
        'Results by outcome: effect + CI + heterogeneity + certainty.',
        'Avoid spin: wording follows certainty; no claims from subgroup or significance alone.',
        'Share data, code and forms; report AI use.',
      ]} />
      <Refs keys={['prisma2020', 'prisma2020ee', 'prismaP', 'prismaS', 'prismaScR', 'prismaNMA', 'prismaLSR', 'prismaC', 'swim', 'spin', 'altman1995', 'aiPosition2025']} />
    </>
  )
}
