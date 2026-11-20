import type { QuizQuestion } from '../types'

export const extraction: QuizQuestion[] = [
  {
    id: 'x-1', level: 2,
    stem: 'A trial reports PHQ-9 as 9.4 ± 0.44 (mean ± SEM) with n = 150. What SD should you enter?',
    options: ['0.44', '5.39', '0.036', '66'],
    answer: 1,
    explain: 'SD = SE × √n = 0.44 × 12.25 = 5.39. Entering the SE as an SD massively over-weights the trial.',
  },
  {
    id: 'x-2', level: 2,
    stem: 'Some trials report change-from-baseline scores and others report final scores, all on HAM-D. Which statement is correct?',
    options: [
      'They can be combined in a mean-difference analysis but should not be mixed in an SMD analysis',
      'They can never be combined',
      'They can be mixed in an SMD analysis but not an MD analysis',
      'Only change scores are valid',
    ],
    answer: 0,
    explain: 'With MD, both estimate the same difference in means (in expectation, in randomised trials). For SMD, the SDs differ (change SDs reflect within-person variability), so standardisation differs.',
  },
  {
    id: 'x-3', level: 2,
    stem: 'A three-arm trial has two eligible exercise arms and one usual-care arm. What is a correct approach for a single pairwise meta-analysis?',
    options: ['Enter each exercise arm vs the full control group', 'Combine the two exercise arms into one group (or split the control group)', 'Use only the arm with the larger effect', 'Exclude the trial'],
    answer: 1,
    explain: 'Entering both comparisons with the full control group double-counts control participants. Combine arms or split the shared group.',
  },
  {
    id: 'x-4', level: 1,
    stem: 'A cluster trial with mean cluster size 21 and ICC 0.05 was analysed ignoring clustering. What is the design effect?',
    options: ['1.05', '1.5', '2.0', '21'],
    answer: 2,
    explain: 'DE = 1 + (21 − 1) × 0.05 = 2.0, so the effective sample size is half the reported n.',
  },
  {
    id: 'x-5', level: 2,
    stem: 'Hospital length of stay is reported as mean 4.0 days (SD 5.5). What does this suggest?',
    options: ['A data entry error only', 'The distribution is likely right-skewed, so means and SDs (and median-based conversions) should be interpreted cautiously', 'The SD is an SE', 'Nothing'],
    answer: 1,
    explain: 'For a variable that cannot be negative, a mean less than twice the SD indicates skewness.',
  },
  {
    id: 'x-6', level: 1,
    stem: 'One trial uses a quality-of-life scale where higher is better; the others use scales where higher is worse. Before computing SMDs you should:',
    options: ['Multiply that trial’s SDs by −1', 'Multiply that trial’s means by −1 so all scales point the same way', 'Exclude the trial', 'Use the odds ratio instead'],
    answer: 1,
    explain: 'Align direction by reversing the means; SDs are always positive.',
  },
  {
    id: 'x-7', level: 1,
    stem: 'What did Buscemi et al. (2006) find when comparing single with double data extraction?',
    options: ['No difference', 'Single extraction generated more errors than double extraction', 'Double extraction introduced bias', 'Single extraction was more accurate but slower'],
    answer: 1,
    explain: 'Independent double extraction (or at least verification) of outcome data reduces errors.',
  },
  {
    id: 'x-8', level: 3,
    stem: 'Median and IQR are 16 (11 to 21.5) with n = 55. Approximately what mean and SD do the Luo and Wan methods give?',
    options: ['Mean 16.2, SD 8.0', 'Mean 16.0, SD 10.5', 'Mean 21.5, SD 5.5', 'Mean 11.0, SD 4.0'],
    answer: 0,
    explain: 'Mean ≈ 0.707 × (11 + 21.5)/2 + 0.293 × 16 = 16.2; SD ≈ IQR / 1.315 = 10.5 / 1.315 ≈ 8.0.',
  },
]
