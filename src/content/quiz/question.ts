import type { QuizQuestion } from '../types'

export const question: QuizQuestion[] = [
  {
    id: 'q-1', level: 1,
    stem: 'Which framework best structures: “How accurate is point-of-care lung ultrasound for diagnosing pneumonia in children in the emergency department?”',
    options: ['PICO', 'PECO', 'Population, index test, reference standard, target condition', 'PCC'],
    answer: 2,
    explain: 'Diagnostic accuracy questions compare an index test against a reference standard for a target condition in a defined population. PICO is for intervention effects.',
  },
  {
    id: 'q-2', level: 2,
    stem: 'Why does the Cochrane Handbook advise that outcomes should not normally be used as eligibility criteria?',
    options: [
      'Because outcomes are chosen after screening',
      'Because excluding studies that measured but did not report an outcome introduces bias due to selective reporting',
      'Because only primary outcomes can be extracted',
      'Because PRISMA 2020 forbids listing outcomes in the protocol',
    ],
    answer: 1,
    explain: 'Studies often measure outcomes they do not report — frequently because results were unfavourable. Excluding them biases the synthesis. Include on PICO and design; treat missing outcome results as missing evidence.',
  },
  {
    id: 'q-3', level: 1,
    stem: 'A team wants to map what types of digital mental-health interventions for adolescents have been studied, which outcomes were measured, and where the gaps are. Which review type fits?',
    options: ['Systematic review with meta-analysis', 'Scoping review using PCC', 'Rapid review', 'Network meta-analysis'],
    answer: 1,
    explain: 'Mapping concepts, evidence types and gaps — without estimating an effect — is the purpose of a scoping review (JBI methodology, PRISMA-ScR).',
  },
  {
    id: 'q-4', level: 2,
    stem: 'An exercise review includes trials with usual care, waiting-list and attention-control comparators. What is the best practice?',
    options: [
      'Pool all “controls” together without comment',
      'Include only placebo-controlled trials',
      'Pre-specify which comparators are eligible and whether they are analysed separately or combined, with a rationale',
      'Decide after seeing the forest plot',
    ],
    answer: 2,
    explain: 'Different comparators answer different questions and can produce different effects. Specify eligibility and the grouping plan in the protocol (PRISMA 2020 item 5).',
  },
  {
    id: 'q-5', level: 1,
    stem: 'Which question needs a PECO rather than a PICO framing?',
    options: [
      'Does semaglutide reduce weight compared with placebo?',
      'Is long-term night-shift work associated with breast cancer?',
      'What is the sensitivity of D-dimer for pulmonary embolism?',
      'What are patients’ experiences of dialysis?',
    ],
    answer: 1,
    explain: 'Night-shift work is an exposure that investigators do not assign; the question is about an association, typically from observational studies (PECO).',
  },
  {
    id: 'q-6', level: 2,
    stem: 'What does the Cochrane Handbook advise about restricting eligibility to English-language reports?',
    options: [
      'It is recommended to reduce workload',
      'Language restrictions should be avoided; eligible non-English reports should be included and translated where needed',
      'It is acceptable if stated in the abstract',
      'It only matters for diagnostic reviews',
    ],
    answer: 1,
    explain: 'Language restrictions can bias results and reduce precision. Search without language limits and translate eligible reports (machine translation is increasingly adequate for extraction).',
  },
  {
    id: 'q-7', level: 3,
    stem: 'A broad question (“any exercise for depression”) is chosen. What must the protocol contain to keep the synthesis defensible?',
    options: [
      'A promise to use a random-effects model',
      'A plan for how studies will be grouped for each synthesis and which effect modifiers will be explored',
      'A limit to five included studies',
      'A rule to exclude trials with small effects',
    ],
    answer: 1,
    explain: 'Lumping is legitimate when grouping rules and planned investigations of heterogeneity are pre-specified. A random-effects model does not fix inappropriate lumping.',
  },
]
