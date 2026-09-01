import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PatientTopbar from '../../../components/PatientTopbar.jsx'
import { useLocalGameResult } from '../../../hooks/useLocalGameResult.js'
import { useSettings } from '../../../context/SettingsContext.jsx'
import { startPatternSession, buildPatternAttemptEvent, recordPatternAttemptEvent } from '../../../data/patternGameAnalytics.js'

// Exactly 3 levels, per spec — grid size grows and display time shrinks as
// the number of target cells rises.
const LEVELS = [
  { level: 1, gridSize: 3, cellCount: 3, displayMs: 5000 },
  { level: 2, gridSize: 3, cellCount: 5, displayMs: 4000 },
  { level: 3, gridSize: 4, cellCount: 7, displayMs: 3000 },
]
const TOTAL_LEVELS = LEVELS.length

function randomPattern(gridSize, cellCount) {
  const all = Array.from({ length: gridSize * gridSize }, (_, i) => i)
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[all[i], all[j]] = [all[j], all[i]]
  }
  return all.slice(0, cellCount).sort((a, b) => a - b)
}

function sameCells(a, b) {
  if (a.length !== b.length) return false
  const sa = [...a].sort((x, y) => x - y)
  const sb = [...b].sort((x, y) => x - y)
  return sa.every((v, i) => v === sb[i])
}

export default function PatternGame() {
  const record = useLocalGameResult('pattern_recognition')
  const { t } = useSettings()
  const navigate = useNavigate()

  const [phase, setPhase] = useState('intro') // intro | showing | input | result
  const [levelIdx, setLevelIdx] = useState(0)
  const [targetCells, setTargetCells] = useState([])
  const [selected, setSelected] = useState([])
  const [countdown, setCountdown] = useState(0)
  const [outcome, setOutcome] = useState(null) // 'success' | 'retry' | 'level_complete'

  const attemptNumber = useRef(0)
  const correctionCount = useRef(0)
  const showStart = useRef(0)
  const inputStart = useRef(0)
  const sessionStats = useRef({ levelsCompleted: 0, totalAttempts: 0, times: [] })
  const countdownTimer = useRef(null)

  const conf = LEVELS[levelIdx]

  function startGame() {
    startPatternSession()
    sessionStats.current = { levelsCompleted: 0, totalAttempts: 0, times: [] }
    setLevelIdx(0)
    beginLevel(0)
  }

  function beginLevel(idx) {
    const c = LEVELS[idx]
    attemptNumber.current = 0
    correctionCount.current = 0
    setTargetCells(randomPattern(c.gridSize, c.cellCount))
    setSelected([])
    setOutcome(null)
    setPhase('showing')
    setCountdown(Math.ceil(c.displayMs / 1000))
    showStart.current = performance.now()
  }

  useEffect(() => {
    if (phase !== 'showing') return
    countdownTimer.current = setInterval(() => {
      setCountdown((s) => (s > 1 ? s - 1 : 0))
    }, 1000)
    const hideTimer = setTimeout(() => {
      clearInterval(countdownTimer.current)
      inputStart.current = performance.now()
      setPhase('input')
    }, conf.displayMs)
    return () => { clearInterval(countdownTimer.current); clearTimeout(hideTimer) }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only re-run when a new level's "showing" phase begins
  }, [phase, levelIdx])

  function toggleCell(idx) {
    if (phase !== 'input') return
    setSelected((prev) => {
      if (prev.includes(idx)) {
        correctionCount.current++
        return prev.filter((c) => c !== idx)
      }
      return [...prev, idx]
    })
  }

  function clearSelection() {
    if (selected.length) correctionCount.current++
    setSelected([])
  }

  function submit() {
    if (phase !== 'input') return
    attemptNumber.current++
    sessionStats.current.totalAttempts++
    const reactionTimeMs = Math.round(performance.now() - inputStart.current)
    const isMatch = sameCells(selected, targetCells)
    const isLastLevel = levelIdx === TOTAL_LEVELS - 1
    const status = isMatch ? (isLastLevel ? 'level_complete' : 'success') : 'retry'

    recordPatternAttemptEvent(buildPatternAttemptEvent({
      level: conf.level,
      gridSize: conf.gridSize,
      targetCellCount: conf.cellCount,
      displayDurationMs: conf.displayMs,
      targetCells,
      selectedCells: selected,
      attemptNumber: attemptNumber.current,
      reactionTimeMs,
      correctionCount: correctionCount.current,
      completionStatus: status,
    }))

    if (isMatch) {
      sessionStats.current.levelsCompleted++
      sessionStats.current.times.push(reactionTimeMs)
    }
    setOutcome(status)
    setPhase('result')
  }

  function nextLevel() {
    const idx = levelIdx + 1
    setLevelIdx(idx)
    beginLevel(idx)
  }

  function retryLevel() {
    beginLevel(levelIdx)
  }

  async function playAgain() {
    await finishSession()
    startGame()
  }

  async function finishSession() {
    await record({
      difficulty: `level_${TOTAL_LEVELS}`,
      rounds: TOTAL_LEVELS,
      correct: sessionStats.current.levelsCompleted,
      incorrect: sessionStats.current.totalAttempts - sessionStats.current.levelsCompleted,
      times: sessionStats.current.times,
    })
  }

  function goMainMenu() {
    if (sessionStats.current.totalAttempts > 0) finishSession()
    navigate('/games')
  }

  return (
    <div className="min-h-screen">
      <PatientTopbar title={t('pattern_recognition')} back="/games" />
      <div className="max-w-2xl mx-auto px-6 py-6 text-center">
        {phase !== 'intro' && (
          <div className="inline-block bg-primary-tint text-primary text-sm font-semibold px-4 py-1 rounded-full mb-4">
            {t('level_word')} {conf.level} / {TOTAL_LEVELS}
          </div>
        )}
        <p className="text-ink-soft mb-4">{t('pattern_instructions')}</p>

        {phase === 'intro' && (
          <div className="flex flex-col items-center gap-6 py-10">
            <div className="text-6xl">🧠</div>
            <button onClick={startGame} className="px-10 py-4 rounded-full bg-primary text-white font-bold text-lg">
              {t('start_game')}
            </button>
          </div>
        )}

        {(phase === 'showing' || phase === 'input') && (
          <>
            <p className="font-semibold text-primary mb-2">
              {phase === 'showing' ? t('pattern_watch_carefully') : t('pattern_your_turn')}
            </p>
            {phase === 'showing' && <p className="text-sm text-ink-faint mb-4">{countdown}s</p>}
            <div
              className="grid gap-3 justify-center mx-auto mb-6"
              style={{ gridTemplateColumns: `repeat(${conf.gridSize}, minmax(0, 1fr))`, maxWidth: conf.gridSize === 3 ? '20rem' : '24rem' }}
            >
              {Array.from({ length: conf.gridSize * conf.gridSize }).map((_, i) => {
                const isLit = phase === 'showing' && targetCells.includes(i)
                const isSelected = phase === 'input' && selected.includes(i)
                return (
                  <button
                    key={i}
                    onClick={() => toggleCell(i)}
                    disabled={phase !== 'input'}
                    aria-label={`Cell ${i + 1}`}
                    className={`aspect-square rounded-xl border-4 transition ${
                      isLit || isSelected ? 'bg-primary border-primary-dark scale-105' : 'bg-surface border-line'
                    }`}
                  />
                )
              })}
            </div>
            {phase === 'input' && (
              <div className="flex justify-center gap-3">
                <button onClick={clearSelection} className="px-6 py-3 rounded-full border-2 border-line text-ink-soft font-semibold">{t('clear')}</button>
                <button onClick={submit} className="px-8 py-3 rounded-full bg-primary text-white font-semibold">{t('submit')}</button>
              </div>
            )}
          </>
        )}

        {phase === 'result' && (
          <div className="flex flex-col items-center gap-4 py-10">
            {outcome === 'level_complete' ? (
              <>
                <div className="text-5xl">🏆</div>
                <h3 className="text-xl patient-serif">{t('pattern_level_completed')}</h3>
              </>
            ) : outcome === 'success' ? (
              <>
                <div className="text-5xl">✅</div>
                <h3 className="text-xl patient-serif">{t('great_job')}</h3>
                <p className="text-ink-soft text-sm">{t('pattern_great_job_desc')}</p>
              </>
            ) : (
              <>
                <div className="text-5xl">⭐</div>
                <h3 className="text-xl patient-serif">{t('pattern_almost_there')}</h3>
                <p className="text-ink-soft text-sm">{t('pattern_some_incorrect')}</p>
              </>
            )}

            <div className="flex flex-wrap justify-center gap-3 mt-2">
              {outcome === 'level_complete' && (
                <button onClick={playAgain} className="px-6 py-3 rounded-full bg-primary text-white font-semibold">🔁 {t('play_again')}</button>
              )}
              {outcome === 'success' && (
                <button onClick={nextLevel} className="px-6 py-3 rounded-full bg-primary text-white font-semibold">{t('next_level')}</button>
              )}
              {outcome === 'retry' && (
                <button onClick={retryLevel} className="px-6 py-3 rounded-full bg-accent text-white font-semibold">{t('retry')}</button>
              )}
              <button onClick={goMainMenu} className="px-6 py-3 rounded-full border-2 border-line text-ink-soft font-semibold">{t('main_menu')}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
