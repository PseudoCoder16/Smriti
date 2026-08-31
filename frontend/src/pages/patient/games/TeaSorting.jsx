import { useRef, useState } from 'react'
import PatientTopbar from '../../../components/PatientTopbar.jsx'
import DifficultyPicker from '../../../components/DifficultyPicker.jsx'
import ResultsPanel from '../../../components/ResultsPanel.jsx'
import { useGameRecorder } from '../../../hooks/useGameRecorder.js'

const DIFF = {
  easy: { leaves: 4, duration: 4000, sub: 'slow pace' },
  medium: { leaves: 5, duration: 3000, sub: 'moderate pace' },
  hard: { leaves: 6, duration: 2200, sub: 'fast pace' },
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

export default function TeaSorting() {
  const record = useGameRecorder('tea_sorting')
  const [phase, setPhase] = useState('diff')
  const [difficulty, setDifficulty] = useState(null)
  const [round, setRound] = useState(0)
  const [leaf, setLeaf] = useState(null)
  const [feedback, setFeedback] = useState('')
  const [result, setResult] = useState(null)

  const stats = useRef({ correct: 0, errors: 0, times: [] })
  const queue = useRef([])
  const index = useRef(0)
  const resolved = useRef(true)
  const spawnTime = useRef(0)
  const timeoutRef = useRef(null)

  function start(diff) {
    stats.current = { correct: 0, errors: 0, times: [] }
    setDifficulty(diff)
    setPhase('play')
    nextRound(diff, 0)
  }

  function nextRound(diff, r) {
    const n = DIFF[diff].leaves
    queue.current = shuffle(Array.from({ length: n }, (_, i) => (i % 2 === 0 ? 'fresh' : 'dry')))
    index.current = 0
    setRound(r + 1)
    setFeedback('')
    spawnLeaf(diff, r)
  }

  function spawnLeaf(diff, r) {
    if (index.current >= queue.current.length) {
      if (r + 1 >= TOTAL_ROUNDS) finish(diff)
      else setTimeout(() => nextRound(diff, r + 1), 500)
      return
    }
    const type = queue.current[index.current]
    setLeaf(type)
    resolved.current = false
    spawnTime.current = performance.now()
    timeoutRef.current = setTimeout(() => {
      if (!resolved.current) {
        stats.current.errors++
        setFeedback('Missed — leaf reached the end.')
        resolved.current = true
        index.current++
        setLeaf(null)
        setTimeout(() => spawnLeaf(diff, r), 300)
      }
    }, DIFF[diff].duration)
  }

  function choose(chosenType) {
    if (resolved.current || !leaf) return
    resolved.current = true
    clearTimeout(timeoutRef.current)
    const rt = performance.now() - spawnTime.current
    if (leaf === chosenType) {
      stats.current.correct++
      stats.current.times.push(rt)
      setFeedback('✅ Correct!')
    } else {
      stats.current.errors++
      setFeedback(`❌ That was a ${leaf} leaf.`)
    }
    index.current++
    setLeaf(null)
    setTimeout(() => spawnLeaf(difficulty, round - 1), 300)
  }

  async function finish(diff) {
    const { score, avgResponseMs } = await record({ difficulty: diff, ...stats.current })
    setResult({ score, avgResponseMs, correct: stats.current.correct, errors: stats.current.errors })
    setPhase('results')
  }

  return (
    <div className="min-h-screen">
      <PatientTopbar title="Tea Leaf Sorting" back="/games" />
      <div className="max-w-2xl mx-auto px-6 py-6 text-center">
        {phase !== 'diff' && <div className="inline-block bg-primary-tint text-primary text-sm font-semibold px-4 py-1 rounded-full mb-4">Round {round} / {TOTAL_ROUNDS}</div>}
        <p className="text-ink-soft mb-2">As each leaf appears, tap the correct basket — fresh green leaves left, dry brown leaves right.</p>

        {phase === 'diff' && (
          <DifficultyPicker
            options={Object.entries(DIFF).map(([value, d]) => ({ value, label: value, sub: d.sub }))}
            onSelect={start}
          />
        )}

        {phase === 'play' && (
          <>
            <p className="text-sm text-ink-faint mb-4">Correct: {stats.current.correct} · Errors: {stats.current.errors}</p>
            <div className="h-28 flex items-center justify-center text-6xl mb-6 bg-surface border border-line rounded-xl">
              {leaf ? (leaf === 'fresh' ? '🍃' : '🍂') : '—'}
            </div>
            <div className="flex justify-center gap-6 mb-4">
              <button onClick={() => choose('fresh')} className="px-8 py-4 rounded-xl bg-primary-tint text-primary font-semibold text-lg">🧺 Fresh</button>
              <button onClick={() => choose('dry')} className="px-8 py-4 rounded-xl bg-clay-tint text-clay font-semibold text-lg">🧺 Dry</button>
            </div>
            <p className="text-sm font-semibold text-primary">{feedback}</p>
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
