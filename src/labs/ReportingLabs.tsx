import { useState } from 'react'
import { Download } from 'lucide-react'
import { Button, Lab, Segmented, Badge, Callout } from '@/components/ui'
import { PRISMA_2020 } from '@/content/prisma2020'
import { downloadText, cn } from '@/lib/utils'

type St = 'yes' | 'partly' | 'no' | 'na'

export function PrismaChecklist() {
  const [st, setSt] = useState<Record<string, St>>({})
  const [loc, setLoc] = useState<Record<string, string>>({})
  const [filter, setFilter] = useState<'all' | 'open'>('all')
  const done = PRISMA_2020.filter((i) => st[i.id] === 'yes' || st[i.id] === 'na').length
  const sections = Array.from(new Set(PRISMA_2020.map((i) => i.section)))
  const md = '| Section | Item | Topic | Reported | Location |\n|---|---|---|---|---|\n' + PRISMA_2020.map((i) => `| ${i.section} | ${i.id} | ${i.topic} | ${st[i.id] ?? '—'} | ${loc[i.id] ?? ''} |`).join('\n')
  return (
    <Lab title="PRISMA 2020 self-audit" subtitle={`${done} of ${PRISMA_2020.length} items reported (27 items, 42 including sub-items). Record where each is reported.`}
      actions={<><Segmented size="sm" value={filter} onChange={setFilter} label="Filter" options={[{ value: 'all', label: 'All' }, { value: 'open', label: 'Open items' }]} /><Button size="sm" variant="outline" onClick={() => downloadText(md, 'prisma-2020-checklist.md', 'text/markdown')}><Download className="h-4 w-4" />Export</Button></>}>
      <div className="h-2 overflow-hidden rounded-full bg-surface-2" aria-hidden><div className="h-full bg-good transition-all" style={{ width: `${(done / PRISMA_2020.length) * 100}%` }} /></div>
      {sections.map((sec) => {
        const items = PRISMA_2020.filter((i) => i.section === sec && (filter === 'all' || !(st[i.id] === 'yes' || st[i.id] === 'na')))
        if (!items.length) return null
        return (
          <div key={sec} className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-primary">{sec}</div>
            {items.map((i) => (
              <div key={i.id} className={cn('grid gap-2 rounded-lg border p-3 lg:grid-cols-[1fr_auto]', st[i.id] === 'no' ? 'border-bad/50' : st[i.id] === 'partly' ? 'border-warn/50' : 'border-border')}>
                <div className="text-sm"><Badge tone="primary" className="mr-2">{i.id}</Badge><span className="font-medium">{i.topic}.</span> <span className="text-fg/80">{i.text}</span></div>
                <div className="flex flex-wrap items-center gap-2">
                  <Segmented size="sm" value={st[i.id] ?? ('' as St)} onChange={(v) => setSt({ ...st, [i.id]: v })} label={`Item ${i.id}`} options={[{ value: 'yes', label: 'Yes' }, { value: 'partly', label: 'Partly' }, { value: 'no', label: 'No' }, { value: 'na', label: 'N/A' }]} />
                  <input aria-label={`Location of item ${i.id}`} placeholder="Page / section" className="h-8 w-32 rounded-md border border-border bg-surface px-2 text-xs" value={loc[i.id] ?? ''} onChange={(e) => setLoc({ ...loc, [i.id]: e.target.value })} />
                </div>
              </div>
            ))}
          </div>
        )
      })}
    </Lab>
  )
}

const SPIN_OPTIONS = [
  'Acceptable as written',
  'Overstates certainty of evidence',
  'Treats absence of evidence as evidence of absence',
  'Over-interprets a subgroup analysis',
  'Misuses a test with too few studies',
  'Selectively emphasises a secondary or favourable result',
  'Makes recommendations beyond the evidence and scope',
]

const SPIN_ITEMS = [
  { text: '“Exercise is an effective treatment for depression (SMD −0.35).” — certainty: low', key: 1, fix: '“Exercise may reduce depressive symptoms slightly compared with usual care (low-certainty evidence).”' },
  { text: '“Exercise did not increase injuries (RR 1.62, 95% CI 0.70 to 3.75).”', key: 2, fix: '“The evidence is very uncertain about the effect of exercise on injuries (RR 1.62, 0.70 to 3.75; very low certainty).”' },
  { text: '“Supervised exercise is superior to home-based exercise (test for subgroup differences p = 0.02).”', key: 3, fix: '“The effect appeared larger in supervised programmes, but this between-study comparison is confounded by study size and risk of bias; credibility is low.”' },
  { text: '“There was no evidence of publication bias (Egger’s test p = 0.31; 8 trials).”', key: 4, fix: '“With eight trials, funnel-plot tests were not informative; small trials showed larger effects and two completed trials are unpublished.”' },
  { text: '“Although the primary outcome did not differ, exercise significantly improved sleep (p = 0.04).” (abstract of a review whose primary outcome was depression)', key: 5, fix: 'Lead with the primary outcome’s effect and certainty; report secondary outcomes with their certainty and without selective emphasis.' },
  { text: '“All adults with depression should be prescribed exercise.”', key: 6, fix: 'Systematic reviews inform, not issue, recommendations: describe the effects, certainty and applicability; leave recommendations to guideline panels weighing values, resources and preferences.' },
  { text: '“Drug A probably reduces hospital admission compared with placebo (RR 0.80, 95% CI 0.70 to 0.91; moderate-certainty evidence).”', key: 0, fix: 'Wording matches moderate certainty and reports the estimate with its CI.' },
]

export function SpinSpotter() {
  const [ans, setAns] = useState<Record<number, number>>({})
  const [shown, setShown] = useState(false)
  const score = SPIN_ITEMS.filter((s, i) => ans[i] === s.key).length
  return (
    <Lab title="Spin spotter" subtitle="What is wrong with each sentence (if anything)?">
      {SPIN_ITEMS.map((s, i) => (
        <div key={i} className={cn('space-y-2 rounded-lg border p-3', shown ? (ans[i] === s.key ? 'border-good/50' : 'border-bad/50') : 'border-border')}>
          <div className="text-sm font-medium">{s.text}</div>
          <select aria-label={`Diagnosis for sentence ${i + 1}`} className="h-9 w-full rounded-lg border border-border bg-surface px-2 text-sm" value={ans[i] ?? ''} onChange={(e) => setAns({ ...ans, [i]: Number(e.target.value) })}>
            <option value="" disabled>Diagnose…</option>
            {SPIN_OPTIONS.map((o, j) => <option key={j} value={j}>{o}</option>)}
          </select>
          {shown && <div className="text-xs"><span className="font-semibold">{SPIN_OPTIONS[s.key]}.</span> Better: {s.fix}</div>}
        </div>
      ))}
      <div className="flex items-center gap-3">
        <Button disabled={Object.keys(ans).length < SPIN_ITEMS.length} onClick={() => setShown(true)}>Check</Button>
        {shown && <span className="text-sm font-medium">{score} / {SPIN_ITEMS.length}</span>}
      </div>
      {shown && <Callout kind="note">In a Cochrane survey, the most severe forms of spin in reviews were unsupported recommendations for practice, misleading titles and selective reporting (Yavchitz 2016).</Callout>}
    </Lab>
  )
}
