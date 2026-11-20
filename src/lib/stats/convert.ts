/**
 * Data-preparation conversions (Cochrane Handbook v6.5, section 6.5.2 and chapter 23).
 */
import { normalQuantile, tQuantile } from './distributions'

/** SD from the standard error of a group mean: SD = SE × √n (6.5.2.2). */
export function sdFromSE(se: number, n: number) {
  if (!(se > 0 && n > 0)) throw new Error('SE and n must be > 0.')
  return se * Math.sqrt(n)
}

/**
 * SD from a confidence interval for a single group mean (6.5.2.2).
 * Uses the t distribution when n < 60, as the Handbook recommends for small samples.
 */
export function sdFromMeanCI(lower: number, upper: number, n: number, level = 0.95) {
  if (!(upper > lower && n > 1)) throw new Error('Need upper > lower and n > 1.')
  const p = 1 - (1 - level) / 2
  const crit = n < 60 ? tQuantile(p, n - 1) : normalQuantile(p)
  return { sd: (Math.sqrt(n) * (upper - lower)) / (2 * crit), crit, usedT: n < 60 }
}

/**
 * SD (assumed common to both groups) from the CI of a mean difference between two groups (6.5.2.3).
 */
export function sdFromMDCI(lower: number, upper: number, n1: number, n2: number, level = 0.95) {
  if (!(upper > lower && n1 > 1 && n2 > 1)) throw new Error('Need upper > lower and n > 1 in each group.')
  const p = 1 - (1 - level) / 2
  const small = n1 + n2 < 60
  const crit = small ? tQuantile(p, n1 + n2 - 2) : normalQuantile(p)
  const se = (upper - lower) / (2 * crit)
  return { se, sd: se / Math.sqrt(1 / n1 + 1 / n2), crit, usedT: small }
}

/** SD from a t statistic or p-value for a two-group comparison of means (6.5.2.3). */
export function sdFromT(meanDiff: number, t: number, n1: number, n2: number) {
  const se = Math.abs(meanDiff / t)
  return { se, sd: se / Math.sqrt(1 / n1 + 1 / n2) }
}

/** Combine two groups into one (Handbook Table 6.5.a). */
export function combineGroups(n1: number, m1: number, sd1: number, n2: number, m2: number, sd2: number) {
  if (!(n1 > 1 && n2 > 1 && sd1 >= 0 && sd2 >= 0)) throw new Error('Each group needs n > 1 and SD ≥ 0.')
  const n = n1 + n2
  const mean = (n1 * m1 + n2 * m2) / n
  const sd = Math.sqrt(((n1 - 1) * sd1 * sd1 + (n2 - 1) * sd2 * sd2 + ((n1 * n2) / n) * (m1 * m1 + m2 * m2 - 2 * m1 * m2)) / (n - 1))
  return { n, mean, sd }
}

/** SD of change scores from baseline and final SDs and their correlation (6.5.2.8). */
export function sdChange(sdBaseline: number, sdFinal: number, r: number) {
  if (!(r >= -1 && r <= 1)) throw new Error('Correlation must be between −1 and 1.')
  return Math.sqrt(sdBaseline ** 2 + sdFinal ** 2 - 2 * r * sdBaseline * sdFinal)
}

export type MedianScenario = 'min-med-max' | 'q1-med-q3' | 'min-q1-med-q3-max'

export interface MedianInput {
  n: number
  median: number
  min?: number
  max?: number
  q1?: number
  q3?: number
}

/**
 * Estimate mean (Luo et al. 2018, Stat Methods Med Res) and SD (Wan et al. 2014, BMC Med Res Methodol)
 * from median-based summaries. Assumes approximate normality; skewed data make these estimates unreliable
 * (Handbook 6.5.2.5).
 */
export function meanSdFromMedian(input: MedianInput): { mean: number; sd: number; scenario: MedianScenario } {
  const { n, median: m, min: a, max: b, q1, q3 } = input
  if (!(n > 1)) throw new Error('n must be > 1.')
  const xi = 2 * normalQuantile((n - 0.375) / (n + 0.25))
  const eta = 2 * normalQuantile((0.75 * n - 0.125) / (n + 0.25))
  const has = (x?: number): x is number => typeof x === 'number' && Number.isFinite(x)
  if (has(a) && has(b) && has(q1) && has(q3)) {
    if (!(a <= q1 && q1 <= m && m <= q3 && q3 <= b)) throw new Error('Need min ≤ Q1 ≤ median ≤ Q3 ≤ max.')
    const w1 = 2.2 / (2.2 + n ** 0.75)
    const w2 = 0.7 - 0.72 / n ** 0.55
    const mean = (w1 * (a + b)) / 2 + (w2 * (q1 + q3)) / 2 + (1 - w1 - w2) * m
    const sd = 0.5 * ((b - a) / xi + (q3 - q1) / eta)
    return { mean, sd, scenario: 'min-q1-med-q3-max' }
  }
  if (has(q1) && has(q3)) {
    if (!(q1 <= m && m <= q3)) throw new Error('Need Q1 ≤ median ≤ Q3.')
    const w = 0.7 + 0.39 / n
    return { mean: (w * (q1 + q3)) / 2 + (1 - w) * m, sd: (q3 - q1) / eta, scenario: 'q1-med-q3' }
  }
  if (has(a) && has(b)) {
    if (!(a <= m && m <= b)) throw new Error('Need min ≤ median ≤ max.')
    const w = 4 / (4 + n ** 0.75)
    return { mean: (w * (a + b)) / 2 + (1 - w) * m, sd: (b - a) / xi, scenario: 'min-med-max' }
  }
  throw new Error('Provide min & max, Q1 & Q3, or all five.')
}

/** Design effect for cluster-randomized trials (Handbook 23.1.4): DE = 1 + (m − 1) × ICC. */
export function designEffect(meanClusterSize: number, icc: number) {
  if (!(meanClusterSize >= 1 && icc >= 0 && icc <= 1)) throw new Error('Cluster size ≥ 1 and 0 ≤ ICC ≤ 1.')
  return 1 + (meanClusterSize - 1) * icc
}

/** Effective sample size / events after dividing by the design effect. */
export function effectiveSampleSize(n: number, de: number) {
  return n / de
}
