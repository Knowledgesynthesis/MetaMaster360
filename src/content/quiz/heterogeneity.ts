import type { QuizQuestion } from '../types'

export const heterogeneity: QuizQuestion[] = [
  {
    id: 'h-1', level: 1,
    stem: 'What does I² describe?',
    options: ['The absolute amount of variation in true effects', 'The proportion of observed variability in estimates due to heterogeneity rather than chance', 'The p-value of the Q test', 'The width of the prediction interval'],
    answer: 1,
    explain: 'I² is a proportion. The absolute variation in true effects is τ (or τ²).',
  },
  {
    id: 'h-2', level: 2,
    stem: 'Two meta-analyses have the same τ² = 0.01. One contains very large trials, the other small trials. Which has the higher I²?',
    options: ['The one with small trials', 'The one with large trials', 'They are identical', 'Cannot have the same τ²'],
    answer: 1,
    explain: 'I² = τ²/(τ² + within-study variance). Large trials have small within-study variance, so the same τ² gives a higher I².',
  },
  {
    id: 'h-3', level: 1,
    stem: 'Which heterogeneity quantity is expressed in the units of the effect measure?',
    options: ['I²', 'Q', 'τ', 'H²'],
    answer: 2,
    explain: 'τ is the standard deviation of true effects (e.g., in SMD or log RR units).',
  },
  {
    id: 'h-4', level: 2,
    stem: 'In one subgroup p = 0.01, in the other p = 0.30. What can you conclude about effect modification?',
    options: ['The effect differs between subgroups', 'Nothing yet — test the difference between subgroups directly', 'The second subgroup has no effect', 'The first subgroup is biased'],
    answer: 1,
    explain: 'Comparing within-subgroup p-values is a classic error; use a test for subgroup differences (interaction).',
  },
  {
    id: 'h-5', level: 1,
    stem: 'What rule of thumb does the Cochrane Handbook give for meta-regression?',
    options: ['At least 3 studies in total', 'At least 10 studies per covariate', 'At least 100 participants', 'Only with IPD'],
    answer: 1,
    explain: 'Meta-regression with fewer than about 10 studies per covariate is unreliable.',
  },
  {
    id: 'h-6', level: 3,
    stem: 'Running case: supervised exercise SMD −0.46 vs home-based −0.15 (test p = 0.02). Both home-based trials are the largest and at lower risk of bias. Best judgement?',
    options: [
      'Credible effect modification — recommend supervised exercise only',
      'Low credibility: a between-study comparison with two trials in one subgroup, confounded by size and risk of bias',
      'The test is invalid because p < 0.05',
      'Home-based exercise does not work',
    ],
    answer: 1,
    explain: 'Between-study, few studies, and confounded by small-study bias. Report as hypothesis-generating.',
  },
  {
    id: 'h-7', level: 2,
    stem: 'A meta-analysis of 5 studies has Q with p = 0.40. What follows?',
    options: ['The studies are homogeneous', 'The test has low power with few studies; absence of evidence of heterogeneity is not evidence of homogeneity', 'A common-effect model is mandatory', 'I² must be 0%'],
    answer: 1,
    explain: 'Q has low power when k is small; look at τ², its CI and the prediction interval.',
  },
  {
    id: 'h-8', level: 2,
    stem: 'How does a sensitivity analysis differ from a subgroup analysis?',
    options: ['They are the same', 'Sensitivity analysis checks whether conclusions change under alternative decisions; subgroup analysis estimates and compares effects in subsets', 'Subgroup analysis is always post hoc', 'Sensitivity analysis needs IPD'],
    answer: 1,
    explain: 'Sensitivity analyses test robustness (e.g., excluding high risk of bias); subgroup analyses test effect modification.',
  },
]
