/**
 * Inverse-variance meta-analysis.
 * - Common-effect (fixed-effect) inverse-variance model.
 * - Random-effects model with REML (RevMan default since 2023) or DerSimonian–Laird τ².
 * - Wald-type or Hartung–Knapp–Sidik–Jonkman (HKSJ) confidence intervals.
 * - Higgins–Thompson–Spiegelhalter prediction interval (t, k − 2 df).
 * - Q-profile confidence interval for τ² (Viechtbauer 2007).
 * References: Cochrane Handbook v6.5 §10.10.4; Veroniki et al. Res Synth Methods 2016;7:55–79.
 */
import { chiSquareCdf, chiSquareQuantile, normalQuantile, pFromT, pFromZ, tQuantile } from './distributions'

export interface StudyInput {
  id: string
  label: string
  yi: number
  vi: number
  group?: string
}

export type Tau2Method = 'REML' | 'DL'
export type CiMethod = 'wald' | 'hksj'

export interface MetaOptions {
  tau2Method?: Tau2Method
  ciMethod?: CiMethod
  level?: number
}

export interface PooledEstimate {
  est: number
  se: number
  lower: number
  upper: number
  stat: number
  p: number
  /** distribution used for CI and p: 'z' or 't' with df */
  dist: { kind: 'z' } | { kind: 't'; df: number }
}

export interface Heterogeneity {
  Q: number
  df: number
  pQ: number
  /** I² as a proportion (0–1), computed from the selected τ² estimator (as RevMan does). */
  I2: number
  /** I² from Q alone: max(0, (Q − df)/Q). Equals I2 for DL. */
  I2fromQ: number
  H2: number
  tau2: number
  tau: number
  tau2Lower: number
  tau2Upper: number
  /** "typical" within-study variance (Higgins & Thompson 2002) */
  s2: number
}

export interface StudyResult extends StudyInput {
  se: number
  lower: number
  upper: number
  wCommon: number
  wRandom: number
}

export interface MetaResult {
  k: number
  studies: StudyResult[]
  common: PooledEstimate
  random: PooledEstimate
  /** Wald random-effects result (kept for comparison when HKSJ is selected). */
  randomWald: PooledEstimate
  heterogeneity: Heterogeneity
  prediction: { lower: number; upper: number } | null
  options: Required<MetaOptions>
  /** HKSJ scaling factor q; q < 1 means HKSJ CI is narrower than Wald. */
  hksjQ: number | null
  warnings: string[]
  recommendedCi: CiMethod
}

const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0)

function validate(studies: StudyInput[]) {
  for (const s of studies) {
    if (!Number.isFinite(s.yi) || !Number.isFinite(s.vi) || s.vi <= 0) throw new Error(`Study "${s.label}" needs a finite estimate and a variance > 0.`)
  }
}

export function tau2DL(y: number[], v: number[]): number {
  const w = v.map((x) => 1 / x)
  const sw = sum(w)
  const mu = sum(w.map((wi, i) => wi * y[i])) / sw
  const Q = sum(w.map((wi, i) => wi * (y[i] - mu) ** 2))
  const c = sw - sum(w.map((x) => x * x)) / sw
  return Math.max(0, (Q - (y.length - 1)) / c)
}

/** REML τ² by Fisher scoring (as in metafor), started at the DL estimate and truncated at 0. */
export function tau2REML(y: number[], v: number[], maxIter = 500, tol = 1e-10): number {
  let tau2 = tau2DL(y, v)
  for (let iter = 0; iter < maxIter; iter++) {
    const w = v.map((vi) => 1 / (vi + tau2))
    const sw = sum(w)
    const mu = sum(w.map((wi, i) => wi * y[i])) / sw
    // P-matrix quantities for the REML score and information
    const sw2 = sum(w.map((x) => x * x))
    const sw3 = sum(w.map((x) => x * x * x))
    const r = y.map((yi) => yi - mu)
    const yPPy = sum(w.map((wi, i) => (wi * r[i]) ** 2)) // y'PPy
    const trP = sw - sw2 / sw
    const trPP = sw2 - (2 * sw3) / sw + (sw2 / sw) ** 2
    const score = 0.5 * (yPPy - trP)
    const info = 0.5 * trPP
    let step = score / info
    let next = tau2 + step
    // step-halving to stay in the parameter space
    while (next < 0 && Math.abs(step) > 1e-14) {
      step /= 2
      next = tau2 + step
    }
    next = Math.max(0, next)
    if (Math.abs(next - tau2) < tol) return next
    tau2 = next
  }
  return tau2
}

function pooledWithTau2(y: number[], v: number[], tau2: number) {
  const w = v.map((vi) => 1 / (vi + tau2))
  const sw = sum(w)
  const est = sum(w.map((wi, i) => wi * y[i])) / sw
  return { w, sw, est, se: Math.sqrt(1 / sw) }
}

/** Generalized Q statistic used by the Q-profile method. */
function generalizedQ(y: number[], v: number[], tau2: number) {
  const { w, est } = pooledWithTau2(y, v, tau2)
  return sum(w.map((wi, i) => wi * (y[i] - est) ** 2))
}

export function tau2QProfileCI(y: number[], v: number[], level = 0.95): { lower: number; upper: number } {
  const k = y.length
  if (k < 2) return { lower: NaN, upper: NaN }
  const alpha = 1 - level
  const qLowTarget = chiSquareQuantile(1 - alpha / 2, k - 1) // gives lower bound
  const qUpTarget = chiSquareQuantile(alpha / 2, k - 1) // gives upper bound
  const solve = (target: number) => {
    if (generalizedQ(y, v, 0) <= target) return 0
    let hi = 1
    while (generalizedQ(y, v, hi) > target) {
      hi *= 2
      if (hi > 1e8) return Infinity
    }
    let lo = 0
    for (let i = 0; i < 200; i++) {
      const mid = (lo + hi) / 2
      if (generalizedQ(y, v, mid) > target) lo = mid
      else hi = mid
      if (hi - lo < 1e-12 * Math.max(1, mid)) break
    }
    return (lo + hi) / 2
  }
  return { lower: solve(qLowTarget), upper: solve(qUpTarget) }
}

function zEstimate(est: number, se: number, level: number): PooledEstimate {
  const z = normalQuantile(1 - (1 - level) / 2)
  return { est, se, lower: est - z * se, upper: est + z * se, stat: est / se, p: pFromZ(est / se), dist: { kind: 'z' } }
}

export function metaAnalyze(input: StudyInput[], opts: MetaOptions = {}): MetaResult {
  const options: Required<MetaOptions> = { tau2Method: opts.tau2Method ?? 'REML', ciMethod: opts.ciMethod ?? 'hksj', level: opts.level ?? 0.95 }
  const studies = input.filter((s) => Number.isFinite(s.yi) && Number.isFinite(s.vi))
  validate(studies)
  const k = studies.length
  if (k < 1) throw new Error('At least one study is needed.')
  const y = studies.map((s) => s.yi)
  const v = studies.map((s) => s.vi)
  const level = options.level
  const z = normalQuantile(1 - (1 - level) / 2)
  const warnings: string[] = []

  // Common-effect
  const wF = v.map((x) => 1 / x)
  const swF = sum(wF)
  const estF = sum(wF.map((w, i) => w * y[i])) / swF
  const common = zEstimate(estF, Math.sqrt(1 / swF), level)

  const Q = sum(wF.map((w, i) => w * (y[i] - estF) ** 2))
  const df = k - 1
  const pQ = df > 0 ? 1 - chiSquareCdf(Q, df) : NaN
  const I2fromQ = Q > 0 && df > 0 ? Math.max(0, (Q - df) / Q) : 0

  const tau2 = k > 1 ? (options.tau2Method === 'REML' ? tau2REML(y, v) : tau2DL(y, v)) : 0
  const s2 = k > 1 ? ((k - 1) * swF) / (swF ** 2 - sum(wF.map((w) => w * w))) : NaN
  const I2 = k > 1 ? tau2 / (tau2 + s2) : 0
  const H2 = k > 1 ? (tau2 + s2) / s2 : 1
  const tauCI = k > 1 ? tau2QProfileCI(y, v, level) : { lower: NaN, upper: NaN }

  const re = pooledWithTau2(y, v, tau2)
  const randomWald = zEstimate(re.est, re.se, level)
  let random = randomWald
  let hksjQ: number | null = null
  if (options.ciMethod === 'hksj' && k > 1) {
    hksjQ = sum(re.w.map((w, i) => w * (y[i] - re.est) ** 2)) / (k - 1)
    const seH = Math.sqrt(hksjQ / re.sw)
    const t = tQuantile(1 - (1 - level) / 2, k - 1)
    random = { est: re.est, se: seH, lower: re.est - t * seH, upper: re.est + t * seH, stat: re.est / seH, p: pFromT(re.est / seH, k - 1), dist: { kind: 't', df: k - 1 } }
    if (hksjQ < 1) warnings.push('HKSJ variance factor q < 1: the HKSJ interval is narrower than the Wald interval. Some software applies the "ad hoc" correction max(1, q); interpret with care.')
  }

  const recommendedCi: CiMethod = tau2 > 0 && k > 2 ? 'hksj' : 'wald'
  if (k === 2 && options.ciMethod === 'hksj') warnings.push('With two studies the HKSJ interval is extremely wide (t with 1 df). Cochrane recommends the Wald-type interval when k = 2.')
  if (tau2 === 0 && options.ciMethod === 'hksj' && k > 2) warnings.push('τ² is estimated as 0; Cochrane recommends the Wald-type interval in this case.')
  if (k > 1 && k < 5) warnings.push(`Only ${k} studies: τ² is estimated very imprecisely, so I², τ² and the prediction interval are unreliable.`)

  let prediction: MetaResult['prediction'] = null
  if (k >= 3) {
    const t = tQuantile(1 - (1 - level) / 2, k - 2)
    const half = t * Math.sqrt(tau2 + re.se ** 2)
    prediction = { lower: re.est - half, upper: re.est + half }
  }

  const results: StudyResult[] = studies.map((s, i) => {
    const se = Math.sqrt(s.vi)
    return { ...s, se, lower: s.yi - z * se, upper: s.yi + z * se, wCommon: wF[i] / swF, wRandom: re.w[i] / re.sw }
  })

  return {
    k,
    studies: results,
    common,
    random,
    randomWald,
    heterogeneity: { Q, df, pQ, I2, I2fromQ, H2, tau2, tau: Math.sqrt(tau2), tau2Lower: tauCI.lower, tau2Upper: tauCI.upper, s2 },
    prediction,
    options,
    hksjQ,
    warnings,
    recommendedCi,
  }
}

export interface SubgroupResult {
  groups: { name: string; result: MetaResult }[]
  /** Test for subgroup differences (RevMan approach: heterogeneity between subgroup estimates). */
  test: { Q: number; df: number; p: number; I2: number } | null
}

export function subgroupAnalysis(studies: StudyInput[], model: 'common' | 'random', opts: MetaOptions = {}): SubgroupResult {
  const names = Array.from(new Set(studies.map((s) => s.group ?? 'Ungrouped')))
  const groups = names.map((name) => ({ name, result: metaAnalyze(studies.filter((s) => (s.group ?? 'Ungrouped') === name), opts) }))
  if (groups.length < 2) return { groups, test: null }
  const ests = groups.map((g) => (model === 'common' ? g.result.common : g.result.randomWald))
  const w = ests.map((e) => 1 / e.se ** 2)
  const mu = sum(w.map((wi, i) => wi * ests[i].est)) / sum(w)
  const Q = sum(w.map((wi, i) => wi * (ests[i].est - mu) ** 2))
  const df = groups.length - 1
  return { groups, test: { Q, df, p: 1 - chiSquareCdf(Q, df), I2: Q > 0 ? Math.max(0, (Q - df) / Q) : 0 } }
}

export function leaveOneOut(studies: StudyInput[], opts: MetaOptions = {}) {
  if (studies.length < 3) return []
  return studies.map((s) => {
    const r = metaAnalyze(studies.filter((x) => x.id !== s.id), opts)
    return { omitted: s, random: r.random, common: r.common, I2: r.heterogeneity.I2, tau2: r.heterogeneity.tau2 }
  })
}

/** Classic Egger regression test (Egger et al. BMJ 1997): regress y/se on 1/se; test intercept. */
export function eggerTest(studies: { yi: number; vi: number }[]) {
  const k = studies.length
  if (k < 3) return null
  const zs = studies.map((s) => s.yi / Math.sqrt(s.vi))
  const xs = studies.map((s) => 1 / Math.sqrt(s.vi))
  const xbar = sum(xs) / k
  const zbar = sum(zs) / k
  const sxx = sum(xs.map((x) => (x - xbar) ** 2))
  if (sxx === 0) return null
  const slope = sum(xs.map((x, i) => (x - xbar) * (zs[i] - zbar))) / sxx
  const intercept = zbar - slope * xbar
  const rss = sum(zs.map((zv, i) => (zv - intercept - slope * xs[i]) ** 2))
  const s2 = rss / (k - 2)
  const seInt = Math.sqrt(s2 * (1 / k + (xbar * xbar) / sxx))
  const t = intercept / seInt
  return { intercept, seIntercept: seInt, slope, t, df: k - 2, p: pFromT(t, k - 2), lowPower: k < 10 }
}
