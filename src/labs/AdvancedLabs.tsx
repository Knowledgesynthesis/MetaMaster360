import { useState } from 'react'
import { Lab, NumberField, Stat, Formula, Callout, Button } from '@/components/ui'
import { fmt, fromConfidenceInterval, normalQuantile } from '@/lib/stats'
import { cn } from '@/lib/utils'

export function BucherCalc() {
  const [ac, setAc] = useState({ est: 0.8, lo: 0.68, hi: 0.94 })
  const [bc, setBc] = useState({ est: 0.9, lo: 0.75, hi: 1.08 })
  let res: { est: number; lo: number; hi: number; se: number } | null = null
  let err = ''
  try {
    const a = fromConfidenceInterval(ac.est, ac.lo, ac.hi, 'RR')
    const b = fromConfidenceInterval(bc.est, bc.lo, bc.hi, 'RR')
    const y = a.yi - b.yi
    const se = Math.sqrt(a.vi + b.vi)
    const z = normalQuantile(0.975)
    res = { est: Math.exp(y), lo: Math.exp(y - z * se), hi: Math.exp(y + z * se), se }
  } catch (e) { err = (e as Error).message }
  return (
    <Lab title="Indirect comparison (Bucher method)" subtitle="A vs C and B vs C trials exist; A vs B was never tested head-to-head.">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid grid-cols-3 gap-2"><NumberField label="RR A vs C" value={ac.est} onChange={(est) => setAc({ ...ac, est })} /><NumberField label="lower" value={ac.lo} onChange={(lo) => setAc({ ...ac, lo })} /><NumberField label="upper" value={ac.hi} onChange={(hi) => setAc({ ...ac, hi })} /></div>
        <div className="grid grid-cols-3 gap-2"><NumberField label="RR B vs C" value={bc.est} onChange={(est) => setBc({ ...bc, est })} /><NumberField label="lower" value={bc.lo} onChange={(lo) => setBc({ ...bc, lo })} /><NumberField label="upper" value={bc.hi} onChange={(hi) => setBc({ ...bc, hi })} /></div>
      </div>
      <Formula>{'ln RR(A vs B) = ln RR(A vs C) − ln RR(B vs C)\nVar = Var(A vs C) + Var(B vs C)'}</Formula>
      {err && <Callout kind="bad">{err}</Callout>}
      {res && <div className="grid gap-3 sm:grid-cols-2"><Stat tone="primary" label="Indirect RR, A vs B" value={fmt(res.est)} sub={`95% CI ${fmt(res.lo)} to ${fmt(res.hi)}`} /><Stat label="SE (log scale)" value={fmt(res.se, 3)} sub="always larger than either direct SE" /></div>}
      <p className="text-sm text-fg/85">Valid only if the A–C and B–C trials are similar in effect modifiers (transitivity). Indirect evidence is less precise than direct evidence of the same size; network meta-analysis combines both and checks that they agree (consistency).</p>
    </Lab>
  )
}

const AI_CASES = [
  { text: 'An LLM translates a Mandarin trial report; a second reviewer checks every extracted number against the original tables. Reported in methods.', ok: true, why: 'Human-verified, fit for purpose, transparently reported.' },
  { text: 'An LLM is the only screener for 8,000 abstracts in a full systematic review; no validation was done.', ok: false, why: 'No human oversight or evidence that it is fit for purpose. Use AI as an assistant, validate on your data, and keep human decisions.' },
  { text: 'Active-learning prioritisation (e.g., ASReview) with a pre-specified, validated stopping rule; dual screening of all records seen; reported in PRISMA item 8.', ok: true, why: 'Accepted practice when validated and reported.' },
  { text: 'Unpublished outcome data shared confidentially by trial investigators are pasted into a public chatbot to compute effect sizes.', ok: false, why: 'Breaches confidentiality and data-protection obligations; use local, approved tools.' },
  { text: 'An LLM drafts search synonyms; the information specialist verifies headings, tests retrieval of known studies and runs PRESS review.', ok: true, why: 'AI supports a human-led, verified process.' },
  { text: 'An LLM writes the discussion and conclusions; AI use is not disclosed.', ok: false, why: 'Authors remain accountable and AI use that shapes judgements or text must be reported.' },
]

export function AiUseLab() {
  const [ans, setAns] = useState<Record<number, boolean>>({})
  return (
    <Lab title="Acceptable AI use?" subtitle="Judge each scenario against the 2025 joint position (Cochrane, Campbell, JBI, CEE) endorsing RAISE.">
      {AI_CASES.map((c, i) => (
        <div key={i} className={cn('space-y-2 rounded-lg border p-3', ans[i] === undefined ? 'border-border' : ans[i] === c.ok ? 'border-good/50 bg-good-soft/30' : 'border-bad/50 bg-bad-soft/30')}>
          <div className="text-sm">{c.text}</div>
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" variant={ans[i] === true ? 'primary' : 'outline'} onClick={() => setAns({ ...ans, [i]: true })}>Acceptable</Button>
            <Button size="sm" variant={ans[i] === false ? 'primary' : 'outline'} onClick={() => setAns({ ...ans, [i]: false })}>Not acceptable</Button>
            {ans[i] !== undefined && <span className="text-xs"><span className="font-semibold">{ans[i] === c.ok ? 'Agree.' : 'Reconsider.'}</span> {c.why}</span>}
          </div>
        </div>
      ))}
    </Lab>
  )
}
