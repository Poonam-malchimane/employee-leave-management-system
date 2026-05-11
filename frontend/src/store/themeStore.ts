import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ThemeState {
  isDark: boolean
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      isDark: false,
      toggleTheme: () => {
        const next = !get().isDark
        document.body.classList.toggle('dark-mode', next)
        set({ isDark: next })
      },
    }),
    { name: 'theme-storage' }
  )
)