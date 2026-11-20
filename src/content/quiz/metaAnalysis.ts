import type { QuizQuestion } from '../types'

export const metaAnalysis: QuizQuestion[] = [
  {
    id: 'm-1', level: 1,
    stem: 'What does a random-effects meta-analysis estimate?',
    options: ['The single true effect shared by all studies', 'The mean of a distribution of true effects across studies', 'The largest study’s effect', 'The median of observed effects'],
    answer: 1,
    explain: 'Random effects assumes true effects vary (variance τ²) and estimates their mean μ.',
  },
  {
    id: 'm-2', level: 1,
    stem: 'Which τ² estimator is now the default and recommended in RevMan?',
    options: ['DerSimonian–Laird', 'REML (restricted maximum likelihood)', 'Hedges–Olkin', 'Paule–Mandel'],
    answer: 1,
    explain: 'Cochrane changed the default to REML; DL remains available but tends to underestimate τ², especially with few studies.',
  },
  {
    id: 'm-3', level: 2,
    stem: 'According to current Cochrane guidance, when is the HKSJ confidence interval recommended for the random-effects summary?',
    options: ['Always', 'When τ² > 0 and there are more than two studies', 'Only when I² > 50%', 'Only for binary outcomes'],
    answer: 1,
    explain: 'If τ² is estimated as 0, or there are only two studies, the Wald-type interval is recommended instead.',
  },
  {
    id: 'm-4', level: 2,
    stem: 'What does the 95% prediction interval describe?',
    options: ['The uncertainty in the average effect', 'The range in which the true effect in a new, similar study or setting is expected to lie', 'The range of observed study estimates', 'The CI of τ²'],
    answer: 1,
    explain: 'The PI combines uncertainty in μ with between-study variance τ²; it is wider than the CI whenever τ² > 0.',
  },
  {
    id: 'm-5', level: 1,
    stem: 'In a forest plot, what does the size of each square represent?',
    options: ['Sample size only', 'The study’s weight in the meta-analysis', 'The effect size', 'Risk of bias'],
    answer: 1,
    explain: 'Square area is proportional to weight (inverse variance in these models).',
  },
  {
    id: 'm-6', level: 2,
    stem: 'Compared with a common-effect model, how does a random-effects model treat small studies?',
    options: ['Gives them less relative weight', 'Gives them more relative weight', 'Excludes them', 'Weights all studies by sample size'],
    answer: 1,
    explain: 'Adding τ² to each variance makes weights more equal, so small studies gain influence — which matters if small studies are biased.',
  },
  {
    id: 'm-7', level: 2,
    stem: 'A pooled RR is 0.92 (95% CI 0.78 to 1.08). What is the best interpretation?',
    options: ['The intervention has no effect', 'The data are compatible with a 22% reduction up to an 8% increase in risk', 'The intervention is harmful', 'The result is invalid'],
    answer: 1,
    explain: 'A CI spanning 1 is not evidence of no effect; describe the range of compatible effects.',
  },
  {
    id: 'm-8', level: 3,
    stem: 'BCG trials: random-effects RR 0.49 (95% CI 0.33 to 0.73), I² 92%, 95% PI 0.13 to 1.79. Which conclusion is best?',
    options: [
      'BCG halves TB risk everywhere',
      'On average BCG reduces TB substantially, but effects vary widely; in some settings it may provide little or no benefit — explore causes such as latitude',
      'Results are too heterogeneous to say anything',
      'BCG has no effect because the PI crosses 1',
    ],
    answer: 1,
    explain: 'The CI shows the average effect is clearly beneficial; the PI shows large variation in true effects, motivating investigation of effect modifiers.',
  },
]
