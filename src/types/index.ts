// Core types for MetaMaster360

export interface Module {
  id: string
  title: string
  description: string
  icon: string
  order: number
  prerequisites?: string[]
  estimatedTime: string
  bloomLevel: string
  path: string
}

export interface Citation {
  id: string
  title: string
  authors: string[]
  year: number
  journal: string
  abstract: string
  doi?: string
  pmid?: string
  studyType: string
}

export interface PICoElement {
  population: string
  intervention?: string
  comparison?: string
  outcome: string
  studyDesign?: string
}

export interface SearchQuery {
  id: string
  database: string
  query: string
  filters: string[]
  date: Date
  results: number
}

export interface ScreeningDecision {
  citationId: string
  decision: 'include' | 'exclude'
  reason?: string
  reviewer: string
  timestamp: number
}

export interface PRISMAFlow {
  identification: {
    databaseResults: number
    otherSources: number
    duplicatesRemoved: number
  }
  screening: {
    titleAbstractScreened: number
    titleAbstractExcluded: number
  }
  eligibility: {
    fullTextAssessed: number
    fullTextExcluded: number
    exclusionReasons: Record<string, number>
  }
  included: {
    studiesIncluded: number
    studiesInMetaAnalysis?: number
  }
}

export interface ExtractionField {
  name: string
  type: 'text' | 'number' | 'select' | 'multiselect'
  options?: string[]
  required: boolean
}

export interface ExtractedData {
  citationId: string
  fields: Record<string, string | number | string[]>
  extractor: string
  timestamp: number
}

export type RiskOfBiasDomain = 'randomization' | 'deviations' | 'missing' | 'measurement' | 'selection'

export interface RiskOfBiasAssessment {
  citationId: string
  tool: 'RoB2' | 'ROBINS-I' | 'QUADAS-2' | 'JBI'
  domains: Record<RiskOfBiasDomain, {
    judgment: 'low' | 'some-concerns' | 'high'
    rationale: string
  }>
  overall: 'low' | 'some-concerns' | 'high'
  assessor: string
  timestamp: number
}

export interface EffectSizeInput {
  studyId: string
  outcomeType: 'continuous' | 'dichotomous' | 'time-to-event'
  // For continuous outcomes
  mean1?: number
  sd1?: number
  n1?: number
  mean2?: number
  sd2?: number
  n2?: number
  // For dichotomous outcomes
  events1?: number
  total1?: number
  events2?: number
  total2?: number
  // For time-to-event
  hr?: number
  ci_lower?: number
  ci_upper?: number
}

export interface EffectSize {
  studyId: string
  measure: 'MD' | 'SMD' | 'RR' | 'OR' | 'HR'
  estimate: number
  se: number
  ci_lower: number
  ci_upper: number
  weight?: number
}

export interface MetaAnalysisResult {
  model: 'fixed' | 'random'
  effectSizes: EffectSize[]
  pooledEstimate: number
  pooledSE: number
  pooledCI: [number, number]
  i2: number
  tau2: number
  q: number
  pValue: number
}

export interface GRADEDomain {
  domain: 'rob' | 'inconsistency' | 'indirectness' | 'imprecision' | 'publication-bias'
  rating: 'no-concern' | 'serious' | 'very-serious'
  rationale: string
}

export interface GRADEAssessment {
  outcome: string
  initialRating: 'high' | 'moderate' | 'low' | 'very-low'
  domains: GRADEDomain[]
  finalRating: 'high' | 'moderate' | 'low' | 'very-low'
  upgrades?: string[]
}

export interface SummaryOfFindings {
  outcome: string
  effectEstimate: string
  certainty: 'high' | 'moderate' | 'low' | 'very-low'
  studies: number
  participants: number
  comments: string
}

export interface AssessmentQuestion {
  id: string
  type: 'mcq' | 'matching' | 'scenario' | 'calculation'
  question: string
  options?: string[]
  correctAnswer: string | string[]
  rationale: string
  module: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

export interface GlossaryTerm {
  term: string
  definition: string
  relatedTerms?: string[]
  category: string
}

export interface UserProgress {
  moduleId: string
  completed: boolean
  score?: number
  lastAccessed: number
}
