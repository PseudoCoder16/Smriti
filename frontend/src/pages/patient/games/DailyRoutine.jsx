import { useRef, useState } from 'react'
import PatientTopbar from '../../../components/PatientTopbar.jsx'
import DifficultyPicker from '../../../components/DifficultyPicker.jsx'
import ResultsPanel from '../../../components/ResultsPanel.jsx'
import { useGameRecorder } from '../../../hooks/useGameRecorder.js'

const ROUTINE_FULL = [
  { icon: '🌅', key: 'wake', label: 'Wake up' },
  { icon: '🪥', key: 'brush', label: 'Brush teeth' },
  { icon: '👕', key: 'dress', label: 'Get dressed' },
  { icon: '🍽️', key: 'eat', label: 'Eat breakfast' },
  { icon: '💊', key: 'medicine', label: 'Take medicine' },
  { icon: '🛁', key: 'bathe', label: 'Bathe' },
  { icon: '📖', key: 'read', label: 'Read newspaper' },
  { icon: '😴', key: 'sleep', label: 'Sleep' },
]
const DIFF = {
  easy: { idx: [0, 3, 4, 7], sub: '4 steps' },
  medium: { idx: [0, 1, 3, 4, 5, 7], sub: '6 steps' },
  hard: { idx: [0, 1, 2, 3, 4, 5, 6, 7], sub: '8 steps' },
}
const TOTAL_ROUNDS = 5

function shuffle(arr) {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function DailyRoutine() {
  const record = useGameRecorder('routine_recall')
  const [phase, setPhase] = useState('diff')
  const [difficulty, setDifficulty] = useState(null)
  const [round, setRound] = useState(0)
  const [items, setItems] = useState([])
  const [pool, setPool] = useState([])
  const [placed, setPlaced] = useState([])
  const [hint, setHint] = useState('')
  const [result, setResult] = useState(null)

  const stats = useRef({ correct: 0, errors: 0, times: [] })
  const roundStart = useRef(0)

  function start(diff) {
    stats.current = { correct: 0, errors: 0, times: [] }
    setDifficulty(diff)
    setPhase('play')
    nextRound(diff, 0)
  }

  function nextRound(diff, r) {
    const its = DIFF[diff].idx.map((i) => ROUTINE_FULL[i])
    setItems(its)
    setPool(shuffle(its))
    setPlaced([])
    setHint('')
    setRound(r + 1)
    roundStart.current = performance.now()
  }

  function tap(item) {
    const expected = items[placed.length]
    if (item.key === expected.key) {
      const next = [...placed, item.key]
      setPlaced(next)
      stats.current.correct++
      if (next.length === items.length) {
        stats.current.times.push(performance.now() - roundStart.current)
        setHint('🎉 Well done!')
        if (round >= TOTAL_ROUNDS) setTimeout(() => finish(difficulty), 700)
        else setTimeout(() => nextRound(difficulty, round), 700)
      }
    } else {
      stats.current.errors++
      setHint('Not quite — try again.')
    }
  }

  async function finish(diff) {
    const { score, avgResponseMs } = await record({ difficulty: diff, ...stats.current })
    setResult({ score, avgResponseMs, correct: stats.current.correct, errors: stats.current.errors })
    setPhase('results')
  }

  return (
    <div className="min-h-screen">
      <PatientTopbar title="Daily Routine Recall" back="/games" />
      <div className="max-w-2xl mx-auto px-6 py-6 text-center">
        {phase !== 'diff' && <div className="inline-block bg-primary-tint text-primary text-sm font-semibold px-4 py-1 rounded-full mb-4">Round {round} / {TOTAL_ROUNDS}</div>}
        <p className="text-ink-soft mb-2">Tap the activities in the order you do them each day, starting from waking up.</p>

        {phase === 'diff' && (
          <DifficultyPicker
            options={Object.entries(DIFF).map(([value, d]) => ({ value, label: value, sub: d.sub }))}
            onSelect={start}
          />
        )}

        {phase === 'play' && (
          <>
            <p className="text-sm text-ink-faint mb-4">Correct: {stats.current.correct} · Errors: {stats.current.errors}</p>
            <div className="flex justify-center flex-wrap gap-2 mb-6">
              {items.map((it, i) => (
                <div key={it.key} className={`w-14 h-14 rounded-lg border-2 flex items-center justify-center text-2xl ${placed[i] ? 'bg-primary-tint border-primary' : 'border-line'}`}>
                  {placed[i] ? ROUTINE_FULL.find((r) => r.key === placed[i]).icon : ''}
                </div>
              ))}
            </div>
            <div className="flex justify-center flex-wrap gap-3 mb-3">
              {pool.map((item) => (
                <button
                  key={item.key}
                  onClick={() => tap(item)}
                  disabled={placed.includes(item.key)}
                  className={`px-4 py-3 rounded-xl border-2 text-2xl ${placed.includes(item.key) ? 'opacity-30 border-line' : 'border-line hover:border-primary bg-surface'}`}
                >
                  {item.icon}
                </button>
              ))}
            </div>
            <p className="text-sm text-primary font-semibold">{hint}</p>
          </>
        )}

        {phase === 'results' && result && (
          <ResultsPanel
            difficulty={difficulty}
            score={result.score}
            correct={result.correct}
            errors={result.errors}
            avgResponseMs={result.avgResponseMs}
            onReplay={() => start(difficulty)}
            onChangeDifficulty={() => setPhase('diff')}
          />
        )}
      </div>
    </div>
  )
}
