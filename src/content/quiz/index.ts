import type { ModuleId, QuizQuestion } from '../types'
import { question } from './question'
import { protocol } from './protocol'
import { search } from './search'
import { records } from './records'
import { screening } from './screening'
import { extraction } from './extraction'
import { riskOfBias } from './riskOfBias'
import { effectMeasures } from './effectMeasures'
import { metaAnalysis } from './metaAnalysis'
import { heterogeneity } from './heterogeneity'
import { reportingBias } from './reportingBias'
import { narrative } from './narrative'
import { grade } from './grade'
import { sof } from './sof'
import { reporting } from './reporting'
import { advanced } from './advanced'
import { capstone } from './capstone'

export const QUIZ: Record<ModuleId, QuizQuestion[]> = {
  question,
  protocol,
  search,
  records,
  screening,
  extraction,
  'risk-of-bias': riskOfBias,
  'effect-measures': effectMeasures,
  'meta-analysis': metaAnalysis,
  heterogeneity,
  'reporting-bias': reportingBias,
  narrative,
  grade,
  sof,
  reporting,
  advanced,
  capstone,
}

export const ALL_QUESTIONS = (Object.entries(QUIZ) as [ModuleId, QuizQuestion[]][]).flatMap(([module, qs]) => qs.map((q) => ({ ...q, module })))
