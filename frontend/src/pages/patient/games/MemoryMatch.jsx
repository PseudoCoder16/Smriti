import { useRef, useState } from 'react'
import PatientTopbar from '../../../components/PatientTopbar.jsx'
import DifficultyPicker from '../../../components/DifficultyPicker.jsx'
import ResultsPanel from '../../../components/ResultsPanel.jsx'
import { useGameRecorder } from '../../../hooks/useGameRecorder.js'

const EMOJI = ['🍵', '🎋', '🏔️', '🦚', '🐘', '🌾', '🥁', '🧣']
const DIFF = { easy: { pairs: 4, sub: '4 pairs' }, medium: { pairs: 6, sub: '6 pairs' }, hard: { pairs: 8, sub: '8 pairs' } }
const TOTAL_ROUNDS = 5

function shuffle(arr) {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function MemoryMatch() {
  const record = useGameRecorder('memory_match')
  const [phase, setPhase] = useState('diff') // diff | play | results
  const [difficulty, setDifficulty] = useState(null)
  const [round, setRound] = useState(0)
  const [cards, setCards] = useState([])
  const [flipped, setFlipped] = useState([])
  const [matched, setMatched] = useState([])
  const [locked, setLocked] = useState(false)
  const [result, setResult] = useState(null)

  const stats = useRef({ correct: 0, errors: 0, times: [] })
  const roundStart = useRef(0)

  function start(diff) {
    stats.current = { correct: 0, errors: 0, times: [] }
    setDifficulty(diff)
    setRound(0)
    setPhase('play')
    nextRound(diff, 0)
  }

  function nextRound(diff, r) {
    const pairs = DIFF[diff].pairs
    const set = shuffle(EMOJI).slice(0, pairs)
    setCards(shuffle([...set, ...set]).map((emoji, i) => ({ id: i, emoji })))
    setFlipped([]); setMatched([]); setLocked(false)
    setRound(r + 1)
    roundStart.current = performance.now()
  }

  function flip(card) {
    if (locked || flipped.includes(card.id) || matched.includes(card.id)) return
    const nextFlipped = [...flipped, card.id]
    setFlipped(nextFlipped)
    if (nextFlipped.length < 2) return

    setLocked(true)
    const [firstId, secondId] = nextFlipped
    const first = cards.find((c) => c.id === firstId)
    const second = cards.find((c) => c.id === secondId)
    const isMatch = first.emoji === second.emoji

    setTimeout(() => {
      if (isMatch) {
        stats.current.correct++
        const newMatched = [...matched, firstId, secondId]
        setMatched(newMatched)
        setFlipped([])
        setLocked(false)
        if (newMatched.length === cards.length) {
          stats.current.times.push(performance.now() - roundStart.current)
          if (round >= TOTAL_ROUNDS) finish(difficulty)
          else setTimeout(() => nextRound(difficulty, round), 500)
        }
      } else {
        stats.current.errors++
        setFlipped([])
        setLocked(false)
      }
    }, 650)
  }

  async function finish(diff) {
    const { score, avgResponseMs } = await record({ difficulty: diff, ...stats.current })
    setResult({ score, avgResponseMs, correct: stats.current.correct, errors: stats.current.errors })
    setPhase('results')
  }

  return (
    <div className="min-h-screen">
      <PatientTopbar title="Memory Match" back="/games" />
      <div className="max-w-2xl mx-auto px-6 py-6 text-center">
        {phase !== 'diff' && <div className="inline-block bg-primary-tint text-primary text-sm font-semibold px-4 py-1 rounded-full mb-4">Round {round} / {TOTAL_ROUNDS}</div>}
        <p className="text-ink-soft mb-2">Flip two cards at a time and find every matching pair.</p>

        {phase === 'diff' && (
          <DifficultyPicker
            options={Object.entries(DIFF).map(([value, d]) => ({ value, label: value, sub: d.sub }))}
            onSelect={start}
          />
        )}

        {phase === 'play' && (
          <>
            <p className="text-sm text-ink-faint mb-4">Correct: {stats.current.correct} · Errors: {stats.current.errors}</p>
            <div className="grid gap-3 justify-center" style={{ gridTemplateColumns: `repeat(${Math.min(cards.length, 4)}, 4.5rem)` }}>
              {cards.map((c) => {
                const isUp = flipped.includes(c.id) || matched.includes(c.id)
                return (
                  <button
                    key={c.id}
                    onClick={() => flip(c)}
                    className={`h-18 rounded-xl text-3xl flex items-center justify-center border-2 aspect-square ${isUp ? 'bg-primary-tint border-primary' : 'bg-primary border-primary text-transparent'}`}
                  >
                    {isUp ? c.emoji : '?'}
                  </button>
                )
              })}
            </div>
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
