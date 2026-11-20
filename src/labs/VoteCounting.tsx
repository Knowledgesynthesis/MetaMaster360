import { useState } from 'react'
import { Lab, Segmented, Stat, Callout, Badge } from '@/components/ui'
import { fmt, pEq, signTest, wilsonInterval } from '@/lib/stats'
import { ROB_META, type RobJudgement } from '@/components/plots/RobPlots'

type Dir = 'benefit' | 'harm' | 'unclear'

const INIT: { study: string; n: number; metric: string; dir: Dir; rob: RobJudgement }[] = [
  { study: 'Alvarez 2016', n: 82, metric: 'SF-36 MCS: mean change, no SD', dir: 'benefit', rob: 'some' },
  { study: 'Brennan 2017', n: 49, metric: 'WHOQOL-BREF: “improved, p < 0.05”', dir: 'benefit', rob: 'high' },
  { study: 'Chowdhury 2018', n: 218, metric: 'EQ-5D index: medians, no IQR', dir: 'benefit', rob: 'some' },
  { study: 'Dimitrov 2019', n: 130, metric: 'SF-36 MCS: “no significant difference”', dir: 'benefit', rob: 'low' },
  { study: 'Eze 2020', n: 59, metric: 'Q-LES-Q: means only', dir: 'benefit', rob: 'high' },
  { study: 'Fujita 2021', n: 298, metric: 'EQ-5D VAS: adjusted MD and CI', dir: 'harm', rob: 'some' },
  { study: 'Gallagher 2022', n: 112, metric: 'SF-12 MCS: “similar in both arms”', dir: 'unclear', rob: 'some' },
  { study: 'Haddad 2023', n: 36, metric: 'Not reported (measured per registry)', dir: 'unclear', rob: 'high' },
]

export function VoteCounting() {
  const [rows, setRows] = useState(INIT)
  const pos = rows.filter((r) => r.dir === 'benefit').length
  const neg = rows.filter((r) => r.dir === 'harm').length
  const st = signTest(pos, neg)
  const w = wilsonInterval(pos, pos + neg)
  const arrow = (d: Dir) => (d === 'benefit' ? '▲' : d === 'harm' ? '▼' : '◄►')
  return (
    <Lab title="Vote counting by direction of effect" subtitle="Secondary outcome: quality of life — reported too inconsistently to pool. Set each study’s direction from its point estimate, whatever its p-value.">
      <div className="relative overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface-2 text-left"><tr><th className="px-3 py-2">Study (n)</th><th className="px-3 py-2">What was reported</th><th className="px-3 py-2">RoB</th><th className="px-3 py-2">Direction</th><th className="px-3 py-2 text-center">Plot</th></tr></thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.study} className="border-t border-border">
                <td className="px-3 py-2 whitespace-nowrap">{r.study} <span className="text-muted">({r.n})</span></td>
                <td className="px-3 py-2 text-fg/80">{r.metric}</td>
                <td className="px-3 py-2"><Badge tone={r.rob === 'high' ? 'bad' : r.rob === 'some' ? 'warn' : 'good'}>{ROB_META[r.rob].label}</Badge></td>
                <td className="px-3 py-2"><Segmented size="sm" value={r.dir} onChange={(d) => setRows(rows.map((x, j) => (j === i ? { ...x, dir: d } : x)))} label={`Direction for ${r.study}`} options={[{ value: 'benefit', label: 'Benefit' }, { value: 'harm', label: 'Harm' }, { value: 'unclear', label: 'Unclear' }]} /></td>
                <td className="px-3 py-2 text-center text-lg" aria-label={r.dir}><span className={r.dir === 'benefit' ? 'text-good' : r.dir === 'harm' ? 'text-bad' : 'text-muted'} style={{ fontSize: r.n > 150 ? '1.4rem' : r.n > 60 ? '1.1rem' : '0.85rem' }}>{arrow(r.dir)}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Studies favouring exercise" value={`${pos} of ${pos + neg}`} sub={`${rows.length - pos - neg} with unclear direction excluded`} />
        <Stat label="Proportion (Wilson 95% CI)" value={fmt(w.p * 100, 0) + '%'} sub={`${fmt(w.lower * 100, 0)}% to ${fmt(w.upper * 100, 0)}%`} tone="primary" />
        <Stat label="Sign test (two-sided)" value={`${pEq(st.p)}`} sub="H₀: benefit and harm equally likely" tone="primary" />
      </div>
      <Callout kind="key">
        Vote counting by direction answers only “is there evidence of an effect in at least one direction?” — not how large it is. Symbol size shows
        study size (effect direction plot). Dimitrov reported “no significant difference”, yet its estimate favours exercise: counting by
        significance would have scored it as negative.
      </Callout>
    </Lab>
  )
}
