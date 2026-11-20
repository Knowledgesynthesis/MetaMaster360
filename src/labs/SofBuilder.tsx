import { useMemo, useState } from 'react'
import { Download, Plus, Trash2 } from 'lucide-react'
import { Button, CopyButton, Lab, NumberField, Select, TextInput, Callout } from '@/components/ui'
import { CERTAINTY } from './GradeLabs'
import { absoluteFromOR, absoluteFromRR, fmt } from '@/lib/stats'
import { downloadText, toCSV } from '@/lib/utils'

interface SofRow {
  id: number
  outcome: string
  type: 'RR' | 'OR' | 'MD' | 'SMD'
  est: number
  lo: number
  hi: number
  cr: number
  unit: string
  participants: number
  studies: number
  certainty: number
  reasons: string
  good: 'lower' | 'higher'
}

export const CASE_SOF: SofRow[] = [
  { id: 1, outcome: 'Depressive symptoms (end of treatment, 8–12 wk)', type: 'SMD', est: -0.35, lo: -0.56, hi: -0.14, cr: NaN, unit: '≈ 1.9 PHQ-9 points lower (0–27 scale; SD 5.3)', participants: 934, studies: 8, certainty: 2, reasons: 'Risk of bias (−1); publication bias (−1)', good: 'lower' },
  { id: 2, outcome: 'Response (≥ 50% symptom reduction)', type: 'RR', est: 1.41, lo: 1.13, hi: 1.76, cr: 0.282, unit: '', participants: 934, studies: 8, certainty: 2, reasons: 'Risk of bias (−1); publication bias (−1)', good: 'higher' },
  { id: 3, outcome: 'Musculoskeletal injury', type: 'RR', est: 1.62, lo: 0.7, hi: 3.75, cr: 0.025, unit: '', participants: 640, studies: 5, certainty: 1, reasons: 'Risk of bias (−1); imprecision (−2): few events, CI includes benefit and important harm', good: 'lower' },
  { id: 4, outcome: 'Dropout (any reason)', type: 'RR', est: 1.1, lo: 0.86, hi: 1.41, cr: 0.18, unit: '', participants: 934, studies: 8, certainty: 2, reasons: 'Risk of bias (−1); imprecision (−1)', good: 'lower' },
]

function absolute(r: SofRow) {
  if (r.type !== 'RR' && r.type !== 'OR') return null
  const f = r.type === 'RR' ? absoluteFromRR : absoluteFromOR
  const p = f(r.cr, r.est), l = f(r.cr, r.lo), h = f(r.cr, r.hi)
  return { comp: Math.round(p.controlPer1000), int: Math.round(p.interventionPer1000), diff: Math.round(p.differencePer1000), dLo: Math.round(l.differencePer1000), dHi: Math.round(h.differencePer1000) }
}

const per = (d: number) => `${Math.abs(d)} ${d < 0 ? 'fewer' : 'more'}`

function statement(r: SofRow, intervention: string) {
  const c = r.certainty
  const ratio = r.type === 'RR' || r.type === 'OR'
  const nullV = ratio ? 1 : 0
  const includesNull = r.lo < nullV && r.hi > nullV
  const up = ratio ? r.est > 1 : r.est > 0
  const o = r.outcome.split(' (')[0].toLowerCase()
  if (c === 1) return `The evidence is very uncertain about the effect of ${intervention} on ${o}.`
  if (includesNull) return `${cap(intervention)} ${c === 4 ? 'results in' : c === 3 ? 'probably results in' : 'may result in'} little to no difference in ${o}.`
  const verb = up ? 'increase' : 'reduce'
  return `${cap(intervention)} ${c === 4 ? verb + 's' : c === 3 ? 'probably ' + verb + 's' : 'may ' + verb} ${o}.`
}
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

export function SofBuilder() {
  const [rows, setRows] = useState<SofRow[]>(CASE_SOF)
  const [title, setTitle] = useState('Exercise compared with usual care for adults with depression')
  const [intervention, setIntervention] = useState('exercise')
  const upd = (id: number, patch: Partial<SofRow>) => setRows(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)))

  const cells = useMemo(() => rows.map((r) => {
    const a = absolute(r)
    const ratio = r.type === 'RR' || r.type === 'OR'
    const valid = r.lo < r.hi && r.lo <= r.est && r.est <= r.hi && (!ratio || (r.lo > 0 && Number.isFinite(r.cr) && r.cr > 0 && r.cr < 1))
    return {
      r, valid,
      comp: a ? `${a.comp} per 1000` : '—',
      int: a ? `${a.int} per 1000 (${per(a.diff)}; ${per(a.dLo)} to ${per(a.dHi)})` : `${r.type} ${fmt(r.est)} (${fmt(r.lo)} to ${fmt(r.hi)})${r.unit ? ' — ' + r.unit : ''}`,
      rel: ratio ? `${r.type} ${fmt(r.est)} (${fmt(r.lo)} to ${fmt(r.hi)})` : '—',
      n: `${r.participants} (${r.studies} RCT${r.studies > 1 ? 's' : ''})`,
      cert: `${CERTAINTY[r.certainty - 1].symbol} ${CERTAINTY[r.certainty - 1].label}`,
      stmt: statement(r, intervention),
    }
  }), [rows, intervention])

  const md = `**${title}**\n\n| Outcome | Risk with comparator | Risk with intervention (difference, 95% CI) | Relative effect (95% CI) | № participants (studies) | Certainty | What happens |\n|---|---|---|---|---|---|---|\n` +
    cells.map((c, i) => `| ${c.r.outcome} | ${c.comp} | ${c.int} | ${c.rel} | ${c.n} | ${c.cert}${String.fromCharCode(97 + i)} | ${c.stmt} |`).join('\n') +
    '\n\n' + cells.map((c, i) => `${String.fromCharCode(97 + i)}. ${c.r.reasons || 'Not rated down.'}`).join('  \n')
  const csv = toCSV([['Outcome', 'Risk with comparator', 'Risk with intervention', 'Relative effect', 'Participants (studies)', 'Certainty', 'Reasons', 'Statement'], ...cells.map((c) => [c.r.outcome, c.comp, c.int, c.rel, c.n, CERTAINTY[c.r.certainty - 1].label, c.r.reasons, c.stmt])])

  return (
    <Lab title="Summary of findings builder" subtitle="Prefilled with the running case (outcomes 3–4 are synthetic additions). Edit any field; absolute effects recompute."
      actions={<><Button size="sm" variant="outline" onClick={() => setRows(CASE_SOF)}>Reset</Button><Button size="sm" variant="outline" onClick={() => setRows([])}>Clear</Button></>}>
      <div className="grid gap-3 sm:grid-cols-2">
        <TextInput label="Table title (population, setting, intervention, comparison)" value={title} onChange={(e) => setTitle(e.target.value)} />
        <TextInput label="Intervention (for statements)" value={intervention} onChange={(e) => setIntervention(e.target.value)} />
      </div>
      <div className="space-y-3">
        {rows.map((r, i) => (
          <div key={r.id} className="space-y-3 rounded-lg border border-border p-3">
            <div className="flex items-end gap-2">
              <TextInput className="flex-1" label={`Outcome ${i + 1}`} value={r.outcome} onChange={(e) => upd(r.id, { outcome: e.target.value })} />
              <Button variant="ghost" size="icon" aria-label="Remove outcome" onClick={() => setRows(rows.filter((x) => x.id !== r.id))}><Trash2 className="h-4 w-4" /></Button>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
              <Select label="Measure" value={r.type} onChange={(e) => upd(r.id, { type: e.target.value as SofRow['type'] })}><option>RR</option><option>OR</option><option>MD</option><option>SMD</option></Select>
              <NumberField label="Estimate" value={r.est} onChange={(est) => upd(r.id, { est })} />
              <NumberField label="CI lower" value={r.lo} onChange={(lo) => upd(r.id, { lo })} />
              <NumberField label="CI upper" value={r.hi} onChange={(hi) => upd(r.id, { hi })} />
              {(r.type === 'RR' || r.type === 'OR') && <NumberField label="Comparator risk (0–1)" value={r.cr} onChange={(cr) => upd(r.id, { cr })} />}
              <NumberField label="Participants" value={r.participants} onChange={(participants) => upd(r.id, { participants })} />
              <NumberField label="Studies" value={r.studies} onChange={(studies) => upd(r.id, { studies })} />
              <Select label="Certainty" value={String(r.certainty)} onChange={(e) => upd(r.id, { certainty: Number(e.target.value) })}>{CERTAINTY.map((c) => <option key={c.level} value={c.level}>{c.label}</option>)}</Select>
            </div>
            <TextInput label="Reasons for rating (footnote)" value={r.reasons} onChange={(e) => upd(r.id, { reasons: e.target.value })} />
          </div>
        ))}
        <Button size="sm" variant="secondary" disabled={rows.length >= 7} onClick={() => setRows([...rows, { id: Date.now(), outcome: 'New outcome', type: 'RR', est: 1, lo: 0.8, hi: 1.25, cr: 0.1, unit: '', participants: 0, studies: 1, certainty: 3, reasons: '', good: 'lower' }])}><Plus className="h-4 w-4" />Add outcome {rows.length >= 7 && '(max 7)'}</Button>
      </div>
      {cells.some((c) => !c.valid) && <Callout kind="bad">Check highlighted outcomes: the estimate must lie in its CI; ratios need positive values and a comparator risk between 0 and 1.</Callout>}
      <div className="relative overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[56rem] text-sm">
          <caption className="bg-surface-2 px-3 py-2 text-left font-semibold">{title}</caption>
          <thead className="bg-surface-2 text-left text-xs">
            <tr><th className="px-3 py-2">Outcome</th><th className="px-3 py-2">Risk with comparator</th><th className="px-3 py-2">Risk with intervention (difference, 95% CI)</th><th className="px-3 py-2">Relative effect</th><th className="px-3 py-2">№ participants (studies)</th><th className="px-3 py-2">Certainty</th><th className="px-3 py-2">What happens</th></tr>
          </thead>
          <tbody>
            {cells.map((c, i) => (
              <tr key={c.r.id} className={`border-t border-border align-top ${c.valid ? '' : 'bg-bad-soft/40'}`}>
                <td className="px-3 py-2 font-medium">{c.r.outcome}</td><td className="px-3 py-2">{c.comp}</td><td className="px-3 py-2">{c.int}</td><td className="px-3 py-2 whitespace-nowrap">{c.rel}</td><td className="px-3 py-2">{c.n}</td>
                <td className="px-3 py-2 whitespace-nowrap">{c.cert}<sup>{String.fromCharCode(97 + i)}</sup></td><td className="px-3 py-2">{c.stmt}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <ol className="list-[lower-alpha] space-y-0.5 border-t border-border px-8 py-2 text-xs text-muted">{cells.map((c) => <li key={c.r.id}>{c.r.reasons || 'Not rated down.'}</li>)}</ol>
      </div>
      <div className="flex flex-wrap gap-2">
        <CopyButton text={md} label="Copy Markdown" />
        <Button size="sm" variant="outline" onClick={() => downloadText(csv, 'summary-of-findings.csv', 'text/csv')}><Download className="h-4 w-4" />CSV</Button>
      </div>
    </Lab>
  )
}
