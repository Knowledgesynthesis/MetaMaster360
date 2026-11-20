import type { ModuleId, ModuleMeta, Phase } from './types'

export const PHASES: { id: Phase; label: string; blurb: string }[] = [
  { id: 'Plan', label: 'Plan', blurb: 'Ask an answerable question and lock the methods before seeing the data.' },
  { id: 'Find', label: 'Find', blurb: 'Search exhaustively, manage records, and select studies reproducibly.' },
  { id: 'Appraise', label: 'Extract & appraise', blurb: 'Get the right numbers out and judge how far to trust each result.' },
  { id: 'Synthesize', label: 'Synthesize', blurb: 'Combine results, explain variation, and check for missing evidence.' },
  { id: 'Conclude', label: 'Conclude & report', blurb: 'Rate certainty, present absolute effects, and report transparently.' },
  { id: 'Extend', label: 'Go further', blurb: 'Specialised review types, AI tools, and an end-to-end capstone.' },
]

export const MODULES: ModuleMeta[] = [
  {
    id: 'question', n: 1, phase: 'Plan', title: 'Framing the review question', short: 'Question',
    summary: 'Turn a clinical uncertainty into a structured question (PICO, PECO, PCC, SPIDER) and choose the right type of review.',
    minutes: 25,
    objectives: [
      'Structure a question with the framework that fits its type (intervention, exposure, diagnosis, prognosis, qualitative, scoping)',
      'Convert each element into explicit eligibility criteria, including outcome timing and study design',
      'Choose between a systematic review, scoping review, rapid review, umbrella review, living review or network meta-analysis',
    ],
    labs: ['Question builder & critic', 'Review-type selector'],
  },
  {
    id: 'protocol', n: 2, phase: 'Plan', title: 'Protocol & registration', short: 'Protocol',
    summary: 'Pre-specify outcomes, effect measures, the synthesis plan and subgroup hypotheses, then register before screening starts.',
    minutes: 25,
    objectives: [
      'Write a protocol that covers the PRISMA-P 2015 items',
      'Pre-specify a primary outcome, effect measure, model and a small number of directional subgroup hypotheses',
      'Choose a registry (PROSPERO, OSF) and handle protocol amendments transparently',
    ],
    labs: ['Protocol generator (exports Markdown)'],
  },
  {
    id: 'search', n: 3, phase: 'Find', title: 'Search strategy', short: 'Search',
    summary: 'Build a sensitive, reproducible search with controlled vocabulary and free text across databases, registers and other sources.',
    minutes: 35,
    objectives: [
      'Translate concepts into subject headings plus free-text synonyms combined with correct Boolean logic',
      'Select sources: CENTRAL, MEDLINE, Embase, trial registers, grey literature and citation searching',
      'Avoid strategy errors that PRESS peer review catches, and report searches per PRISMA-S',
    ],
    labs: ['Search builder with PubMed & Ovid syntax', 'Strategy linter'],
  },
  {
    id: 'records', n: 4, phase: 'Find', title: 'Records & deduplication', short: 'Records',
    summary: 'Manage search exports, remove duplicate records safely, and link multiple reports to the same study.',
    minutes: 20,
    objectives: [
      'Distinguish records, reports and studies (the PRISMA 2020 units)',
      'Deduplicate using DOI, normalised title, year and author without discarding companion reports',
      'Document counts for the PRISMA flow diagram',
    ],
    labs: ['Deduplication lab'],
  },
  {
    id: 'screening', n: 5, phase: 'Find', title: 'Study selection', short: 'Screening',
    summary: 'Screen titles/abstracts and full texts independently in duplicate, record reasons, measure agreement and draw the PRISMA flow.',
    minutes: 35,
    objectives: [
      'Apply eligibility criteria consistently at title/abstract and full-text stages',
      'Quantify reviewer agreement with Cohen’s kappa and know its limitations',
      'Produce an arithmetically consistent PRISMA 2020 flow diagram',
    ],
    labs: ['Screening simulator', 'Kappa calculator', 'PRISMA 2020 flow builder'],
  },
  {
    id: 'extraction', n: 6, phase: 'Appraise', title: 'Data extraction & preparation', short: 'Extraction',
    summary: 'Extract the right numbers in duplicate and convert what papers report (SE, CI, medians, multiple arms, clusters) into analysable data.',
    minutes: 40,
    objectives: [
      'Design and pilot an extraction form; extract in duplicate',
      'Convert SE, CI, t and p values to SDs; estimate mean/SD from medians with stated assumptions',
      'Handle multi-arm, cluster-randomized and change-score data without unit-of-analysis errors',
    ],
    labs: ['Extraction exercise with traps', 'Data-conversion calculators'],
  },
  {
    id: 'risk-of-bias', n: 7, phase: 'Appraise', title: 'Risk of bias', short: 'Risk of bias',
    summary: 'Choose the right tool (RoB 2, ROBINS-I V2, QUADAS-2 …), apply signalling questions, and display judgements per result.',
    minutes: 45,
    objectives: [
      'Match study designs and questions to the appropriate risk-of-bias tool',
      'Apply RoB 2 domain algorithms and the overall judgement rule',
      'Distinguish risk of bias from imprecision, reporting quality and indirectness',
    ],
    labs: ['RoB 2 domain-1 algorithm', 'Appraise three trials vs expert key', 'Traffic-light plot'],
  },
  {
    id: 'effect-measures', n: 8, phase: 'Synthesize', title: 'Effect measures', short: 'Effect measures',
    summary: 'Compute and interpret MD, SMD (Hedges’ g), RR, OR, RD, NNT and HR — and pick the right one for each outcome.',
    minutes: 35,
    objectives: [
      'Calculate each effect measure and its standard error from raw data',
      'Choose between relative and absolute, and between MD and SMD, for a given outcome',
      'Explain why ORs exaggerate RRs when events are common, and re-express SMDs in clinical units',
    ],
    labs: ['Effect-size calculator with steps', 'OR vs RR divergence explorer'],
  },
  {
    id: 'meta-analysis', n: 9, phase: 'Synthesize', title: 'Meta-analysis', short: 'Meta-analysis',
    summary: 'Pool studies with common-effect and random-effects models (REML, HKSJ, prediction intervals) and read forest plots fluently.',
    minutes: 50,
    objectives: [
      'Explain inverse-variance weighting and how random-effects weighting differs',
      'Choose estimators and interval methods in line with current Cochrane guidance (REML; HKSJ when τ² > 0 and k > 2)',
      'Interpret a forest plot: estimate, confidence interval, prediction interval and weights',
    ],
    labs: ['Meta-analysis engine with forest plot', 'Weight explorer'],
  },
  {
    id: 'heterogeneity', n: 10, phase: 'Synthesize', title: 'Heterogeneity, subgroups & sensitivity', short: 'Heterogeneity',
    summary: 'Quantify variation correctly (τ, prediction interval, I² and its limits), and investigate it without fooling yourself.',
    minutes: 35,
    objectives: [
      'Distinguish Q, I², τ² and the prediction interval, and know which one answers which question',
      'Run and interpret a test for subgroup differences; judge credibility with ICEMAN criteria',
      'Plan sensitivity analyses that test the robustness of conclusions',
    ],
    labs: ['I² vs τ² explorer', 'Subgroup credibility checker'],
  },
  {
    id: 'reporting-bias', n: 11, phase: 'Synthesize', title: 'Missing evidence & small-study effects', short: 'Reporting bias',
    summary: 'Use funnel plots and tests only when they work, recognise other causes of asymmetry, and assess risk of bias due to missing evidence (ROB-ME).',
    minutes: 30,
    objectives: [
      'Read standard and contour-enhanced funnel plots',
      'Know when Egger’s test is valid (≥ 10 studies, not too heterogeneous) and what else causes asymmetry',
      'Apply the ROB-ME logic: known missing results plus potential unknown missing studies',
    ],
    labs: ['Publication-bias simulator'],
  },
  {
    id: 'narrative', n: 12, phase: 'Synthesize', title: 'Synthesis without meta-analysis', short: 'Narrative synthesis',
    summary: 'When pooling is inappropriate, synthesise transparently with SWiM: grouping, standardised metrics, vote counting by direction, and visual displays.',
    minutes: 25,
    objectives: [
      'Decide when not to pool',
      'Use acceptable methods: summary statistics of effects, combining p-values, vote counting by direction with a sign test',
      'Report per SWiM and avoid vote counting by statistical significance',
    ],
    labs: ['Vote counting & effect-direction plot'],
  },
  {
    id: 'grade', n: 13, phase: 'Conclude', title: 'Certainty of evidence (GRADE)', short: 'GRADE',
    summary: 'Rate certainty per outcome across risk of bias, inconsistency, indirectness, imprecision and publication bias — using the 2025 Core GRADE guidance.',
    minutes: 40,
    objectives: [
      'Set the starting level and apply the five reasons to rate down and three to rate up',
      'Rate imprecision against a decision threshold (MID) and the optimal information size',
      'Write justified footnotes and informative statements that match the certainty',
    ],
    labs: ['GRADE rater', 'Imprecision assistant'],
  },
  {
    id: 'sof', n: 14, phase: 'Conclude', title: 'Summary of findings', short: 'SoF table',
    summary: 'Build a Summary of findings table with absolute effects per 1000, certainty and plain-language statements.',
    minutes: 25,
    objectives: [
      'Convert relative effects into absolute effects for an assumed comparator risk',
      'Select up to seven critical/important outcomes, including harms',
      'Phrase findings consistently with their certainty (GRADE informative statements)',
    ],
    labs: ['Summary of findings builder (exports Markdown/CSV)'],
  },
  {
    id: 'reporting', n: 15, phase: 'Conclude', title: 'Reporting & interpretation', short: 'Reporting',
    summary: 'Report to PRISMA 2020, write a structured abstract, and interpret results without spin.',
    minutes: 30,
    objectives: [
      'Self-audit a manuscript against the 27-item PRISMA 2020 checklist',
      'Write results and conclusions that reflect effect size, precision and certainty',
      'Spot and fix common forms of spin',
    ],
    labs: ['PRISMA 2020 checklist audit', 'Spin spotter'],
  },
  {
    id: 'advanced', n: 16, phase: 'Extend', title: 'Beyond the standard review', short: 'Advanced & AI',
    summary: 'Network meta-analysis, diagnostic accuracy, IPD, prognosis, qualitative synthesis, living and rapid reviews — and responsible use of AI.',
    minutes: 35,
    objectives: [
      'Recognise when a specialised review type and its reporting extension are needed',
      'State the key assumptions of network meta-analysis (transitivity, consistency)',
      'Apply the 2025 joint position on AI in evidence synthesis: human accountability, validation and transparent reporting',
    ],
    labs: ['Method selector'],
  },
  {
    id: 'capstone', n: 17, phase: 'Extend', title: 'Capstone: run a full review', short: 'Capstone',
    summary: 'Make every key decision on one synthetic review — from question to Summary of findings — and get feedback on each.',
    minutes: 45,
    objectives: [
      'Integrate all steps on a single dataset',
      'Justify each methodological choice against current guidance',
      'Produce a defensible conclusion with certainty ratings',
    ],
    labs: ['12-decision case with scoring'],
  },
]

export const MODULE_BY_ID = Object.fromEntries(MODULES.map((m) => [m.id, m])) as Record<ModuleId, ModuleMeta>

export const modulePath = (id: ModuleId) => `/learn/${id}`

/** Legacy routes from v1 of the app. */
export const LEGACY_ROUTES: Record<string, ModuleId> = {
  pico: 'question', protocol: 'protocol', search: 'search', citations: 'records', screening: 'screening', extraction: 'extraction',
  rob: 'risk-of-bias', 'effect-size': 'effect-measures', 'meta-analysis': 'meta-analysis', 'publication-bias': 'reporting-bias',
  grade: 'grade', sof: 'sof', manuscript: 'reporting', sandbox: 'capstone',
}

export const PASS_MARK = 0.8
