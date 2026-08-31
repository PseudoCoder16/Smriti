import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PatientTopbar from '../../components/PatientTopbar.jsx'
import { api } from '../../api/client.js'
import { useAuth } from '../../context/AuthContext.jsx'

const MOODS = [
  { mood: 'Happy', emoji: '😊' },
  { mood: 'Okay', emoji: '😐' },
  { mood: 'Sad', emoji: '😢' },
  { mood: 'Tired', emoji: '😴' },
]

export default function Checkin() {
  const { session } = useAuth()
  const navigate = useNavigate()
  const [done, setDone] = useState(false)

  async function pick(mood) {
    await api.post('/checkin', { patient_id: session.patient_id, mood })
    setDone(true)
    setTimeout(() => navigate('/home'), 1100)
  }

  return (
    <div className="min-h-screen">
      <PatientTopbar title="Check-in" />
      <div className="max-w-md mx-auto text-center px-6 py-14">
        <h2 className="text-2xl serif mb-8">How are you feeling right now?</h2>
        <div className="flex justify-center gap-4 mb-6">
          {MOODS.map((m) => (
            <button
              key={m.mood}
              onClick={() => pick(m.mood)}
              className="w-20 h-20 rounded-full bg-surface border border-line text-4xl flex items-center justify-center hover:border-primary hover:scale-105 transition"
            >
              {m.emoji}
            </button>
          ))}
        </div>
        {done && <p className="text-primary font-semibold">Thank you — noted.</p>}
      </div>
    </div>
  )
}
