import { useMemo, useState } from 'react'
import { Button, Callout, Lab, Badge, Segmented } from '@/components/ui'
import { cn } from '@/lib/utils'

export interface RawRecord {
  id: string
  source: 'MEDLINE' | 'Embase' | 'CENTRAL' | 'Registry'
  authors: string
  title: string
  journal: string
  year: number
  doi?: string
  /** expert key */
  key: 'keep' | 'duplicate' | 'link'
  of?: string
  why: string
}

export const RAW_RECORDS: RawRecord[] = [
  { id: 'M1', source: 'MEDLINE', authors: 'Alvarez R, Kim J, Osei P', title: 'Supervised aerobic exercise for major depression: a randomised controlled trial', journal: 'J Affect Res', year: 2016, doi: '10.5555/jar.2016.0101', key: 'keep', why: 'First occurrence of this article.' },
  { id: 'E1', source: 'Embase', authors: 'ALVAREZ R., KIM J., OSEI P.', title: 'Supervised aerobic exercise for major depression: A randomized controlled trial.', journal: 'Journal of Affective Research', year: 2016, doi: '10.5555/JAR.2016.0101', key: 'duplicate', of: 'M1', why: 'Same DOI (case differs), same article; spelling and journal abbreviation differ by database.' },
  { id: 'C1', source: 'CENTRAL', authors: 'Alvarez R, et al.', title: 'Supervised aerobic exercise for major depression: a randomised controlled trial', journal: 'J Affect Res', year: 2016, key: 'duplicate', of: 'M1', why: 'No DOI in this export, but identical title, first author and year.' },
  { id: 'M2', source: 'MEDLINE', authors: 'Chowdhury S, Patel A, Nwosu C', title: 'Home-based exercise delivered through primary care for depression: a cluster randomised trial', journal: 'Prim Care Ment Health', year: 2018, doi: '10.5555/pcmh.2018.044', key: 'keep', why: 'Main report of the Chowdhury trial.' },
  { id: 'E2', source: 'Embase', authors: 'Chowdhury S, Patel A', title: 'Home-based exercise for depression in primary care: preliminary results of a cluster trial [conference abstract]', journal: 'Eur Psychiatry Congress Abstr', year: 2017, key: 'link', of: 'M2', why: 'A different report (conference abstract) of the same study. Not a duplicate record — keep it and link it to the study; it may contain extra data.' },
  { id: 'M3', source: 'MEDLINE', authors: 'Dimitrov K, Hale T', title: 'Aerobic versus resistance training for depression: a three-arm randomised trial', journal: 'Ment Health Phys Act', year: 2019, doi: '10.5555/mhpa.2019.0007', key: 'keep', why: 'First occurrence.' },
  { id: 'E3', source: 'Embase', authors: 'Dimitrov K., Hale T.', title: 'Aerobic versus resistance training for depression: A three-arm randomised trial', journal: 'Mental Health and Physical Activity', year: 2019, doi: '10.5555/mhpa.2019.0007', key: 'duplicate', of: 'M3', why: 'Identical DOI.' },
  { id: 'M4', source: 'MEDLINE', authors: 'Ivanova L', title: 'Exercise and mood in older adults: a narrative review', journal: 'Geriatr Rev', year: 2019, doi: '10.5555/gr.2019.331', key: 'keep', why: 'Unique record. It will be excluded at screening (not a primary study) — but deduplication is not the place to judge eligibility.' },
  { id: 'R1', source: 'Registry', authors: 'Fujita H (PI)', title: 'Smartphone-guided Exercise for Depression in Adults (SMART-EX) — NCT00000000', journal: 'ClinicalTrials.gov', year: 2018, key: 'link', of: 'M5', why: 'Registry entry of the Fujita trial. Link it to the study — it shows the registered primary outcome.' },
  { id: 'M5', source: 'MEDLINE', authors: 'Fujita H, Mori A, Sato K', title: 'Smartphone-guided home exercise for adults with depression: a randomised controlled trial', journal: 'J Digit Psychiatry', year: 2021, doi: '10.5555/jdp.2021.0210', key: 'keep', why: 'Main report of the Fujita trial.' },
  { id: 'E4', source: 'Embase', authors: 'Fujita H, Mori A, Sato K', title: 'Erratum: Smartphone-guided home exercise for adults with depression: a randomised controlled trial', journal: 'J Digit Psychiatry', year: 2021, doi: '10.5555/jdp.2021.0299', key: 'link', of: 'M5', why: 'An erratum is a separate report about the same study. Link it: corrections can change the numbers you extract.' },
  { id: 'C2', source: 'CENTRAL', authors: 'Gallagher M, Byrne C', title: 'Group exercise added to usual care for depression: randomised trial', journal: 'Ir J Psychol Med', year: 2022, doi: '10.5555/ijpm.2022.019', key: 'keep', why: 'Unique record.' },
  { id: 'E5', source: 'Embase', authors: 'Haddad N, Saleh R', title: 'Brief supervised exercise for depression in young adults: a pilot randomised trial', journal: 'Early Interv Psychiatry', year: 2023, doi: '10.5555/eip.2023.112', key: 'keep', why: 'First occurrence.' },
  { id: 'C3', source: 'CENTRAL', authors: 'Haddad N, Saleh R', title: 'Brief supervised excercise for depresssion in young adults: a pilot randomized trial', journal: 'Early Interv Psychiatry', year: 2023, key: 'duplicate', of: 'E5', why: 'Typos in the title and no DOI: exact-match deduplication misses this; fuzzy matching or a manual check catches it.' },
]

type Decision = 'keep' | 'duplicate' | 'link'

const norm = (s: string) =>
  s.toLowerCase().replace(/\[.*?\]/g, '').replace(/randomized/g, 'randomised').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim()

function similarity(a: string, b: string) {
  const m = a.length, n = b.length
  if (!m || !n) return 0
  const d = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)])
  for (let j = 1; j <= n; j++) d[0][j] = j
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
  return 1 - d[m][n] / Math.max(m, n)
}

export function autoDedup(records: RawRecord[], mode: 'doi' | 'exact' | 'fuzzy') {
  const kept: RawRecord[] = []
  const flagged: { id: string; of: string; rule: string }[] = []
  for (const r of records) {
    const match = kept.find((k) => {
      if (r.doi && k.doi && r.doi.toLowerCase() === k.doi.toLowerCase()) return true
      if (mode === 'doi') return false
      const sameMeta = r.year === k.year && r.authors.split(/[ ,]/)[0].toLowerCase() === k.authors.split(/[ ,]/)[0].toLowerCase()
      if (!sameMeta) return false
      if (mode === 'exact') return norm(r.title) === norm(k.title)
      return similarity(norm(r.title), norm(k.title)) >= 0.95
    })
    if (match) flagged.push({ id: r.id, of: match.id, rule: r.doi && match.doi && r.doi.toLowerCase() === match.doi.toLowerCase() ? 'DOI' : mode === 'exact' ? 'title+author+year' : 'fuzzy title+author+year' })
    else kept.push(r)
  }
  return { kept, flagged }
}

export function DedupLab() {
  const [dec, setDec] = useState<Record<string, Decision>>({})
  const [checked, setChecked] = useState(false)
  const [mode, setMode] = useState<'doi' | 'exact' | 'fuzzy'>('doi')
  const auto = useMemo(() => autoDedup(RAW_RECORDS, mode), [mode])
  const score = RAW_RECORDS.filter((r) => dec[r.id] === r.key).length
  const removed = Object.values(dec).filter((d) => d === 'duplicate').length

  return (
    <Lab
      title="Deduplication lab"
      subtitle={`${RAW_RECORDS.length} records exported from four sources. Decide for each: keep, remove as a duplicate record, or keep and link to an existing study.`}
      actions={<Button size="sm" variant="outline" onClick={() => { setDec({}); setChecked(false) }}>Reset</Button>}
    >
      <div className="space-y-2">
        {RAW_RECORDS.map((r) => {
          const d = dec[r.id]
          const right = checked && d === r.key
          const wrong = checked && d !== r.key
          return (
            <div key={r.id} className={cn('rounded-lg border p-3 text-sm', right ? 'border-good/60 bg-good-soft/40' : wrong ? 'border-bad/60 bg-bad-soft/40' : 'border-border bg-surface')}>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="primary">{r.id}</Badge>
                    <Badge>{r.source}</Badge>
                    <span className="text-xs text-muted">{r.year}{r.doi ? ` · doi:${r.doi}` : ' · no DOI'}</span>
                  </div>
                  <div className="mt-1 font-medium leading-snug">{r.title}</div>
                  <div className="text-xs text-muted">{r.authors} · {r.journal}</div>
                </div>
                <Segmented size="sm" value={d ?? ('' as Decision)} onChange={(v) => { setDec({ ...dec, [r.id]: v }); setChecked(false) }} label={`Decision for ${r.id}`} options={[
                  { value: 'keep', label: 'Keep' }, { value: 'duplicate', label: 'Duplicate' }, { value: 'link', label: 'Link' },
                ]} />
              </div>
              {checked && (
                <div className="mt-2 border-t border-border pt-2 text-xs leading-relaxed">
                  <span className="font-semibold">{r.key === 'keep' ? 'Keep' : r.key === 'duplicate' ? `Duplicate of ${r.of}` : `Link to the study reported in ${r.of}`}.</span> {r.why}
                </div>
              )}
            </div>
          )
        })}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={() => setChecked(true)} disabled={Object.keys(dec).length < RAW_RECORDS.length}>Check against key ({Object.keys(dec).length}/{RAW_RECORDS.length})</Button>
        {checked && <span className="text-sm font-medium">{score} / {RAW_RECORDS.length} correct · you removed {removed} (key: 4) → {RAW_RECORDS.length - removed} records go to screening</span>}
      </div>
      <div className="space-y-2 rounded-lg border border-border p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-sm font-semibold">What an algorithm would do</div>
          <Segmented size="sm" value={mode} onChange={setMode} label="Matching rule" options={[{ value: 'doi', label: 'DOI only' }, { value: 'exact', label: '+ exact title' }, { value: 'fuzzy', label: '+ fuzzy title' }]} />
        </div>
        <p className="text-sm">
          Flags {auto.flagged.length} of 4 true duplicates{auto.flagged.length ? ': ' : '.'}
          {auto.flagged.map((f) => `${f.id}→${f.of} (${f.rule})`).join(', ')}.
        </p>
        <Callout kind="note">No rule should ever remove E2, R1 or E4: they are different reports of included studies. Automated deduplication followed by a manual check of borderline matches is standard; never let software delete companion reports.</Callout>
      </div>
    </Lab>
  )
}
