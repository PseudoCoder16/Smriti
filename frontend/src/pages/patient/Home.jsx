import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import AlertsPopover from '../../components/AlertsPopover.jsx'
import ProfileMenu from '../../components/ProfileMenu.jsx'
import ReminderStrip from '../../components/ReminderStrip.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { useSettings } from '../../context/SettingsContext.jsx'
import { LANGUAGES } from '../../i18n/translations.js'
import { speak } from '../../utils/speak.js'

// Phase 1 roster: the 2 reminiscence games plus the 3 newly finished cognitive
// games. Memory Match, Daily Routine Recall and Tea Leaf Sorting stay in the
// codebase (routes still work) but are no longer surfaced here.
function useGameTiles(t) {
  return [
    { emoji: '🎵', label: t('music_memory'), to: '/games/music-memory' },
    { emoji: '📖', label: t('remember_my_story'), to: '/games/remember-my-story' },
    { emoji: '🎨', label: t('color_sort'), to: '/games/color-sort' },
    { emoji: '🥁', label: t('rhythm_tap'), to: '/games/rhythm-tap' },
    { emoji: '🔷', label: t('pattern_recognition'), to: '/games/pattern' },
  ]
}

export default function Home() {
  const { session } = useAuth()
  const { t, simpleMode, setSimpleMode, language, setLanguage } = useSettings()
  const navigate = useNavigate()
  const gameTiles = useGameTiles(t)

  const timeGreet = useMemo(() => {
    const hour = new Date().getHours()
    return hour < 12 ? t('good_morning') : hour < 17 ? t('good_afternoon') : t('good_evening')
  }, [t])
  const first = session.name.split(' ')[0]

  useEffect(() => {
    speak(`${timeGreet}, ${first}!`)
  }, [timeGreet, first])

  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-line shrink-0 gap-4">
        <div className="min-w-0">
          <span className="serif text-sm text-primary-dark block mb-1">Smriti</span>
          <h1 className="text-xl serif leading-tight truncate">{timeGreet} 👋, {first}!</h1>
          <p className="text-xs text-ink-faint">{t('how_feeling')}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <AlertsPopover />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="text-sm border border-line rounded-lg px-2 py-2"
            aria-label={t('choose_language')}
          >
            {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
          </select>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <span className="text-xs font-semibold text-ink-soft hidden sm:inline">{t('simple_mode')}</span>
            <span
              onClick={() => setSimpleMode(!simpleMode)}
              className={`w-11 h-6 rounded-full flex items-center px-0.5 transition ${simpleMode ? 'bg-primary justify-end' : 'bg-line justify-start'}`}
            >
              <span className="w-5 h-5 rounded-full bg-white shadow" />
            </span>
          </label>
          <ProfileMenu />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {gameTiles.map((g) => (
            <button
              key={g.to}
              onClick={() => navigate(g.to)}
              className="bg-surface border border-line rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary-tint transition p-2"
            >
              <span className="text-3xl">{g.emoji}</span>
              <span className="text-xs font-semibold text-center leading-tight">{g.label}</span>
            </button>
          ))}
          <button onClick={() => navigate('/checkin')} className="bg-surface border border-line rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary-tint transition p-2">
            <span className="text-3xl">❤️</span>
            <span className="text-xs font-semibold text-center leading-tight">{t('checkin')}</span>
          </button>
          <button onClick={() => navigate('/progress')} className="bg-surface border border-line rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary-tint transition p-2">
            <span className="text-3xl">🏆</span>
            <span className="text-xs font-semibold text-center leading-tight">{t('progress')}</span>
          </button>
        </div>
      </div>

      <ReminderStrip />
    </div>
  )
}
