import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function downloadText(content: string, filename: string, type = 'text/plain') {
  const blob = new Blob([content], { type: `${type};charset=utf-8` })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function toCSV(rows: (string | number)[][]) {
  return rows
    .map((r) => r.map((c) => {
      const s = String(c)
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
    }).join(','))
    .join('\n')
}

export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

/** Deterministic shuffle (Fisher–Yates with a seeded LCG). */
export function seededShuffle<T>(arr: T[], seed: number): T[] {
  const a = arr.slice()
  let s = seed >>> 0 || 1
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) >>> 0
    const j = s % (i + 1)
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** Parse a user-entered number; accepts unicode minus and commas as decimal separators. */
export function parseNum(s: string): number {
  if (s.trim() === '') return NaN
  return Number(s.replace(/[−–]/g, '-').replace(',', '.'))
}
