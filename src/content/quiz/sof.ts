import type { QuizQuestion } from '../types'

export const sof: QuizQuestion[] = [
  {
    id: 'f-1', level: 1,
    stem: 'How many outcomes should a Summary of findings table usually include at most?',
    options: ['3', '7', '12', 'All measured outcomes'],
    answer: 1,
    explain: 'Up to seven patient-important outcomes, including harms, keeps the table usable.',
  },
  {
    id: 'f-2', level: 2,
    stem: 'Comparator risk is 282 per 1000 and RR = 1.41 (95% CI 1.13 to 1.76). What is the risk with the intervention?',
    options: ['About 141 per 1000', 'About 398 per 1000 (319 to 496)', 'About 1410 per 1000', 'About 282 per 1000'],
    answer: 1,
    explain: '282 × 1.41 ≈ 398; 282 × 1.13 ≈ 319; 282 × 1.76 ≈ 496 — i.e., 116 more per 1000 (37 to 214 more).',
  },
  {
    id: 'f-3', level: 2,
    stem: 'What is the best source for the assumed comparator risk?',
    options: ['Always 50%', 'The median control-group risk of included trials or representative observational data for the target population', 'The largest trial only', 'The intervention group risk'],
    answer: 1,
    explain: 'Absolute effects should reflect the people to whom the evidence will be applied; present several risk levels when they vary.',
  },
  {
    id: 'f-4', level: 1,
    stem: 'Why must SoF tables show absolute effects?',
    options: ['Journals require them', 'Decisions depend on how many people benefit or are harmed, which relative effects alone do not convey', 'Relative effects are always biased', 'To avoid GRADE'],
    answer: 1,
    explain: 'The same RR can mean 1 or 100 fewer events per 1000 depending on baseline risk.',
  },
  {
    id: 'f-5', level: 2,
    stem: 'Moderate-certainty evidence shows RR 0.80 (0.70 to 0.91) for hospitalisation. Which statement fits?',
    options: ['“X reduces hospitalisation”', '“X probably reduces hospitalisation”', '“X may reduce hospitalisation”', '“The evidence is very uncertain”'],
    answer: 1,
    explain: 'Moderate certainty → “probably”.',
  },
  {
    id: 'f-6', level: 2,
    stem: 'No trial reported serious adverse events, which the protocol listed as a SoF outcome. What should the table show?',
    options: ['Drop the row', 'Keep the row and state that no studies reported it', 'Assume zero events', 'Use another outcome instead'],
    answer: 1,
    explain: 'Absence of evidence on harms is itself important information for decision-makers.',
  },
]
