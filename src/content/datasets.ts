import { CASE_STUDIES } from './case'

export type DataMode = 'continuous' | 'binary' | 'generic'

export interface Dataset {
  id: string
  name: string
  mode: DataMode
  measure: 'MD' | 'SMD' | 'RR' | 'OR' | 'RD' | 'HR' | 'GEN'
  left: string
  right: string
  rows: { label: string; group: string; values: number[] }[]
  note: string
}

export const FIELDS: Record<DataMode, { key: string; label: string }[]> = {
  continuous: [{ key: 'n1', label: 'n₁' }, { key: 'm1', label: 'Mean₁' }, { key: 'sd1', label: 'SD₁' }, { key: 'n2', label: 'n₂' }, { key: 'm2', label: 'Mean₂' }, { key: 'sd2', label: 'SD₂' }],
  binary: [{ key: 'e1', label: 'Events₁' }, { key: 'n1', label: 'Total₁' }, { key: 'e2', label: 'Events₂' }, { key: 'n2', label: 'Total₂' }],
  generic: [{ key: 'est', label: 'Estimate' }, { key: 'lo', label: '95% CI low' }, { key: 'hi', label: '95% CI high' }],
}

const BCG: [string, number, number, number, number, string][] = [
  ['Aronson 1948', 4, 123, 11, 139, 'Latitude ≥ 34°'], ['Ferguson & Simes 1949', 6, 306, 29, 303, 'Latitude ≥ 34°'], ['Rosenthal 1960', 3, 231, 11, 220, 'Latitude ≥ 34°'],
  ['Hart & Sutherland 1977', 62, 13598, 248, 12867, 'Latitude ≥ 34°'], ['Frimodt-Moller 1973', 33, 5069, 47, 5808, 'Latitude < 34°'], ['Stein & Aronson 1953', 180, 1541, 372, 1451, 'Latitude ≥ 34°'],
  ['Vandiviere 1973', 8, 2545, 10, 629, 'Latitude < 34°'], ['TPT Madras 1980', 505, 88391, 499, 88391, 'Latitude < 34°'], ['Coetzee & Berjak 1968', 29, 7499, 45, 7277, 'Latitude < 34°'],
  ['Rosenthal 1961', 17, 1716, 65, 1665, 'Latitude ≥ 34°'], ['Comstock 1974', 186, 50634, 141, 27338, 'Latitude < 34°'], ['Comstock & Webster 1969', 5, 2498, 3, 2341, 'Latitude < 34°'],
  ['Comstock 1976', 27, 16913, 29, 17854, 'Latitude < 34°'],
]

export const DATASETS: Dataset[] = [
  {
    id: 'case-smd', name: 'Running case — depressive symptoms (SMD)', mode: 'continuous', measure: 'SMD', left: 'Favours exercise', right: 'Favours usual care',
    rows: CASE_STUDIES.map((s) => ({ label: s.label, group: s.delivery, values: [s.n1, s.m1, s.sd1, s.n2, s.m2, s.sd2] })),
    note: 'Synthetic data prepared in the extraction module. Lower scores are better.',
  },
  {
    id: 'case-rr', name: 'Running case — response ≥ 50% (RR)', mode: 'binary', measure: 'RR', left: 'Favours usual care', right: 'Favours exercise',
    rows: CASE_STUDIES.map((s) => ({ label: s.label, group: s.delivery, values: [s.r1, s.n1, s.r2, s.n2] })),
    note: 'Synthetic data. Response is a good outcome, so RR > 1 favours exercise.',
  },
  {
    id: 'bcg', name: 'BCG vaccine trials — tuberculosis (RR), real data', mode: 'binary', measure: 'RR', left: 'Favours vaccine', right: 'Favours control',
    rows: BCG.map(([label, e1, n1, e2, n2, group]) => ({ label, group, values: [e1, n1, e2, n2] })),
    note: 'Colditz et al. 1994 (13 trials), grouped by absolute latitude of the trial site. Reproduces published metafor results: REML pooled RR 0.49 (Wald 95% CI 0.34 to 0.70), τ² = 0.313, I² = 92%.',
  },
  {
    id: 'hr', name: 'Generic inverse variance — hazard ratios (synthetic)', mode: 'generic', measure: 'HR', left: 'Favours treatment', right: 'Favours control',
    rows: [
      { label: 'Trial A', group: '', values: [0.78, 0.62, 0.98] }, { label: 'Trial B', group: '', values: [0.85, 0.7, 1.03] },
      { label: 'Trial C', group: '', values: [0.66, 0.45, 0.97] }, { label: 'Trial D', group: '', values: [0.95, 0.8, 1.13] },
      { label: 'Trial E', group: '', values: [0.72, 0.55, 0.94] },
    ],
    note: 'Enter each estimate with its 95% CI; the engine converts to ln(HR) and SE.',
  },
]
