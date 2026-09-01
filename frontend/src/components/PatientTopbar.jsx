import { Link, useNavigate } from 'react-router-dom'
import { useSettings } from '../context/SettingsContext.jsx'
import { LANGUAGES } from '../i18n/translations.js'

export default function PatientTopbar({ title, back = '/home' }) {
  const navigate = useNavigate()
  const { t, simpleMode, setSimpleMode, language, setLanguage } = useSettings()

  return (
    <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3 sm:py-4 border-b border-line bg-surface flex-wrap">
      <div className="flex items-center gap-3 min-w-0">
        <Link to="/home" className="patient-serif text-lg text-primary-dark shrink-0" aria-label="Smriti home">
          Smriti
        </Link>
        <button
          onClick={() => navigate(back)}
          className="w-10 h-10 rounded-full bg-primary-tint text-primary text-lg flex items-center justify-center hover:bg-line shrink-0"
          aria-label="Back"
        >
          🏠
        </button>
        <h1 className="text-lg sm:text-xl patient-serif text-ink truncate">{title}</h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="text-sm border border-line rounded-full px-3 py-2"
          aria-label={t('language')}
        >
          {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
        </select>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <span className="text-xs font-semibold text-ink-soft hidden sm:inline">{t('simple_mode')}</span>
          <span
            onClick={() => setSimpleMode(!simpleMode)}
            role="switch"
            aria-checked={simpleMode}
            aria-label={t('simple_mode')}
            className={`w-11 h-6 rounded-full flex items-center px-0.5 transition ${simpleMode ? 'bg-primary justify-end' : 'bg-line justify-start'}`}
          >
            <span className="w-5 h-5 rounded-full bg-white shadow" />
          </span>
        </label>
      </div>
    </div>
  )
}
