import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PatientTopbar from '../../components/PatientTopbar.jsx'
import PatientAvatar from '../../components/PatientAvatar.jsx'
import VoiceMicButton from '../../components/VoiceMicButton.jsx'
import { api } from '../../api/client.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { useSettings } from '../../context/SettingsContext.jsx'
import { speak, matchMoodIntent } from '../../utils/voiceService.js'

export default function Checkin() {
  const { session } = useAuth()
  const { t, language } = useSettings()
  const navigate = useNavigate()
  const [done, setDone] = useState(false)
  const [busy, setBusy] = useState(false)

  const MOODS = [
    { mood: 'Good', emoji: '🙂', label: t('good') },
    { mood: 'Okay', emoji: '😐', label: t('okay') },
    { mood: 'Not Good', emoji: '🙁', label: t('not_good') },
  ]

  useEffect(() => {
    if (!done) speak(t('how_was_your_day'), language, 'how_was_your_day')
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only re-speak on language change, not on every render
  }, [language])

  const MOOD_RESPONSE_KEY = { Good: 'mood_response_good', Okay: 'mood_response_okay', 'Not Good': 'mood_response_not_good' }

  async function pick(mood) {
    setBusy(true)
    await api.post('/checkin', { patient_id: session.patient_id, mood })
    setBusy(false)
    setDone(true)
    const key = MOOD_RESPONSE_KEY[mood]
    if (key) speak(t(key), language, key)
  }

  function handleVoiceResult(text) {
    const mood = matchMoodIntent(text, { good: t('good'), okay: t('okay'), not_good: t('not_good') })
    if (mood) pick(mood)
    // No match — patient can just tap a button below; voice never blocks the flow.
  }

  return (
    <div className="min-h-screen">
      <PatientTopbar title={t('checkin')} />
      <div className="max-w-md mx-auto text-center px-6 py-14">
        {!done ? (
          <>
            <div className="mb-8 flex justify-center">
              <PatientAvatar message={t('how_was_your_day')} />
            </div>
            <div className="flex justify-center gap-4 mb-8">
              {MOODS.map((m) => (
                <button
                  key={m.mood}
                  disabled={busy}
                  onClick={() => pick(m.mood)}
                  className="flex flex-col items-center gap-2 w-24 h-24 rounded-2xl bg-surface border border-line hover:border-primary hover:scale-105 transition disabled:opacity-60"
                >
                  <span className="text-4xl">{m.emoji}</span>
                  <span className="text-xs font-semibold text-ink-soft">{m.label}</span>
                </button>
              ))}
            </div>
            <div className="flex justify-center">
              <VoiceMicButton onResult={handleVoiceResult} />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-6 py-6">
            <p className="text-primary font-semibold text-lg">{t('thank_you_noted')}</p>
            <button
              onClick={() => navigate('/home')}
              className="px-8 py-4 rounded-lg bg-primary text-white font-semibold text-lg"
            >
              {t('continue')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
