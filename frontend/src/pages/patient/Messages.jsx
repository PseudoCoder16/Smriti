import { useEffect, useState } from 'react'
import PatientTopbar from '../../components/PatientTopbar.jsx'
import { api } from '../../api/client.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { useSettings } from '../../context/SettingsContext.jsx'
import { speak } from '../../utils/speak.js'

export default function Messages() {
  const { session } = useAuth()
  const { t } = useSettings()
  const [messages, setMessages] = useState(null)
  const [acked, setAcked] = useState({})

  useEffect(() => {
    api.get(`/messages/${session.patient_id}`).then((res) => setMessages(res.messages))
  }, [])

  return (
    <div className="min-h-screen">
      <PatientTopbar title={t('message_from_caregiver')} />
      <div className="max-w-2xl mx-auto px-6 py-8 flex flex-col gap-3">
        {messages === null && <p className="text-ink-soft">Loading…</p>}
        {messages?.length === 0 && (
          <p className="text-ink-faint text-sm bg-surface border border-line rounded-xl p-4">No messages yet from your caregiver.</p>
        )}
        {messages?.map((m) => (
          <div key={m.message_id} className="flex gap-3 bg-surface border border-line rounded-xl p-4">
            <span className="text-2xl">💬</span>
            <div className="flex-1">
              <div className="text-ink">{m.text}</div>
              <div className="text-xs text-ink-faint mt-1">{new Date(m.timestamp).toLocaleString()}</div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => speak(m.text)}
                  className="px-4 py-2 rounded-lg bg-primary-tint text-primary text-sm font-semibold"
                >
                  🔊 {t('listen')}
                </button>
                <button
                  onClick={() => setAcked((a) => ({ ...a, [m.message_id]: true }))}
                  disabled={acked[m.message_id]}
                  className="px-4 py-2 rounded-lg bg-surface border border-line text-sm font-semibold disabled:opacity-50"
                >
                  {acked[m.message_id] ? `✔️ ${t('got_it')}` : t('got_it')}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
