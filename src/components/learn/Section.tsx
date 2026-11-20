import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function Section({ id, title, kicker, children, className }: { id: string; title: string; kicker?: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} data-toc={title} className={cn('scroll-mt-20 space-y-4', className)}>
      <div>
        {kicker && <div className="text-xs font-semibold uppercase tracking-wider text-primary">{kicker}</div>}
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
          <a href={`#${id}`} className="hover:underline decoration-primary/40 underline-offset-4">{title}</a>
        </h2>
      </div>
      {children}
    </section>
  )
}

export function Prose({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('lesson max-w-3xl text-[0.95rem]', className)}>{children}</div>
}

export function KeyPoints({ items, title = 'Remember' }: { items: ReactNode[]; title?: string }) {
  return (
    <div className="rounded-xl border border-primary/30 bg-primary-soft/40 p-4">
      <div className="mb-2 text-sm font-semibold text-primary">{title}</div>
      <ul className="space-y-1.5 text-sm leading-relaxed">
        {items.map((x, i) => (
          <li key={i} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
            <span>{x}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Pitfalls({ items }: { items: { wrong: ReactNode; right: ReactNode }[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {items.map((p, i) => (
        <div key={i} className="rounded-lg border border-border bg-surface p-3 text-sm leading-relaxed">
          <div className="flex gap-2"><span className="font-semibold text-bad" aria-label="Pitfall">✗</span><span>{p.wrong}</span></div>
          <div className="mt-2 flex gap-2 border-t border-border pt-2"><span className="font-semibold text-good" aria-label="Instead">✓</span><span>{p.right}</span></div>
        </div>
      ))}
    </div>
  )
}

export function Steps({ items }: { items: { title: ReactNode; body: ReactNode }[] }) {
  return (
    <ol className="space-y-3">
      {items.map((s, i) => (
        <li key={i} className="flex gap-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-fg tabular">{i + 1}</span>
          <div className="pt-0.5 text-sm leading-relaxed">
            <div className="font-semibold">{s.title}</div>
            <div className="text-fg/85">{s.body}</div>
          </div>
        </li>
      ))}
    </ol>
  )
}

export function Grid({ children, cols = 2 }: { children: ReactNode; cols?: 2 | 3 }) {
  return <div className={cn('grid gap-3 [&>*]:min-w-0', cols === 2 ? 'md:grid-cols-2' : 'md:grid-cols-2 xl:grid-cols-3')}>{children}</div>
}

export function InfoCard({ title, children, tag }: { title: ReactNode; children: ReactNode; tag?: ReactNode }) {
  return (
    <div className="min-w-0 rounded-lg border border-border bg-surface p-4 text-sm leading-relaxed">
      <div className="mb-1.5 flex flex-wrap items-center gap-2 font-semibold">{title}{tag}</div>
      <div className="text-fg/85 [&>p+p]:mt-2 [&_ul]:mt-1 [&_ul]:list-disc [&_ul]:pl-5 [&_li+li]:mt-1">{children}</div>
    </div>
  )
}
