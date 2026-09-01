import { useEffect, useState } from 'react'
import PatientTopbar from '../../components/PatientTopbar.jsx'
import { api } from '../../api/client.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { useSettings } from '../../context/SettingsContext.jsx'

export default function Medicine() {
  const { session } = useAuth()
  const { t } = useSettings()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    const res = await api.get(`/medicine/${session.patient_id}`)
    setItems(res.medicine)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function setStatus(m, status) {
    await api.put(`/medicine/${m.medicine_id}`, { status })
    load()
  }

  const pending = items.filter((m) => m.status !== 'taken')
  const done = items.filter((m) => m.status === 'taken')

  return (
    <div className="min-h-screen">
      <PatientTopbar title={t('medicine_time')} />
      <div className="max-w-2xl mx-auto px-6 py-8">
        {loading ? (
          <p className="text-ink-soft">Loading…</p>
        ) : (
          <>
            <Section title={t('pending_today')} items={pending} onSetStatus={setStatus} empty="Nothing pending — you're all caught up." t={t} />
            <Section title={t('completed')} items={done} onSetStatus={setStatus} empty="No medicine marked as taken yet today." t={t} />
          </>
        )}
      </div>
    </div>
  )
}

function Section({ title, items, onSetStatus, empty, t }) {
  return (
    <div className="mb-8">
      <h3 className="font-semibold text-ink-soft mb-3">{title}</h3>
      {items.length === 0 ? (
        <p className="text-ink-faint text-sm bg-surface border border-line rounded-xl p-4">{empty}</p>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((m) => (
            <div key={m.medicine_id} className="flex items-center gap-4 bg-surface border border-line rounded-xl p-4 flex-wrap">
              <span className="text-2xl">💊</span>
              <div className="flex-1 min-w-[8rem]">
                <div className={`font-semibold ${m.status === 'taken' ? 'line-through text-ink-faint' : ''}`}>{m.name}</div>
                <div className="text-sm text-ink-faint">{m.time} · {m.frequency}</div>
              </div>
              <div className="flex gap-2">
                {m.status === 'taken' ? (
                  <button
                    onClick={() => onSetStatus(m, 'pending')}
                    className="px-4 py-2 rounded-lg text-sm font-semibold bg-primary-tint text-primary"
                  >
                    ✔️ {t('taken')}
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => onSetStatus(m, 'taken')}
                      className="px-4 py-2 rounded-lg text-sm font-semibold bg-primary text-white"
                    >
                      ⏳ {t('mark_taken')}
                    </button>
                    <button
                      onClick={() => onSetStatus(m, 'remind_later')}
                      className="px-4 py-2 rounded-lg text-sm font-semibold bg-surface border border-line text-ink-soft"
                    >
                      🔔 {t('remind_later')}
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
