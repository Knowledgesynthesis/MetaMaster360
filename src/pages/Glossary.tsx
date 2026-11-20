import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import { Search } from 'lucide-react'
import { GLOSSARY } from '@/content/glossary'
import { MODULE_BY_ID, modulePath } from '@/content/modules'

export default function Glossary() {
  const [q, setQ] = useState('')
  useEffect(() => { document.title = 'Glossary — MetaMaster360' }, [])
  const items = useMemo(() => {
    const s = q.trim().toLowerCase()
    return GLOSSARY.filter((t) => !s || t.term.toLowerCase().includes(s) || t.def.toLowerCase().includes(s) || t.aka?.toLowerCase().includes(s)).sort((a, b) => a.term.localeCompare(b.term))
  }, [q])
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Glossary</h1>
        <p className="text-muted">{GLOSSARY.length} terms, each linked to the module that teaches it.</p>
      </header>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search terms or definitions…" aria-label="Search glossary" className="h-11 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/25" />
      </div>
      <dl className="divide-y divide-border rounded-xl border border-border bg-surface">
        {items.map((t) => (
          <div key={t.term} className="p-4">
            <dt className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-semibold">{t.term}{t.aka && <span className="ml-2 text-sm font-normal text-muted">({t.aka})</span>}</span>
              {t.module && <Link to={modulePath(t.module)} className="text-xs text-primary underline underline-offset-2">Module {MODULE_BY_ID[t.module].n}: {MODULE_BY_ID[t.module].short}</Link>}
            </dt>
            <dd className="mt-1 text-sm leading-relaxed text-fg/85">{t.def}</dd>
          </div>
        ))}
        {!items.length && <div className="p-6 text-center text-sm text-muted">No matching terms.</div>}
      </dl>
    </div>
  )
}
