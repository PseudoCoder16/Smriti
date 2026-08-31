import { useRef, useState } from 'react'
import PatientTopbar from '../../../components/PatientTopbar.jsx'
import DifficultyPicker from '../../../components/DifficultyPicker.jsx'
import ResultsPanel from '../../../components/ResultsPanel.jsx'
import { useGameRecorder } from '../../../hooks/useGameRecorder.js'

const ICONS = ['🔺', '🔵', '⭐', '🟩', '🔶', '🟣', '⬛', '💠', '🔻']
const DIFF = { easy: { len: 3, sub: '3 shapes' }, medium: { len: 5, sub: '5 shapes' }, hard: { len: 7, sub: '7 shapes' } }
const TOTAL_ROUNDS = 5

export default function PatternGame() {
  const record = useGameRecorder('pattern_recognition')
  const [phase, setPhase] = useState('diff')
  const [difficulty, setDifficulty] = useState(null)
  const [round, setRound] = useState(0)
  const [status, setStatus] = useState('')
  const [lit, setLit] = useState(null)
  const [wrong, setWrong] = useState(null)
  const [active, setActive] = useState(false)
  const [result, setResult] = useState(null)

  const stats = useRef({ correct: 0, errors: 0, times: [] })
  const sequence = useRef([])
  const userIndex = useRef(0)
  const roundHasError = useRef(false)
  const roundStart = useRef(0)

  function start(diff) {
    stats.current = { correct: 0, errors: 0, times: [] }
    setDifficulty(diff)
    setPhase('play')
    playRound(diff, 0)
  }

  function playRound(diff, r) {
    setRound(r + 1)
    userIndex.current = 0
    roundHasError.current = false
    sequence.current = Array.from({ length: DIFF[diff].len }, () => Math.floor(Math.random() * 9))
    setActive(false)
    setStatus('Watch carefully…')

    let i = 0
    const interval = setInterval(() => {
      setLit(null)
      if (i < sequence.current.length) {
        setLit(sequence.current[i])
        setTimeout(() => setLit((v) => (v === sequence.current[i] ? null : v)), 400)
        i++
      } else {
        clearInterval(interval)
        setStatus('Your turn — tap them in order')
        roundStart.current = performance.now()
        setActive(true)
      }
    }, 600)
  }

  function tap(idx) {
    if (!active) return
    const expected = sequence.current[userIndex.current]
    if (idx === expected) {
      userIndex.current++
      if (userIndex.current === sequence.current.length) {
        setActive(false)
        if (!roundHasError.current) stats.current.correct++
        stats.current.times.push(performance.now() - roundStart.current)
        setStatus('Nice! Next round…')
        if (round >= TOTAL_ROUNDS) setTimeout(() => finish(difficulty), 900)
        else setTimeout(() => playRound(difficulty, round), 900)
      }
    } else {
      setWrong(idx)
      setTimeout(() => setWrong(null), 350)
      stats.current.errors++
      roundHasError.current = true
    }
  }

  async function finish(diff) {
    const { score, avgResponseMs } = await record({ difficulty: diff, ...stats.current })
    setResult({ score, avgResponseMs, correct: stats.current.correct, errors: stats.current.errors })
    setPhase('results')
  }

  return (
    <div className="min-h-screen">
      <PatientTopbar title="Pattern Recognition" back="/games" />
      <div className="max-w-2xl mx-auto px-6 py-6 text-center">
        {phase !== 'diff' && <div className="inline-block bg-primary-tint text-primary text-sm font-semibold px-4 py-1 rounded-full mb-4">Round {round} / {TOTAL_ROUNDS}</div>}
        <p className="text-ink-soft mb-2">Watch the shapes light up, then tap them back in the same order.</p>

        {phase === 'diff' && (
          <DifficultyPicker
            options={Object.entries(DIFF).map(([value, d]) => ({ value, label: value, sub: d.sub }))}
            onSelect={start}
          />
        )}

        {phase === 'play' && (
          <>
            <p className="text-sm text-ink-faint mb-2">Correct: {stats.current.correct} · Errors: {stats.current.errors}</p>
            <p className="font-semibold text-primary mb-4">{status}</p>
            <div className="grid grid-cols-3 gap-3 justify-center max-w-xs mx-auto">
              {ICONS.map((icon, i) => (
                <button
                  key={i}
                  onClick={() => tap(i)}
                  className={`h-20 rounded-xl text-3xl flex items-center justify-center border-2 ${lit === i ? 'bg-accent-tint border-accent scale-105' : wrong === i ? 'bg-clay-tint border-clay' : 'bg-surface border-line'}`}
                >
                  {icon}
                </button>
              ))}
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
