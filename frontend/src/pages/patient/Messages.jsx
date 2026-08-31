import { useEffect, useState } from 'react'
import PatientTopbar from '../../components/PatientTopbar.jsx'
import { api } from '../../api/client.js'
import { useAuth } from '../../context/AuthContext.jsx'

export default function Messages() {
  const { session } = useAuth()
  const [messages, setMessages] = useState(null)

  useEffect(() => {
    api.get(`/messages/${session.patient_id}`).then((res) => setMessages(res.messages))
  }, [])

  return (
    <div className="min-h-screen">
      <PatientTopbar title="Messages from your Caregiver" />
      <div className="max-w-2xl mx-auto px-6 py-8 flex flex-col gap-3">
        {messages === null && <p className="text-ink-soft">Loading…</p>}
        {messages?.length === 0 && (
          <p className="text-ink-faint text-sm bg-surface border border-line rounded-xl p-4">No messages yet from your caregiver.</p>
        )}
        {messages?.map((m) => (
          <div key={m.message_id} className="flex gap-3 bg-surface border border-line rounded-xl p-4">
            <span className="text-2xl">💬</span>
            <div>
              <div className="text-ink">{m.text}</div>
              <div className="text-xs text-ink-faint mt-1">{new Date(m.timestamp).toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
