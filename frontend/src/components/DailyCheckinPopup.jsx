import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useSettings } from '../context/SettingsContext.jsx'
import { speak } from '../utils/voiceService.js'
import { api } from '../api/client.js'
import { getTodayCheckin, saveDailyCheckin } from '../data/dailyCheckinData.js'

// Phase 7 — a simple avatar popup shown once per day when the patient opens
// the dashboard. Saves to the same real /checkin API as the dedicated
// /checkin page (Phase 8); the local store here is only used to decide
// whether the popup has already been answered today, not as the source of
// truth for the data itself.
const MOODS = [
  { mood: 'Good', emoji: '🙂' },
  { mood: 'Okay', emoji: '😐' },
  { mood: 'Not Good', emoji: '🙁' },
]

export default function DailyCheckinPopup() {
  const { session } = useAuth()
  const { t, language, simpleMode } = useSettings()
  const [open, setOpen] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  useEffect(() => {
    if (!session?.patient_id) return
    if (!getTodayCheckin(session.patient_id)) {
      setOpen(true)
      speak(t('how_was_your_day'), language, 'how_was_your_day')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only check once when the dashboard first mounts
  }, [session?.patient_id])

  async function pick(mood) {
    setOpen(false)
    try {
      await api.post('/checkin', { patient_id: session.patient_id, mood })
    } catch (err) {
      // Save failed (offline/API down) — still record locally so the popup
      // doesn't nag again today; the patient's answer isn't lost from their
      // point of view even though it didn't reach the backend this time.
      console.warn('[daily checkin] failed to save to backend', err)
    }
    saveDailyCheckin(session.patient_id, mood)
    setConfirmed(true)
    setTimeout(() => setConfirmed(false), 2500)
  }

  if (open) {
    return (
      <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 px-4">
        <div className="bg-surface rounded-3xl shadow-lg p-6 sm:p-8 max-w-sm w-full text-center">
          <img
            src="/avatar/smriti-avatar.jpg"
            alt="Smriti"
            className={`mx-auto rounded-full object-cover mb-4 ${simpleMode ? 'w-32 h-32' : 'w-24 h-24'}`}
          />
          <p className={`font-semibold text-ink mb-6 ${simpleMode ? 'text-2xl' : 'text-lg'}`}>{t('how_was_your_day')}</p>
          <div className="flex justify-center gap-3">
            {MOODS.map((m) => (
              <button
                key={m.mood}
                onClick={() => pick(m.mood)}
                aria-label={t(m.mood === 'Good' ? 'good' : m.mood === 'Okay' ? 'okay' : 'not_good')}
                className={`flex flex-col items-center gap-1 rounded-2xl bg-primary-tint hover:bg-line transition ${
                  simpleMode ? 'w-28 h-28' : 'w-20 h-20'
                }`}
              >
                <span className={simpleMode ? 'text-5xl' : 'text-4xl'}>{m.emoji}</span>
                <span className={`font-semibold text-ink-soft ${simpleMode ? 'text-sm' : 'text-xs'}`}>
                  {t(m.mood === 'Good' ? 'good' : m.mood === 'Okay' ? 'okay' : 'not_good')}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (confirmed) {
    return (
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 bg-surface border border-line rounded-full shadow-md px-5 py-3">
        <p className="text-primary font-semibold text-sm">{t('thank_you_noted')}</p>
      </div>
    )
  }

  return null
}
