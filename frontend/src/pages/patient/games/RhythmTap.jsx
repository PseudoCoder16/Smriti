import { useRef, useState } from 'react'
import PatientTopbar from '../../../components/PatientTopbar.jsx'
import DifficultyPicker from '../../../components/DifficultyPicker.jsx'
import ResultsPanel from '../../../components/ResultsPanel.jsx'
import { useGameRecorder } from '../../../hooks/useGameRecorder.js'

const DIFF = {
  easy: { beats: 5, interval: 1100, tolerance: 550, sub: 'relaxed tempo' },
  medium: { beats: 6, interval: 900, tolerance: 400, sub: 'steady tempo' },
  hard: { beats: 7, interval: 700, tolerance: 300, sub: 'quick tempo' },
}
const TOTAL_ROUNDS = 5

export default function RhythmTap() {
  const record = useGameRecorder('rhythm_tap')
  const [phase, setPhase] = useState('diff')
  const [difficulty, setDifficulty] = useState(null)
  const [round, setRound] = useState(0)
  const [pulse, setPulse] = useState(false)
  const [dots, setDots] = useState([])
  const [feedback, setFeedback] = useState('')
  const [result, setResult] = useState(null)

  const stats = useRef({ correct: 0, errors: 0, times: [] })
  const current = useRef(0)
  const awaiting = useRef(false)
  const hit = useRef(false)
  const beatTime = useRef(0)
  const tickTimer = useRef(null)

  function start(diff) {
    stats.current = { correct: 0, errors: 0, times: [] }
    setDifficulty(diff)
    setPhase('play')
    nextRound(diff, 0)
  }

  function nextRound(diff, r) {
    current.current = 0
    setRound(r + 1)
    setDots(Array.from({ length: DIFF[diff].beats }, () => null))
    setFeedback('')
    tickTimer.current = setInterval(() => beat(diff, r), DIFF[diff].interval)
    beat(diff, r)
  }

  function beat(diff, r) {
    if (current.current >= DIFF[diff].beats) {
      clearInterval(tickTimer.current)
      if (r + 1 >= TOTAL_ROUNDS) finish(diff)
      else setTimeout(() => nextRound(diff, r + 1), 600)
      return
    }
    setPulse(true)
    setTimeout(() => setPulse(false), 220)
    awaiting.current = true
    hit.current = false
    beatTime.current = performance.now()
    const beatIndex = current.current

    setTimeout(() => {
      if (awaiting.current && !hit.current) {
        stats.current.errors++
        setDots((d) => { const next = [...d]; next[beatIndex] = 'miss'; return next })
      }
      awaiting.current = false
      current.current++
    }, DIFF[diff].tolerance)
  }

  function tap() {
    if (!awaiting.current) {
      setFeedback('Try to tap right as the drum pulses.')
      return
    }
    hit.current = true
    stats.current.correct++
    stats.current.times.push(performance.now() - beatTime.current)
    setDots((d) => { const next = [...d]; next[current.current] = 'hit'; return next })
    setFeedback('🎯 On beat!')
  }

  async function finish(diff) {
    const { score, avgResponseMs } = await record({ difficulty: diff, ...stats.current })
    setResult({ score, avgResponseMs, correct: stats.current.correct, errors: stats.current.errors })
    setPhase('results')
  }

  return (
    <div className="min-h-screen">
      <PatientTopbar title="Rhythm & Tap" back="/games" />
      <div className="max-w-2xl mx-auto px-6 py-6 text-center">
        {phase !== 'diff' && <div className="inline-block bg-primary-tint text-primary text-sm font-semibold px-4 py-1 rounded-full mb-4">Round {round} / {TOTAL_ROUNDS}</div>}
        <p className="text-ink-soft mb-2">Watch the drum pulse to the beat, then tap the button right as it pulses.</p>

        {phase === 'diff' && (
          <DifficultyPicker
            options={Object.entries(DIFF).map(([value, d]) => ({ value, label: value, sub: d.sub }))}
            onSelect={start}
          />
        )}

        {phase === 'play' && (
          <>
            <p className="text-sm text-ink-faint mb-4">Correct: {stats.current.correct} · Errors: {stats.current.errors}</p>
            <div className={`text-7xl mb-4 transition-transform ${pulse ? 'scale-125' : 'scale-100'}`}>🥁</div>
            <div className="flex justify-center gap-2 mb-6">
              {dots.map((d, i) => (
                <span key={i} className={`w-4 h-4 rounded-full ${d === 'hit' ? 'bg-primary' : d === 'miss' ? 'bg-clay' : 'bg-line'}`} />
              ))}
            </div>
            <button onClick={tap} className="px-12 py-6 rounded-2xl bg-accent text-white font-bold text-xl mb-3">TAP</button>
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
