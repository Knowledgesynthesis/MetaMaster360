import type { QuizQuestion } from '../types'

export const effectMeasures: QuizQuestion[] = [
  {
    id: 'e-1', level: 1,
    stem: '20/100 events with the intervention and 40/100 with control. What are the RR and the RD?',
    options: ['RR 0.50; RD −0.20', 'RR 0.375; RD −0.20', 'RR 2.0; RD 0.20', 'RR 0.50; RD −0.50'],
    answer: 0,
    explain: 'RR = 0.20/0.40 = 0.50. RD = 0.20 − 0.40 = −0.20 (20 fewer per 100). The OR would be (20×60)/(80×40) = 0.375.',
  },
  {
    id: 'e-2', level: 2,
    stem: 'Trials measure depression with HAM-D, MADRS and BDI-II. Which effect measure is appropriate for pooling?',
    options: ['Mean difference', 'Standardized mean difference', 'Risk ratio', 'Hazard ratio'],
    answer: 1,
    explain: 'Different instruments of the same construct require standardisation (SMD). MD would add points from incompatible scales.',
  },
  {
    id: 'e-3', level: 3,
    stem: 'Control risk is 60% and a trial reports OR 0.40. What is the approximate risk ratio?',
    options: ['0.40', '0.63', '0.24', '0.85'],
    answer: 1,
    explain: 'Intervention risk = OR·CR/(1 − CR + OR·CR) = 0.24/0.64 = 0.375; RR = 0.375/0.60 ≈ 0.63. Reading the OR as an RR exaggerates the effect.',
  },
  {
    id: 'e-4', level: 2,
    stem: 'A pooled SMD is −0.35. A typical SD of PHQ-9 is about 5.3. What is the approximate effect in PHQ-9 points?',
    options: ['−0.35 points', 'About −1.9 points', 'About −5.3 points', 'Cannot be estimated'],
    answer: 1,
    explain: 'Multiply the SMD by the SD of a familiar instrument: −0.35 × 5.3 ≈ −1.9 points, then compare with its minimal important difference.',
  },
  {
    id: 'e-5', level: 1,
    stem: 'Why is Hedges’ g preferred over Cohen’s d in meta-analysis?',
    options: ['It is always larger', 'It corrects the upward bias of d in small samples', 'It does not need SDs', 'It works for binary outcomes'],
    answer: 1,
    explain: 'The correction factor J = 1 − 3/(4N − 9) slightly shrinks d; RevMan’s SMD is Hedges’ adjusted g.',
  },
  {
    id: 'e-6', level: 2,
    stem: 'Why are risk ratios and odds ratios meta-analysed on the log scale?',
    options: ['To make them larger', 'Their sampling distribution is approximately normal and symmetric on the log scale', 'Logs remove heterogeneity', 'It is required for absolute effects'],
    answer: 1,
    explain: 'Ratios are bounded below by 0 and skewed; logs make them symmetric so inverse-variance methods and normal CIs apply.',
  },
  {
    id: 'e-7', level: 2,
    stem: 'A meta-analysis reports “NNT = 8” obtained by averaging NNTs from each trial. What is wrong?',
    options: ['Nothing', 'NNTs depend on baseline risk and should not be pooled; derive NNT from the pooled relative effect for a stated baseline risk', 'NNT should be rounded down', 'NNT can only be used for harms'],
    answer: 1,
    explain: 'Pool on a relative scale and convert to absolute effects (and NNT) at a specified baseline risk and time frame.',
  },
  {
    id: 'e-8', level: 1,
    stem: 'A trial has 0/40 events in both arms. How does it contribute to a risk-ratio meta-analysis?',
    options: ['With RR = 1 and narrow CI', 'It is excluded from the RR analysis (no information on a ratio)', 'Add 0.5 and include with full weight', 'It doubles the weight of others'],
    answer: 1,
    explain: 'Double-zero studies are uninformative for RR/OR and are excluded; they can contribute to a risk-difference analysis.',
  },
]
