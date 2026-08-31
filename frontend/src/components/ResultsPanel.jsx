import { useNavigate } from 'react-router-dom'

export default function ResultsPanel({ difficulty, score, correct, errors, avgResponseMs, onReplay, onChangeDifficulty }) {
  const navigate = useNavigate()
  const avgLabel = avgResponseMs ? (avgResponseMs / 1000).toFixed(1) + 's' : '—'

  return (
    <div className="flex flex-col items-center gap-6 py-10">
      <h3 className="text-xl serif">Session complete — 5 rounds ({difficulty})</h3>
      <div className="grid grid-cols-4 gap-4 w-full max-w-lg">
        {[
          ['Score', `${score}%`],
          ['Correct', correct],
          ['Errors', errors],
          ['Avg Response', avgLabel],
        ].map(([label, value]) => (
          <div key={label} className="bg-surface border border-line rounded-xl py-4 text-center">
            <div className="text-2xl font-bold text-primary">{value}</div>
            <div className="text-xs text-ink-faint mt-1">{label}</div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <button onClick={onReplay} className="px-6 py-3 rounded-lg bg-primary text-white font-semibold">🔁 Play Again</button>
        <button onClick={onChangeDifficulty} className="px-6 py-3 rounded-lg border-2 border-primary text-primary font-semibold">🎚️ Change Difficulty</button>
        <button onClick={() => navigate('/games')} className="px-6 py-3 rounded-lg text-ink-soft font-semibold">← Back to Games</button>
      </div>
    </div>
  )
}
