import type { QuizQuestion } from '../types'

export const protocol: QuizQuestion[] = [
  {
    id: 'p-1', level: 1,
    stem: 'What is the main methodological purpose of publishing a review protocol before the review is done?',
    options: [
      'To guarantee acceptance by a journal',
      'To fix and make public the planned methods so that data-driven changes and selective reporting can be detected',
      'To avoid having to search trial registers',
      'To allow single-reviewer screening',
    ],
    answer: 1,
    explain: 'Pre-specification plus public registration lets readers compare plan and report; it deters and reveals post-hoc decisions. It also reduces unintended duplication.',
  },
  {
    id: 'p-2', level: 1,
    stem: 'When should a systematic review ideally be registered?',
    options: ['After the meta-analysis', 'After data extraction but before writing', 'Before screening against eligibility criteria begins', 'At submission to a journal'],
    answer: 2,
    explain: 'Registration protects against bias only if it precedes contact with study results; the standard advice is before screening starts.',
  },
  {
    id: 'p-3', level: 1,
    stem: 'Where would you register a scoping review protocol?',
    options: ['PROSPERO', 'OSF Registries', 'ClinicalTrials.gov', 'It cannot be registered'],
    answer: 1,
    explain: 'PROSPERO does not accept scoping reviews. OSF Registries (or a published protocol) is the usual route.',
  },
  {
    id: 'p-4', level: 2,
    stem: 'A protocol states: “A random-effects model will be used if I² exceeds 50%, otherwise fixed-effect.” What is the main problem?',
    options: [
      'Nothing — this is the Cochrane rule',
      'Model choice should rest on whether studies are assumed to share one true effect and be pre-specified, not be triggered by a heterogeneity statistic',
      'I² cannot exceed 50%',
      'Fixed-effect models are not allowed in Cochrane reviews',
    ],
    answer: 1,
    explain: 'The Handbook discourages choosing the model from a heterogeneity test or statistic. I² also depends on study precision, making such rules unstable.',
  },
  {
    id: 'p-5', level: 2,
    stem: 'Trials report depression on HAM-D, MADRS and BDI-II, sometimes all three. What should the protocol contain?',
    options: [
      'Nothing; extract whichever shows the largest effect',
      'A pre-specified hierarchy for choosing one result per study (and a time-point rule)',
      'A plan to include all three from each trial in the same meta-analysis',
      'An instruction to exclude trials with multiple scales',
    ],
    answer: 1,
    explain: 'Choosing among multiple eligible results after seeing them is selective inclusion. A hierarchy decided in advance prevents it; including several results per study double-counts participants.',
  },
  {
    id: 'p-6', level: 2,
    stem: 'Which subgroup plan best meets current credibility criteria (ICEMAN)?',
    options: [
      '“We will explore subgroups as appropriate.”',
      'Twelve subgroups covering every reported characteristic',
      'Two subgroups, each with a pre-specified expected direction and a biological or clinical rationale',
      'Subgroups chosen after seeing which studies differ most',
    ],
    answer: 2,
    explain: 'Credible effect modification is more likely when hypotheses are few, pre-specified, directional and grounded in rationale.',
  },
  {
    id: 'p-7', level: 3,
    stem: 'Midway through, you switch the primary outcome from symptom score to response rate because few trials reported symptom scores. What is the best approach?',
    options: [
      'Change it silently — the reason is valid',
      'Record and report the amendment with date and reason, update the registration, and still report the original outcome where possible',
      'Abandon the review',
      'Keep the original outcome but exclude trials not reporting it',
    ],
    answer: 1,
    explain: 'Changes are legitimate when justified, but must be transparent (PRISMA item 24c). Presenting the originally planned outcome too shows the change did not drive conclusions.',
  },
]
