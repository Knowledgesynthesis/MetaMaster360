import { binomialPmf, normalQuantile } from './distributions'

/** Cohen's kappa for two reviewers making include/exclude decisions. */
export function cohensKappa(bothInclude: number, r1IncludeR2Exclude: number, r1ExcludeR2Include: number, bothExclude: number) {
  const a = bothInclude, b = r1IncludeR2Exclude, c = r1ExcludeR2Include, d = bothExclude
  const n = a + b + c + d
  if (!(n > 0) || [a, b, c, d].some((x) => x < 0 || !Number.isInteger(x))) throw new Error('Counts must be non-negative whole numbers.')
  const po = (a + d) / n
  const pe = ((a + b) * (a + c) + (c + d) * (b + d)) / (n * n)
  const kappa = pe === 1 ? 1 : (po - pe) / (1 - pe)
  const se = pe === 1 ? 0 : Math.sqrt((po * (1 - po)) / (n * (1 - pe) ** 2))
  const z = normalQuantile(0.975)
  const pabak = 2 * po - 1
  return { n, po, pe, kappa, lower: kappa - z * se, upper: kappa + z * se, pabak }
}

/** Landis & Koch (1977) descriptive bands — conventions, not validated thresholds. */
export function kappaLabel(k: number) {
  if (k < 0) return 'Poor (worse than chance)'
  if (k <= 0.2) return 'Slight'
  if (k <= 0.4) return 'Fair'
  if (k <= 0.6) return 'Moderate'
  if (k <= 0.8) return 'Substantial'
  return 'Almost perfect'
}

/** Exact two-sided sign (binomial) test, as recommended for vote counting by direction of effect (Handbook 12.2.2.3). */
export function signTest(positive: number, negative: number) {
  const n = positive + negative
  if (n === 0) return { n, p: 1 }
  let lower = 0
  let upper = 0
  for (let x = 0; x <= n; x++) {
    const pm = binomialPmf(x, n, 0.5)
    if (x <= positive) lower += pm
    if (x >= positive) upper += pm
  }
  return { n, p: Math.min(1, 2 * Math.min(lower, upper)) }
}

/** Wilson score interval for a proportion. */
export function wilsonInterval(x: number, n: number, level = 0.95) {
  if (n === 0) return { p: NaN, lower: NaN, upper: NaN }
  const z = normalQuantile(1 - (1 - level) / 2)
  const p = x / n
  const denom = 1 + (z * z) / n
  const centre = (p + (z * z) / (2 * n)) / denom
  const half = (z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n))) / denom
  return { p, lower: Math.max(0, centre - half), upper: Math.min(1, centre + half) }
}

/**
 * Optimal information size (GRADE guidance 6, Guyatt 2011): the total sample size
 * a single adequately powered trial would need. Binary outcome version.
 */
export function oisBinary(controlRisk: number, relativeRiskReduction: number, alpha = 0.05, power = 0.8) {
  const p1 = controlRisk
  const p2 = controlRisk * (1 - relativeRiskReduction)
  const za = normalQuantile(1 - alpha / 2)
  const zb = normalQuantile(power)
  const perGroup = ((za + zb) ** 2 * (p1 * (1 - p1) + p2 * (1 - p2))) / (p1 - p2) ** 2
  return { perGroup: Math.ceil(perGroup), total: 2 * Math.ceil(perGroup), p1, p2 }
}

/** Optimal information size for a continuous outcome (difference delta, common SD). */
export function oisContinuous(delta: number, sd: number, alpha = 0.05, power = 0.8) {
  const za = normalQuantile(1 - alpha / 2)
  const zb = normalQuantile(power)
  const perGroup = (2 * (za + zb) ** 2 * sd * sd) / (delta * delta)
  return { perGroup: Math.ceil(perGroup), total: 2 * Math.ceil(perGroup) }
}
