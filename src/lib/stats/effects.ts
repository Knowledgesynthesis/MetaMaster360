/**
 * Effect measures for two-group comparisons.
 * Formulas: Cochrane Handbook v6.5, chapter 6 (sections 6.4–6.5).
 */
import { normalQuantile } from './distributions'

export type Measure = 'MD' | 'SMD' | 'RR' | 'OR' | 'RD' | 'HR' | 'GEN'

export const RATIO_MEASURES: Measure[] = ['RR', 'OR', 'HR']
export const isRatio = (m: Measure) => RATIO_MEASURES.includes(m)

export interface EffectEstimate {
  /** Estimate on the analysis scale (log scale for ratio measures). */
  yi: number
  /** Sampling variance on the analysis scale. */
  vi: number
  sei: number
  measure: Measure
  /** Notes about corrections applied (e.g., continuity correction). */
  notes: string[]
}

export const z975 = 1.959963984540054

export function ciFrom(yi: number, sei: number, level = 0.95) {
  const z = normalQuantile(1 - (1 - level) / 2)
  return { lower: yi - z * sei, upper: yi + z * sei }
}

/** Convert analysis-scale value back to the natural scale. */
export const toNatural = (measure: Measure, y: number) => (isRatio(measure) ? Math.exp(y) : y)

const finitePositive = (...xs: number[]) => xs.every((x) => Number.isFinite(x) && x > 0)

/** Mean difference (Handbook 6.5.1.1). */
export function meanDifference(m1: number, sd1: number, n1: number, m2: number, sd2: number, n2: number): EffectEstimate {
  if (!finitePositive(sd1, sd2, n1, n2) || !Number.isFinite(m1) || !Number.isFinite(m2)) throw new Error('Means must be numbers; SDs and sample sizes must be > 0.')
  const yi = m1 - m2
  const vi = (sd1 * sd1) / n1 + (sd2 * sd2) / n2
  return { yi, vi, sei: Math.sqrt(vi), measure: 'MD', notes: [] }
}

export interface SmdDetail extends EffectEstimate {
  d: number
  J: number
  sPooled: number
}

/**
 * Standardized mean difference as Hedges' (adjusted) g, the SMD used by RevMan.
 * SE formula from Handbook 6.5.1.2: SE(g) = sqrt(N/(n1 n2) + g^2 / (2 (N − 3.94))).
 */
export function hedgesG(m1: number, sd1: number, n1: number, m2: number, sd2: number, n2: number): SmdDetail {
  if (!finitePositive(sd1, sd2) || !(n1 >= 2 && n2 >= 2) || !Number.isFinite(m1) || !Number.isFinite(m2)) throw new Error('SMD needs numeric means, SD > 0 and n ≥ 2 per group.')
  const N = n1 + n2
  const sPooled = Math.sqrt(((n1 - 1) * sd1 * sd1 + (n2 - 1) * sd2 * sd2) / (N - 2))
  const d = (m1 - m2) / sPooled
  const J = 1 - 3 / (4 * N - 9)
  const g = d * J
  const vi = N / (n1 * n2) + (g * g) / (2 * (N - 3.94))
  return { yi: g, vi, sei: Math.sqrt(vi), measure: 'SMD', notes: [], d, J, sPooled }
}

export interface BinaryInput {
  /** events in experimental group */
  e1: number
  n1: number
  /** events in comparator group */
  e2: number
  n2: number
}

export interface BinaryEstimate extends EffectEstimate {
  /** true when the study cannot contribute to this measure (e.g., no events in either arm for RR/OR). */
  excluded?: boolean
  risk1: number
  risk2: number
}

function validateBinary({ e1, n1, e2, n2 }: BinaryInput) {
  const ints = [e1, n1, e2, n2].every((x) => Number.isInteger(x) && x >= 0)
  if (!ints || n1 < 1 || n2 < 1 || e1 > n1 || e2 > n2) throw new Error('Events and totals must be whole numbers with 0 ≤ events ≤ total and total ≥ 1.')
}

/**
 * Risk ratio, odds ratio or risk difference from a 2×2 table.
 * Zero cells: 0.5 is added to every cell of that study (RevMan convention).
 * Studies with zero events (or all events) in both arms are excluded from RR/OR (Handbook 10.4.4.1).
 */
export function binaryEffect(input: BinaryInput, measure: 'RR' | 'OR' | 'RD', cc = 0.5): BinaryEstimate {
  validateBinary(input)
  const { e1, n1, e2, n2 } = input
  const risk1 = e1 / n1
  const risk2 = e2 / n2
  const notes: string[] = []
  if (measure === 'RD') {
    const yi = risk1 - risk2
    let vi = (risk1 * (1 - risk1)) / n1 + (risk2 * (1 - risk2)) / n2
    if (vi === 0) {
      const a = e1 + cc, c = e2 + cc, m1 = n1 + 2 * cc, m2 = n2 + 2 * cc
      vi = ((a / m1) * (1 - a / m1)) / m1 + ((c / m2) * (1 - c / m2)) / m2
      notes.push(`Variance was zero; ${cc} added to each cell to compute the SE.`)
    }
    return { yi, vi, sei: Math.sqrt(vi), measure, notes, risk1, risk2 }
  }
  const doubleZero = e1 === 0 && e2 === 0
  const doubleAll = e1 === n1 && e2 === n2
  if (doubleZero || doubleAll) {
    return {
      yi: NaN, vi: NaN, sei: NaN, measure, risk1, risk2, excluded: true,
      notes: [doubleZero ? 'No events in either group: the study gives no information on a ratio measure and is excluded (it can contribute to a risk difference).' : 'All participants had the event in both groups: excluded from ratio measures.'],
    }
  }
  let a = e1, b = n1 - e1, c = e2, d = n2 - e2
  if (a === 0 || b === 0 || c === 0 || d === 0) {
    a += cc; b += cc; c += cc; d += cc
    notes.push(`Zero cell: ${cc} added to all four cells.`)
  }
  if (measure === 'RR') {
    const yi = Math.log((a / (a + b)) / (c / (c + d)))
    const vi = 1 / a - 1 / (a + b) + 1 / c - 1 / (c + d)
    return { yi, vi, sei: Math.sqrt(vi), measure, notes, risk1, risk2 }
  }
  const yi = Math.log((a * d) / (b * c))
  const vi = 1 / a + 1 / b + 1 / c + 1 / d
  return { yi, vi, sei: Math.sqrt(vi), measure, notes, risk1, risk2 }
}

/**
 * Recover an estimate and its SE from a reported point estimate and confidence interval
 * (Handbook 6.3.1 / 6.5.2.3). Ratio measures are handled on the log scale.
 */
export function fromConfidenceInterval(estimate: number, lower: number, upper: number, measure: Measure, level = 0.95): EffectEstimate {
  const ratio = isRatio(measure)
  if (ratio && !finitePositive(estimate, lower, upper)) throw new Error('Ratio estimates and limits must be > 0.')
  if (!(lower < upper)) throw new Error('Lower limit must be below upper limit.')
  if (!(lower <= estimate && estimate <= upper)) throw new Error('Estimate must lie within its confidence interval.')
  const f = ratio ? Math.log : (x: number) => x
  const z = normalQuantile(1 - (1 - level) / 2)
  const sei = (f(upper) - f(lower)) / (2 * z)
  const yi = f(estimate)
  const notes: string[] = []
  const asym = Math.abs((f(upper) - yi) - (yi - f(lower))) / (f(upper) - f(lower))
  if (asym > 0.1) notes.push('Interval is noticeably asymmetric on the analysis scale — check the reported numbers (or whether a ratio was reported on the wrong scale).')
  return { yi, vi: sei * sei, sei, measure, notes }
}

/** SE from an estimate and its two-sided p-value (Handbook 6.3.2). Ratio measures on log scale. */
export function seFromP(estimate: number, p: number, measure: Measure): number {
  if (!(p > 0 && p < 1)) throw new Error('p must be between 0 and 1.')
  const y = isRatio(measure) ? Math.log(estimate) : estimate
  const z = normalQuantile(1 - p / 2)
  return Math.abs(y) / z
}

/** Number needed to treat from a comparator risk and a risk ratio (Handbook 15.4.4). */
export function nntFromRR(controlRisk: number, rr: number): { arr: number; nnt: number; label: 'NNTB' | 'NNTH' | 'none' } {
  const arr = controlRisk - controlRisk * rr
  if (arr === 0) return { arr, nnt: Infinity, label: 'none' }
  return { arr, nnt: 1 / Math.abs(arr), label: arr > 0 ? 'NNTB' : 'NNTH' }
}

/** Absolute effect per 1000 from a relative effect and an assumed comparator risk (GRADE SoF). */
export function absoluteFromRR(controlRisk: number, rr: number) {
  const interventionRisk = Math.min(1, controlRisk * rr)
  return { controlPer1000: controlRisk * 1000, interventionPer1000: interventionRisk * 1000, differencePer1000: (interventionRisk - controlRisk) * 1000 }
}

/** Absolute effect from an OR and comparator risk: risk = OR·CR / (1 − CR + OR·CR). */
export function absoluteFromOR(controlRisk: number, or: number) {
  const interventionRisk = (or * controlRisk) / (1 - controlRisk + or * controlRisk)
  return { controlPer1000: controlRisk * 1000, interventionPer1000: interventionRisk * 1000, differencePer1000: (interventionRisk - controlRisk) * 1000 }
}

/** Convert an SMD to a log odds ratio (Chinn 2000; Handbook 10.6): ln(OR) = SMD × π/√3. */
export const smdToLogOR = (smd: number) => (smd * Math.PI) / Math.sqrt(3)
export const logORToSmd = (lnOR: number) => (lnOR * Math.sqrt(3)) / Math.PI
