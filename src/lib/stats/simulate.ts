/**
 * Simulation of a body of evidence subject to publication bias.
 * Each candidate study: n per arm drawn log-uniformly; true effect θ_i ~ N(θ, τ²);
 * observed SMD ~ N(θ_i, v_i) with v_i ≈ 2/n + θ_i²/(4n) (per-arm n).
 * Studies with a statistically significant benefit (two-sided p < .05, effect < 0 = benefit) are always
 * published; others are published with probability (1 − selection).
 */
import { mulberry32, normalRng } from './random'
import { normalCdf } from './distributions'

export interface SimStudy {
  id: string
  yi: number
  vi: number
  n: number
  published: boolean
  significant: boolean
}

export interface SimOptions {
  trueEffect: number
  tau: number
  candidates: number
  selection: number
  minN: number
  maxN: number
  seed: number
}

export function simulateLiterature(o: SimOptions): SimStudy[] {
  const rand = mulberry32(o.seed)
  const gauss = normalRng(rand)
  const out: SimStudy[] = []
  for (let i = 0; i < o.candidates; i++) {
    const n = Math.round(Math.exp(Math.log(o.minN) + rand() * (Math.log(o.maxN) - Math.log(o.minN))))
    const theta = o.tau > 0 ? gauss(o.trueEffect, o.tau) : o.trueEffect
    const vi = 2 / n + (theta * theta) / (4 * n)
    const yi = gauss(theta, Math.sqrt(vi))
    const z = yi / Math.sqrt(vi)
    const p = 2 * (1 - normalCdf(Math.abs(z)))
    const significant = p < 0.05 && yi < 0
    const published = significant || rand() >= o.selection
    out.push({ id: `S${i + 1}`, yi, vi, n: 2 * n, published, significant })
  }
  return out
}
