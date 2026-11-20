import { lazy, type ComponentType, type LazyExoticComponent } from 'react'
import type { ModuleId } from '@/content/types'

export const MODULE_CONTENT: Record<ModuleId, LazyExoticComponent<ComponentType>> = {
  question: lazy(() => import('./Question')),
  protocol: lazy(() => import('./Protocol')),
  search: lazy(() => import('./Search')),
  records: lazy(() => import('./Records')),
  screening: lazy(() => import('./Screening')),
  extraction: lazy(() => import('./Extraction')),
  'risk-of-bias': lazy(() => import('./RiskOfBias')),
  'effect-measures': lazy(() => import('./EffectMeasures')),
  'meta-analysis': lazy(() => import('./MetaAnalysis')),
  heterogeneity: lazy(() => import('./Heterogeneity')),
  'reporting-bias': lazy(() => import('./ReportingBias')),
  narrative: lazy(() => import('./Narrative')),
  grade: lazy(() => import('./Grade')),
  sof: lazy(() => import('./Sof')),
  reporting: lazy(() => import('./Reporting')),
  advanced: lazy(() => import('./Advanced')),
  capstone: lazy(() => import('./Capstone')),
}
