import { describe, expect, it } from 'vitest'
import {
  binaryEffect, chiSquareCdf, chiSquareQuantile, cohensKappa, combineGroups, designEffect, eggerTest, fromConfidenceInterval,
  hedgesG, leaveOneOut, meanDifference, meanSdFromMedian, metaAnalyze, normalCdf, normalQuantile, nntFromRR, oisBinary,
  sdFromMDCI, sdFromMeanCI, sdFromSE, signTest, subgroupAnalysis, tCdf, tQuantile, wilsonInterval, absoluteFromRR, fmt, fmtP,
  simulateLiterature,
} from './index'

// BCG vaccine trials (Colditz et al. 1994), the reference dataset used by metafor.
const BCG: [string, number, number, number, number][] = [
  ['Aronson 1948', 4, 119, 11, 128], ['Ferguson & Simes 1949', 6, 300, 29, 274], ['Rosenthal 1960', 3, 228, 11, 209],
  ['Hart & Sutherland 1977', 62, 13536, 248, 12619], ['Frimodt-Moller 1973', 33, 5036, 47, 5761], ['Stein & Aronson 1953', 180, 1361, 372, 1079],
  ['Vandiviere 1973', 8, 2537, 10, 619], ['TPT Madras 1980', 505, 87886, 499, 87892], ['Coetzee & Berjak 1968', 29, 7470, 45, 7232],
  ['Rosenthal 1961', 17, 1699, 65, 1600], ['Comstock 1974', 186, 50448, 141, 27197], ['Comstock & Webster 1969', 5, 2493, 3, 2338],
  ['Comstock 1976', 27, 16886, 29, 17825],
]
const bcgStudies = BCG.map(([label, tpos, tneg, cpos, cneg], i) => {
  const e = binaryEffect({ e1: tpos, n1: tpos + tneg, e2: cpos, n2: cpos + cneg }, 'RR')
  return { id: String(i), label, yi: e.yi, vi: e.vi }
})

describe('distributions (vs SciPy 1.18)', () => {
  it('normal', () => {
    expect(normalQuantile(0.975)).toBeCloseTo(1.959963984540054, 10)
    expect(normalQuantile(0.001)).toBeCloseTo(-3.090232306167813, 9)
    expect(normalCdf(-2.5)).toBeCloseTo(0.006209665325776132, 12)
  })
  it('t', () => {
    expect(tQuantile(0.975, 1)).toBeCloseTo(12.706204736174694, 8)
    expect(tQuantile(0.975, 4)).toBeCloseTo(2.7764451051977934, 9)
    expect(tQuantile(0.975, 29)).toBeCloseTo(2.045229642132703, 9)
    expect(tCdf(1.7, 7)).toBeCloseTo(0.9335355516087224, 10)
  })
  it('chi-square', () => {
    expect(chiSquareQuantile(0.975, 12)).toBeCloseTo(23.33666415864534, 8)
    expect(chiSquareQuantile(0.025, 12)).toBeCloseTo(4.4037885069817015, 8)
    expect(chiSquareCdf(15.2, 9)).toBeCloseTo(0.9144132093769869, 10)
  })
})

describe('meta-analysis on BCG data (metafor published values + independent SciPy REML)', () => {
  const reml = metaAnalyze(bcgStudies, { tau2Method: 'REML', ciMethod: 'wald' })
  it('common-effect inverse variance', () => {
    expect(reml.common.est).toBeCloseTo(-0.4302851636540906, 8)
    expect(reml.common.se).toBeCloseTo(0.04049875171086381, 8)
  })
  it('Q and I²', () => {
    expect(reml.heterogeneity.Q).toBeCloseTo(152.233008, 5)
    expect(reml.heterogeneity.df).toBe(12)
    expect(reml.heterogeneity.I2).toBeCloseTo(0.9222138463, 6)
  })
  it('REML τ² and pooled estimate', () => {
    expect(reml.heterogeneity.tau2).toBeCloseTo(0.3132432628912972, 7)
    expect(reml.random.est).toBeCloseTo(-0.7145323425931489, 7)
    expect(reml.random.se).toBeCloseTo(0.17978151720378535, 7)
  })
  it('Q-profile CI for τ²', () => {
    expect(reml.heterogeneity.tau2Lower).toBeCloseTo(0.1197183611, 6)
    expect(reml.heterogeneity.tau2Upper).toBeCloseTo(1.1114790841, 6)
  })
  it('prediction interval (t, k−2)', () => {
    expect(reml.prediction!.lower).toBeCloseTo(-2.0083759169984283, 6)
    expect(reml.prediction!.upper).toBeCloseTo(0.5793112318121305, 6)
  })
  it('HKSJ', () => {
    const h = metaAnalyze(bcgStudies, { tau2Method: 'REML', ciMethod: 'hksj' })
    expect(h.random.se).toBeCloseTo(0.18079174419280558, 7)
    expect(h.random.lower).toBeCloseTo(-1.1084437143383494, 6)
    expect(h.random.upper).toBeCloseTo(-0.32062097084794844, 6)
    expect(h.random.p).toBeCloseTo(0.0019200150952917434, 7)
    expect(h.recommendedCi).toBe('hksj')
  })
  it('DerSimonian–Laird', () => {
    const dl = metaAnalyze(bcgStudies, { tau2Method: 'DL', ciMethod: 'wald' })
    expect(dl.heterogeneity.tau2).toBeCloseTo(0.3087602628623764, 8)
    expect(dl.random.est).toBeCloseTo(-0.7141172220732271, 8)
    expect(dl.random.se).toBeCloseTo(0.1787420895354032, 8)
    // for DL, τ²-based I² equals the Q-based I²
    expect(dl.heterogeneity.I2).toBeCloseTo(dl.heterogeneity.I2fromQ, 10)
  })
  it('weights sum to 1', () => {
    const s = reml.studies.reduce((a, b) => a + b.wRandom, 0)
    expect(s).toBeCloseTo(1, 12)
  })
  it('Egger test', () => {
    const e = eggerTest(bcgStudies)!
    expect(e.intercept).toBeCloseTo(-2.112042120893297, 8)
    expect(e.seIntercept).toBeCloseTo(1.5072213283570086, 8)
    expect(e.p).toBeCloseTo(0.1887069950819787, 7)
    expect(e.lowPower).toBe(false)
  })
})

describe('meta-analysis edge cases', () => {
  it('k = 1: no heterogeneity, no PI', () => {
    const r = metaAnalyze([{ id: 'a', label: 'A', yi: 0.3, vi: 0.04 }])
    expect(r.random.est).toBeCloseTo(0.3)
    expect(r.heterogeneity.tau2).toBe(0)
    expect(r.prediction).toBeNull()
  })
  it('identical studies: τ² = 0, I² = 0, Wald recommended', () => {
    const r = metaAnalyze(['a', 'b', 'c', 'd'].map((id) => ({ id, label: id, yi: 0.5, vi: 0.02 })))
    expect(r.heterogeneity.tau2).toBe(0)
    expect(r.heterogeneity.I2).toBe(0)
    expect(r.recommendedCi).toBe('wald')
    expect(r.random.est).toBeCloseTo(r.common.est, 12)
  })
  it('k = 2 with HKSJ warns', () => {
    const r = metaAnalyze([{ id: 'a', label: 'A', yi: 0.1, vi: 0.01 }, { id: 'b', label: 'B', yi: 0.9, vi: 0.01 }], { ciMethod: 'hksj' })
    expect(r.warnings.join(' ')).toMatch(/two studies/)
    expect(r.recommendedCi).toBe('wald')
  })
  it('rejects zero or negative variance', () => {
    expect(() => metaAnalyze([{ id: 'a', label: 'A', yi: 0.1, vi: 0 }])).toThrow()
    expect(() => metaAnalyze([{ id: 'a', label: 'A', yi: 0.1, vi: -1 }])).toThrow()
  })
  it('handles extreme variance ratios without NaN', () => {
    const r = metaAnalyze([
      { id: 'a', label: 'A', yi: 0.1, vi: 1e-6 }, { id: 'b', label: 'B', yi: 2, vi: 100 }, { id: 'c', label: 'C', yi: -1, vi: 5 },
    ])
    expect(Number.isFinite(r.random.est)).toBe(true)
    expect(Number.isFinite(r.heterogeneity.tau2)).toBe(true)
  })
  it('REML never negative and converges for 200 random datasets', () => {
    let seed = 1
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
    for (let rep = 0; rep < 200; rep++) {
      const k = 2 + Math.floor(rnd() * 20)
      const s = Array.from({ length: k }, (_, i) => ({ id: String(i), label: String(i), yi: (rnd() - 0.5) * 3, vi: 0.001 + rnd() * 0.5 }))
      const r = metaAnalyze(s)
      expect(r.heterogeneity.tau2).toBeGreaterThanOrEqual(0)
      expect(Number.isFinite(r.random.lower) && Number.isFinite(r.random.upper)).toBe(true)
      expect(r.random.lower).toBeLessThanOrEqual(r.random.upper)
    }
  })
  it('subgroup test and leave-one-out', () => {
    const s = bcgStudies.map((x, i) => ({ ...x, group: i < 6 ? 'early' : 'late' }))
    const sg = subgroupAnalysis(s, 'random')
    expect(sg.groups).toHaveLength(2)
    expect(sg.test!.df).toBe(1)
    expect(sg.test!.p).toBeGreaterThan(0)
    const loo = leaveOneOut(bcgStudies)
    expect(loo).toHaveLength(13)
  })
})

describe('effect sizes (Cochrane Handbook ch. 6)', () => {
  it('MD', () => {
    const r = meanDifference(135, 12, 50, 145, 15, 50)
    expect(r.yi).toBe(-10)
    expect(r.sei).toBeCloseTo(Math.sqrt(144 / 50 + 225 / 50), 12)
  })
  it("Hedges' g", () => {
    const r = hedgesG(10, 4, 20, 12, 4, 20)
    expect(r.d).toBeCloseTo(-0.5, 12)
    expect(r.J).toBeCloseTo(1 - 3 / (4 * 40 - 9), 12)
    expect(r.yi).toBeCloseTo(-0.5 * (1 - 3 / 151), 12)
    expect(r.vi).toBeCloseTo(40 / 400 + r.yi ** 2 / (2 * (40 - 3.94)), 12)
  })
  it('RR and OR', () => {
    const rr = binaryEffect({ e1: 20, n1: 100, e2: 40, n2: 100 }, 'RR')
    expect(Math.exp(rr.yi)).toBeCloseTo(0.5, 12)
    expect(rr.vi).toBeCloseTo(1 / 20 - 1 / 100 + 1 / 40 - 1 / 100, 12)
    const or = binaryEffect({ e1: 20, n1: 100, e2: 40, n2: 100 }, 'OR')
    expect(Math.exp(or.yi)).toBeCloseTo((20 * 60) / (80 * 40), 12)
  })
  it('zero cells and double zero', () => {
    const z = binaryEffect({ e1: 0, n1: 50, e2: 5, n2: 50 }, 'OR')
    expect(z.notes[0]).toMatch(/0.5 added/)
    expect(Math.exp(z.yi)).toBeCloseTo((0.5 * 45.5) / (50.5 * 5.5), 10)
    const dz = binaryEffect({ e1: 0, n1: 50, e2: 0, n2: 50 }, 'RR')
    expect(dz.excluded).toBe(true)
    const rd = binaryEffect({ e1: 0, n1: 50, e2: 0, n2: 50 }, 'RD')
    expect(rd.yi).toBe(0)
    expect(rd.vi).toBeGreaterThan(0)
  })
  it('rejects impossible 2×2 data', () => {
    expect(() => binaryEffect({ e1: 60, n1: 50, e2: 1, n2: 50 }, 'RR')).toThrow()
    expect(() => binaryEffect({ e1: 1.5, n1: 50, e2: 1, n2: 50 }, 'RR')).toThrow()
  })
  it('HR from CI', () => {
    const r = fromConfidenceInterval(0.75, 0.6, 0.94, 'HR')
    expect(r.yi).toBeCloseTo(Math.log(0.75), 12)
    expect(r.sei).toBeCloseTo((Math.log(0.94) - Math.log(0.6)) / (2 * 1.959963984540054), 12)
    expect(() => fromConfidenceInterval(0.75, 0.8, 0.94, 'HR')).toThrow()
  })
  it('NNT and absolute effects', () => {
    const n = nntFromRR(0.2, 0.75)
    expect(n.arr).toBeCloseTo(0.05, 12)
    expect(n.nnt).toBeCloseTo(20, 10)
    expect(n.label).toBe('NNTB')
    expect(absoluteFromRR(0.2, 0.75).differencePer1000).toBeCloseTo(-50, 10)
  })
})

describe('conversions', () => {
  it('SD from SE and CI', () => {
    expect(sdFromSE(2, 25)).toBe(10)
    const big = sdFromMeanCI(10, 14, 100)
    expect(big.usedT).toBe(false)
    expect(big.sd).toBeCloseTo((10 * 4) / (2 * 1.959963984540054), 10)
    const small = sdFromMeanCI(10, 14, 25)
    expect(small.usedT).toBe(true)
    expect(small.sd).toBeCloseTo((5 * 4) / (2 * tQuantile(0.975, 24)), 10)
    const md = sdFromMDCI(-5, -1, 100, 100)
    expect(md.se).toBeCloseTo(4 / (2 * 1.959963984540054), 10)
  })
  it('combine groups (Handbook Table 6.5.a)', () => {
    const c = combineGroups(10, 5, 2, 10, 7, 2)
    expect(c.n).toBe(20)
    expect(c.mean).toBe(6)
    // brute force: pooled variance of two groups with known means
    const expected = Math.sqrt((9 * 4 + 9 * 4 + (100 / 20) * (25 + 49 - 70)) / 19)
    expect(c.sd).toBeCloseTo(expected, 12)
  })
  it('median/IQR to mean/SD (Luo 2018; Wan 2014)', () => {
    const r = meanSdFromMedian({ n: 100, median: 50, q1: 40, q3: 60 })
    expect(r.mean).toBeCloseTo(50, 10)
    expect(r.sd).toBeCloseTo(20 / (2 * normalQuantile((75 - 0.125) / 100.25)), 10)
    const s = meanSdFromMedian({ n: 50, median: 10, min: 2, max: 30 })
    const w = 4 / (4 + 50 ** 0.75)
    expect(s.mean).toBeCloseTo((w * 32) / 2 + (1 - w) * 10, 10)
    expect(() => meanSdFromMedian({ n: 50, median: 10, q1: 12, q3: 20 })).toThrow()
  })
  it('design effect', () => {
    expect(designEffect(21, 0.05)).toBeCloseTo(2, 12)
  })
})

describe('other tools', () => {
  it('kappa', () => {
    const k = cohensKappa(20, 5, 10, 65)
    expect(k.po).toBeCloseTo(0.85, 12)
    expect(k.pe).toBeCloseTo((25 * 30 + 75 * 70) / 10000, 12)
    expect(k.kappa).toBeCloseTo((0.85 - 0.6) / 0.4, 12)
  })
  it('sign test vs SciPy', () => {
    expect(signTest(8, 2).p).toBeCloseTo(0.109375, 12)
    expect(signTest(5, 5).p).toBe(1)
  })
  it('Wilson interval', () => {
    const w = wilsonInterval(8, 10)
    expect(w.lower).toBeGreaterThan(0.44)
    expect(w.upper).toBeLessThan(0.97)
  })
  it('optimal information size', () => {
    const o = oisBinary(0.2, 0.25)
    // classic GRADE example: control risk 20%, RRR 25% → ~ 1,800–2,000 total
    expect(o.total).toBeGreaterThan(1700)
    expect(o.total).toBeLessThan(2200)
  })
  it('formatting', () => {
    expect(fmt(-0.5)).toBe('−0.50')
    expect(fmt(-0.001)).toBe('0.00')
    expect(fmtP(0.0004)).toBe('< 0.001')
    expect(fmtP(0.0312)).toBe('0.031')
  })
  it('simulation is reproducible for a seed', () => {
    const a = simulateLiterature({ trueEffect: 0, tau: 0, candidates: 30, selection: 0.8, minN: 10, maxN: 300, seed: 42 })
    const b = simulateLiterature({ trueEffect: 0, tau: 0, candidates: 30, selection: 0.8, minN: 10, maxN: 300, seed: 42 })
    expect(a).toEqual(b)
    expect(a.some((s) => !s.published)).toBe(true)
  })
})
