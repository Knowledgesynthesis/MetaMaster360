import { useState } from 'react'
import { Button, Callout, Disclosure, Lab, NumberField, Badge } from '@/components/ui'
import { cn } from '@/lib/utils'

interface Item {
  id: string
  study: string
  excerpt: string
  key: { n1: number; m1: number; sd1: number; n2: number; m2: number; sd2: number }
  trap: string
  solution: string
}

export const ITEMS: Item[] = [
  {
    id: 'fuj', study: 'Fujita 2021', trap: 'SE reported with ±',
    excerpt: 'At 12 weeks, PHQ-9 scores were 9.4 ± 0.44 in the exercise group (n = 150) and 10.0 ± 0.46 in the usual-care group (n = 148). Values are mean ± SEM.',
    key: { n1: 150, m1: 9.4, sd1: 5.39, n2: 148, m2: 10.0, sd2: 5.6 },
    solution: 'The ± values are standard errors. SD = SE × √n: 0.44 × √150 = 5.39; 0.46 × √148 = 5.60. Entering 0.44 as an SD would give this trial ~150 times too much weight.',
  },
  {
    id: 'gal', study: 'Gallagher 2022', trap: 'Median (IQR)',
    excerpt: 'MADRS at 12 weeks, median (IQR): exercise 16 (11 to 21.5), n = 55; usual care 19 (13.5 to 24.5), n = 57.',
    key: { n1: 55, m1: 16.2, sd1: 7.99, n2: 57, m2: 19.0, sd2: 8.36 },
    solution: 'Luo (mean) and Wan (SD) methods with the IQR: exercise mean = 0.707 × 16.25 + 0.293 × 16 = 16.2; SD = 10.5 / 1.315 = 7.99. Usual care mean = 19.0; SD = 11 / 1.316 = 8.36. Both assume approximately normal data — check symmetry (here the medians sit near the IQR mid-points).',
  },
  {
    id: 'dim', study: 'Dimitrov 2019', trap: 'Three arms, shared control',
    excerpt: 'HAM-D at 10 weeks, mean (SD): aerobic 11.6 (6.0), n = 32; resistance 12.4 (6.2), n = 32; usual care 13.4 (6.0), n = 66. Both exercise arms are eligible.',
    key: { n1: 64, m1: 12.0, sd1: 6.07, n2: 66, m2: 13.4, sd2: 6.0 },
    solution: 'Combine the two eligible arms (Handbook Table 6.5.a): n = 64, mean = 12.0, SD = √{[31·36 + 31·38.44 + 16·(0.8²)]/63} = 6.07. Entering each arm against the full control group would count the 66 controls twice.',
  },
  {
    id: 'cho', study: 'Chowdhury 2018', trap: 'Cluster trial analysed per patient',
    excerpt: '20 practices randomised; 110 patients (exercise) and 108 (usual care); mean 11 patients per practice. PHQ-9: 8.9 (SD 5.0) vs 10.1 (SD 5.2). Analysis did not account for clustering; ICC from a similar trial = 0.03.',
    key: { n1: 85, m1: 8.9, sd1: 5.0, n2: 83, m2: 10.1, sd2: 5.2 },
    solution: 'Design effect = 1 + (11 − 1) × 0.03 = 1.3. Effective n = 110/1.3 ≈ 85 and 108/1.3 ≈ 83. Means and SDs are unchanged; only the sample sizes shrink, widening the CI to reflect clustering.',
  },
]

const tol = (a: number, b: number, t: number) => Number.isFinite(a) && Math.abs(a - b) <= t

export function ExtractionExercise() {
  const [vals, setVals] = useState<Record<string, Record<string, number>>>({})
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  return (
    <Lab title="Extraction exercise: four traps" subtitle="Enter what the meta-analysis needs (n, mean, SD per arm). Use the calculators below if needed.">
      {ITEMS.map((it) => {
        const v = vals[it.id] ?? {}
        const set = (k: string, x: number) => setVals({ ...vals, [it.id]: { ...v, [k]: x } })
        const fields: [keyof Item['key'], string][] = [['n1', 'Exercise n'], ['m1', 'Exercise mean'], ['sd1', 'Exercise SD'], ['n2', 'Control n'], ['m2', 'Control mean'], ['sd2', 'Control SD']]
        const ok = (k: keyof Item['key']) => tol(v[k], it.key[k], k.startsWith('n') ? 1 : k.startsWith('sd') ? 0.12 : 0.11)
        const allOk = fields.every(([k]) => ok(k))
        return (
          <div key={it.id} className={cn('space-y-3 rounded-lg border p-3', checked[it.id] ? (allOk ? 'border-good/60' : 'border-warn/60') : 'border-border')}>
            <div className="flex flex-wrap items-center gap-2"><span className="font-semibold">{it.study}</span><Badge tone="warn">{it.trap}</Badge></div>
            <blockquote className="border-l-4 border-primary/40 pl-3 text-sm italic text-fg/85">{it.excerpt}</blockquote>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {fields.map(([k, label]) => (
                <NumberField key={k} label={label} value={v[k] ?? NaN} onChange={(x) => set(k, x)} invalid={checked[it.id] && !ok(k)} />
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm" onClick={() => setChecked({ ...checked, [it.id]: true })}>Check</Button>
              {checked[it.id] && <span className={cn('text-sm font-medium', allOk ? 'text-good' : 'text-warn')}>{allOk ? 'Correct — ready for analysis.' : 'Some values are off (highlighted).'}</span>}
            </div>
            {checked[it.id] && <Disclosure summary="Worked solution" defaultOpen={!allOk}>{it.solution}</Disclosure>}
          </div>
        )
      })}
      <Callout kind="note">These prepared values are exactly what the running-case meta-analysis uses in later modules.</Callout>
    </Lab>
  )
}
