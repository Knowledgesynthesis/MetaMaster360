import { useEffect, useMemo, useState } from 'react'
import { ExternalLink, Search } from 'lucide-react'
import { REFS } from '@/content/references'

export default function References() {
  const [q, setQ] = useState('')
  useEffect(() => { document.title = 'Sources — MetaMaster360' }, [])
  const list = useMemo(() => Object.values(REFS).filter((r) => r.cite.toLowerCase().includes(q.trim().toLowerCase())).sort((a, b) => a.cite.localeCompare(b.cite)), [q])
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Sources</h1>
        <p className="text-muted">The {Object.keys(REFS).length} guidelines, tools and studies this course is built on. Every DOI was checked against Crossref in November 2026.</p>
      </header>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter by author, title or journal…" aria-label="Filter sources" className="h-11 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/25" />
      </div>
      <ol className="space-y-2">
        {list.map((r) => (
          <li key={r.cite} className="rounded-lg border border-border bg-surface p-3 text-sm leading-relaxed">
            <a href={r.url} target="_blank" rel="noreferrer" className="hover:text-primary">{r.cite} <ExternalLink className="inline h-3.5 w-3.5 opacity-60" aria-label="opens in new tab" /></a>
            {'note' in r && r.note && <div className="mt-1 text-xs text-muted">{r.note}</div>}
          </li>
        ))}
      </ol>
    </div>
  )
}
