import { useEffect, useState } from 'react'
import PatientTopbar from '../../components/PatientTopbar.jsx'
import { api } from '../../api/client.js'
import { useAuth } from '../../context/AuthContext.jsx'

export default function Medicine() {
  const { session } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    const res = await api.get(`/medicine/${session.patient_id}`)
    setItems(res.medicine)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function toggleStatus(m) {
    const status = m.status === 'taken' ? 'pending' : 'taken'
    await api.put(`/medicine/${m.medicine_id}`, { status })
    load()
  }

  const pending = items.filter((m) => m.status !== 'taken')
  const done = items.filter((m) => m.status === 'taken')

  return (
    <div className="min-h-screen">
      <PatientTopbar title="Medicine & Reminders" />
      <div className="max-w-2xl mx-auto px-6 py-8">
        {loading ? (
          <p className="text-ink-soft">Loading…</p>
        ) : (
          <>
            <Section title="Pending today" items={pending} onToggle={toggleStatus} empty="Nothing pending — you're all caught up." />
            <Section title="Completed" items={done} onToggle={toggleStatus} empty="No medicine marked as taken yet today." />
          </>
        )}
      </div>
    </div>
  )
}

function Section({ title, items, onToggle, empty }) {
  return (
    <div className="mb-8">
      <h3 className="font-semibold text-ink-soft mb-3">{title}</h3>
      {items.length === 0 ? (
        <p className="text-ink-faint text-sm bg-surface border border-line rounded-xl p-4">{empty}</p>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((m) => (
            <div key={m.medicine_id} className="flex items-center gap-4 bg-surface border border-line rounded-xl p-4">
              <span className="text-2xl">💊</span>
              <div className="flex-1">
                <div className={`font-semibold ${m.status === 'taken' ? 'line-through text-ink-faint' : ''}`}>{m.name}</div>
                <div className="text-sm text-ink-faint">{m.time} · {m.frequency}</div>
              </div>
              <button
                onClick={() => onToggle(m)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold ${m.status === 'taken' ? 'bg-primary-tint text-primary' : 'bg-primary text-white'}`}
              >
                {m.status === 'taken' ? '✔️ Taken' : '⏳ Mark taken'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
