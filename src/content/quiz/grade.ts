import type { QuizQuestion } from '../types'

export const grade: QuizQuestion[] = [
  {
    id: 'g-1', level: 1,
    stem: 'In GRADE, at what level does evidence from randomized trials start?',
    options: ['Low', 'Moderate', 'High', 'It depends on sample size'],
    answer: 2,
    explain: 'RCT evidence starts high and is rated down for risk of bias, inconsistency, indirectness, imprecision or publication bias.',
  },
  {
    id: 'g-2', level: 1,
    stem: 'Which is NOT one of the five GRADE reasons to rate down certainty?',
    options: ['Indirectness', 'Imprecision', 'Lack of statistical significance', 'Publication bias'],
    answer: 2,
    explain: 'The five are risk of bias, inconsistency, indirectness, imprecision and publication bias. Statistical significance is not a domain.',
  },
  {
    id: 'g-3', level: 2,
    stem: 'Under Core GRADE, when do you rate down for imprecision?',
    options: ['When p > 0.05', 'When the 95% CI crosses the threshold that defines the target of the rating (null or MID)', 'When fewer than 10 trials', 'When I² > 50%'],
    answer: 1,
    explain: 'Imprecision is judged against the chosen threshold; if the CI includes both important and unimportant (or opposite) effects, rate down.',
  },
  {
    id: 'g-4', level: 2,
    stem: 'A body of observational studies shows RR 0.15 with no serious limitations. How might certainty change?',
    options: ['Start low; rate up two levels for a very large effect', 'Start high; rate down two', 'Start moderate; no change', 'Observational evidence cannot be rated up'],
    answer: 0,
    explain: 'RR < 0.2 is a very large effect: non-randomized evidence without serious limitations can be rated up by two levels.',
  },
  {
    id: 'g-5', level: 1,
    stem: 'Which wording fits low-certainty evidence of benefit?',
    options: ['“X reduces Y”', '“X probably reduces Y”', '“X may reduce Y”', '“X does not affect Y”'],
    answer: 2,
    explain: 'GRADE informative statements: high “reduces”, moderate “probably reduces”, low “may reduce”, very low “very uncertain”.',
  },
  {
    id: 'g-6', level: 1,
    stem: 'For what unit is GRADE certainty rated in a systematic review?',
    options: ['The review as a whole', 'Each included study', 'Each outcome (across studies)', 'Each database searched'],
    answer: 2,
    explain: 'Certainty differs across outcomes and is displayed per outcome in the Summary of findings table.',
  },
  {
    id: 'g-7', level: 3,
    stem: 'Running case: SMD −0.35 (95% CI −0.56 to −0.14); serious risk of bias; publication bias suspected; consistent, direct. Target: any benefit. Certainty?',
    options: ['High', 'Moderate', 'Low', 'Very low'],
    answer: 2,
    explain: 'Start high; −1 risk of bias; −1 publication bias; imprecision not serious for the non-null target because the CI excludes 0 → low.',
  },
  {
    id: 'g-8', level: 3,
    stem: 'Same case, but the target is an important effect with MID = 0.2 SMD. What changes?',
    options: ['Nothing', 'The CI includes effects smaller than the MID, so also rate down for imprecision → very low', 'Rate up for a large effect', 'Certainty becomes moderate'],
    answer: 1,
    explain: 'The upper CI limit (−0.14) is less than the MID in magnitude: the data are compatible with unimportant effects. The target changes the rating.',
  },
]
