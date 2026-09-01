import { useRef, useState } from 'react'
import PatientTopbar from '../../../components/PatientTopbar.jsx'
import DifficultyPicker from '../../../components/DifficultyPicker.jsx'
import ResultsPanel from '../../../components/ResultsPanel.jsx'
import { useLocalGameResult } from '../../../hooks/useLocalGameResult.js'
import { useSettings } from '../../../context/SettingsContext.jsx'

// Original Smriti puzzle — not a copy of any reference artwork/branding.
// Balls are plain CSS circles; tubes are plain CSS containers.
// `letter` gives each ball a non-color cue (initial) so sorting doesn't rely
// on color perception alone.
const COLORS = [
  { key: 'red', hex: '#c0392b', letter: 'R' },
  { key: 'blue', hex: '#2563eb', letter: 'B' },
  { key: 'green', hex: '#1f7a3d', letter: 'G' },
  { key: 'yellow', hex: '#d4a017', letter: 'Y' },
  { key: 'purple', hex: '#7c3aed', letter: 'P' },
]
const CAPACITY = 4
const TOTAL_ROUNDS = 5

// More tubes/colors and a heavier scramble as difficulty rises, per the
// "fewer/more balls, fewer/more tubes" guidance — exact counts tuned for a
// playable, reliably-solvable puzzle rather than any fixed target count.
const DIFF = {
  easy: { colors: 3, emptyTubes: 2, scramble: 12, sub: '3 colors, 5 tubes' },
  medium: { colors: 4, emptyTubes: 2, scramble: 20, sub: '4 colors, 6 tubes' },
  hard: { colors: 5, emptyTubes: 2, scramble: 30, sub: '5 colors, 7 tubes' },
}

function isSolved(tubes) {
  return tubes.every((t) => t.length === 0 || (t.length === CAPACITY && t.every((b) => b === t[0])))
}

function legalMoves(tubes) {
  const moves = []
  for (let from = 0; from < tubes.length; from++) {
    if (tubes[from].length === 0) continue
    const ball = tubes[from][tubes[from].length - 1]
    for (let to = 0; to < tubes.length; to++) {
      if (to === from || tubes[to].length >= CAPACITY) continue
      const top = tubes[to][tubes[to].length - 1]
      if (tubes[to].length === 0 || top === ball) moves.push([from, to])
    }
  }
  return moves
}

// Generates a puzzle by scrambling a solved arrangement with random legal
// moves. Because every move is reversible, replaying the scramble backwards
// always solves the result — every generated puzzle is guaranteed solvable.
function generatePuzzle(numColors, emptyTubes, scrambleMoves) {
  const colorKeys = COLORS.slice(0, numColors).map((c) => c.key)
  let tubes = colorKeys.map((key) => Array(CAPACITY).fill(key))
  for (let i = 0; i < emptyTubes; i++) tubes.push([])

  let lastMove = null
  for (let i = 0; i < scrambleMoves; i++) {
    const moves = legalMoves(tubes)
    const pool = moves.filter(([from, to]) => !(lastMove && from === lastMove[1] && to === lastMove[0]))
    const candidates = pool.length ? pool : moves
    if (candidates.length === 0) break
    const [from, to] = candidates[Math.floor(Math.random() * candidates.length)]
    tubes[from] = tubes[from].slice()
    tubes[to] = tubes[to].slice()
    tubes[to].push(tubes[from].pop())
    lastMove = [from, to]
  }

  return isSolved(tubes) ? generatePuzzle(numColors, emptyTubes, scrambleMoves) : tubes
}

export default function ColorSort() {
  const record = useLocalGameResult('color_sort')
  const { t } = useSettings()
  const [phase, setPhase] = useState('diff')
  const [difficulty, setDifficulty] = useState(null)
  const [round, setRound] = useState(0)
  const [tubes, setTubes] = useState([])
  const [selected, setSelected] = useState(null)
  const [feedback, setFeedback] = useState('')
  const [result, setResult] = useState(null)

  const stats = useRef({ correct: 0, incorrect: 0, times: [] })
  const roundIndexRef = useRef(0)
  const moveStart = useRef(0)

  function start(diff) {
    stats.current = { correct: 0, incorrect: 0, times: [] }
    setDifficulty(diff)
    setPhase('play')
    roundIndexRef.current = 0
    beginRound(diff)
  }

  function beginRound(diff) {
    const conf = DIFF[diff]
    setTubes(generatePuzzle(conf.colors, conf.emptyTubes, conf.scramble))
    setSelected(null)
    setFeedback('')
    setRound(roundIndexRef.current + 1)
  }

  function advanceRound(diff) {
    roundIndexRef.current++
    if (roundIndexRef.current >= TOTAL_ROUNDS) finish(diff)
    else beginRound(diff)
  }

  function tapTube(idx) {
    if (phase !== 'play') return

    if (selected === null) {
      if (tubes[idx].length === 0) {
        setFeedback(t('color_sort_pick_a_tube'))
        return
      }
      setSelected(idx)
      setFeedback('')
      moveStart.current = performance.now()
      return
    }

    if (selected === idx) {
      setSelected(null)
      setFeedback('')
      return
    }

    const from = selected
    const to = idx
    const ball = tubes[from][tubes[from].length - 1]
    const destTop = tubes[to][tubes[to].length - 1]
    const valid = tubes[to].length < CAPACITY && (tubes[to].length === 0 || destTop === ball)

    if (!valid) {
      stats.current.incorrect++
      setFeedback(`❌ ${t('try_again')}`)
      setSelected(null)
      return
    }

    const rt = performance.now() - moveStart.current
    const next = tubes.map((t) => t.slice())
    next[to].push(next[from].pop())
    stats.current.correct++
    stats.current.times.push(rt)
    setTubes(next)
    setSelected(null)

    if (isSolved(next)) {
      setFeedback(`🎉 ${t('great_job')}`)
      setTimeout(() => advanceRound(difficulty), 900)
    } else {
      setFeedback(`✅ ${t('correct')}`)
    }
  }

  async function finish(diff) {
    const res = await record({
      difficulty: diff,
      rounds: TOTAL_ROUNDS,
      correct: stats.current.correct,
      incorrect: stats.current.incorrect,
      times: stats.current.times,
    })
    setResult({ score: res.score, avgResponseMs: res.average_response_time, correct: res.correct, errors: res.errors })
    setPhase('results')
  }

  return (
    <div className="min-h-screen">
      <PatientTopbar title={t('color_sort')} back="/home" />
      <div className="max-w-2xl mx-auto px-6 py-6 text-center">
        {phase === 'play' && <div className="inline-block bg-primary-tint text-primary text-sm font-semibold px-4 py-1 rounded-full mb-4">{t('round')} {round} / {TOTAL_ROUNDS}</div>}
        <p className="text-ink-soft mb-4">{t('color_sort_instructions')}</p>

        {phase === 'diff' && (
          <DifficultyPicker
            options={Object.entries(DIFF).map(([value, d]) => ({ value, label: value, sub: d.sub }))}
            onSelect={start}
          />
        )}

        {phase === 'play' && (
          <>
            <p className="text-sm text-ink-faint mb-4">{t('correct')}: {stats.current.correct} · {t('errors')}: {stats.current.incorrect}</p>
            <div className="flex flex-wrap justify-center gap-4 mb-4">
              {tubes.map((tube, idx) => (
                <button
                  key={idx}
                  onClick={() => tapTube(idx)}
                  aria-label={`Tube ${idx + 1}${tube.length ? `, ${tube.length} balls` : ', empty'}`}
                  className={`flex flex-col-reverse items-center gap-1.5 w-16 sm:w-20 p-2 rounded-b-2xl rounded-t-lg border-4 bg-surface transition ${
                    selected === idx ? 'border-primary scale-105' : 'border-line'
                  }`}
                  style={{ minHeight: `${CAPACITY * 3 + 1}rem` }}
                >
                  {Array.from({ length: CAPACITY }).map((_, slot) => {
                    const ball = tube[slot]
                    const color = ball ? COLORS.find((c) => c.key === ball) : null
                    return color ? (
                      <span
                        key={slot}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-black/10 shrink-0 flex items-center justify-center text-white font-bold text-sm"
                        style={{ backgroundColor: color.hex }}
                      >
                        {color.letter}
                      </span>
                    ) : (
                      <span key={slot} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-dashed border-line shrink-0" />
                    )
                  })}
                </button>
              ))}
            </div>
            <p className="text-sm font-semibold text-primary min-h-6">{feedback}</p>
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
