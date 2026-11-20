import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { ModuleId } from '@/content/types'
import { PASS_MARK } from '@/content/modules'

export type Theme = 'system' | 'light' | 'dark'

export interface ModuleScore {
  best: number
  last: number
  attempts: number
  passed: boolean
  date: string
}

interface ProgressState {
  theme: Theme
  scores: Partial<Record<ModuleId, ModuleScore>>
  /** questionId → number of times missed and not yet corrected */
  missed: Record<string, number>
  visited: Partial<Record<ModuleId, string>>
  lastModule?: ModuleId
  exams: { date: string; correct: number; total: number }[]
  capstone: Record<string, number>
  setTheme: (t: Theme) => void
  visit: (id: ModuleId) => void
  recordQuiz: (id: ModuleId, results: { questionId: string; correct: boolean }[]) => ModuleScore
  recordAnswers: (results: { questionId: string; correct: boolean }[]) => void
  recordExam: (correct: number, total: number) => void
  setCapstone: (decision: string, choice: number) => void
  resetCapstone: () => void
  reset: () => void
}

const initial = { theme: 'system' as Theme, scores: {}, missed: {}, visited: {}, exams: [], capstone: {} }

function applyAnswers(missed: Record<string, number>, results: { questionId: string; correct: boolean }[]) {
  const next = { ...missed }
  for (const r of results) {
    if (r.correct) delete next[r.questionId]
    else next[r.questionId] = (next[r.questionId] ?? 0) + 1
  }
  return next
}

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      ...initial,
      setTheme: (theme) => set({ theme }),
      visit: (id) => set((s) => ({ lastModule: id, visited: { ...s.visited, [id]: s.visited[id] ?? new Date().toISOString() } })),
      recordQuiz: (id, results) => {
        const score = results.filter((r) => r.correct).length / Math.max(1, results.length)
        const prev = get().scores[id]
        const entry: ModuleScore = {
          best: Math.max(prev?.best ?? 0, score),
          last: score,
          attempts: (prev?.attempts ?? 0) + 1,
          passed: (prev?.passed ?? false) || score >= PASS_MARK,
          date: new Date().toISOString(),
        }
        set((s) => ({ scores: { ...s.scores, [id]: entry }, missed: applyAnswers(s.missed, results) }))
        return entry
      },
      recordAnswers: (results) => set((s) => ({ missed: applyAnswers(s.missed, results) })),
      recordExam: (correct, total) => set((s) => ({ exams: [...s.exams, { date: new Date().toISOString(), correct, total }].slice(-20) })),
      setCapstone: (decision, choice) => set((s) => ({ capstone: { ...s.capstone, [decision]: choice } })),
      resetCapstone: () => set({ capstone: {} }),
      reset: () => set({ ...initial, theme: get().theme }),
    }),
    {
      name: 'mm360-progress',
      version: 2,
      storage: createJSONStorage(() => localStorage),
      partialize: ({ theme, scores, missed, visited, lastModule, exams, capstone }) => ({ theme, scores, missed, visited, lastModule, exams, capstone }),
    },
  ),
)

export function useIsDark() {
  const theme = useProgress((s) => s.theme)
  if (theme === 'system') return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
  return theme === 'dark'
}
