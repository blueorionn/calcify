'use client'
import React, {
  createContext,
  useContext,
  useEffect,
  useSyncExternalStore,
  useCallback,
} from 'react'

interface ThemeContextType {
  theme: 'light' | 'dark'
  setTheme: React.Dispatch<React.SetStateAction<'light' | 'dark'>>
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const STORAGE_KEY = 'theme'

function getServerSnapshot(): 'light' | 'dark' {
  return 'dark'
}

function getTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return getServerSnapshot()
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  return 'dark'
}

function subscribeToTheme(callback: () => void): () => void {
  window.addEventListener('storage', callback)
  return () => window.removeEventListener('storage', callback)
}

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getTheme,
    getServerSnapshot
  )

  const setTheme = useCallback(
    (
      value: 'light' | 'dark' | ((prev: 'light' | 'dark') => 'light' | 'dark')
    ) => {
      const newTheme = typeof value === 'function' ? value(theme) : value
      window.localStorage.setItem(STORAGE_KEY, newTheme)
      window.dispatchEvent(
        new StorageEvent('storage', { key: STORAGE_KEY, newValue: newTheme })
      )
    },
    [theme]
  )

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// Custom hook for easier access
export const useThemeProvider = (): ThemeContextType => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('Unknown Theme Context')
  }
  return context
}
