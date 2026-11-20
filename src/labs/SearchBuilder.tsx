import { useMemo, useState } from 'react'
import { AlertTriangle, CheckCircle2, Plus, Trash2, X } from 'lucide-react'
import { Button, CopyButton, Lab, Segmented, TextInput } from '@/components/ui'
import { cn } from '@/lib/utils'

interface Block { id: number; concept: string; headings: string[]; terms: string[] }

const CASE_BLOCKS: Block[] = [
  { id: 1, concept: 'Depression (population)', headings: ['Depression', 'Depressive Disorder'], terms: ['depress*', 'dysthymi*', 'melanchol*', 'mood disorder*'] },
  { id: 2, concept: 'Exercise (intervention)', headings: ['Exercise', 'Exercise Therapy', 'Resistance Training'], terms: ['exercis*', 'physical activit*', 'aerobic*', 'resistance training', 'strength training', 'walking', 'yoga'] },
]

export const HSSS_PUBMED = '(randomized controlled trial[pt] OR controlled clinical trial[pt] OR randomized[tiab] OR placebo[tiab] OR drug therapy[sh] OR randomly[tiab] OR trial[tiab] OR groups[tiab]) NOT (animals[mh] NOT humans[mh])'

const HSSS_OVID = [
  'randomized controlled trial.pt.', 'controlled clinical trial.pt.', 'randomized.ab.', 'placebo.ab.', 'drug therapy.fs.', 'randomly.ab.', 'trial.ab.', 'groups.ab.',
]

const SPELLING: [RegExp, string][] = [
  [/randomiz/i, 'randomis'], [/randomis/i, 'randomiz'], [/behavior/i, 'behaviour'], [/behaviour/i, 'behavior'], [/pediatric/i, 'paediatric'],
  [/paediatric/i, 'pediatric'], [/anemi/i, 'anaemi'], [/tumor/i, 'tumour'], [/hospitaliz/i, 'hospitalis'], [/estrogen/i, 'oestrogen'],
]

const pubmedTerm = (t: string) => (/\s/.test(t) ? `"${t}"[tiab]` : `${t}[tiab]`)

function buildPubmed(blocks: Block[], rct: boolean) {
  const parts = blocks
    .map((b) => [...b.headings.filter(Boolean).map((h) => `"${h}"[Mesh]`), ...b.terms.filter(Boolean).map(pubmedTerm)])
    .filter((p) => p.length)
    .map((p) => `(${p.join(' OR ')})`)
  if (rct) parts.push(`(${HSSS_PUBMED})`)
  return parts.join('\nAND\n')
}

function buildOvid(blocks: Block[], rct: boolean) {
  const lines: string[] = []
  const blockLines: number[] = []
  for (const b of blocks) {
    const start = lines.length + 1
    b.headings.filter(Boolean).forEach((h) => lines.push(`exp ${h}/`))
    b.terms.filter(Boolean).forEach((t) => lines.push(`${t}.ti,ab,kf.`))
    if (lines.length + 1 > start) {
      lines.push(`or/${start}-${lines.length}`)
      blockLines.push(lines.length)
    }
  }
  if (rct) {
    const start = lines.length + 1
    HSSS_OVID.forEach((l) => lines.push(l))
    lines.push(`or/${start}-${lines.length}`)
    const orLine = lines.length
    lines.push('exp animals/ not humans.sh.')
    lines.push(`${orLine} not ${lines.length}`)
    blockLines.push(lines.length)
  }
  if (blockLines.length > 1) lines.push(blockLines.join(' and '))
  return lines.map((l, i) => `${String(i + 1).padStart(2, ' ')}  ${l}`).join('\n')
}

interface Finding { level: 'warn' | 'ok'; text: string }

function lint(blocks: Block[], rct: boolean, langLimit: boolean, dateLimit: boolean): Finding[] {
  const f: Finding[] = []
  const active = blocks.filter((b) => b.headings.some(Boolean) || b.terms.some(Boolean))
  if (active.length === 0) return [{ level: 'warn', text: 'Add at least one concept block.' }]
  active.forEach((b, i) => {
    const name = b.concept || `Block ${i + 1}`
    const n = b.headings.filter(Boolean).length + b.terms.filter(Boolean).length
    if (!b.headings.some(Boolean)) f.push({ level: 'warn', text: `${name}: no subject headings. Add MeSH (MEDLINE) / Emtree (Embase) terms — indexing captures synonyms you will not think of.` })
    if (!b.terms.some(Boolean)) f.push({ level: 'warn', text: `${name}: no free-text terms. New records are not yet indexed and indexing is inconsistent — add title/abstract synonyms.` })
    if (n > 0 && n < 3) f.push({ level: 'warn', text: `${name}: only ${n} term(s). Sensitive searches usually need many synonyms, spelling variants and truncation.` })
    b.terms.filter(Boolean).forEach((t) => {
      if (/\b(AND|NOT)\b/.test(t)) f.push({ level: 'warn', text: `“${t}”: Boolean operators inside a term. Keep synonyms within a block joined only by OR; put AND between blocks.` })
      const stem = t.split('*')[0]
      if (t.includes('*') && stem.replace(/\W/g, '').length < 4) f.push({ level: 'warn', text: `“${t}”: truncation stem too short — it will retrieve many irrelevant words.` })
      for (const [re, alt] of SPELLING) {
        if (re.test(t) && !b.terms.some((o) => o.toLowerCase().includes(alt)) && !t.includes('*')) {
          f.push({ level: 'warn', text: `“${t}”: add the ${alt}… spelling variant (or truncate before the variant).` })
          break
        }
      }
    })
    if (/outcome|symptom|mortality|quality of life/i.test(b.concept)) f.push({ level: 'warn', text: `${name}: outcome concepts are often missing from titles/abstracts; adding them lowers sensitivity. Usually search Population AND Intervention (AND design).` })
  })
  if (active.length > 3) f.push({ level: 'warn', text: `${active.length} concepts joined by AND: every extra AND removes records. Use the fewest concepts that keep results manageable.` })
  if (langLimit) f.push({ level: 'warn', text: 'Language limit: avoid. Restricting to English can bias results; translate eligible reports instead.' })
  if (dateLimit) f.push({ level: 'warn', text: 'Date limit: justify explicitly (e.g., intervention did not exist before a year) and report it (PRISMA-S).' })
  if (!rct) f.push({ level: 'ok', text: 'No study-design filter: highest sensitivity. For RCT-only reviews in MEDLINE, the Cochrane HSSS keeps sensitivity high while reducing volume.' })
  if (!f.some((x) => x.level === 'warn')) f.push({ level: 'ok', text: 'No structural problems detected. Next: verify every heading in the thesaurus, test that known eligible studies are retrieved, and get PRESS peer review.' })
  return f
}

function TermList({ items, onChange, placeholder, label }: { items: string[]; onChange: (v: string[]) => void; placeholder: string; label: string }) {
  const [draft, setDraft] = useState('')
  const add = () => {
    const parts = draft.split(/[;\n]/).map((s) => s.trim()).filter(Boolean)
    if (parts.length) onChange([...items, ...parts])
    setDraft('')
  }
  return (
    <div className="space-y-1.5">
      <div className="text-xs font-medium text-muted">{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {items.map((t, i) => (
          <span key={i} className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-2 py-0.5 font-mono text-xs">
            {t}
            <button type="button" aria-label={`Remove ${t}`} onClick={() => onChange(items.filter((_, j) => j !== i))} className="text-muted hover:text-bad"><X className="h-3 w-3" /></button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="h-9 min-w-0 flex-1 rounded-lg border border-border bg-surface px-3 text-sm outline-none focus:border-primary"
          placeholder={placeholder}
          value={draft}
          aria-label={label}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), add())}
        />
        <Button size="sm" variant="secondary" onClick={add}>Add</Button>
      </div>
    </div>
  )
}

export function SearchBuilder() {
  const [blocks, setBlocks] = useState<Block[]>([{ id: 1, concept: '', headings: [], terms: [] }])
  const [rct, setRct] = useState(false)
  const [lang, setLang] = useState(false)
  const [date, setDate] = useState(false)
  const [syntax, setSyntax] = useState<'pubmed' | 'ovid'>('pubmed')
  const out = useMemo(() => (syntax === 'pubmed' ? buildPubmed(blocks, rct) : buildOvid(blocks, rct)), [blocks, rct, syntax])
  const findings = useMemo(() => lint(blocks, rct, lang, date), [blocks, rct, lang, date])
  const update = (id: number, patch: Partial<Block>) => setBlocks((bs) => bs.map((b) => (b.id === id ? { ...b, ...patch } : b)))

  return (
    <Lab
      title="Search builder & linter"
      subtitle="One block per concept: subject headings OR free-text synonyms. Blocks are combined with AND."
      actions={<Button size="sm" variant="outline" onClick={() => { setBlocks(CASE_BLOCKS.map((b) => ({ ...b }))); setRct(true) }}>Load running case</Button>}
    >
      <div className="space-y-3">
        {blocks.map((b, i) => (
          <div key={b.id} className="space-y-3 rounded-lg border border-border bg-surface-2/40 p-3">
            <div className="flex items-end gap-2">
              <TextInput className="flex-1" label={`Concept ${i + 1}`} placeholder="e.g., Depression (population)" value={b.concept} onChange={(e) => update(b.id, { concept: e.target.value })} />
              {blocks.length > 1 && <Button variant="ghost" size="icon" aria-label="Remove concept" onClick={() => setBlocks(blocks.filter((x) => x.id !== b.id))}><Trash2 className="h-4 w-4" /></Button>}
            </div>
            <TermList label="Subject headings (MeSH)" placeholder="e.g., Depressive Disorder — Enter to add" items={b.headings} onChange={(headings) => update(b.id, { headings })} />
            <TermList label="Free-text synonyms (title/abstract; * truncates)" placeholder="e.g., depress* ; dysthymi*" items={b.terms} onChange={(terms) => update(b.id, { terms })} />
          </div>
        ))}
        <Button variant="secondary" onClick={() => setBlocks([...blocks, { id: Math.max(...blocks.map((b) => b.id)) + 1, concept: '', headings: [], terms: [] }])}><Plus className="h-4 w-4" />Add concept</Button>
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
        <label className="inline-flex items-center gap-2"><input type="checkbox" checked={rct} onChange={(e) => setRct(e.target.checked)} />Add Cochrane RCT filter (HSSS)</label>
        <label className="inline-flex items-center gap-2"><input type="checkbox" checked={lang} onChange={(e) => setLang(e.target.checked)} />English-only limit</label>
        <label className="inline-flex items-center gap-2"><input type="checkbox" checked={date} onChange={(e) => setDate(e.target.checked)} />Date limit</label>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <Segmented size="sm" value={syntax} onChange={setSyntax} label="Syntax" options={[{ value: 'pubmed', label: 'PubMed' }, { value: 'ovid', label: 'Ovid MEDLINE' }]} />
            <CopyButton text={out} />
          </div>
          <pre className="max-h-80 overflow-auto rounded-lg border border-border bg-surface-2 p-3 font-mono text-xs leading-relaxed whitespace-pre-wrap">{out || '— add terms —'}</pre>
        </div>
        <div>
          <div className="mb-2 text-sm font-semibold">Linter</div>
          <ul className="space-y-1.5 text-sm">
            {findings.map((x, i) => (
              <li key={i} className={cn('flex gap-2')}>
                {x.level === 'ok' ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-good" /> : <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warn" />}
                <span>{x.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Lab>
  )
}
