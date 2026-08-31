import { useEffect, useRef, useState } from 'react'
import { api } from '../api/client.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useSettings } from '../context/SettingsContext.jsx'

export default function AlertsPopover() {
  const { session } = useAuth()
  const { t } = useSettings()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const ref = useRef(null)

  useEffect(() => {
    api.get(`/messages/${session.patient_id}`).then((res) => setMessages(res.messages))
  }, [])

  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative w-11 h-11 rounded-full bg-primary-tint text-primary text-xl flex items-center justify-center"
        aria-label={t('messages')}
      >
        💬
        {messages.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-clay text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {messages.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 max-h-80 overflow-y-auto bg-surface border border-line rounded-xl shadow-lg z-30 p-2">
          <div className="text-xs font-semibold text-ink-faint px-2 py-1">{t('messages')}</div>
          {messages.length === 0 && <p className="text-sm text-ink-faint px-2 py-3">No messages yet from your caregiver.</p>}
          {messages.map((m) => (
            <div key={m.message_id} className="px-2 py-2 border-t border-line text-sm">
              <div>{m.text}</div>
              <div className="text-xs text-ink-faint mt-1">{new Date(m.timestamp).toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
