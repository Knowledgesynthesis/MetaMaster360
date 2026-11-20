import { ExternalLink } from 'lucide-react'
import { REFS, type RefKey } from '@/content/references'

export function Refs({ keys, title = 'Sources' }: { keys: RefKey[]; title?: string }) {
  return (
    <section id="module-sources" data-toc={title} className="scroll-mt-20 space-y-3">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      <ol className="space-y-2 text-sm">
        {keys.map((k) => {
          const r = REFS[k]
          return (
            <li key={k} className="rounded-lg border border-border bg-surface px-3 py-2 leading-relaxed">
              <a href={r.url} target="_blank" rel="noreferrer" className="group inline">
                {r.cite} <ExternalLink className="inline h-3.5 w-3.5 opacity-60 group-hover:opacity-100" aria-label="opens in new tab" />
              </a>
              {'note' in r && r.note && <div className="text-xs text-muted">{r.note}</div>}
            </li>
          )
        })}
      </ol>
    </section>
  )
}

/** Inline citation marker linking to a source. */
export function Cite({ k, children }: { k: RefKey; children?: React.ReactNode }) {
  const r = REFS[k]
  return (
    <a href={r.url} target="_blank" rel="noreferrer" title={r.cite} className="text-primary underline decoration-primary/30 underline-offset-2 hover:decoration-primary">
      {children ?? shortCite(r.cite)}
    </a>
  )
}

export function shortCite(cite: string) {
  // Publication year: the year before a volume (";"), otherwise the last year mentioned.
  const years = [...cite.matchAll(/((?:19|20)\d{2})(;?)/g)]
  const year = (years.find((m) => m[2] === ';') ?? years[years.length - 1])?.[1]
  const person = cite.match(/^([^,.(:]+?)\s+[A-Z][A-Za-z]{0,3}[,.]/)
  let head = person ? person[1] : cite.split(/[.(:]/)[0].trim()
  if (head.length > 28) head = `${head.split(',')[0]} et al.`
  return `${head}${year ? ' ' + year : ''}`
}
