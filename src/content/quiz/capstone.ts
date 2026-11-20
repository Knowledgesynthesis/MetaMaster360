import type { QuizQuestion } from '../types'

export const capstone: QuizQuestion[] = [
  {
    id: 'c-1', level: 3,
    stem: 'In the running case, excluding the three high risk-of-bias trials changes the SMD from −0.35 to −0.22 and I² from 34% to 0%. What is the best use of this finding?',
    options: ['Report only the restricted analysis', 'Report the primary analysis, present the restricted analysis as a pre-specified sensitivity analysis, and reflect it in GRADE risk of bias', 'Ignore it — the CI still excludes 0', 'Exclude high-risk trials from the review'],
    answer: 1,
    explain: 'Sensitivity analyses inform interpretation and certainty; they do not silently replace the primary analysis.',
  },
  {
    id: 'c-2', level: 3,
    stem: 'The 95% prediction interval for the case is −0.75 to 0.05. What does it add to the 95% CI (−0.56 to −0.14)?',
    options: ['Nothing', 'In a new setting like these trials, the true effect could range from moderate benefit to none', 'It proves the effect is harmful', 'It replaces the CI'],
    answer: 1,
    explain: 'The CI concerns the average effect; the PI shows how effects vary across settings.',
  },
  {
    id: 'c-3', level: 2,
    stem: 'Why does the capstone abstract report 934 participants rather than 984 randomized?',
    options: ['50 participants dropped out', 'Chowdhury’s cluster trial was adjusted to its effective sample size with a design effect of 1.3', 'A typo', 'Haddad was excluded'],
    answer: 1,
    explain: '218 participants ÷ 1.3 ≈ 168 effective participants (85 + 83). Report both the randomized number and the adjustment in methods.',
  },
  {
    id: 'c-4', level: 3,
    stem: 'A reviewer asks why you did not rate down for imprecision. Best reply?',
    options: ['Because p < 0.05', 'Our target was any benefit; the 95% CI excludes no effect. Against an MID of 0.2 SMD we would rate down — stated in the SoF footnote', 'Imprecision only applies to binary outcomes', 'Because there were 8 trials'],
    answer: 1,
    explain: 'Core GRADE: imprecision is judged against the explicitly chosen target; make it transparent.',
  },
  {
    id: 'c-5', level: 2,
    stem: 'Which sentence belongs in the review’s “Limitations of the review process” (PRISMA 23c)?',
    options: ['“Most trials were unblinded.”', '“Searches were run 10 months before publication and one subject database was searched without its thesaurus.”', '“The effect was small.”', '“Exercise is cheap.”'],
    answer: 1,
    explain: '23b covers limitations of the evidence (e.g., unblinded trials); 23c covers your own process.',
  },
]
