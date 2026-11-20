import { useEffect, useRef, useState } from 'react'

export function useWidth<T extends HTMLElement>(initial = 640) {
  const ref = useRef<T>(null)
  const [width, setWidth] = useState(initial)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setWidth(Math.max(260, Math.floor(e.contentRect.width))))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, width] as const
}

export function niceTicks(min: number, max: number, count = 5): number[] {
  if (!(max > min)) return [min]
  const span = max - min
  const step0 = span / count
  const mag = 10 ** Math.floor(Math.log10(step0))
  const err = step0 / mag
  const step = (err >= 7.5 ? 10 : err >= 3.5 ? 5 : err >= 1.5 ? 2 : 1) * mag
  const start = Math.ceil(min / step) * step
  const ticks: number[] = []
  for (let v = start; v <= max + step * 1e-9; v += step) ticks.push(Math.abs(v) < step * 1e-9 ? 0 : v)
  return ticks
}

const RATIO_TICKS = [0.01, 0.02, 0.05, 0.1, 0.2, 0.25, 0.5, 0.67, 1, 1.5, 2, 4, 5, 10, 20, 50, 100]

export function ratioTicks(minLog: number, maxLog: number): number[] {
  const inRange = RATIO_TICKS.filter((t) => Math.log(t) >= minLog - 1e-9 && Math.log(t) <= maxLog + 1e-9)
  if (inRange.length <= 7) return inRange
  const keep = [0.01, 0.1, 0.5, 1, 2, 10, 100]
  return inRange.filter((t) => keep.includes(t))
}
