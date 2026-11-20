import { useState } from 'react'
import { Lab, NumberField, Stat, Callout } from '@/components/ui'
import { cohensKappa, fmt, fmtPct, kappaLabel } from '@/lib/stats'

export function KappaCalc() {
  const [v, setV] = useState({ a: 40, b: 12, c: 8, d: 940 })
  let r: ReturnType<typeof cohensKappa> | null = null
  let err = ''
  try { r = cohensKappa(v.a, v.b, v.c, v.d) } catch (e) { err = (e as Error).message }
  return (
    <Lab title="Agreement between two screeners" subtitle="Counts of title/abstract decisions from a pilot round.">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <NumberField label="Both include" value={v.a} onChange={(a) => setV({ ...v, a })} />
        <NumberField label="A include, B exclude" value={v.b} onChange={(b) => setV({ ...v, b })} />
        <NumberField label="A exclude, B include" value={v.c} onChange={(c) => setV({ ...v, c })} />
        <NumberField label="Both exclude" value={v.d} onChange={(d) => setV({ ...v, d })} />
      </div>
      {err && <Callout kind="bad">{err}</Callout>}
      {r && (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Observed agreement" value={fmtPct(r.po, 1)} />
            <Stat label="Chance agreement" value={fmtPct(r.pe, 1)} />
            <Stat label="Cohen’s κ" value={fmt(r.kappa, 2)} sub={`95% CI ${fmt(r.lower, 2)} to ${fmt(r.upper, 2)} · ${kappaLabel(r.kappa)}`} tone="primary" />
            <Stat label="PABAK" value={fmt(r.pabak, 2)} sub="prevalence-adjusted" />
          </div>
          <p className="text-sm text-fg/85">
            κ = (p<sub>o</sub> − p<sub>e</sub>) / (1 − p<sub>e</sub>). With few eligible records, chance agreement is high and κ can be modest despite
            {' '}{fmtPct(r.po, 0)} raw agreement (the “kappa paradox”). Report raw agreement too, and use disagreements to refine the criteria —
            the point of a pilot is calibration, not a score. Try setting “Both include” to 2.
          </p>
        </>
      )}
    </Lab>
  )
}
