import type { QuizQuestion } from '../types'

export const screening: QuizQuestion[] = [
  {
    id: 'sc-1', level: 1,
    stem: 'At title/abstract stage the abstract is unclear about whether the control group received usual care. What do you do?',
    options: ['Exclude — unclear means ineligible', 'Retrieve the full text', 'Include it in the meta-analysis directly', 'Email the journal'],
    answer: 1,
    explain: 'Title/abstract screening should be inclusive. Excluding an eligible study is unrecoverable; reading one more full text is cheap.',
  },
  {
    id: 'sc-2', level: 1,
    stem: 'In the crowd-based randomized trial by Gartlehner et al. (2020), how many relevant studies did single-reviewer abstract screening miss on average?',
    options: ['About 1%', 'About 13%', 'About 40%', 'None'],
    answer: 1,
    explain: 'Single screening missed 13% of relevant studies on average versus 3% with dual screening — the evidence base for independent dual screening.',
  },
  {
    id: 'sc-3', level: 2,
    stem: 'Two reviewers agree on 97% of 1,000 records, but κ is only 0.45. What is the most likely explanation?',
    options: ['The reviewers screened carelessly', 'Very few records are eligible, so chance agreement is high (prevalence effect on κ)', 'κ cannot be below 0.6', 'A calculation error'],
    answer: 1,
    explain: 'With rare includes, expected chance agreement is high and κ is depressed even when raw agreement is excellent. Report raw agreement and disagreement counts too.',
  },
  {
    id: 'sc-4', level: 2,
    stem: 'A full-text report fails both the population and the comparator criteria. How should it appear in the PRISMA flow diagram?',
    options: ['Under both reasons', 'Under one reason, chosen by a pre-specified order, so totals add up', 'It should not be counted', 'As “other”'],
    answer: 1,
    explain: 'One reason per excluded report keeps the flow diagram arithmetically consistent; a pre-set order makes the choice reproducible.',
  },
  {
    id: 'sc-5', level: 2,
    stem: 'An eligible-looking RCT allocated participants by alternation. At full-text screening you should:',
    options: ['Exclude it for high risk of bias', 'Include it (if RCTs and quasi-RCTs are eligible per protocol) and assess its risk of bias later', 'Exclude it as “wrong design” unless the protocol explicitly excluded quasi-randomized trials', 'Ignore the allocation method'],
    answer: 2,
    explain: 'Alternation is not true randomization. Whether such trials are eligible depends on the protocol. If quasi-randomized trials are excluded, it is a design exclusion; if included, it is assessed as high risk of bias in RoB 2 domain 1. Do not exclude for “bias” ad hoc.',
  },
  {
    id: 'sc-6', level: 2,
    stem: 'You find a trial protocol with no results yet. What is the correct handling?',
    options: ['Delete it', 'Record it as an ongoing study, check the registry for results and contact investigators', 'Include it in the meta-analysis with zero effect', 'Exclude as wrong population'],
    answer: 1,
    explain: 'Ongoing studies are listed separately; they matter for judging missing evidence and for updates.',
  },
  {
    id: 'sc-7', level: 1,
    stem: '55 reports were assessed at full text and 44 were excluded. The remaining reports describe 8 studies. What goes in the “included” box?',
    options: ['8 studies; 11 reports', '11 studies; 8 reports', '55 studies', '44 reports'],
    answer: 0,
    explain: 'Reports included = 55 − 44 = 11, describing 8 studies. PRISMA 2020 asks for both numbers.',
  },
  {
    id: 'sc-8', level: 2,
    stem: 'An active-learning tool was used and screening stopped after 40% of records. What must be reported?',
    options: ['Nothing — the tool is validated', 'The tool, how it was used, the stopping rule and how it was validated (PRISMA item 8)', 'Only the tool’s name', 'The number of records the tool did not show'],
    answer: 1,
    explain: 'Automation is acceptable with transparent reporting of the tool, its role and the stopping criterion; reviewers remain accountable.',
  },
]
