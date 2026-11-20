import type { QuizQuestion } from '../types'

export const reporting: QuizQuestion[] = [
  {
    id: 'w-1', level: 1,
    stem: 'How many items does the main PRISMA 2020 checklist contain?',
    options: ['12', '17', '27', '42'],
    answer: 2,
    explain: '27 items (42 including sub-items). The abstract checklist has 12 items; PRISMA-P has 17.',
  },
  {
    id: 'w-2', level: 1,
    stem: 'Which extension should a living systematic review use in addition to PRISMA 2020?',
    options: ['PRISMA-ScR', 'PRISMA-LSR (2024)', 'PRISMA-P', 'SWiM'],
    answer: 1,
    explain: 'PRISMA-LSR (BMJ 2024) adds items on living mode, changes to methods and results, and authorship roles.',
  },
  {
    id: 'w-3', level: 2,
    stem: 'A review concludes “drug X did not increase bleeding (RR 1.4, 95% CI 0.8 to 2.6)”. What is the problem?',
    options: ['None', 'It treats absence of evidence as evidence of absence; the CI includes a large increase', 'RR should be OR', 'Bleeding should not be reported'],
    answer: 1,
    explain: 'The data are compatible with up to a 2.6-fold increase. Describe the uncertainty, with certainty rating.',
  },
  {
    id: 'w-4', level: 2,
    stem: 'Under PRISMA 2020 item 27, what should be made available?',
    options: ['Only the PRISMA checklist', 'Data collection forms, extracted data, analysis data, analytic code and other materials (or a statement about availability)', 'Reviewer names', 'Rejected manuscripts'],
    answer: 1,
    explain: 'Item 27 promotes reproducibility through open materials.',
  },
  {
    id: 'w-5', level: 2,
    stem: 'An AI tool assisted screening. Where and how should this be reported?',
    options: ['Not at all', 'In the methods (PRISMA items 8/9/11 as relevant): tool, version, purpose, human oversight and validation', 'Only in acknowledgements', 'Only if it made errors'],
    answer: 1,
    explain: 'PRISMA 2020 asks for automation tool details, and the 2025 joint position requires transparent reporting of any AI that makes or suggests judgements.',
  },
  {
    id: 'w-6', level: 3,
    stem: 'Which sentence is free of spin for low-certainty evidence of a benefit?',
    options: ['“X is effective for Y.”', '“X may improve Y (low-certainty evidence).”', '“X clearly improves Y.”', '“X should be offered to all patients with Y.”'],
    answer: 1,
    explain: 'Low certainty → “may”; reviews describe effects and certainty rather than issuing recommendations.',
  },
]
