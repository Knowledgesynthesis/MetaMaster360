export type ModuleId =
  | 'question' | 'protocol' | 'search' | 'records' | 'screening' | 'extraction' | 'risk-of-bias'
  | 'effect-measures' | 'meta-analysis' | 'heterogeneity' | 'reporting-bias' | 'narrative'
  | 'grade' | 'sof' | 'reporting' | 'advanced' | 'capstone'

export type Phase = 'Plan' | 'Find' | 'Appraise' | 'Synthesize' | 'Conclude' | 'Extend'

export interface ModuleMeta {
  id: ModuleId
  n: number
  phase: Phase
  title: string
  short: string
  summary: string
  minutes: number
  objectives: string[]
  /** Interactive labs inside the module (shown on cards). */
  labs: string[]
}

export interface QuizQuestion {
  id: string
  stem: string
  options: string[]
  /** index into options */
  answer: number
  explain: string
  level?: 1 | 2 | 3
}

export interface Reference {
  cite: string
  url: string
  note?: string
}
