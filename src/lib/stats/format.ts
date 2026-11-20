export function fmt(x: number | null | undefined, digits = 2): string {
  if (x === null || x === undefined || Number.isNaN(x)) return '—'
  if (x === Infinity) return '∞'
  if (x === -Infinity) return '−∞'
  const s = x.toFixed(digits)
  return s.startsWith('-') && Number(s) !== 0 ? '−' + s.slice(1) : s.replace(/^-/, '')
}

export function fmtP(p: number | null | undefined): string {
  if (p === null || p === undefined || Number.isNaN(p)) return '—'
  if (p < 0.001) return '< 0.001'
  if (p < 0.1) return p.toFixed(3)
  return p.toFixed(2)
}

export function fmtPct(x: number | null | undefined, digits = 0): string {
  if (x === null || x === undefined || Number.isNaN(x)) return '—'
  return `${(x * 100).toFixed(digits)}%`
}

/** "p < 0.001" or "p = 0.03" */
export function pEq(p: number | null | undefined): string {
  if (p === null || p === undefined || Number.isNaN(p)) return 'p = —'
  return p < 0.001 ? 'p < 0.001' : `p = ${fmtP(p)}`
}
