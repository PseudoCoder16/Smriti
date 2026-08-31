import { createContext, useContext, useEffect, useState } from 'react'
import { useTranslator } from '../i18n/translations.js'

const SettingsContext = createContext(null)

function loadSettings() {
  try {
    return JSON.parse(localStorage.getItem('smriti_settings') || 'null') || { simpleMode: false, language: 'en' }
  } catch {
    return { simpleMode: false, language: 'en' }
  }
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(loadSettings)

  useEffect(() => {
    localStorage.setItem('smriti_settings', JSON.stringify(settings))
    // Simple Mode scales the root font-size, which scales every rem-based
    // Tailwind utility (text size, padding, icon size) across the whole app.
    document.documentElement.style.fontSize = settings.simpleMode ? '20px' : '16px'
  }, [settings])

  const setSimpleMode = (simpleMode) => setSettings((s) => ({ ...s, simpleMode }))
  const setLanguage = (language) => setSettings((s) => ({ ...s, language }))
  const t = useTranslator(settings.language)

  return (
    <SettingsContext.Provider value={{ ...settings, setSimpleMode, setLanguage, t }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}
