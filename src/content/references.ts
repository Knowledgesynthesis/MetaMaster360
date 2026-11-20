import type { Reference } from './types'

/** Canonical sources. Every factual claim in the modules should trace to one of these. */
export const REFS = {
  handbook: {
    cite: 'Higgins JPT, Thomas J, Chandler J, et al (eds). Cochrane Handbook for Systematic Reviews of Interventions, version 6.5. Cochrane, 2024.',
    url: 'https://www.cochrane.org/authors/handbooks-and-manuals/handbook/current',
    note: 'The methodological reference for intervention reviews. Chapter numbers cited throughout this app refer to v6.5.',
  },
  prisma2020: {
    cite: 'Page MJ, McKenzie JE, Bossuyt PM, et al. The PRISMA 2020 statement: an updated guideline for reporting systematic reviews. BMJ 2021;372:n71.',
    url: 'https://doi.org/10.1136/bmj.n71',
  },
  prisma2020ee: {
    cite: 'Page MJ, Moher D, Bossuyt PM, et al. PRISMA 2020 explanation and elaboration: updated guidance and exemplars for reporting systematic reviews. BMJ 2021;372:n160.',
    url: 'https://doi.org/10.1136/bmj.n160',
  },
  prismaP: {
    cite: 'Shamseer L, Moher D, Clarke M, et al. Preferred reporting items for systematic review and meta-analysis protocols (PRISMA-P) 2015: elaboration and explanation. BMJ 2015;349:g7647.',
    url: 'https://doi.org/10.1136/bmj.g7647',
  },
  prismaS: {
    cite: 'Rethlefsen ML, Kirtley S, Waffenschmidt S, et al. PRISMA-S: an extension to the PRISMA statement for reporting literature searches in systematic reviews. Syst Rev 2021;10:39.',
    url: 'https://doi.org/10.1186/s13643-020-01542-z',
  },
  prismaLSR: {
    cite: 'Akl EA, et al. Extension of the PRISMA 2020 statement for living systematic reviews (PRISMA-LSR): checklist and explanation. BMJ 2024;387:e079183.',
    url: 'https://doi.org/10.1136/bmj-2024-079183',
  },
  prismaC: {
    cite: 'Baba A, et al. PRISMA-Children and Adolescents (PRISMA-C) 2026 extension statement and explanation: enhancing the reporting and utility of systematic reviews of interventions in paediatrics. BMJ 2026;393:e088561.',
    url: 'https://doi.org/10.1136/bmj-2025-088561',
  },
  prismaScR: {
    cite: 'Tricco AC, Lillie E, Zarin W, et al. PRISMA Extension for Scoping Reviews (PRISMA-ScR): checklist and explanation. Ann Intern Med 2018;169:467–473.',
    url: 'https://doi.org/10.7326/M18-0850',
  },
  prismaNMA: {
    cite: 'Hutton B, Salanti G, Caldwell DM, et al. The PRISMA extension statement for reporting of systematic reviews incorporating network meta-analyses of health care interventions. Ann Intern Med 2015;162:777–784.',
    url: 'https://doi.org/10.7326/M14-2385',
  },
  press: {
    cite: 'McGowan J, Sampson M, Salzwedel DM, et al. PRESS Peer Review of Electronic Search Strategies: 2015 guideline statement. J Clin Epidemiol 2016;75:40–46.',
    url: 'https://doi.org/10.1016/j.jclinepi.2016.01.021',
  },
  tarcis: {
    cite: 'Hirt J, et al. Guidance on terminology, application, and reporting of citation searching: the TARCiS statement. BMJ 2024;385:e078384.',
    url: 'https://doi.org/10.1136/bmj-2023-078384',
  },
  prospero: {
    cite: 'PROSPERO: International prospective register of systematic reviews. Centre for Reviews and Dissemination, University of York (new platform launched 2025).',
    url: 'https://www.crd.york.ac.uk/prospero/',
  },
  gartlehner2020: {
    cite: 'Gartlehner G, Affengruber L, Titscher V, et al. Single-reviewer abstract screening missed 13 percent of relevant studies: a crowd-based, randomized controlled trial. J Clin Epidemiol 2020;121:20–28.',
    url: 'https://doi.org/10.1016/j.jclinepi.2020.01.005',
  },
  buscemi2006: {
    cite: 'Buscemi N, Hartling L, Vandermeer B, et al. Single data extraction generated more errors than double data extraction in systematic reviews. J Clin Epidemiol 2006;59:697–703.',
    url: 'https://doi.org/10.1016/j.jclinepi.2005.11.010',
  },
  wan2014: {
    cite: 'Wan X, Wang W, Liu J, Tong T. Estimating the sample mean and standard deviation from the sample size, median, range and/or interquartile range. BMC Med Res Methodol 2014;14:135.',
    url: 'https://doi.org/10.1186/1471-2288-14-135',
  },
  luo2018: {
    cite: 'Luo D, Wan X, Liu J, Tong T. Optimally estimating the sample mean from the sample size, median, mid-range, and/or mid-quartile range. Stat Methods Med Res 2018;27:1785–1805.',
    url: 'https://doi.org/10.1177/0962280216669183',
  },
  rob2: {
    cite: 'Sterne JAC, Savović J, Page MJ, et al. RoB 2: a revised tool for assessing risk of bias in randomised trials. BMJ 2019;366:l4898.',
    url: 'https://doi.org/10.1136/bmj.l4898',
  },
  robinsI: {
    cite: 'Sterne JA, Hernán MA, Reeves BC, et al. ROBINS-I: a tool for assessing risk of bias in non-randomised studies of interventions. BMJ 2016;355:i4919.',
    url: 'https://doi.org/10.1136/bmj.i4919',
  },
  robinsIv2: {
    cite: 'ROBINS-I V2 (revised draft posted 20 November 2025). riskofbias.info.',
    url: 'https://www.riskofbias.info/welcome/robins-i-v2',
    note: 'Still labelled a draft by its developers; check the site for the current version before use.',
  },
  robinsE: {
    cite: 'Higgins JPT, et al. A tool to assess risk of bias in non-randomized follow-up studies of exposure effects (ROBINS-E). Environ Int 2024;186:108602.',
    url: 'https://doi.org/10.1016/j.envint.2024.108602',
  },
  quadas2: {
    cite: 'Whiting PF, Rutjes AWS, Westwood ME, et al. QUADAS-2: a revised tool for the quality assessment of diagnostic accuracy studies. Ann Intern Med 2011;155:529–536.',
    url: 'https://doi.org/10.7326/0003-4819-155-8-201110180-00009',
  },
  probastAI: {
    cite: 'Moons KGM, et al. PROBAST+AI: an updated quality, risk of bias, and applicability assessment tool for prediction models using regression or artificial intelligence methods. BMJ 2025;388:e082505.',
    url: 'https://doi.org/10.1136/bmj-2024-082505',
  },
  amstar2: {
    cite: 'Shea BJ, Reeves BC, Wells G, et al. AMSTAR 2: a critical appraisal tool for systematic reviews that include randomised or non-randomised studies of healthcare interventions, or both. BMJ 2017;358:j4008.',
    url: 'https://doi.org/10.1136/bmj.j4008',
  },
  robme: {
    cite: 'Page MJ, Sterne JAC, Boutron I, et al. ROB-ME: a tool for assessing risk of bias due to missing evidence in systematic reviews with meta-analysis. BMJ 2023;383:e076754.',
    url: 'https://doi.org/10.1136/bmj-2023-076754',
  },
  reExplainer: {
    cite: 'Cochrane Methods. New random-effects methods in RevMan: explainer for authors (REML default; HKSJ when τ² > 0 and k > 2; prediction intervals). Cochrane, 2025.',
    url: 'https://resources.cochrane.org/sites/resources.cochrane.org/files/uploads/methods/news/final_-re-methods-explainer.pdf',
  },
  veroniki2016: {
    cite: 'Veroniki AA, Jackson D, Viechtbauer W, et al. Methods to estimate the between-study variance and its uncertainty in meta-analysis. Res Synth Methods 2016;7:55–79.',
    url: 'https://doi.org/10.1002/jrsm.1164',
  },
  veroniki2019: {
    cite: 'Veroniki AA, Jackson D, Bender R, et al. Methods to calculate uncertainty in the estimated overall effect size from a random-effects meta-analysis. Res Synth Methods 2019;10:23–43.',
    url: 'https://doi.org/10.1002/jrsm.1319',
  },
  inthout2014: {
    cite: 'IntHout J, Ioannidis JPA, Borm GF. The Hartung-Knapp-Sidik-Jonkman method for random effects meta-analysis is straightforward and considerably outperforms the standard DerSimonian-Laird method. BMC Med Res Methodol 2014;14:25.',
    url: 'https://doi.org/10.1186/1471-2288-14-25',
  },
  higgins2009: {
    cite: 'Higgins JPT, Thompson SG, Spiegelhalter DJ. A re-evaluation of random-effects meta-analysis. J R Stat Soc Ser A 2009;172:137–159.',
    url: 'https://doi.org/10.1111/j.1467-985X.2008.00552.x',
  },
  inthout2016: {
    cite: 'IntHout J, Ioannidis JPA, Rovers MM, Goeman JJ. Plea for routinely presenting prediction intervals in meta-analysis. BMJ Open 2016;6:e010247.',
    url: 'https://doi.org/10.1136/bmjopen-2015-010247',
  },
  higgins2003: {
    cite: 'Higgins JPT, Thompson SG, Deeks JJ, Altman DG. Measuring inconsistency in meta-analyses. BMJ 2003;327:557–560.',
    url: 'https://doi.org/10.1136/bmj.327.7414.557',
  },
  borenstein2017: {
    cite: 'Borenstein M, Higgins JPT, Hedges LV, Rothstein HR. Basics of meta-analysis: I² is not an absolute measure of heterogeneity. Res Synth Methods 2017;8:5–18.',
    url: 'https://doi.org/10.1002/jrsm.1230',
  },
  iceman: {
    cite: 'Schandelmaier S, Briel M, Varadhan R, et al. Development of the Instrument to assess the Credibility of Effect Modification Analyses (ICEMAN) in randomized controlled trials and meta-analyses. CMAJ 2020;192:E901–E906.',
    url: 'https://doi.org/10.1503/cmaj.200077',
  },
  egger1997: {
    cite: 'Egger M, Davey Smith G, Schneider M, Minder C. Bias in meta-analysis detected by a simple, graphical test. BMJ 1997;315:629–634.',
    url: 'https://doi.org/10.1136/bmj.315.7109.629',
  },
  sterne2011: {
    cite: 'Sterne JAC, Sutton AJ, Ioannidis JPA, et al. Recommendations for examining and interpreting funnel plot asymmetry in meta-analyses of randomised controlled trials. BMJ 2011;343:d4002.',
    url: 'https://doi.org/10.1136/bmj.d4002',
  },
  peters2008: {
    cite: 'Peters JL, Sutton AJ, Jones DR, et al. Contour-enhanced meta-analysis funnel plots help distinguish publication bias from other causes of asymmetry. J Clin Epidemiol 2008;61:991–996.',
    url: 'https://doi.org/10.1016/j.jclinepi.2007.11.010',
  },
  swim: {
    cite: 'Campbell M, McKenzie JE, Sowden A, et al. Synthesis without meta-analysis (SWiM) in systematic reviews: reporting guideline. BMJ 2020;368:l6890.',
    url: 'https://doi.org/10.1136/bmj.l6890',
  },
  coreGrade1: {
    cite: 'Guyatt G, et al. Core GRADE 1: overview of the Core GRADE approach. BMJ 2025;389:e081903.',
    url: 'https://doi.org/10.1136/bmj-2024-081903',
  },
  coreGrade2: {
    cite: 'Guyatt G, et al. Core GRADE 2: choosing the target of certainty rating and assessing imprecision. BMJ 2025;389:e081904.',
    url: 'https://doi.org/10.1136/bmj-2024-081904',
  },
  coreGrade3: {
    cite: 'Guyatt G, et al. Core GRADE 3: rating certainty of evidence—assessing inconsistency. BMJ 2025;389:e081905.',
    url: 'https://doi.org/10.1136/bmj-2024-081905',
  },
  coreGrade4: {
    cite: 'Guyatt G, et al. Core GRADE 4: rating certainty of evidence—risk of bias, publication bias, and reasons for rating up certainty. BMJ 2025;389:e083864.',
    url: 'https://doi.org/10.1136/bmj-2024-083864',
  },
  gradeHandbook: {
    cite: 'Schünemann H, Brożek J, Guyatt G, Oxman A (eds). GRADE Handbook. GRADE Working Group, updated 2013.',
    url: 'https://gdt.gradepro.org/app/handbook/handbook.html',
  },
  grade6: {
    cite: 'Guyatt GH, Oxman AD, Kunz R, et al. GRADE guidelines 6. Rating the quality of evidence—imprecision. J Clin Epidemiol 2011;64:1283–1293.',
    url: 'https://doi.org/10.1016/j.jclinepi.2011.01.012',
  },
  grade26: {
    cite: 'Santesso N, Glenton C, Dahm P, et al. GRADE guidelines 26: informative statements to communicate the findings of systematic reviews of interventions. J Clin Epidemiol 2020;119:126–135.',
    url: 'https://doi.org/10.1016/j.jclinepi.2019.10.014',
  },
  cinema: {
    cite: 'Nikolakopoulou A, Higgins JPT, Papakonstantinou T, et al. CINeMA: an approach for assessing confidence in the results of a network meta-analysis. PLoS Med 2020;17:e1003082.',
    url: 'https://doi.org/10.1371/journal.pmed.1003082',
  },
  dtaHandbook: {
    cite: 'Deeks JJ, Bossuyt PM, Leeflang MM, Takwoingi Y (eds). Cochrane Handbook for Systematic Reviews of Diagnostic Test Accuracy, version 2.0. Cochrane, 2023.',
    url: 'https://training.cochrane.org/handbook-diagnostic-test-accuracy',
  },
  rapid2024: {
    cite: 'Garritty C, et al. Updated recommendations for the Cochrane rapid review methods guidance for rapid reviews of effectiveness. BMJ 2024;384:e076335.',
    url: 'https://doi.org/10.1136/bmj-2023-076335',
  },
  jbiScoping: {
    cite: 'Peters MDJ, Marnie C, Tricco AC, et al. Updated methodological guidance for the conduct of scoping reviews. JBI Evid Synth 2020;18:2119–2126.',
    url: 'https://doi.org/10.11124/JBIES-20-00167',
  },
  cerqual: {
    cite: 'Lewin S, Booth A, Glenton C, et al. Applying GRADE-CERQual to qualitative evidence synthesis findings: introduction to the series. Implement Sci 2018;13(Suppl 1):2.',
    url: 'https://doi.org/10.1186/s13012-017-0688-3',
  },
  aiPosition2025: {
    cite: 'Cochrane, the Campbell Collaboration, JBI and the Collaboration for Environmental Evidence. Position statement on artificial intelligence (AI) use in evidence synthesis, 2025 (endorses the RAISE recommendations).',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12594113/',
  },
  asreview: {
    cite: 'van de Schoot R, de Bruin J, Schram R, et al. An open source machine learning framework for efficient and transparent systematic reviews. Nat Mach Intell 2021;3:125–133.',
    url: 'https://doi.org/10.1038/s42256-020-00287-7',
  },
  spin: {
    cite: 'Yavchitz A, Ravaud P, Altman DG, et al. A new classification of spin in systematic reviews and meta-analyses was developed and ranked according to the severity. J Clin Epidemiol 2016;75:56–65.',
    url: 'https://doi.org/10.1016/j.jclinepi.2016.01.020',
  },
  altman1995: {
    cite: 'Altman DG, Bland JM. Absence of evidence is not evidence of absence. BMJ 1995;311:485.',
    url: 'https://doi.org/10.1136/bmj.311.7003.485',
  },
  chinn2000: {
    cite: 'Chinn S. A simple method for converting an odds ratio to effect size for use in meta-analysis. Stat Med 2000;19:3127–3131.',
    url: 'https://doi.org/10.1002/1097-0258(20001130)19:22<3127::AID-SIM784>3.0.CO;2-M',
  },
  tramer1997: {
    cite: 'Tramèr MR, Reynolds DJM, Moore RA, McQuay HJ. Impact of covert duplicate publication on meta-analysis: a case study. BMJ 1997;315:635–640.',
    url: 'https://doi.org/10.1136/bmj.315.7109.635',
  },
  juni1999: {
    cite: 'Jüni P, Witschi A, Bloch R, Egger M. The hazards of scoring the quality of clinical trials for meta-analysis. JAMA 1999;282:1054–1060.',
    url: 'https://doi.org/10.1001/jama.282.11.1054',
  },
  colditz1994: {
    cite: 'Colditz GA, Brewer TF, Berkey CS, et al. Efficacy of BCG vaccine in the prevention of tuberculosis: meta-analysis of the published literature. JAMA 1994;271:698–702.',
    url: 'https://doi.org/10.1001/jama.1994.03510330076038',
    note: 'Real dataset of 13 trials, used here to validate the engine against published metafor results.',
  },
} satisfies Record<string, Reference>

export type RefKey = keyof typeof REFS
