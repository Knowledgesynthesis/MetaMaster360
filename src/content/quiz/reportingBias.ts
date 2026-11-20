import type { QuizQuestion } from '../types'

export const reportingBias: QuizQuestion[] = [
  {
    id: 'rb-1', level: 1,
    stem: 'What is the minimum number of studies generally recommended before using tests for funnel plot asymmetry?',
    options: ['3', '5', '10', '30'],
    answer: 2,
    explain: 'With fewer than 10 studies, tests have too little power to distinguish chance from real asymmetry (Sterne et al. 2011; Handbook ch. 13).',
  },
  {
    id: 'rb-2', level: 2,
    stem: 'Which is NOT a recognised cause of funnel plot asymmetry?',
    options: ['Publication bias', 'Poorer methods in smaller studies', 'True heterogeneity related to study size', 'Using a random-effects model'],
    answer: 3,
    explain: 'Asymmetry arises from reporting biases, small-study bias, heterogeneity, artefacts and chance — not from the choice of pooling model.',
  },
  {
    id: 'rb-3', level: 2,
    stem: 'On a contour-enhanced funnel plot, the apparently missing studies fall in regions of non-significance. What does this suggest?',
    options: ['Publication bias is a plausible explanation', 'Publication bias is ruled out', 'The meta-analysis is invalid', 'Heterogeneity is zero'],
    answer: 0,
    explain: 'Selective publication tends to remove non-significant results; missing studies in significant regions would point to other causes.',
  },
  {
    id: 'rb-4', level: 2,
    stem: 'How should the trim-and-fill “adjusted” estimate be used?',
    options: ['As the primary result', 'As a sensitivity analysis, acknowledging its assumption that asymmetry is due to publication bias', 'To replace the funnel plot', 'Never mentioned'],
    answer: 1,
    explain: 'Adjustment methods depend on strong, untestable assumptions; they show sensitivity, not truth.',
  },
  {
    id: 'rb-5', level: 1,
    stem: 'What does ROB-ME assess?',
    options: ['Risk of bias in a single trial', 'Risk of bias due to missing evidence (missing studies or results) in a meta-analysis', 'Measurement error', 'Risk of bias in qualitative studies'],
    answer: 1,
    explain: 'ROB-ME (BMJ 2023) structures judgements about bias from results missing because of their p-value, magnitude or direction.',
  },
  {
    id: 'rb-6', level: 1,
    stem: 'What is the most direct way to detect selective outcome reporting within a trial?',
    options: ['A funnel plot', 'Comparing outcomes in the protocol or registry with those reported', 'Egger’s test', 'Checking the sample size'],
    answer: 1,
    explain: 'Registry and protocol comparisons reveal outcomes measured but not reported, or switched primary outcomes.',
  },
  {
    id: 'rb-7', level: 3,
    stem: 'The running case has 8 trials; the 3 smallest show the largest benefits and are at high risk of bias. What is the best approach?',
    options: [
      'Run Egger’s test and conclude from its p-value',
      'Do not test formally; describe the small-study pattern, relate it to risk of bias and known missing results, and consider rating down for publication bias in GRADE',
      'Exclude the small trials from the review',
      'Ignore it because k < 10',
    ],
    answer: 1,
    explain: 'Below 10 studies tests are uninformative, but the qualitative pattern plus RoB and registry evidence still informs ROB-ME and GRADE.',
  },
  {
    id: 'rb-8', level: 3,
    stem: 'Why are Harbord’s or Peters’ tests preferred over Egger’s test for odds ratios?',
    options: ['They are newer', 'Egger’s test has inflated false-positive rates for log ORs because the estimate and its SE are mathematically correlated', 'They need fewer studies', 'Egger’s test only works for RRs'],
    answer: 1,
    explain: 'The artefactual correlation between log OR and its SE can produce asymmetry without bias; the alternative tests reduce this.',
  },
]
