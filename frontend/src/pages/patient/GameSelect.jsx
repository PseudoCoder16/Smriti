import { useNavigate } from 'react-router-dom'
import PatientTopbar from '../../components/PatientTopbar.jsx'

const GAMES = [
  { to: '/games/music-memory', emoji: '🎵', name: 'Song Recognition', desc: 'Listen and say if the music feels familiar.' },
  { to: '/games/remember-my-story', emoji: '📖', name: 'Family Memory', desc: 'Gentle prompts to share a memory or story.' },
  { to: '/games/color-sort', emoji: '🎨', name: 'Color Sort', desc: 'Tap the jar that matches each colored ball.' },
  { to: '/games/rhythm-tap', emoji: '🥁', name: 'Rhythm & Tap', desc: 'Tap along to the folk drum beat.' },
  { to: '/games/pattern', emoji: '🔷', name: 'Pattern Recognition', desc: 'Watch the sequence, then tap it back.' },
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
