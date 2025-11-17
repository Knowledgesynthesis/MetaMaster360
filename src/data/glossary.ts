import { GlossaryTerm } from '@/types'

export const glossaryTerms: GlossaryTerm[] = [
  {
    term: 'Systematic Review',
    definition: 'A type of literature review that uses systematic methods to collect secondary data, critically appraise research studies, and synthesize findings qualitatively or quantitatively',
    category: 'Core Concepts',
    relatedTerms: ['Meta-Analysis', 'PRISMA', 'Evidence Synthesis']
  },
  {
    term: 'Meta-Analysis',
    definition: 'A statistical technique that combines the results of multiple studies addressing a similar research question to produce a single pooled estimate of effect',
    category: 'Core Concepts',
    relatedTerms: ['Forest Plot', 'Effect Size', 'Heterogeneity']
  },
  {
    term: 'PICO',
    definition: 'A framework for formulating clinical research questions: Population, Intervention, Comparison, Outcome',
    category: 'Question Formulation',
    relatedTerms: ['PEO', 'Research Question', 'Eligibility Criteria']
  },
  {
    term: 'PRISMA',
    definition: 'Preferred Reporting Items for Systematic Reviews and Meta-Analyses - a reporting guideline to improve transparency and completeness of systematic reviews',
    category: 'Reporting Standards',
    relatedTerms: ['PRISMA Flow Diagram', 'Reporting Guidelines']
  },
  {
    term: 'PROSPERO',
    definition: 'International prospective register of systematic reviews. Registration helps reduce publication bias and prevents duplicate reviews',
    category: 'Protocol',
    relatedTerms: ['Protocol', 'Registration']
  },
  {
    term: 'Effect Size',
    definition: 'A quantitative measure of the magnitude of the relationship or difference between groups',
    category: 'Statistics',
    relatedTerms: ['SMD', 'MD', 'RR', 'OR', 'HR']
  },
  {
    term: 'SMD',
    definition: 'Standardized Mean Difference - used when studies measure the same outcome using different scales. Calculated by dividing the mean difference by the pooled standard deviation',
    category: 'Effect Measures',
    relatedTerms: ['Effect Size', 'Cohen\'s d', 'Hedges\' g']
  },
  {
    term: 'MD',
    definition: 'Mean Difference - the absolute difference between the mean values in two groups, used when outcomes are measured on the same scale',
    category: 'Effect Measures',
    relatedTerms: ['SMD', 'Continuous Outcomes']
  },
  {
    term: 'RR',
    definition: 'Risk Ratio (Relative Risk) - the ratio of the probability of an event occurring in the exposed group versus the control group',
    category: 'Effect Measures',
    relatedTerms: ['OR', 'Dichotomous Outcomes']
  },
  {
    term: 'OR',
    definition: 'Odds Ratio - the ratio of the odds of an event in one group to the odds in another group',
    category: 'Effect Measures',
    relatedTerms: ['RR', 'Logistic Regression']
  },
  {
    term: 'HR',
    definition: 'Hazard Ratio - a measure of how often a particular event happens in one group compared to another over time',
    category: 'Effect Measures',
    relatedTerms: ['Time-to-Event', 'Survival Analysis']
  },
  {
    term: 'Heterogeneity',
    definition: 'Variability or differences between studies in a meta-analysis. Can be clinical, methodological, or statistical',
    category: 'Statistics',
    relatedTerms: ['I²', 'τ²', 'Q statistic']
  },
  {
    term: 'I²',
    definition: 'A statistic that describes the percentage of variation across studies due to heterogeneity rather than chance. Values: 0-40% (might not be important), 30-60% (moderate), 50-90% (substantial), 75-100% (considerable)',
    category: 'Statistics',
    relatedTerms: ['Heterogeneity', 'τ²']
  },
  {
    term: 'τ²',
    definition: 'Tau-squared - the variance of the true effect sizes in a random-effects meta-analysis',
    category: 'Statistics',
    relatedTerms: ['Heterogeneity', 'I²', 'Random-Effects Model']
  },
  {
    term: 'Forest Plot',
    definition: 'A graphical display of the results of individual studies and their meta-analysis, showing effect estimates and confidence intervals',
    category: 'Visualization',
    relatedTerms: ['Meta-Analysis', 'Confidence Interval']
  },
  {
    term: 'Funnel Plot',
    definition: 'A scatter plot used to detect publication bias in meta-analyses, plotting effect size against measure of study precision',
    category: 'Visualization',
    relatedTerms: ['Publication Bias', 'Egger Test', 'Asymmetry']
  },
  {
    term: 'Fixed-Effect Model',
    definition: 'A meta-analysis model assuming all studies estimate the same true effect size, with differences due only to sampling error',
    category: 'Statistical Models',
    relatedTerms: ['Random-Effects Model', 'Meta-Analysis']
  },
  {
    term: 'Random-Effects Model',
    definition: 'A meta-analysis model that assumes true effect sizes vary between studies, accounting for both within-study and between-study variation',
    category: 'Statistical Models',
    relatedTerms: ['Fixed-Effect Model', 'Heterogeneity']
  },
  {
    term: 'RoB 2',
    definition: 'Revised Cochrane risk-of-bias tool for randomized trials, assessing bias across five domains',
    category: 'Risk of Bias',
    relatedTerms: ['Risk of Bias', 'Critical Appraisal', 'ROBINS-I']
  },
  {
    term: 'ROBINS-I',
    definition: 'Risk Of Bias In Non-randomized Studies of Interventions - a tool for evaluating bias in non-randomized studies',
    category: 'Risk of Bias',
    relatedTerms: ['RoB 2', 'Non-Randomized Studies']
  },
  {
    term: 'GRADE',
    definition: 'Grading of Recommendations Assessment, Development and Evaluation - a systematic approach to rating the certainty of evidence',
    category: 'Evidence Quality',
    relatedTerms: ['Certainty of Evidence', 'Quality of Evidence']
  },
  {
    term: 'Publication Bias',
    definition: 'The selective publication of studies based on their results, typically favoring statistically significant positive findings',
    category: 'Bias',
    relatedTerms: ['Funnel Plot', 'File Drawer Problem', 'Reporting Bias']
  },
  {
    term: 'Sensitivity Analysis',
    definition: 'Analyses conducted to assess the robustness of results to changes in methods or assumptions',
    category: 'Analysis Methods',
    relatedTerms: ['Subgroup Analysis', 'Meta-Regression']
  },
  {
    term: 'Subgroup Analysis',
    definition: 'Analysis comparing effect sizes across different subgroups to explore sources of heterogeneity',
    category: 'Analysis Methods',
    relatedTerms: ['Heterogeneity', 'Sensitivity Analysis']
  },
  {
    term: 'Confidence Interval',
    definition: 'A range of values that is likely to contain the true population parameter with a specified level of confidence (typically 95%)',
    category: 'Statistics',
    relatedTerms: ['p-value', 'Statistical Significance']
  }
]
