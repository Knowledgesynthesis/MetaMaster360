import { AssessmentQuestion } from '@/types'

export const mcqQuestions: AssessmentQuestion[] = [
  {
    id: 'mcq-001',
    type: 'mcq',
    module: 'pico',
    difficulty: 'beginner',
    question: 'In the PICO framework, what does the "I" stand for?',
    options: [
      'Investigation',
      'Intervention',
      'Indication',
      'Inclusion'
    ],
    correctAnswer: 'Intervention',
    rationale: 'The "I" in PICO stands for Intervention (or Exposure in observational studies). It represents the treatment, test, or exposure being evaluated.'
  },
  {
    id: 'mcq-002',
    type: 'mcq',
    module: 'pico',
    difficulty: 'intermediate',
    question: 'When should you use PEO instead of PICO?',
    options: [
      'For randomized controlled trials',
      'For intervention studies',
      'For observational and qualitative studies',
      'Only for diagnostic studies'
    ],
    correctAnswer: 'For observational and qualitative studies',
    rationale: 'PEO (Population, Exposure, Outcome) is more appropriate for observational studies, prognosis questions, and qualitative research where there is no formal intervention or comparison group.'
  },
  {
    id: 'mcq-003',
    type: 'mcq',
    module: 'rob',
    difficulty: 'intermediate',
    question: 'Which RoB tool should be used for randomized controlled trials?',
    options: [
      'ROBINS-I',
      'RoB 2',
      'QUADAS-2',
      'JBI Critical Appraisal'
    ],
    correctAnswer: 'RoB 2',
    rationale: 'RoB 2 (Risk of Bias tool version 2) is the Cochrane tool specifically designed for assessing risk of bias in randomized controlled trials. ROBINS-I is for non-randomized studies, QUADAS-2 for diagnostic accuracy studies.'
  },
  {
    id: 'mcq-004',
    type: 'mcq',
    module: 'meta-analysis',
    difficulty: 'intermediate',
    question: 'What does an I² value of 75% indicate?',
    options: [
      'Low heterogeneity',
      'Moderate heterogeneity',
      'Substantial to considerable heterogeneity',
      'No heterogeneity'
    ],
    correctAnswer: 'Substantial to considerable heterogeneity',
    rationale: 'According to Cochrane guidelines, I² values of 75-100% represent considerable heterogeneity. Values: 0-40% might not be important, 30-60% moderate, 50-90% substantial, 75-100% considerable.'
  },
  {
    id: 'mcq-005',
    type: 'mcq',
    module: 'meta-analysis',
    difficulty: 'advanced',
    question: 'When should you use a random-effects model instead of a fixed-effect model?',
    options: [
      'When heterogeneity is low (I² < 25%)',
      'When you have only 2-3 studies',
      'When there is substantial heterogeneity or studies differ in populations/interventions',
      'Random-effects should never be used'
    ],
    correctAnswer: 'When there is substantial heterogeneity or studies differ in populations/interventions',
    rationale: 'A random-effects model should be used when there is evidence of heterogeneity or when studies are expected to estimate different, but related, treatment effects (e.g., different populations, doses, or implementations). It accounts for both within-study and between-study variation.'
  },
  {
    id: 'mcq-006',
    type: 'mcq',
    module: 'grade',
    difficulty: 'beginner',
    question: 'What is the starting certainty rating for evidence from randomized trials in GRADE?',
    options: [
      'Very low',
      'Low',
      'Moderate',
      'High'
    ],
    correctAnswer: 'High',
    rationale: 'In GRADE, evidence from randomized controlled trials starts at "High" certainty and can be downgraded based on risk of bias, inconsistency, indirectness, imprecision, or publication bias. Observational studies start at "Low."'
  },
  {
    id: 'mcq-007',
    type: 'mcq',
    module: 'effect-size',
    difficulty: 'intermediate',
    question: 'When should you use SMD (Standardized Mean Difference) instead of MD (Mean Difference)?',
    options: [
      'When outcome is dichotomous',
      'When studies use different measurement scales for the same outcome',
      'Only for large sample sizes',
      'When studies use the same measurement scale'
    ],
    correctAnswer: 'When studies use different measurement scales for the same outcome',
    rationale: 'SMD is used when studies measure the same continuous outcome but use different measurement scales (e.g., different depression questionnaires). MD is used when all studies use the same scale.'
  },
  {
    id: 'mcq-008',
    type: 'mcq',
    module: 'search',
    difficulty: 'beginner',
    question: 'In Boolean search logic, what does the AND operator do?',
    options: [
      'Broadens the search by including either term',
      'Narrows the search by requiring both terms',
      'Excludes articles with certain terms',
      'Searches for exact phrases'
    ],
    correctAnswer: 'Narrows the search by requiring both terms',
    rationale: 'AND narrows a search by requiring that all terms joined by AND appear in the results. OR broadens by including either term, and NOT excludes terms.'
  },
  {
    id: 'mcq-009',
    type: 'mcq',
    module: 'screening',
    difficulty: 'intermediate',
    question: 'What is the recommended approach for screening in systematic reviews?',
    options: [
      'Single reviewer screens all articles',
      'Two independent reviewers with disagreements resolved by consensus',
      'Three reviewers vote on each article',
      'Automated software screening without human review'
    ],
    correctAnswer: 'Two independent reviewers with disagreements resolved by consensus',
    rationale: 'Best practice is dual independent screening with disagreements resolved through discussion or a third reviewer. This minimizes errors and bias while maintaining feasibility.'
  },
  {
    id: 'mcq-010',
    type: 'mcq',
    module: 'publication-bias',
    difficulty: 'intermediate',
    question: 'What does asymmetry in a funnel plot suggest?',
    options: [
      'High quality studies',
      'Low heterogeneity',
      'Possible publication bias or small-study effects',
      'Successful meta-analysis'
    ],
    correctAnswer: 'Possible publication bias or small-study effects',
    rationale: 'Asymmetry in a funnel plot may indicate publication bias (small negative studies missing) or small-study effects. However, asymmetry can also result from heterogeneity or chance, so interpret cautiously.'
  }
]

export const matchingActivities = [
  {
    id: 'match-001',
    title: 'Match Study Designs to RoB Tools',
    leftColumn: [
      { id: 'l1', text: 'Randomized Controlled Trial' },
      { id: 'l2', text: 'Cohort Study (non-randomized)' },
      { id: 'l3', text: 'Diagnostic Accuracy Study' },
      { id: 'l4', text: 'Cross-sectional Survey' }
    ],
    rightColumn: [
      { id: 'r1', text: 'RoB 2', matchId: 'l1' },
      { id: 'r2', text: 'ROBINS-I', matchId: 'l2' },
      { id: 'r3', text: 'QUADAS-2', matchId: 'l3' },
      { id: 'r4', text: 'JBI Critical Appraisal', matchId: 'l4' }
    ]
  },
  {
    id: 'match-002',
    title: 'Match Effect Measures to Outcome Types',
    leftColumn: [
      { id: 'l1', text: 'Continuous outcome, same scale' },
      { id: 'l2', text: 'Continuous outcome, different scales' },
      { id: 'l3', text: 'Binary outcome (events)' },
      { id: 'l4', text: 'Time-to-event outcome' }
    ],
    rightColumn: [
      { id: 'r1', text: 'Mean Difference (MD)', matchId: 'l1' },
      { id: 'r2', text: 'Standardized Mean Difference (SMD)', matchId: 'l2' },
      { id: 'r3', text: 'Risk Ratio (RR) or Odds Ratio (OR)', matchId: 'l3' },
      { id: 'r4', text: 'Hazard Ratio (HR)', matchId: 'l4' }
    ]
  },
  {
    id: 'match-003',
    title: 'Match GRADE Domains to Definitions',
    leftColumn: [
      { id: 'l1', text: 'Risk of Bias' },
      { id: 'l2', text: 'Inconsistency' },
      { id: 'l3', text: 'Indirectness' },
      { id: 'l4', text: 'Imprecision' }
    ],
    rightColumn: [
      { id: 'r1', text: 'Study limitations and methodological flaws', matchId: 'l1' },
      { id: 'r2', text: 'Unexplained heterogeneity across studies', matchId: 'l2' },
      { id: 'r3', text: 'Differences in populations, interventions, or outcomes', matchId: 'l3' },
      { id: 'r4', text: 'Wide confidence intervals or small sample sizes', matchId: 'l4' }
    ]
  }
]

export const screeningScenarios = [
  {
    id: 'screen-001',
    citation: {
      title: 'The Impact of Social Media Use on Mental Health in Adolescents: A Narrative Review',
      authors: 'Johnson A, Smith B',
      year: 2023,
      abstract: 'This narrative review discusses various perspectives on how social media affects adolescent mental health. The review includes opinion pieces, editorials, and selected studies without systematic methodology.'
    },
    picoCriteria: {
      population: 'Adults with depression',
      intervention: 'Cognitive behavioral therapy',
      comparison: 'Standard care',
      outcome: 'Depression symptoms'
    },
    correctDecision: 'exclude',
    correctReason: 'Wrong study design (narrative review, not systematic)',
    explanation: 'This is a narrative review without systematic methods. Systematic reviews should only include primary studies or systematic reviews with explicit methodology. Additionally, the population (adolescents) and intervention (social media) don\'t match the PICO criteria.'
  },
  {
    id: 'screen-002',
    citation: {
      title: 'Effectiveness of Cognitive Behavioral Therapy for Depression in Primary Care: A Randomized Controlled Trial',
      authors: 'Williams C, Brown D, Taylor E',
      year: 2022,
      abstract: 'Background: Depression is common in primary care. This RCT (n=240) compared CBT delivered by trained therapists versus standard medication management in adults with moderate-to-severe depression. Methods: Participants were randomized 1:1. Primary outcome was change in BDI-II at 12 weeks. Results: CBT showed significant improvement (MD = -8.5, 95% CI: -11.2 to -5.8, p<0.001).'
    },
    picoCriteria: {
      population: 'Adults with depression',
      intervention: 'Cognitive behavioral therapy',
      comparison: 'Standard care',
      outcome: 'Depression symptoms'
    },
    correctDecision: 'include',
    correctReason: 'Matches all PICO criteria',
    explanation: 'This study matches all PICO elements: adult population with depression (P), CBT intervention (I), compared to standard care (C), measuring depression symptoms with a validated tool (O). It is also a high-quality study design (RCT).'
  },
  {
    id: 'screen-003',
    citation: {
      title: 'Mindfulness-Based Stress Reduction for Anxiety: A Pilot Study',
      authors: 'Garcia M, Lee S, Chen L',
      year: 2021,
      abstract: 'This pilot study (n=15) examined the feasibility of mindfulness-based stress reduction in adults with anxiety disorders. Preliminary results showed reduced anxiety scores.'
    },
    picoCriteria: {
      population: 'Adults with depression',
      intervention: 'Cognitive behavioral therapy',
      comparison: 'Standard care',
      outcome: 'Depression symptoms'
    },
    correctDecision: 'exclude',
    correctReason: 'Wrong intervention and wrong population',
    explanation: 'While this is a potentially relevant study design, it examines mindfulness (not CBT) for anxiety (not depression). It should be excluded as it doesn\'t match the PICO criteria for intervention or population.'
  }
]

export const effectSizeCalculations = [
  {
    id: 'calc-001',
    scenario: 'Continuous Outcome - Mean Difference',
    description: 'A study reports the following data for blood pressure reduction:',
    data: {
      intervention: { mean: 135, sd: 12, n: 50 },
      control: { mean: 145, sd: 15, n: 50 }
    },
    question: 'Calculate the Mean Difference (MD)',
    correctAnswer: '-10',
    unit: 'mmHg',
    explanation: 'MD = Mean(Intervention) - Mean(Control) = 135 - 145 = -10 mmHg. The negative value indicates blood pressure decreased more in the intervention group (favorable outcome).'
  },
  {
    id: 'calc-002',
    scenario: 'Dichotomous Outcome - Risk Ratio',
    description: 'A trial of a new medication reports:',
    data: {
      intervention: { events: 20, total: 100 },
      control: { events: 40, total: 100 }
    },
    question: 'Calculate the Risk Ratio (RR)',
    correctAnswer: '0.50',
    explanation: 'Risk in intervention = 20/100 = 0.20. Risk in control = 40/100 = 0.40. RR = 0.20/0.40 = 0.50. An RR of 0.50 means the intervention group has half the risk of the outcome compared to control.'
  }
]
