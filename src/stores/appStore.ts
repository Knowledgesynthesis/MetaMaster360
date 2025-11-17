import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface AppState {
  // Theme
  darkMode: boolean
  toggleDarkMode: () => void

  // User progress
  completedModules: Set<string>
  markModuleComplete: (moduleId: string) => void
  isModuleComplete: (moduleId: string) => boolean

  // Current work
  currentModule: string | null
  setCurrentModule: (moduleId: string | null) => void

  // User preferences
  showHints: boolean
  toggleHints: () => void

  // Accessibility
  fontSize: 'normal' | 'large' | 'xlarge'
  setFontSize: (size: 'normal' | 'large' | 'xlarge') => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Theme
      darkMode: true,
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

      // User progress
      completedModules: new Set<string>(),
      markModuleComplete: (moduleId: string) =>
        set((state) => ({
          completedModules: new Set([...state.completedModules, moduleId])
        })),
      isModuleComplete: (moduleId: string) => get().completedModules.has(moduleId),

      // Current work
      currentModule: null,
      setCurrentModule: (moduleId: string | null) =>
        set({ currentModule: moduleId }),

      // User preferences
      showHints: true,
      toggleHints: () => set((state) => ({ showHints: !state.showHints })),

      // Accessibility
      fontSize: 'normal',
      setFontSize: (size: 'normal' | 'large' | 'xlarge') =>
        set({ fontSize: size }),
    }),
    {
      name: 'metamaster360-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        darkMode: state.darkMode,
        completedModules: Array.from(state.completedModules),
        showHints: state.showHints,
        fontSize: state.fontSize,
      }),
      onRehydrateStorage: () => (state) => {
        if (state && Array.isArray((state as any).completedModules)) {
          state.completedModules = new Set((state as any).completedModules)
        }
      },
    }
  )
)
