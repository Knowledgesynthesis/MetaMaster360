import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router'
import { BookOpen, Calculator, CheckCircle2, GraduationCap, Home, Info, Library, Menu, Moon, Monitor, Sun, X } from 'lucide-react'
import { MODULES, PHASES, modulePath } from '@/content/modules'
import { useProgress, type Theme } from '@/store/progress'
import { cn } from '@/lib/utils'
import { Logo } from './Logo'

const NAV = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/tools', label: 'Toolkit', icon: Calculator },
  { to: '/exam', label: 'Mastery exam', icon: GraduationCap },
  { to: '/glossary', label: 'Glossary', icon: BookOpen },
  { to: '/references', label: 'Sources', icon: Library },
  { to: '/about', label: 'About & settings', icon: Info },
]

function useApplyTheme() {
  const theme = useProgress((s) => s.theme)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const apply = () => {
      const dark = theme === 'dark' || (theme === 'system' && mq.matches)
      document.documentElement.classList.toggle('dark', dark)
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#0b1120' : '#f7f9fc')
    }
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [theme])
}

function ThemeToggle() {
  const theme = useProgress((s) => s.theme)
  const setTheme = useProgress((s) => s.setTheme)
  const next: Record<Theme, Theme> = { system: 'light', light: 'dark', dark: 'system' }
  const Icon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor
  return (
    <button
      type="button"
      onClick={() => setTheme(next[theme])}
      className="inline-flex h-9 items-center gap-2 rounded-lg px-2.5 text-sm text-muted hover:bg-surface-2 hover:text-fg"
      aria-label={`Theme: ${theme}. Switch to ${next[theme]}`}
      title={`Theme: ${theme}`}
    >
      <Icon className="h-4 w-4" />
      <span className="hidden capitalize sm:inline">{theme}</span>
    </button>
  )
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const scores = useProgress((s) => s.scores)
  const location = useLocation()
  return (
    <nav className="space-y-6 p-4 text-sm" aria-label="Main">
      <ul className="space-y-0.5">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              onClick={onNavigate}
              className={({ isActive }) => cn('flex items-center gap-3 rounded-lg px-3 py-2 font-medium', isActive ? 'bg-primary-soft text-primary' : 'text-muted hover:bg-surface-2 hover:text-fg')}
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
      {PHASES.map((phase) => (
        <div key={phase.id}>
          <div className="mb-1.5 px-3 text-[0.7rem] font-semibold uppercase tracking-wider text-muted">{phase.label}</div>
          <ul className="space-y-0.5">
            {MODULES.filter((m) => m.phase === phase.id).map((m) => {
              const active = location.pathname === modulePath(m.id)
              const passed = scores[m.id]?.passed
              return (
                <li key={m.id}>
                  <Link
                    to={modulePath(m.id)}
                    onClick={onNavigate}
                    aria-current={active ? 'page' : undefined}
                    className={cn('flex items-center gap-2.5 rounded-lg px-3 py-1.5', active ? 'bg-primary-soft font-medium text-primary' : 'text-fg/80 hover:bg-surface-2')}
                  >
                    <span className={cn('flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[0.65rem] font-semibold tabular', passed ? 'bg-good text-white' : 'bg-surface-2 text-muted')}>
                      {passed ? <CheckCircle2 className="h-3.5 w-3.5" aria-label="passed" /> : m.n}
                    </span>
                    <span className="truncate">{m.title}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}

export function AppShell() {
  useApplyTheme()
  const [open, setOpen] = useState(false)
  const location = useLocation()
  useEffect(() => {
    if (!location.hash) window.scrollTo(0, 0)
  }, [location.pathname, location.hash])
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <div className="min-h-dvh">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-fg">Skip to content</a>
      <header className="sticky top-0 z-30 border-b border-border bg-bg/85 backdrop-blur supports-[backdrop-filter]:bg-bg/70">
        <div className="flex h-14 items-center gap-2 px-3 sm:px-4">
          <button type="button" className="inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-surface-2 lg:hidden" onClick={() => setOpen(true)} aria-label="Open navigation">
            <Menu className="h-5 w-5" />
          </button>
          <Link to="/" className="flex items-center gap-2.5 font-semibold tracking-tight">
            <Logo className="h-7 w-7" />
            <span>MetaMaster<span className="text-primary">360</span></span>
          </Link>
          <div className="ml-auto flex items-center gap-1">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <aside className="fixed bottom-0 left-0 top-14 hidden w-72 overflow-y-auto border-r border-border bg-bg lg:block">
        <SidebarContent />
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute bottom-0 left-0 top-0 w-[85%] max-w-80 overflow-y-auto bg-bg shadow-xl">
            <div className="flex h-14 items-center justify-between border-b border-border px-4">
              <span className="font-semibold">Navigate</span>
              <button type="button" className="inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-surface-2" onClick={() => setOpen(false)} aria-label="Close navigation">
                <X className="h-5 w-5" />
              </button>
            </div>
            <SidebarContent onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      <main id="main" className="lg:pl-72">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
