import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PatientTopbar from '../../components/PatientTopbar.jsx'
import { api } from '../../api/client.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { useSettings } from '../../context/SettingsContext.jsx'

export default function Checkin() {
  const { session } = useAuth()
  const { t } = useSettings()
  const navigate = useNavigate()
  const [done, setDone] = useState(false)
  const [busy, setBusy] = useState(false)

  const MOODS = [
    { mood: 'Good', emoji: '🙂', label: t('good') },
    { mood: 'Okay', emoji: '😐', label: t('okay') },
    { mood: 'Not Good', emoji: '🙁', label: t('not_good') },
  ]

  async function pick(mood) {
    setBusy(true)
    await api.post('/checkin', { patient_id: session.patient_id, mood })
    setBusy(false)
    setDone(true)
  }

  return (
    <div className="min-h-screen">
      <PatientTopbar title={t('checkin')} />
      <div className="max-w-md mx-auto text-center px-6 py-14">
        {!done ? (
          <>
            <h2 className="text-2xl serif mb-8">{t('how_was_your_day')}</h2>
            <div className="flex justify-center gap-4 mb-6">
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
