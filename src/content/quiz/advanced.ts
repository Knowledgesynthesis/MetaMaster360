import type { QuizQuestion } from '../types'

export const advanced: QuizQuestion[] = [
  {
    id: 'a-1', level: 1,
    stem: 'What does the transitivity assumption in network meta-analysis require?',
    options: ['All trials have the same sample size', 'Effect modifiers are similarly distributed across the different comparisons', 'Direct and indirect estimates are identical', 'There are at least 10 trials per comparison'],
    answer: 1,
    explain: 'Transitivity is a clinical/methodological judgement that indirect comparisons are valid; consistency is its statistical manifestation.',
  },
  {
    id: 'a-2', level: 2,
    stem: 'RR(A vs C) = 0.80 and RR(B vs C) = 0.90. What is the indirect RR(A vs B)?',
    options: ['0.72', '0.89', '1.13', '0.10'],
    answer: 1,
    explain: 'ln RR(A vs B) = ln 0.80 − ln 0.90 → RR = 0.80/0.90 ≈ 0.89, with variance equal to the sum of the two variances.',
  },
  {
    id: 'a-3', level: 1,
    stem: 'What is “inconsistency” (incoherence) in a network meta-analysis?',
    options: ['Heterogeneity within one comparison', 'Disagreement between direct and indirect evidence for the same comparison', 'Different outcome scales', 'Missing studies'],
    answer: 1,
    explain: 'Checked with node-splitting or design-by-treatment interaction models.',
  },
  {
    id: 'a-4', level: 2,
    stem: 'How should sensitivity and specificity be meta-analysed in a diagnostic accuracy review?',
    options: ['Separately with univariate random-effects models', 'Jointly, with bivariate or HSROC models that account for their correlation', 'By averaging them', 'Using odds ratios only'],
    answer: 1,
    explain: 'Sensitivity and specificity are correlated (threshold effects); hierarchical models handle this.',
  },
  {
    id: 'a-5', level: 1,
    stem: 'Which principle is central to the 2025 joint position on AI in evidence synthesis?',
    options: ['AI may replace human reviewers if faster', 'Review authors remain accountable; AI is used with human oversight and reported transparently', 'AI use need not be reported', 'Only open-source AI may be used'],
    answer: 1,
    explain: 'Cochrane, Campbell, JBI and CEE endorse RAISE: accountability, oversight, fitness for purpose and transparent reporting.',
  },
  {
    id: 'a-6', level: 2,
    stem: 'When is an individual participant data (IPD) meta-analysis especially valuable?',
    options: ['When aggregate data are complete', 'For participant-level effect modification and standardised time-to-event analyses', 'For scoping questions', 'When only abstracts are available'],
    answer: 1,
    explain: 'IPD allows within-trial interaction analyses (avoiding ecological bias) and consistent outcome definitions.',
  },
  {
    id: 'a-7', level: 2,
    stem: 'What is a specific methodological problem in overviews (umbrella reviews)?',
    options: ['Too few databases exist', 'Overlap: the same primary studies appear in several included reviews', 'GRADE cannot be used', 'Forest plots are impossible'],
    answer: 1,
    explain: 'Overlap double-counts evidence; it must be measured (e.g., citation matrix) and managed.',
  },
]
