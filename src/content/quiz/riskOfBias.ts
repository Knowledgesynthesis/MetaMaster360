import type { QuizQuestion } from '../types'

export const riskOfBias: QuizQuestion[] = [
  {
    id: 'b-1', level: 1,
    stem: 'At what level is risk of bias assessed with RoB 2?',
    options: ['Per journal', 'Per study, once for all outcomes', 'Per result (a specific outcome at a time point)', 'Per meta-analysis only'],
    answer: 2,
    explain: 'Blinding, missing data and selective reporting can differ across outcomes of the same trial, so RoB 2 judges each result.',
  },
  {
    id: 'b-2', level: 1,
    stem: 'Participants were allocated by alternation (odd/even registration numbers). Domain 1 judgement?',
    options: ['Low risk', 'Some concerns', 'High risk', 'Not applicable'],
    answer: 2,
    explain: 'Alternation cannot be concealed (1.2 = N), which leads directly to high risk in the RoB 2 algorithm.',
  },
  {
    id: 'b-3', level: 2,
    stem: 'An unblinded trial measures depressive symptoms with a self-completed questionnaire. What is the most defensible domain 4 judgement?',
    options: ['Always low risk', 'At least some concerns, and high if knowledge of allocation was likely to influence responses', 'Not assessable', 'Domain 4 does not apply to self-report'],
    answer: 1,
    explain: 'For self-report the participant is the assessor. If aware of allocation, assessment could be influenced (some concerns); if likely influenced, high.',
  },
  {
    id: 'b-4', level: 1,
    stem: 'A trial is low risk in four RoB 2 domains and high risk in one. Overall judgement?',
    options: ['Low', 'Some concerns', 'High', 'Average of the domains'],
    answer: 2,
    explain: 'Overall risk of bias is high if any domain is high.',
  },
  {
    id: 'b-5', level: 2,
    stem: 'Which tool fits a cohort study comparing outcomes in people who started statins versus those who did not?',
    options: ['RoB 2', 'ROBINS-I', 'QUADAS-2', 'AMSTAR 2'],
    answer: 1,
    explain: 'Statin initiation is an intervention studied non-randomly: ROBINS-I (V2 is the revised draft). ROBINS-E is for exposures not chosen as interventions (e.g., air pollution).',
  },
  {
    id: 'b-6', level: 2,
    stem: 'Why are summary quality scores discouraged?',
    options: ['They take too long', 'They weight items arbitrarily; different scales can classify the same trials oppositely', 'Cochrane forbids numbers', 'They ignore sample size'],
    answer: 1,
    explain: 'Jüni et al. (1999) showed that conclusions about the association of “quality” with effects depended on which of 25 scales was used.',
  },
  {
    id: 'b-7', level: 2,
    stem: '41% of control participants are missing versus 21% of the exercise group, and control dropouts were “feeling worse”. Domain 3?',
    options: ['Low', 'Some concerns', 'High', 'No information'],
    answer: 2,
    explain: 'Substantial missingness that likely depends on the true outcome (worsening) makes bias likely: high risk.',
  },
  {
    id: 'b-8', level: 3,
    stem: 'The registry lists BDI-II as primary outcome, but the paper reports PHQ-9 as primary and says BDI-II was “also collected”. Domain 5?',
    options: ['Low — PHQ-9 is validated', 'Some concerns', 'High — the result was likely selected from multiple eligible measurements', 'Not applicable to registered trials'],
    answer: 2,
    explain: 'Reporting one of several eligible measures in a way that may depend on results is the core of domain 5 (5.2 = Y/PY → high).',
  },
]
