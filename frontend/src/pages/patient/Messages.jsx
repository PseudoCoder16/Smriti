import { useEffect, useState } from 'react'
import PatientTopbar from '../../components/PatientTopbar.jsx'
import { api } from '../../api/client.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { useSettings } from '../../context/SettingsContext.jsx'
import { speak } from '../../utils/voiceService.js'

export default function Messages() {
  const { session } = useAuth()
  const { t, language } = useSettings()
  const [messages, setMessages] = useState(null)

  useEffect(() => {
    api.get(`/messages/${session.patient_id}`).then((res) => setMessages(res.messages))
  }, [])

  async function markRead(messageId) {
    setMessages((msgs) => msgs.map((m) => (m.message_id === messageId ? { ...m, read: true } : m)))
    try {
      await api.put(`/message/${messageId}`, { read: true })
    } catch (err) {
      console.warn('[messages] failed to save read status', err)
    }
  }

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
                  onClick={() => speak(m.text, language)}
                  className="px-4 py-2 rounded-lg bg-primary-tint text-primary text-sm font-semibold"
                >
                  🔊 {t('listen')}
                </button>
                <button
                  onClick={() => markRead(m.message_id)}
                  disabled={m.read}
                  className="px-4 py-2 rounded-lg bg-surface border border-line text-sm font-semibold disabled:opacity-50"
                >
                  {m.read ? `✔️ ${t('got_it')}` : t('got_it')}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
