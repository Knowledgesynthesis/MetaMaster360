import { useState } from 'react'
import { AlertTriangle, CheckCircle2, Plus, Trash2 } from 'lucide-react'
import { Button, Lab, NumberField, TextInput } from '@/components/ui'
import { PrismaFlow, prismaChecks, type PrismaCounts } from '@/components/plots/PrismaFlow'

export const EXAMPLE_FLOW: PrismaCounts = {
  databases: 1248, registers: 96, duplicates: 312, automation: 0, otherRemoved: 0, screened: 1032, excludedScreening: 975, soughtRetrieval: 57,
  notRetrieved: 2, assessed: 55,
  excludedReasons: [
    { reason: 'Wrong study design', n: 13 }, { reason: 'Wrong population', n: 12 }, { reason: 'Wrong intervention', n: 9 },
    { reason: 'Wrong comparator', n: 8 }, { reason: 'Ongoing study, no results', n: 2 },
  ],
  studiesIncluded: 8, reportsIncluded: 11,
}

const FIELDS: { k: keyof Omit<PrismaCounts, 'excludedReasons'>; label: string }[] = [
  { k: 'databases', label: 'Records from databases' }, { k: 'registers', label: 'Records from registers' }, { k: 'duplicates', label: 'Duplicates removed' },
  { k: 'automation', label: 'Removed by automation tools' }, { k: 'otherRemoved', label: 'Removed for other reasons' }, { k: 'screened', label: 'Records screened' },
  { k: 'excludedScreening', label: 'Records excluded' }, { k: 'soughtRetrieval', label: 'Reports sought' }, { k: 'notRetrieved', label: 'Reports not retrieved' },
  { k: 'assessed', label: 'Reports assessed' }, { k: 'studiesIncluded', label: 'Studies included' }, { k: 'reportsIncluded', label: 'Reports of included studies' },
]

export function PrismaBuilder() {
  const [c, setC] = useState<PrismaCounts>(EXAMPLE_FLOW)
  const checks = prismaChecks(c)
  const set = (k: keyof PrismaCounts, v: number) => setC({ ...c, [k]: Number.isFinite(v) ? v : 0 })
  return (
    <Lab title="PRISMA 2020 flow builder" subtitle="Enter your counts; every arithmetic link is checked." actions={<Button size="sm" variant="outline" onClick={() => setC(EXAMPLE_FLOW)}>Reset example</Button>}>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {FIELDS.map((f) => <NumberField key={f.k} label={f.label} value={c[f.k] as number} onChange={(v) => set(f.k, v)} />)}
      </div>
      <div className="space-y-2">
        <div className="text-sm font-semibold">Full-text exclusion reasons</div>
        {c.excludedReasons.map((r, i) => (
          <div key={i} className="flex items-end gap-2">
            <TextInput className="flex-1" aria-label="Reason" value={r.reason} onChange={(e) => setC({ ...c, excludedReasons: c.excludedReasons.map((x, j) => (j === i ? { ...x, reason: e.target.value } : x)) })} />
            <NumberField className="w-24" label="n" value={r.n} onChange={(n) => setC({ ...c, excludedReasons: c.excludedReasons.map((x, j) => (j === i ? { ...x, n: Number.isFinite(n) ? n : 0 } : x)) })} />
            <Button variant="ghost" size="icon" aria-label="Remove reason" onClick={() => setC({ ...c, excludedReasons: c.excludedReasons.filter((_, j) => j !== i) })}><Trash2 className="h-4 w-4" /></Button>
          </div>
        ))}
        <Button size="sm" variant="secondary" onClick={() => setC({ ...c, excludedReasons: [...c.excludedReasons, { reason: 'Other reason', n: 0 }] })}><Plus className="h-4 w-4" />Add reason</Button>
      </div>
      <ul className="space-y-1 text-sm">
        {checks.map((x, i) => (
          <li key={i} className="flex gap-2">{x.ok ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-good" /> : <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-bad" />}<span>{x.msg}</span></li>
        ))}
      </ul>
      <PrismaFlow c={c} />
    </Lab>
  )
}
