import { useEffect, useState, type RefObject } from 'react'
import { cn } from '@/lib/utils'

export function useToc(container: RefObject<HTMLElement | null>, key: string) {
  const [items, setItems] = useState<{ id: string; title: string }[]>([])
  useEffect(() => {
    const el = container.current
    if (!el) return
    const update = () => {
      const next = Array.from(el.querySelectorAll<HTMLElement>('[data-toc]')).map((s) => ({ id: s.id, title: s.dataset.toc ?? '' }))
      setItems((prev) => (prev.length === next.length && prev.every((p, i) => p.id === next[i].id) ? prev : next))
    }
    update()
    const mo = new MutationObserver(update)
    mo.observe(el, { childList: true, subtree: true })
    return () => mo.disconnect()
  }, [container, key])
  return items
}

export function Toc({ items }: { items: { id: string; title: string }[] }) {
  const [active, setActive] = useState<string | null>(null)
  useEffect(() => {
    if (!items.length) return
    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (vis[0]) setActive(vis[0].target.id)
      },
      { rootMargin: '-80px 0px -60% 0px' },
    )
    items.forEach((i) => {
      const el = document.getElementById(i.id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [items])
  if (!items.length) return null
  return (
    <nav aria-label="On this page" className="text-sm">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">On this page</div>
      <ul className="space-y-1 border-l border-border">
        {items.map((i) => (
          <li key={i.id}>
            <a href={`#${i.id}`} className={cn('-ml-px block border-l-2 py-0.5 pl-3 leading-snug', active === i.id ? 'border-primary font-medium text-primary' : 'border-transparent text-muted hover:text-fg')}>
              {i.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
