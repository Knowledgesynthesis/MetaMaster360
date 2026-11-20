import { describe, expect, it } from 'vitest'
import { MODULES, MODULE_BY_ID, LEGACY_ROUTES } from './modules'
import { QUIZ, ALL_QUESTIONS } from './quiz'
import { GLOSSARY } from './glossary'
import { REFS } from './references'
import { PRISMA_2020 } from './prisma2020'
import { CASE_STUDIES } from './case'
import { DATASETS, FIELDS } from './datasets'
import { MODULE_CONTENT } from '@/modules'
import { DECISIONS } from '@/modules/Capstone'
import { ITEMS as EXTRACTION_ITEMS } from '@/labs/ExtractionExercise'
import { ABSTRACTS } from '@/labs/ScreeningSim'
import { RAW_RECORDS, autoDedup } from '@/labs/DedupLab'
import { CASE_SOF } from '@/labs/SofBuilder'
import { rob2Domain1, overallRob2 } from '@/labs/RobLabs'
import { binaryEffect, combineGroups, designEffect, hedgesG, meanSdFromMedian, metaAnalyze, sdFromSE, subgroupAnalysis, absoluteFromRR } from '@/lib/stats'

describe('module registry', () => {
  it('has 17 modules with unique ids, sequential numbers and content', () => {
    expect(MODULES).toHaveLength(17)
    expect(new Set(MODULES.map((m) => m.id)).size).toBe(17)
    MODULES.forEach((m, i) => expect(m.n).toBe(i + 1))
    for (const m of MODULES) {
      expect(MODULE_CONTENT[m.id]).toBeDefined()
      expect(m.objectives.length).toBeGreaterThanOrEqual(3)
    }
  })
  it('legacy routes map to real modules', () => {
    Object.values(LEGACY_ROUTES).forEach((id) => expect(MODULE_BY_ID[id]).toBeDefined())
  })
})

describe('question bank', () => {
  it('every module has at least 5 questions', () => {
    for (const m of MODULES) expect(QUIZ[m.id].length, m.id).toBeGreaterThanOrEqual(5)
  })
  it('ids are unique; answers valid; options distinct; explanations present', () => {
    expect(new Set(ALL_QUESTIONS.map((q) => q.id)).size).toBe(ALL_QUESTIONS.length)
    for (const q of ALL_QUESTIONS) {
      expect(q.options.length, q.id).toBeGreaterThanOrEqual(3)
      expect(new Set(q.options).size, q.id).toBe(q.options.length)
      expect(q.answer, q.id).toBeGreaterThanOrEqual(0)
      expect(q.answer, q.id).toBeLessThan(q.options.length)
      expect(q.explain.length, q.id).toBeGreaterThan(20)
    }
  })
  it('the bank is large enough for a 30-question exam', () => {
    expect(ALL_QUESTIONS.length).toBeGreaterThanOrEqual(100)
  })
})

describe('glossary, references, PRISMA', () => {
  it('glossary terms are unique and link to existing modules', () => {
    expect(new Set(GLOSSARY.map((t) => t.term)).size).toBe(GLOSSARY.length)
    GLOSSARY.forEach((t) => t.module && expect(MODULE_BY_ID[t.module], t.term).toBeDefined())
  })
  it('references use https', () => {
    Object.values(REFS).forEach((r) => expect(r.url.startsWith('https://'), r.cite).toBe(true))
  })
  it('PRISMA 2020 has 27 items / 42 including sub-items', () => {
    expect(PRISMA_2020).toHaveLength(42)
    expect(new Set(PRISMA_2020.map((i) => i.id.replace(/[a-f]$/, ''))).size).toBe(27)
  })
})

describe('running case: numbers quoted in the text match the engine', () => {
  const smd = CASE_STUDIES.map((c) => { const g = hedgesG(c.m1, c.sd1, c.n1, c.m2, c.sd2, c.n2); return { id: c.id, label: c.label, yi: g.yi, vi: g.vi, group: c.delivery } })
  const r = metaAnalyze(smd)
  const r2 = (x: number) => Math.round(x * 100) / 100
  it('primary analysis: SMD −0.35 (−0.56 to −0.14), PI −0.75 to 0.05, I² 34%', () => {
    expect(r2(r.random.est)).toBe(-0.35)
    expect(r2(r.random.lower)).toBe(-0.56)
    expect(r2(r.random.upper)).toBe(-0.14)
    expect(r2(r.prediction!.lower)).toBe(-0.75)
    expect(r2(r.prediction!.upper)).toBe(0.05)
    expect(Math.round(r.heterogeneity.I2 * 100)).toBe(34)
    expect(r.recommendedCi).toBe('hksj')
  })
  it('participants: 934 analysed (984 randomised)', () => {
    expect(CASE_STUDIES.reduce((a, c) => a + c.n1 + c.n2, 0)).toBe(934)
  })
  it('sensitivity excluding high risk of bias: SMD −0.22, I² 0%', () => {
    const high = CASE_STUDIES.filter((c) => c.robOverall === 'high').map((c) => c.id)
    expect(high).toHaveLength(3)
    const s = metaAnalyze(smd.filter((x) => !high.includes(x.id)))
    expect(r2(s.random.est)).toBe(-0.22)
    expect(Math.round(s.heterogeneity.I2 * 100)).toBe(0)
    const w = r.studies.filter((x) => high.includes(x.id)).reduce((a, b) => a + b.wRandom, 0)
    expect(Math.round(w * 100)).toBe(20)
  })
  it('subgroups: supervised −0.46 vs home-based −0.15, p ≈ 0.02', () => {
    const sg = subgroupAnalysis(smd, 'random')
    const sup = sg.groups.find((g) => g.name === 'Supervised')!
    const home = sg.groups.find((g) => g.name === 'Home-based')!
    expect(r2(sup.result.random.est)).toBe(-0.46)
    expect(r2(home.result.random.est)).toBe(-0.15)
    expect(home.result.k).toBe(2)
    expect(sg.test!.p).toBeLessThan(0.05)
    expect(sg.test!.p).toBeGreaterThan(0.01)
  })
  it('response: RR 1.41 (1.13 to 1.76)', () => {
    const b = CASE_STUDIES.map((c) => { const e = binaryEffect({ e1: c.r1, n1: c.n1, e2: c.r2, n2: c.n2 }, 'RR'); return { id: c.id, label: c.label, yi: e.yi, vi: e.vi } })
    const rr = metaAnalyze(b)
    expect(r2(Math.exp(rr.random.est))).toBe(1.41)
    expect(r2(Math.exp(rr.random.lower))).toBe(1.13)
    expect(r2(Math.exp(rr.random.upper))).toBe(1.76)
  })
  it('RoB judgements are internally consistent with the RoB 2 overall rule', () => {
    for (const c of CASE_STUDIES) expect(overallRob2(c.rob).j, c.label).toBe(c.robOverall)
  })
  it('SoF row for response: 398 per 1000, 116 more (37 to 214 more)', () => {
    const row = CASE_SOF.find((x) => x.type === 'RR' && x.outcome.startsWith('Response'))!
    expect(Math.round(absoluteFromRR(row.cr, row.est).interventionPer1000)).toBe(398)
    expect(Math.round(absoluteFromRR(row.cr, row.est).differencePer1000)).toBe(116)
    expect(Math.round(absoluteFromRR(row.cr, row.lo).differencePer1000)).toBe(37)
    expect(Math.round(absoluteFromRR(row.cr, row.hi).differencePer1000)).toBe(214)
  })
})

describe('lab answer keys are correct', () => {
  it('extraction exercise keys follow from the excerpts', () => {
    const k = Object.fromEntries(EXTRACTION_ITEMS.map((i) => [i.id, i.key]))
    expect(sdFromSE(0.44, 150)).toBeCloseTo(k.fuj.sd1, 1)
    expect(sdFromSE(0.46, 148)).toBeCloseTo(k.fuj.sd2, 1)
    const g1 = meanSdFromMedian({ n: 55, median: 16, q1: 11, q3: 21.5 })
    const g2 = meanSdFromMedian({ n: 57, median: 19, q1: 13.5, q3: 24.5 })
    expect(g1.mean).toBeCloseTo(k.gal.m1, 1)
    expect(g1.sd).toBeCloseTo(k.gal.sd1, 1)
    expect(g2.mean).toBeCloseTo(k.gal.m2, 1)
    expect(g2.sd).toBeCloseTo(k.gal.sd2, 1)
    const c = combineGroups(32, 11.6, 6.0, 32, 12.4, 6.2)
    expect(c.n).toBe(k.dim.n1)
    expect(c.mean).toBeCloseTo(k.dim.m1, 5)
    expect(c.sd).toBeCloseTo(k.dim.sd1, 2)
    const de = designEffect(11, 0.03)
    expect(Math.round(110 / de)).toBe(k.cho.n1)
    expect(Math.round(108 / de)).toBe(k.cho.n2)
  })
  it('prepared extraction values are those used by the case dataset', () => {
    const byId = Object.fromEntries(CASE_STUDIES.map((c) => [c.id, c]))
    for (const it of EXTRACTION_ITEMS) {
      const c = byId[it.id]
      expect(c.n1).toBe(it.key.n1)
      expect(c.n2).toBe(it.key.n2)
      expect(c.m1).toBeCloseTo(it.key.m1, 1)
      expect(c.sd1).toBeCloseTo(it.key.sd1, 0)
      expect(c.sd2).toBeCloseTo(it.key.sd2, 0)
    }
  })
  it('screening key includes exactly the 8 case studies', () => {
    const included = ABSTRACTS.filter((a) => a.ta === 'forward' && a.ft === 'Eligible — include').map((a) => a.cite).sort()
    expect(included).toEqual(CASE_STUDIES.map((c) => c.label).sort())
    ABSTRACTS.filter((a) => a.ta === 'exclude').forEach((a) => expect(a.ft).not.toBe('Eligible — include'))
  })
  it('deduplication key: 4 duplicates; fuzzy matching finds all and never removes companion reports', () => {
    expect(RAW_RECORDS.filter((r) => r.key === 'duplicate')).toHaveLength(4)
    const fuzzy = autoDedup(RAW_RECORDS, 'fuzzy').flagged.map((f) => f.id).sort()
    expect(fuzzy).toEqual(RAW_RECORDS.filter((r) => r.key === 'duplicate').map((r) => r.id).sort())
    expect(autoDedup(RAW_RECORDS, 'doi').flagged.length).toBeLessThan(4)
  })
  it('RoB 2 domain 1 algorithm', () => {
    expect(rob2Domain1('Y', 'Y', 'N')!.j).toBe('low')
    expect(rob2Domain1('NI', 'Y', 'NI')!.j).toBe('low')
    expect(rob2Domain1('N', 'N', 'N')!.j).toBe('high')
    expect(rob2Domain1('Y', 'NI', 'N')!.j).toBe('some')
    expect(rob2Domain1('Y', 'NI', 'Y')!.j).toBe('high')
    expect(rob2Domain1('Y', 'Y', 'PY')!.j).toBe('some')
    expect(rob2Domain1('PN', 'PY', 'N')!.j).toBe('some')
  })
  it('capstone decisions have valid answers', () => {
    DECISIONS.forEach((d) => expect(d.answer).toBeLessThan(d.options.length))
    DECISIONS.forEach((d) => expect(MODULE_BY_ID[d.module]).toBeDefined())
  })
  it('datasets are complete and numeric', () => {
    for (const d of DATASETS) for (const r of d.rows) {
      expect(r.values.length, `${d.id} ${r.label}`).toBe(FIELDS[d.mode].length)
      r.values.forEach((v) => expect(Number.isFinite(v)).toBe(true))
    }
  })
})
