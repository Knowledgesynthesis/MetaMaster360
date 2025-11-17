import { Citation } from '@/types'

// Synthetic citations for educational purposes
export const syntheticCitations: Citation[] = [
  {
    id: 'cit-001',
    title: 'Effectiveness of Cognitive Behavioral Therapy for Anxiety Disorders: A Meta-Analysis',
    authors: ['Smith J', 'Johnson A', 'Williams B'],
    year: 2022,
    journal: 'Journal of Clinical Psychology',
    abstract: 'This systematic review and meta-analysis evaluated the effectiveness of cognitive behavioral therapy (CBT) for anxiety disorders. Twenty-five randomized controlled trials (n=3,450) were included. Results showed a significant reduction in anxiety symptoms (SMD = -0.85, 95% CI: -1.12 to -0.58, I² = 67%). Subgroup analysis revealed larger effects for panic disorder compared to generalized anxiety disorder. Risk of bias assessment showed most studies had low to moderate risk. GRADE assessment indicated moderate certainty of evidence.',
    doi: '10.1234/jcp.2022.001',
    pmid: '12345678',
    studyType: 'Systematic Review'
  },
  {
    id: 'cit-002',
    title: 'Impact of Exercise on Depression: A Randomized Controlled Trial',
    authors: ['Chen L', 'Anderson K', 'Martinez R'],
    year: 2021,
    journal: 'American Journal of Psychiatry',
    abstract: 'Background: Depression is a leading cause of disability worldwide. This RCT examined the effects of structured exercise interventions on depressive symptoms. Methods: 240 adults with major depressive disorder were randomized to either a 12-week supervised exercise program or usual care. Results: The exercise group showed significant improvement in BDI-II scores (mean difference = -8.5, 95% CI: -11.2 to -5.8, p<0.001). Conclusion: Supervised exercise is an effective adjunct treatment for depression.',
    doi: '10.1234/ajp.2021.045',
    pmid: '23456789',
    studyType: 'RCT'
  },
  {
    id: 'cit-003',
    title: 'Mindfulness-Based Interventions for Chronic Pain: Systematic Review',
    authors: ['Thompson E', 'Garcia M', 'Lee S'],
    year: 2023,
    journal: 'Pain Medicine',
    abstract: 'Objective: To evaluate the efficacy of mindfulness-based interventions (MBIs) for chronic pain management. Methods: Comprehensive search of MEDLINE, Embase, and Cochrane databases. Eighteen studies (n=2,100) met inclusion criteria. Results: MBIs demonstrated moderate effects on pain intensity (SMD = -0.52, 95% CI: -0.75 to -0.29) and pain interference (SMD = -0.48, 95% CI: -0.68 to -0.28). Heterogeneity was substantial (I² = 72%). Conclusions: MBIs show promise for chronic pain, but more high-quality trials are needed.',
    doi: '10.1234/pm.2023.012',
    pmid: '34567890',
    studyType: 'Systematic Review'
  },
  {
    id: 'cit-004',
    title: 'Digital Health Interventions for Diabetes Self-Management: Meta-Analysis',
    authors: ['Patel N', 'Brown C', 'Davis K'],
    year: 2022,
    journal: 'Diabetes Care',
    abstract: 'This meta-analysis assessed the effectiveness of digital health interventions on glycemic control in type 2 diabetes. Thirty-two RCTs (n=4,820) were included. Pooled analysis showed a significant reduction in HbA1c (MD = -0.43%, 95% CI: -0.58 to -0.28, p<0.001, I² = 58%). Mobile app-based interventions showed larger effects than web-based programs. Quality of evidence was rated as moderate according to GRADE criteria.',
    doi: '10.1234/dc.2022.089',
    pmid: '45678901',
    studyType: 'Meta-Analysis'
  },
  {
    id: 'cit-005',
    title: 'Antidepressant Efficacy in Adolescent Depression: Network Meta-Analysis',
    authors: ['Wilson R', 'Taylor H', 'Moore J'],
    year: 2023,
    journal: 'JAMA Psychiatry',
    abstract: 'Importance: Treatment of adolescent depression requires careful consideration of efficacy and safety. Objective: To compare the efficacy and acceptability of different antidepressants. Design: Network meta-analysis of 45 RCTs (n=7,200). Results: Fluoxetine showed the best efficacy profile (SMD = -0.62, 95% CI: -0.85 to -0.39) with acceptable tolerability. Sertraline and escitalopram also showed favorable benefit-risk ratios. Certainty of evidence ranged from moderate to high.',
    doi: '10.1234/jamapsych.2023.034',
    pmid: '56789012',
    studyType: 'Network Meta-Analysis'
  },
  {
    id: 'cit-006',
    title: 'Omega-3 Fatty Acids for Cardiovascular Disease Prevention: Cochrane Review',
    authors: ['Anderson P', 'White L', 'Clark M'],
    year: 2021,
    journal: 'Cochrane Database of Systematic Reviews',
    abstract: 'Background: Omega-3 fatty acids have been proposed for cardiovascular disease prevention. Objectives: To assess effects of increased omega-3 intake on cardiovascular outcomes. Methods: Cochrane systematic review methodology. Seventy-nine trials (n=112,059) included. Results: Little or no effect on all-cause mortality (RR = 0.98, 95% CI: 0.93 to 1.03, I² = 0%, high certainty evidence) or cardiovascular events (RR = 0.99, 95% CI: 0.94 to 1.04, I² = 0%, high certainty evidence).',
    doi: '10.1002/14651858.CD003177.pub5',
    pmid: '67890123',
    studyType: 'Systematic Review'
  },
  {
    id: 'cit-007',
    title: 'Telemedicine for Chronic Disease Management: Umbrella Review',
    authors: ['Rodriguez A', 'Kim S', 'O\'Brien T'],
    year: 2023,
    journal: 'BMJ Open',
    abstract: 'Objective: To synthesize evidence from systematic reviews on telemedicine effectiveness for chronic disease management. Design: Umbrella review. Data sources: MEDLINE, Embase, Cochrane Library. Eligibility: Systematic reviews of telemedicine interventions. Results: Included 28 systematic reviews covering 450 primary studies. Telemedicine showed benefits for diabetes (HbA1c reduction), hypertension (blood pressure control), and COPD (reduced hospitalizations). Quality of included reviews varied (AMSTAR-2 scores: critically low to high).',
    doi: '10.1136/bmjopen-2023-012345',
    pmid: '78901234',
    studyType: 'Umbrella Review'
  },
  {
    id: 'cit-008',
    title: 'Sleep Interventions for Insomnia: Individual Patient Data Meta-Analysis',
    authors: ['Zhang Y', 'Murphy D', 'Singh K'],
    year: 2022,
    journal: 'Sleep Medicine Reviews',
    abstract: 'Context: Insomnia affects millions worldwide. Objective: To determine optimal components of behavioral sleep interventions using individual patient data (IPD). Methods: IPD meta-analysis of 22 RCTs (n=3,890 patients). Results: Sleep restriction and stimulus control were the most effective components (effect size = 0.91, 95% CI: 0.72 to 1.10). Multi-component interventions showed sustained benefits at 12-month follow-up. Older adults benefited more than younger participants.',
    doi: '10.1016/j.smrv.2022.012345',
    pmid: '89012345',
    studyType: 'IPD Meta-Analysis'
  },
  {
    id: 'cit-009',
    title: 'Vaccine Effectiveness Against Influenza: Living Systematic Review',
    authors: ['Hassan F', 'Nguyen T', 'Peterson R'],
    year: 2023,
    journal: 'The Lancet Infectious Diseases',
    abstract: 'Background: Influenza vaccine effectiveness varies by season and strain. This living systematic review continuously updates evidence. Methods: Monthly searches, rapid screening and data extraction. Results: Current analysis includes 156 studies. Overall vaccine effectiveness: 45% (95% CI: 40% to 50%) against laboratory-confirmed influenza. Effectiveness higher in children (52%) than adults (42%) or elderly (38%). Updated monthly with new evidence.',
    doi: '10.1016/S1473-3099(23)00123-4',
    pmid: '90123456',
    studyType: 'Living Systematic Review'
  },
  {
    id: 'cit-010',
    title: 'Mediterranean Diet and Cognitive Decline: Prospective Cohort Meta-Analysis',
    authors: ['Romano G', 'Schmidt J', 'Liu X'],
    year: 2021,
    journal: 'Neurology',
    abstract: 'Objective: To examine the association between Mediterranean diet adherence and cognitive decline. Methods: Meta-analysis of 12 prospective cohorts (n=34,168). Results: Higher Mediterranean diet adherence associated with reduced risk of cognitive impairment (RR = 0.79, 95% CI: 0.70 to 0.90, I² = 45%). Dose-response meta-analysis showed linear relationship. Sensitivity analyses excluding studies with high risk of bias confirmed findings.',
    doi: '10.1212/WNL.0000000000012345',
    pmid: '01234567',
    studyType: 'Meta-Analysis'
  }
]
