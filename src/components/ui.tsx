import { useId, useState, type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode, type SelectHTMLAttributes, type InputHTMLAttributes } from 'react'
import { AlertTriangle, BookMarked, CheckCircle2, ChevronDown, Info, Lightbulb, XCircle, Copy, Check } from 'lucide-react'
import { cn, copyText, parseNum } from '@/lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon'

export function buttonClasses(variant: ButtonVariant = 'primary', size: ButtonSize = 'md', className?: string) {
  return cn(
    'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-2 disabled:opacity-50 select-none',
    {
      primary: 'bg-primary text-primary-fg hover:opacity-90',
      secondary: 'bg-surface-2 text-fg hover:bg-primary-soft',
      outline: 'border border-border bg-surface hover:bg-surface-2',
      ghost: 'hover:bg-surface-2',
      danger: 'bg-bad text-white hover:opacity-90',
    }[variant],
    { sm: 'h-8 px-3 text-sm', md: 'h-10 px-4 text-sm', lg: 'h-12 px-6 text-base', icon: 'h-10 w-10' }[size],
    className,
  )
}

export function Button({ variant, size, className, type = 'button', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; size?: ButtonSize }) {
  return <button type={type} className={buttonClasses(variant, size, className)} {...props} />
}

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('rounded-xl border border-border bg-surface shadow-sm', className)} {...props} />
}

export function CardBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-4 sm:p-5', className)} {...props} />
}

type Tone = 'neutral' | 'primary' | 'accent' | 'good' | 'warn' | 'bad'
const toneClasses: Record<Tone, string> = {
  neutral: 'bg-surface-2 text-fg',
  primary: 'bg-primary-soft text-primary',
  accent: 'bg-accent-soft text-accent',
  good: 'bg-good-soft text-good',
  warn: 'bg-warn-soft text-warn',
  bad: 'bg-bad-soft text-bad',
}

export function Badge({ tone = 'neutral', className, ...props }: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium', toneClasses[tone], className)} {...props} />
}

type CalloutKind = 'key' | 'pitfall' | 'tip' | 'evidence' | 'note' | 'good' | 'bad'
const calloutMeta: Record<CalloutKind, { icon: typeof Info; cls: string; label: string }> = {
  key: { icon: CheckCircle2, cls: 'border-primary/40 bg-primary-soft/60', label: 'Key point' },
  pitfall: { icon: AlertTriangle, cls: 'border-warn/50 bg-warn-soft/70', label: 'Pitfall' },
  tip: { icon: Lightbulb, cls: 'border-accent/40 bg-accent-soft/60', label: 'Practical tip' },
  evidence: { icon: BookMarked, cls: 'border-border bg-surface-2', label: 'Evidence' },
  note: { icon: Info, cls: 'border-border bg-surface-2', label: 'Note' },
  good: { icon: CheckCircle2, cls: 'border-good/40 bg-good-soft/70', label: 'Correct' },
  bad: { icon: XCircle, cls: 'border-bad/40 bg-bad-soft/70', label: 'Not quite' },
}

export function Callout({ kind = 'note', title, children, className }: { kind?: CalloutKind; title?: ReactNode; children: ReactNode; className?: string }) {
  const m = calloutMeta[kind]
  const Icon = m.icon
  return (
    <div className={cn('rounded-lg border p-3 sm:p-4 text-sm leading-relaxed', m.cls, className)} role={kind === 'bad' || kind === 'good' ? 'status' : undefined}>
      <div className="flex gap-2.5">
        <Icon className="mt-0.5 h-4 w-4 shrink-0 opacity-80" aria-hidden />
        <div className="min-w-0 space-y-1.5">
          <div className="font-semibold">{title ?? m.label}</div>
          <div className="[&>p+p]:mt-2 [&_ul]:list-disc [&_ul]:pl-5 [&_li+li]:mt-1">{children}</div>
        </div>
      </div>
    </div>
  )
}

export function Label({ htmlFor, children, hint }: { htmlFor?: string; children: ReactNode; hint?: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium">
      {children}
      {hint && <span className="ml-1 font-normal text-muted">{hint}</span>}
    </label>
  )
}

const inputCls = 'h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/25 tabular'

export function TextInput({ label, hint, className, ...props }: InputHTMLAttributes<HTMLInputElement> & { label?: ReactNode; hint?: ReactNode }) {
  const id = useId()
  return (
    <div className={cn('space-y-1', className)}>
      {label && <Label htmlFor={id} hint={hint}>{label}</Label>}
      <input id={id} className={inputCls} {...props} />
    </div>
  )
}

export function TextArea({ label, hint, className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: ReactNode; hint?: ReactNode }) {
  const id = useId()
  return (
    <div className={cn('space-y-1', className)}>
      {label && <Label htmlFor={id} hint={hint}>{label}</Label>}
      <textarea id={id} className={cn(inputCls, 'h-auto min-h-20 py-2 leading-relaxed')} {...props} />
    </div>
  )
}

/** Number field that keeps the raw text while typing and reports a parsed number (NaN if empty/invalid). */
export function NumberField({ label, value, onChange, hint, className, step = 'any', min, max, invalid, ...rest }: {
  label: ReactNode
  value: number | ''
  onChange: (v: number) => void
  hint?: ReactNode
  className?: string
  step?: number | 'any'
  min?: number
  max?: number
  invalid?: boolean
  placeholder?: string
}) {
  const id = useId()
  const [text, setText] = useState(value === '' || Number.isNaN(value) ? '' : String(value))
  const [lastValue, setLastValue] = useState(value)
  if (!Object.is(value, lastValue)) {
    setLastValue(value)
    const external = value === '' || Number.isNaN(value) ? text !== '' && !Number.isNaN(parseNum(text)) : parseNum(text) !== value
    if (external) setText(value === '' || Number.isNaN(value) ? '' : String(value))
  }
  const parsed = parseNum(text)
  const bad = invalid || (text !== '' && Number.isNaN(parsed))
  return (
    <div className={cn('space-y-1', className)}>
      <Label htmlFor={id} hint={hint}>{label}</Label>
      <input
        id={id}
        inputMode="decimal"
        className={cn(inputCls, bad && 'border-bad focus:border-bad focus:ring-bad/25')}
        value={text}
        aria-invalid={bad || undefined}
        onChange={(e) => {
          setText(e.target.value)
          onChange(parseNum(e.target.value))
        }}
        step={step}
        min={min}
        max={max}
        {...rest}
      />
    </div>
  )
}

export function Select({ label, hint, className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { label?: ReactNode; hint?: ReactNode }) {
  const id = useId()
  return (
    <div className={cn('space-y-1', className)}>
      {label && <Label htmlFor={id} hint={hint}>{label}</Label>}
      <select id={id} className={cn(inputCls, 'pr-8')} {...props}>
        {children}
      </select>
    </div>
  )
}

export function Segmented<T extends string>({ value, onChange, options, label, size = 'md' }: {
  value: T
  onChange: (v: T) => void
  options: { value: T; label: ReactNode; title?: string }[]
  label?: string
  size?: 'sm' | 'md'
}) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex max-w-full flex-wrap rounded-lg border border-border bg-surface-2 p-0.5">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          title={o.title}
          onClick={() => onChange(o.value)}
          className={cn(
            'rounded-md font-medium transition-colors',
            size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm',
            value === o.value ? 'bg-surface text-fg shadow-sm' : 'text-muted hover:text-fg',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function Disclosure({ summary, children, defaultOpen = false, className }: { summary: ReactNode; children: ReactNode; defaultOpen?: boolean; className?: string }) {
  return (
    <details className={cn('group rounded-lg border border-border bg-surface', className)} open={defaultOpen}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 text-sm font-medium [&::-webkit-details-marker]:hidden">
        <span>{summary}</span>
        <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" aria-hidden />
      </summary>
      <div className="border-t border-border px-4 py-3 text-sm leading-relaxed">{children}</div>
    </details>
  )
}

export function Formula({ children, label }: { children: ReactNode; label?: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-surface-2 px-4 py-3">
      {label && <div className="mb-1 text-xs font-medium uppercase tracking-wide text-muted">{label}</div>}
      <div className="font-mono text-[0.9rem] leading-7 whitespace-pre">{children}</div>
    </div>
  )
}

export function Stat({ label, value, sub, tone }: { label: ReactNode; value: ReactNode; sub?: ReactNode; tone?: Tone }) {
  return (
    <div className={cn('rounded-lg border border-border p-3', tone ? toneClasses[tone] : 'bg-surface-2/60')}>
      <div className="text-xs font-medium text-muted">{label}</div>
      <div className="mt-0.5 text-lg font-semibold tabular">{value}</div>
      {sub && <div className="text-xs text-muted">{sub}</div>}
    </div>
  )
}

export function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [done, setDone] = useState(false)
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={async () => {
        if (await copyText(text)) {
          setDone(true)
          setTimeout(() => setDone(false), 1500)
        }
      }}
    >
      {done ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      {done ? 'Copied' : label}
    </Button>
  )
}

export function Table({ head, rows, className, caption }: { head: ReactNode[]; rows: ReactNode[][]; className?: string; caption?: ReactNode }) {
  return (
    <div className={cn('relative overflow-x-auto rounded-lg border border-border', className)}>
      <table className="w-full border-collapse text-sm">
        {caption && <caption className="px-3 pt-3 text-left text-xs text-muted">{caption}</caption>}
        <thead className="bg-surface-2 text-left">
          <tr>
            {head.map((h, i) => (
              <th key={i} scope="col" className="px-3 py-2 font-semibold whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-border align-top">
              {r.map((c, j) => (
                <td key={j} className="px-3 py-2">{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function Lab({ title, subtitle, children, actions }: { title: ReactNode; subtitle?: ReactNode; children: ReactNode; actions?: ReactNode }) {
  return (
    <Card className="overflow-hidden border-primary/30">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border bg-primary-soft/40 px-4 py-3 sm:px-5">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-primary">Interactive lab</div>
          <h3 className="text-base font-semibold sm:text-lg">{title}</h3>
          {subtitle && <p className="mt-0.5 text-sm text-muted">{subtitle}</p>}
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
      <div className="space-y-4 p-4 sm:p-5">{children}</div>
    </Card>
  )
}
