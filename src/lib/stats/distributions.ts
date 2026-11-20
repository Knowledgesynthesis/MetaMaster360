/**
 * Probability distributions used by the meta-analysis engine.
 * Implementations follow Numerical Recipes (3rd ed.) and Acklam's normal quantile
 * with a Halley refinement step; accuracy is ~1e-12 or better over practical ranges.
 */

const LANCZOS = [
  0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313,
  -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6,
  1.5056327351493116e-7,
]

export function lnGamma(x: number): number {
  if (x < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * x)) - lnGamma(1 - x)
  x -= 1
  let a = LANCZOS[0]
  const t = x + 7.5
  for (let i = 1; i < 9; i++) a += LANCZOS[i] / (x + i)
  return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a)
}

/** Regularized lower incomplete gamma P(a, x). */
export function gammaP(a: number, x: number): number {
  if (x <= 0) return 0
  if (x < a + 1) {
    let sum = 1 / a
    let del = sum
    let ap = a
    for (let n = 0; n < 1000; n++) {
      ap += 1
      del *= x / ap
      sum += del
      if (Math.abs(del) < Math.abs(sum) * 1e-16) break
    }
    return sum * Math.exp(-x + a * Math.log(x) - lnGamma(a))
  }
  return 1 - gammaQcf(a, x)
}

function gammaQcf(a: number, x: number): number {
  const FPMIN = 1e-300
  let b = x + 1 - a
  let c = 1 / FPMIN
  let d = 1 / b
  let h = d
  for (let i = 1; i < 1000; i++) {
    const an = -i * (i - a)
    b += 2
    d = an * d + b
    if (Math.abs(d) < FPMIN) d = FPMIN
    c = b + an / c
    if (Math.abs(c) < FPMIN) c = FPMIN
    d = 1 / d
    const del = d * c
    h *= del
    if (Math.abs(del - 1) < 1e-16) break
  }
  return Math.exp(-x + a * Math.log(x) - lnGamma(a)) * h
}

/** Regularized incomplete beta I_x(a, b). */
export function betaI(x: number, a: number, b: number): number {
  if (x <= 0) return 0
  if (x >= 1) return 1
  const bt = Math.exp(lnGamma(a + b) - lnGamma(a) - lnGamma(b) + a * Math.log(x) + b * Math.log(1 - x))
  if (x < (a + 1) / (a + b + 2)) return (bt * betacf(x, a, b)) / a
  return 1 - (bt * betacf(1 - x, b, a)) / b
}

function betacf(x: number, a: number, b: number): number {
  const FPMIN = 1e-300
  const qab = a + b
  const qap = a + 1
  const qam = a - 1
  let c = 1
  let d = 1 - (qab * x) / qap
  if (Math.abs(d) < FPMIN) d = FPMIN
  d = 1 / d
  let h = d
  for (let m = 1; m < 1000; m++) {
    const m2 = 2 * m
    let aa = (m * (b - m) * x) / ((qam + m2) * (a + m2))
    d = 1 + aa * d
    if (Math.abs(d) < FPMIN) d = FPMIN
    c = 1 + aa / c
    if (Math.abs(c) < FPMIN) c = FPMIN
    d = 1 / d
    h *= d * c
    aa = (-(a + m) * (qab + m) * x) / ((a + m2) * (qap + m2))
    d = 1 + aa * d
    if (Math.abs(d) < FPMIN) d = FPMIN
    c = 1 + aa / c
    if (Math.abs(c) < FPMIN) c = FPMIN
    d = 1 / d
    const del = d * c
    h *= del
    if (Math.abs(del - 1) < 1e-16) break
  }
  return h
}

/** Standard normal CDF via erf(x) = P(1/2, x^2). */
export function normalCdf(z: number): number {
  if (!Number.isFinite(z)) return z > 0 ? 1 : 0
  const p = gammaP(0.5, (z * z) / 2)
  return z >= 0 ? 0.5 + 0.5 * p : 0.5 - 0.5 * p
}

/** Standard normal quantile (Acklam + one Halley step). */
export function normalQuantile(p: number): number {
  if (p <= 0) return -Infinity
  if (p >= 1) return Infinity
  const a = [-3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2, 1.38357751867269e2, -3.066479806614716e1, 2.506628277459239]
  const b = [-5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2, 6.680131188771972e1, -1.328068155288572e1]
  const c = [-7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783]
  const d = [7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996, 3.754408661907416]
  const plow = 0.02425
  let x: number
  if (p < plow) {
    const q = Math.sqrt(-2 * Math.log(p))
    x = (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
  } else if (p <= 1 - plow) {
    const q = p - 0.5
    const r = q * q
    x = ((((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q) / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1)
  } else {
    const q = Math.sqrt(-2 * Math.log(1 - p))
    x = -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
  }
  // Halley refinement
  const e = normalCdf(x) - p
  const u = e * Math.sqrt(2 * Math.PI) * Math.exp((x * x) / 2)
  return x - u / (1 + (x * u) / 2)
}

/** Student t CDF. */
export function tCdf(t: number, df: number): number {
  if (!Number.isFinite(t)) return t > 0 ? 1 : 0
  if (df === Infinity) return normalCdf(t)
  const x = df / (df + t * t)
  const tail = 0.5 * betaI(x, df / 2, 0.5)
  return t > 0 ? 1 - tail : tail
}

function bisect(f: (x: number) => number, target: number, lo: number, hi: number, increasing = true): number {
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2
    const v = f(mid)
    if ((v < target) === increasing) lo = mid
    else hi = mid
    if (Math.abs(hi - lo) < 1e-13 * Math.max(1, Math.abs(mid))) break
  }
  return (lo + hi) / 2
}

/** Student t quantile. */
export function tQuantile(p: number, df: number): number {
  if (p <= 0) return -Infinity
  if (p >= 1) return Infinity
  if (df === Infinity) return normalQuantile(p)
  if (p < 0.5) return -tQuantile(1 - p, df)
  let hi = 10
  while (tCdf(hi, df) < p) hi *= 2
  return bisect((t) => tCdf(t, df), p, 0, hi)
}

export function chiSquareCdf(x: number, df: number): number {
  if (x <= 0) return 0
  return gammaP(df / 2, x / 2)
}

export function chiSquareQuantile(p: number, df: number): number {
  if (p <= 0) return 0
  if (p >= 1) return Infinity
  let hi = Math.max(1, df)
  while (chiSquareCdf(hi, df) < p) hi *= 2
  return bisect((x) => chiSquareCdf(x, df), p, 0, hi)
}

/** Two-sided p-value from a z statistic. */
export const pFromZ = (z: number) => 2 * (1 - normalCdf(Math.abs(z)))
/** Two-sided p-value from a t statistic. */
export const pFromT = (t: number, df: number) => 2 * (1 - tCdf(Math.abs(t), df))

/** Exact binomial probability mass. */
export function binomialPmf(x: number, n: number, p: number): number {
  if (x < 0 || x > n) return 0
  const lc = lnGamma(n + 1) - lnGamma(x + 1) - lnGamma(n - x + 1)
  if (p === 0) return x === 0 ? 1 : 0
  if (p === 1) return x === n ? 1 : 0
  return Math.exp(lc + x * Math.log(p) + (n - x) * Math.log(1 - p))
}
