import type { QuizQuestion } from '../types'

export const narrative: QuizQuestion[] = [
  {
    id: 'n-1', level: 2,
    stem: 'Why is vote counting based on statistical significance inappropriate?',
    options: ['It is too slow', 'It treats underpowered non-significant studies as evidence of no effect and ignores effect sizes', 'It requires individual data', 'It overestimates heterogeneity'],
    answer: 1,
    explain: 'Many small studies can all point to benefit yet each be non-significant; counting significance would wrongly suggest no effect.',
  },
  {
    id: 'n-2', level: 2,
    stem: 'Eight of ten studies show benefit and two show harm (by point estimate). What does an exact two-sided sign test give?',
    options: ['p ≈ 0.01', 'p ≈ 0.11', 'p ≈ 0.50', 'p = 1'],
    answer: 1,
    explain: 'P(X ≥ 8 | n = 10, p = 0.5) = 0.055; doubling for two sides gives ≈ 0.11.',
  },
  {
    id: 'n-3', level: 1,
    stem: 'What question does combining p-values (e.g., Fisher’s method) answer?',
    options: ['How large the average effect is', 'Whether there is evidence of an effect in at least one study', 'Whether studies are homogeneous', 'What the NNT is'],
    answer: 1,
    explain: 'It tests a global null hypothesis; it says nothing about magnitude or consistency.',
  },
  {
    id: 'n-4', level: 1,
    stem: 'What is SWiM?',
    options: ['A meta-analysis model', 'A reporting guideline for synthesis without meta-analysis (9 items)', 'A risk-of-bias tool', 'A search filter'],
    answer: 1,
    explain: 'SWiM (BMJ 2020) promotes transparent reporting of grouping, metrics, methods, prioritisation, heterogeneity, certainty, presentation and limitations.',
  },
  {
    id: 'n-5', level: 2,
    stem: 'Which plot suits studies that report only p-values and sample sizes?',
    options: ['Forest plot', 'Albatross plot', 'Funnel plot', 'Traffic-light plot'],
    answer: 1,
    explain: 'Albatross plots place p-values against sample size, with contours showing the effect sizes implied.',
  },
  {
    id: 'n-6', level: 2,
    stem: 'An outcome synthesised narratively still needs:',
    options: ['Nothing further', 'A GRADE certainty rating', 'A funnel plot', 'A random-effects model'],
    answer: 1,
    explain: 'Certainty assessment applies to every important outcome regardless of synthesis method (SWiM item 6).',
  },
]
