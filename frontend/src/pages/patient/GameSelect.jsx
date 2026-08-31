import { useNavigate } from 'react-router-dom'
import PatientTopbar from '../../components/PatientTopbar.jsx'

const GAMES = [
  { to: '/games/memory-match', emoji: '🃏', name: 'Memory Match', desc: 'Flip the cards and find matching pairs.' },
  { to: '/games/pattern', emoji: '🔷', name: 'Pattern Recognition', desc: 'Watch the sequence, then tap it back.' },
  { to: '/games/routine', emoji: '🪥', name: 'Daily Routine Recall', desc: "Arrange the day's activities in order." },
  { to: '/games/tea-sorting', emoji: '🍃', name: 'Tea Leaf Sorting', desc: 'Sort fresh green leaves from dry brown ones.' },
  { to: '/games/rhythm-tap', emoji: '🥁', name: 'Rhythm & Tap', desc: 'Tap along to the folk drum beat.' },
]

export default function GameSelect() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen">
      <PatientTopbar title="Choose a game" />
      <div className="max-w-4xl mx-auto px-6 py-8 grid sm:grid-cols-2 gap-5">
        {GAMES.map((g) => (
          <button
            key={g.to}
            onClick={() => navigate(g.to)}
            className="bg-surface border border-line rounded-2xl overflow-hidden text-left hover:border-primary transition"
          >
            <div className="bg-primary-tint text-4xl py-8 text-center">{g.emoji}</div>
            <div className="p-5">
              <h3 className="font-semibold text-lg mb-1">{g.name}</h3>
              <p className="text-sm text-ink-soft">{g.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
