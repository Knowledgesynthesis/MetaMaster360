import { useMemo, useState } from 'react'
import { Download, Plus, Trash2, Upload } from 'lucide-react'
import { Button, Callout, CopyButton, Disclosure, Lab, Segmented, Select, Stat, TextArea, TextInput, Badge } from '@/components/ui'
import { ForestPlot, type ForestGroup } from '@/components/plots/ForestPlot'
import { DATASETS, FIELDS, type DataMode, type Dataset } from '@/content/datasets'
import {
  binaryEffect, fmt, pEq, fromConfidenceInterval, hedgesG, isRatio, meanDifference, metaAnalyze, subgroupAnalysis,
  type CiMethod, type Measure, type MetaResult, type StudyInput, type Tau2Method,
} from '@/lib/stats'
import { downloadText, parseNum, toCSV, cn } from '@/lib/utils'

interface Row { id: string; include: boolean; label: string; group: string; values: string[] }

const MEASURES: Record<DataMode, Measure[]> = { continuous: ['SMD', 'MD'], binary: ['RR', 'OR', 'RD'], generic: ['HR', 'RR', 'OR', 'MD', 'SMD'] }
const MEASURE_NAMES: Record<string, string> = { SMD: 'Std. mean difference', MD: 'Mean difference', RR: 'Risk ratio', OR: 'Odds ratio', RD: 'Risk difference', HR: 'Hazard ratio', GEN: 'Effect' }

let uid = 0
const toRows = (d: Dataset): Row[] => d.rows.map((r) => ({ id: `r${uid++}`, include: true, label: r.label, group: r.group, values: r.values.map(String) }))

export function computeStudies(rows: Row[], mode: DataMode, measure: Measure) {
  const studies: StudyInput[] = []
  const problems: { label: string; msg: string }[] = []
  for (const r of rows) {
    if (!r.include) continue
    const v = r.values.map(parseNum)
    if (v.some((x) => Number.isNaN(x))) {
      problems.push({ label: r.label || '(unnamed)', msg: 'Missing or non-numeric value.' })
      continue
    }
    try {
      let yi: number, vi: number
      if (mode === 'continuous') {
        const [n1, m1, sd1, n2, m2, sd2] = v
        const e = measure === 'MD' ? meanDifference(m1, sd1, n1, m2, sd2, n2) : hedgesG(m1, sd1, n1, m2, sd2, n2)
        yi = e.yi; vi = e.vi
      } else if (mode === 'binary') {
        const [e1, n1, e2, n2] = v
        const e = binaryEffect({ e1, n1, e2, n2 }, measure as 'RR' | 'OR' | 'RD')
        if (e.excluded) { problems.push({ label: r.label, msg: e.notes[0] }); continue }
        e.notes.forEach((n) => problems.push({ label: r.label, msg: n }))
        yi = e.yi; vi = e.vi
      } else {
        const [est, lo, hi] = v
        const e = fromConfidenceInterval(est, lo, hi, measure)
        e.notes.forEach((n) => problems.push({ label: r.label, msg: n }))
        yi = e.yi; vi = e.vi
      }
      studies.push({ id: r.id, label: r.label || '(unnamed)', yi, vi, group: r.group.trim() || 'Ungrouped' })
    } catch (e) {
      problems.push({ label: r.label || '(unnamed)', msg: (e as Error).message })
    }
  }
  return { studies, problems }
}

function interpretation(r: MetaResult, measure: Measure, model: 'random' | 'common') {
  const ratio = isRatio(measure)
  const nat = (x: number) => fmt(ratio ? Math.exp(x) : x, 2)
  const e = model === 'random' ? r.random : r.common
  const h = r.heterogeneity
  const name = MEASURE_NAMES[measure].toLowerCase()
  const modelTxt = model === 'random' ? `Random-effects (${r.options.tau2Method}, ${r.options.ciMethod === 'hksj' ? 'HKSJ' : 'Wald'} CI)` : 'Common-effect (inverse variance)'
  const crosses = e.lower < 0 && e.upper > 0
  let s = `${modelTxt} pooled ${name}: ${nat(e.est)} (95% CI ${nat(e.lower)} to ${nat(e.upper)}; ${r.k} studies). `
  if (r.k > 1) s += `Heterogeneity: τ² = ${fmt(h.tau2, 3)}, I² = ${Math.round(h.I2 * 100)}%, Q = ${fmt(h.Q, 2)} (df = ${h.df}, ${pEq(h.pQ)}). `
  if (r.prediction && model === 'random') {
    const pc = r.prediction.lower < 0 && r.prediction.upper > 0
    s += `95% prediction interval ${nat(r.prediction.lower)} to ${nat(r.prediction.upper)}${pc ? ' — in a new setting similar to these studies, the true effect could plausibly be in either direction.' : ' — the effect is expected in the same direction in similar settings.'} `
  }
  s += crosses ? 'The confidence interval includes no effect: the data are compatible with benefit, no effect and possibly harm — this is not evidence of no effect.' : 'The confidence interval excludes no effect; judge importance against a minimal important difference and certainty (GRADE).'
  return s
}

export function MetaLab({ initial = 'case-smd', subgroupsDefault = false }: { initial?: string; subgroupsDefault?: boolean }) {
  const start = DATASETS.find((d) => d.id === initial) ?? DATASETS[0]
  const [mode, setMode] = useState<DataMode>(start.mode)
  const [measure, setMeasure] = useState<Measure>(start.measure)
  const [rows, setRows] = useState<Row[]>(() => toRows(start))
  const [left, setLeft] = useState(start.left)
  const [right, setRight] = useState(start.right)
  const [note, setNote] = useState(start.note)
  const [tau2Method, setTau2Method] = useState<Tau2Method>('REML')
  const [ciMethod, setCiMethod] = useState<CiMethod>('hksj')
  const [model, setModel] = useState<'random' | 'common'>('random')
  const [showPI, setShowPI] = useState(true)
  const [bySubgroup, setBySubgroup] = useState(subgroupsDefault)
  const [csv, setCsv] = useState('')

  const load = (id: string) => {
    const d = DATASETS.find((x) => x.id === id)
    if (!d) return
    setMode(d.mode); setMeasure(d.measure); setRows(toRows(d)); setLeft(d.left); setRight(d.right); setNote(d.note)
  }
  const blank = (m: DataMode) => {
    setMode(m); setMeasure(MEASURES[m][0]); setNote('')
    setRows(Array.from({ length: 3 }, (_, i) => ({ id: `r${uid++}`, include: true, label: `Study ${i + 1}`, group: '', values: FIELDS[m].map(() => '') })))
    setLeft('Favours intervention'); setRight('Favours control')
  }

  const { studies, problems } = useMemo(() => computeStudies(rows, mode, measure), [rows, mode, measure])
  const opts = { tau2Method, ciMethod }
  const result = useMemo(() => { try { return studies.length ? metaAnalyze(studies, opts) : null } catch { return null } }, [studies, tau2Method, ciMethod]) // eslint-disable-line react-hooks/exhaustive-deps
  const groupsPresent = new Set(studies.map((s) => s.group)).size > 1
  const sub = useMemo(() => (bySubgroup && groupsPresent ? subgroupAnalysis(studies, model, opts) : null), [bySubgroup, groupsPresent, studies, model, tau2Method, ciMethod]) // eslint-disable-line react-hooks/exhaustive-deps
  const ratio = isRatio(measure)
  const nat = (x: number) => fmt(ratio ? Math.exp(x) : x, 2)

  const forest: ForestGroup[] = useMemo(() => {
    if (!result) return []
    const w = (id: string) => { const s = result.studies.find((x) => x.id === id); return s ? (model === 'random' ? s.wRandom : s.wCommon) : 0 }
    const summary = (r: MetaResult, label: string) => {
      const e = model === 'random' ? r.random : r.common
      return { label, est: e.est, lower: e.lower, upper: e.upper, pi: model === 'random' && showPI ? r.prediction : null }
    }
    if (sub) {
      return [
        ...sub.groups.map((g) => ({
          title: g.name,
          rows: g.result.studies.map((s) => ({ label: s.label, est: s.yi, lower: s.lower, upper: s.upper, weight: w(s.id) })),
          summaries: [{ ...summary(g.result, `Subtotal (k = ${g.result.k})`), pi: null }],
        })),
        { rows: [], summaries: [summary(result, `Overall (k = ${result.k})`)] },
      ]
    }
    return [{ rows: result.studies.map((s) => ({ label: s.label, est: s.yi, lower: s.lower, upper: s.upper, weight: model === 'random' ? s.wRandom : s.wCommon })), summaries: [summary(result, model === 'random' ? 'Random effects' : 'Common effect')] }]
  }, [result, sub, model, showPI])

  const exportCsv = () => {
    if (!result) return
    const head = ['Study', 'Group', `${measure}${ratio ? ' (ln)' : ''}`, 'SE', `${measure}`, 'CI lower', 'CI upper', 'Weight common %', 'Weight random %']
    const body = result.studies.map((s) => [s.label, s.group ?? '', s.yi.toFixed(5), s.se.toFixed(5), nat(s.yi), nat(s.lower), nat(s.upper), (s.wCommon * 100).toFixed(2), (s.wRandom * 100).toFixed(2)])
    downloadText(toCSV([head, ...body]), 'meta-analysis.csv', 'text/csv')
  }
  const importCsv = () => {
    const lines = csv.trim().split(/\r?\n/).filter(Boolean)
    const parsed: Row[] = []
    const nf = FIELDS[mode].length
    for (const line of lines) {
      const cells = line.split(/\t|;|,/).map((c) => c.trim())
      if (cells.length < nf + 1 || cells.slice(1, nf + 1).some((c) => Number.isNaN(parseNum(c)))) continue
      parsed.push({ id: `r${uid++}`, include: true, label: cells[0], values: cells.slice(1, nf + 1), group: cells[nf + 1] ?? '' })
    }
    if (parsed.length) { setRows(parsed); setCsv('') }
  }

  return (
    <Lab
      title="Meta-analysis engine"
      subtitle="Edit any cell; everything recalculates. Validated against metafor on the BCG dataset (see tests)."
      actions={
        <Select aria-label="Load dataset" value="" onChange={(e) => (e.target.value.startsWith('blank:') ? blank(e.target.value.slice(6) as DataMode) : load(e.target.value))} className="w-56">
          <option value="" disabled>Load data…</option>
          {DATASETS.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          <option value="blank:continuous">Blank — continuous</option>
          <option value="blank:binary">Blank — binary</option>
          <option value="blank:generic">Blank — estimate + CI</option>
        </Select>
      }
    >
      {note && <p className="text-sm text-muted">{note}</p>}
      <div className="flex flex-wrap items-end gap-3">
        <Select label="Effect measure" value={measure} onChange={(e) => setMeasure(e.target.value as Measure)} className="w-48">
          {MEASURES[mode].map((m) => <option key={m} value={m}>{MEASURE_NAMES[m]} ({m})</option>)}
        </Select>
        <TextInput label="Left label" value={left} onChange={(e) => setLeft(e.target.value)} className="w-44" />
        <TextInput label="Right label" value={right} onChange={(e) => setRight(e.target.value)} className="w-44" />
      </div>

      <div className="relative overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface-2 text-left text-xs">
            <tr>
              <th className="px-2 py-2" scope="col"><span className="sr-only">Include</span>✓</th>
              <th className="px-2 py-2" scope="col">Study</th>
              {FIELDS[mode].map((f) => <th key={f.key} className="px-1 py-2" scope="col">{f.label}</th>)}
              <th className="px-2 py-2" scope="col">Subgroup</th>
              <th className="px-2 py-2" scope="col"><span className="sr-only">Remove</span></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.id} className={cn('border-t border-border', !r.include && 'opacity-50')}>
                <td className="px-2 py-1"><input type="checkbox" aria-label={`Include ${r.label}`} checked={r.include} onChange={(e) => setRows(rows.map((x) => (x.id === r.id ? { ...x, include: e.target.checked } : x)))} /></td>
                <td className="px-1 py-1"><input aria-label={`Study ${i + 1} label`} className="h-8 w-36 rounded border border-border bg-surface px-2" value={r.label} onChange={(e) => setRows(rows.map((x) => (x.id === r.id ? { ...x, label: e.target.value } : x)))} /></td>
                {FIELDS[mode].map((f, j) => (
                  <td key={f.key} className="px-1 py-1">
                    <input aria-label={`${r.label} ${f.label}`} inputMode="decimal" className={cn('h-8 w-16 rounded border bg-surface px-2 tabular', Number.isNaN(parseNum(r.values[j] ?? '')) ? 'border-bad' : 'border-border')} value={r.values[j] ?? ''} onChange={(e) => setRows(rows.map((x) => (x.id === r.id ? { ...x, values: x.values.map((vv, k) => (k === j ? e.target.value : vv)) } : x)))} />
                  </td>
                ))}
                <td className="px-1 py-1"><input aria-label={`${r.label} subgroup`} className="h-8 w-28 rounded border border-border bg-surface px-2" value={r.group} onChange={(e) => setRows(rows.map((x) => (x.id === r.id ? { ...x, group: e.target.value } : x)))} /></td>
                <td className="px-1 py-1"><Button variant="ghost" size="icon" aria-label={`Remove ${r.label}`} onClick={() => setRows(rows.filter((x) => x.id !== r.id))}><Trash2 className="h-4 w-4" /></Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="secondary" onClick={() => setRows([...rows, { id: `r${uid++}`, include: true, label: `Study ${rows.length + 1}`, group: '', values: FIELDS[mode].map(() => '') }])}><Plus className="h-4 w-4" />Add study</Button>
        <Disclosure summary={<span className="inline-flex items-center gap-2"><Upload className="h-4 w-4" />Paste data (CSV/TSV)</span>} className="flex-1">
          <TextArea rows={4} value={csv} onChange={(e) => setCsv(e.target.value)} placeholder={`One study per line: label, ${FIELDS[mode].map((f) => f.label).join(', ')}, [subgroup]`} />
          <Button size="sm" className="mt-2" onClick={importCsv}>Replace rows</Button>
        </Disclosure>
      </div>

      {problems.length > 0 && (
        <Callout kind="pitfall" title="Data notes">
          <ul>{problems.map((p, i) => <li key={i}><strong>{p.label}:</strong> {p.msg}</li>)}</ul>
        </Callout>
      )}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border border-border bg-surface-2/50 p-3">
        <Segmented size="sm" value={model} onChange={setModel} label="Model" options={[{ value: 'random', label: 'Random effects' }, { value: 'common', label: 'Common effect' }]} />
        {model === 'random' && (
          <>
            <Segmented size="sm" value={tau2Method} onChange={setTau2Method} label="τ² estimator" options={[{ value: 'REML', label: 'REML' }, { value: 'DL', label: 'DerSimonian–Laird' }]} />
            <Segmented size="sm" value={ciMethod} onChange={setCiMethod} label="CI method" options={[{ value: 'hksj', label: 'HKSJ' }, { value: 'wald', label: 'Wald' }]} />
            <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={showPI} onChange={(e) => setShowPI(e.target.checked)} />Prediction interval</label>
          </>
        )}
        <label className={cn('inline-flex items-center gap-2 text-sm', !groupsPresent && 'opacity-50')}><input type="checkbox" disabled={!groupsPresent} checked={bySubgroup && groupsPresent} onChange={(e) => setBySubgroup(e.target.checked)} />By subgroup</label>
      </div>

      {result ? (
        <>
          <ForestPlot groups={forest} ratio={ratio} leftLabel={left} rightLabel={right} measureLabel={MEASURE_NAMES[measure]} />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Stat tone="primary" label={model === 'random' ? 'Random-effects estimate' : 'Common-effect estimate'} value={nat((model === 'random' ? result.random : result.common).est)} sub={`95% CI ${nat((model === 'random' ? result.random : result.common).lower)} to ${nat((model === 'random' ? result.random : result.common).upper)} · ${pEq((model === 'random' ? result.random : result.common).p)}`} />
            <Stat label="τ² (between-study variance)" value={fmt(result.heterogeneity.tau2, 3)} sub={result.k > 1 ? `95% CI ${fmt(result.heterogeneity.tau2Lower, 3)} to ${fmt(result.heterogeneity.tau2Upper, 3)} (Q-profile) · τ = ${fmt(result.heterogeneity.tau, 3)}` : 'needs ≥ 2 studies'} />
            <Stat label="I²" value={`${Math.round(result.heterogeneity.I2 * 100)}%`} sub={`Q = ${fmt(result.heterogeneity.Q, 2)}, df = ${result.heterogeneity.df}, ${pEq(result.heterogeneity.pQ)}`} />
            <Stat label="95% prediction interval" value={result.prediction ? `${nat(result.prediction.lower)} to ${nat(result.prediction.upper)}` : '—'} sub={result.prediction ? 't distribution, k − 2 df' : 'needs ≥ 3 studies'} />
          </div>
          {model === 'random' && result.k > 1 && result.recommendedCi !== ciMethod && (
            <Callout kind="tip" title="Cochrane recommendation">With τ² {result.heterogeneity.tau2 > 0 ? '> 0' : '= 0'} and k = {result.k}, Cochrane’s current guidance recommends the {result.recommendedCi === 'hksj' ? 'HKSJ' : 'Wald-type'} confidence interval.</Callout>
          )}
          {result.warnings.map((w) => <Callout key={w} kind="pitfall">{w}</Callout>)}
          {sub?.test && (
            <Callout kind="note" title="Test for subgroup differences">
              Q = {fmt(sub.test.Q, 2)}, df = {sub.test.df}, {pEq(sub.test.p)}, I² = {Math.round(sub.test.I2 * 100)}%.{' '}
              {sub.groups.map((g) => `${g.name}: ${nat((model === 'random' ? g.result.randomWald : g.result.common).est)} (k = ${g.result.k})`).join('; ')}.{' '}
              Subgroup comparisons are observational: judge credibility (pre-specified? direction predicted? within-study evidence? confounded by other study features?) before believing them.
            </Callout>
          )}
          <div className="rounded-lg border border-border p-3 text-sm leading-relaxed">
            <div className="mb-1 flex items-center justify-between gap-2"><span className="font-semibold">Results paragraph</span><CopyButton text={interpretation(result, measure, model)} /></div>
            {interpretation(result, measure, model)}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" variant="outline" onClick={exportCsv}><Download className="h-4 w-4" />Export study effects (CSV)</Button>
            {model === 'random' && <Badge>Common-effect for comparison: {nat(result.common.est)} [{nat(result.common.lower)}, {nat(result.common.upper)}]</Badge>}
          </div>
        </>
      ) : (
        <Callout kind="note">Enter at least one complete study.</Callout>
      )}
    </Lab>
  )
}

export function WeightExplorer() {
  const base = [
    { label: 'Large trial', v: 0.004 }, { label: 'Medium trial', v: 0.02 }, { label: 'Medium trial', v: 0.03 }, { label: 'Small trial', v: 0.08 }, { label: 'Tiny trial', v: 0.15 },
  ]
  const [tau2, setTau2] = useState(0)
  const wc = base.map((b) => 1 / b.v)
  const wr = base.map((b) => 1 / (b.v + tau2))
  const sc = wc.reduce((a, b) => a + b, 0)
  const sr = wr.reduce((a, b) => a + b, 0)
  return (
    <Lab title="How τ² redistributes weight" subtitle="Inverse-variance weights: common effect uses 1/vᵢ; random effects uses 1/(vᵢ + τ²).">
      <label className="block space-y-1 text-sm"><span className="font-medium">τ² = {tau2.toFixed(3)}</span><input type="range" min={0} max={0.3} step={0.005} value={tau2} onChange={(e) => setTau2(Number(e.target.value))} className="w-full accent-[var(--primary)]" /></label>
      <div className="space-y-2">
        {base.map((b, i) => (
          <div key={i} className="grid grid-cols-[7rem_1fr] items-center gap-3 text-xs sm:grid-cols-[9rem_1fr]">
            <span>{b.label} (SE {Math.sqrt(b.v).toFixed(2)})</span>
            <div className="space-y-1">
              <div className="flex items-center gap-2"><div className="h-3 rounded bg-muted/50" style={{ width: `${(wc[i] / sc) * 100}%` }} /><span className="tabular">{((wc[i] / sc) * 100).toFixed(0)}%</span></div>
              <div className="flex items-center gap-2"><div className="h-3 rounded bg-primary" style={{ width: `${(wr[i] / sr) * 100}%` }} /><span className="tabular">{((wr[i] / sr) * 100).toFixed(0)}%</span></div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-4 text-xs text-muted"><span className="inline-flex items-center gap-1"><span className="h-3 w-3 rounded bg-muted/50" />Common effect</span><span className="inline-flex items-center gap-1"><span className="h-3 w-3 rounded bg-primary" />Random effects</span></div>
      <p className="text-sm text-fg/85">As τ² grows it dominates every study’s variance, so weights become more equal and small studies gain influence. That is why random-effects estimates move toward small-study results when small-study effects exist.</p>
    </Lab>
  )
}
