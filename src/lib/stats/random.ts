/** Seeded PRNG (mulberry32) so simulations are reproducible. */
export function mulberry32(seed: number) {
  let a = seed >>> 0
  return function next() {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function normalRng(rand: () => number) {
  let spare: number | null = null
  return function gauss(mean = 0, sd = 1) {
    if (spare !== null) {
      const v = spare
      spare = null
      return mean + sd * v
    }
    let u = 0
    let v = 0
    while (u === 0) u = rand()
    while (v === 0) v = rand()
    const r = Math.sqrt(-2 * Math.log(u))
    spare = r * Math.sin(2 * Math.PI * v)
    return mean + sd * r * Math.cos(2 * Math.PI * v)
  }
}
