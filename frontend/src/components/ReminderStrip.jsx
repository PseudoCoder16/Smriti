import { useEffect, useState } from 'react'
import { api } from '../api/client.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useSettings } from '../context/SettingsContext.jsx'

export default function ReminderStrip() {
  const { session } = useAuth()
  const { t } = useSettings()
  const [items, setItems] = useState([])

  async function load() {
    const res = await api.get(`/medicine/${session.patient_id}`)
    setItems(res.medicine)
  }

  useEffect(() => { load() }, [])

  async function toggle(m) {
    await api.put(`/medicine/${m.medicine_id}`, { status: m.status === 'taken' ? 'pending' : 'taken' })
    load()
  }

  if (items.length === 0) return null

  return (
    <div className="border-t border-line bg-surface px-4 py-3 shrink-0">
      <div className="text-xs font-semibold text-ink-faint mb-2 px-1">{t('medicine')} &amp; {t('pending_today')}</div>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {items.map((m) => (
          <button
            key={m.medicine_id}
            onClick={() => toggle(m)}
            className={`shrink-0 flex items-center gap-2 rounded-xl px-4 py-2 border-2 whitespace-nowrap ${m.status === 'taken' ? 'bg-primary-tint border-primary text-primary' : 'bg-accent-tint border-accent text-accent-dark'}`}
          >
            <span className="text-xl">💊</span>
            <span className="text-sm font-semibold">{m.name}</span>
            <span className="text-xs opacity-80">{m.time}</span>
            <span className="text-xs font-bold">{m.status === 'taken' ? `✔ ${t('taken')}` : '⏳'}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
