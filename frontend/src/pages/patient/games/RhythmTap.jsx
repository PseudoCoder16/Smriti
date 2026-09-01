import { useRef, useState } from 'react'
import PatientTopbar from '../../../components/PatientTopbar.jsx'
import ResultsPanel from '../../../components/ResultsPanel.jsx'
import { useLocalGameResult } from '../../../hooks/useLocalGameResult.js'
import { useSettings } from '../../../context/SettingsContext.jsx'
import { RHYTHM_STYLES, getRhythmStyle } from '../../../data/rhythmPatterns.js'

// Scored modes tap along with the beat; Listen First is pure demonstration
// (no tapping, no scoring) so a patient can hear the pattern first without
// any pressure to perform. Tempo/tolerance loosen as difficulty rises the
// other direction (slower + more forgiving for easy).
const MODES = {
  easy: { tempoMs: 900, tolerance: 550, sub: 'Relaxed tempo' },
  medium: { tempoMs: 700, tolerance: 420, sub: 'Steady tempo' },
  advanced: { tempoMs: 550, tolerance: 320, sub: 'Quick tempo' },
}
const LISTEN_TEMPO_MS = 800

// Rounds are sized to land near the middle of the required 30-90s window,
// regardless of which cultural pattern/tempo is active, by picking however
// many loops of the pattern that takes.
const TARGET_ROUND_MS = 45000
const MIN_LOOPS = 3

function loopsForDuration(pattern, tempoMs) {
  const unitSum = pattern.reduce((a, b) => a + b, 0)
  return Math.max(MIN_LOOPS, Math.round(TARGET_ROUND_MS / (unitSum * tempoMs)))
}

// Synthesized click — no audio files needed, so this never depends on
// network/uploaded assets and keeps working fully offline. Silently does
// nothing if Web Audio is unavailable or blocked.
function useClickSound() {
  const ctxRef = useRef(null)
  return () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      if (!AudioCtx) return
      if (!ctxRef.current) ctxRef.current = new AudioCtx()
      const ctx = ctxRef.current
      if (ctx.state === 'suspended') ctx.resume()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.frequency.value = 440
      gain.gain.setValueAtTime(0.15, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.12)
    } catch {
      // No audio available — the visual pulse still carries the beat.
    }
  }
}

export default function RhythmTap() {
  const record = useLocalGameResult('rhythm_tap')
  const { t, language } = useSettings()

  const [phase, setPhase] = useState('style') // style | mode | listen | play | results
  const [style, setStyle] = useState(RHYTHM_STYLES.some((s) => s.code === language) ? language : 'as')
  const [mode, setMode] = useState(null)
  const [pulse, setPulse] = useState(false)
  const [dots, setDots] = useState([])
  const [feedback, setFeedback] = useState('')
  const [result, setResult] = useState(null)
  const [consistency, setConsistency] = useState(null)

  const stats = useRef({ correct: 0, missed: 0, offsets: [] })
  const beatIndex = useRef(0)
  const totalBeats = useRef(0)
  const awaiting = useRef(false)
  const hit = useRef(false)
  const beatTime = useRef(0)
  const tickTimer = useRef(null)
  const playClick = useClickSound()

  function chooseStyle(code) {
    setStyle(code)
    setPhase('mode')
  }

  function chooseMode(value) {
    setMode(value)
    if (value === 'listen_first') startListen()
    else startPlay(value)
  }

  function startListen() {
    setPhase('listen')
    setFeedback('')
    const pattern = getRhythmStyle(style).pattern
    let i = 0
    const playNext = () => {
      if (i >= pattern.length) {
        setPulse(false)
        setFeedback(t('rhythm_listen_done'))
        return
      }
      setPulse(true)
      playClick()
      setTimeout(() => setPulse(false), 200)
      const gapMs = pattern[i] * LISTEN_TEMPO_MS
      i++
      tickTimer.current = setTimeout(playNext, gapMs)
    }
    playNext()
  }

  function startPlay(value) {
    stats.current = { correct: 0, missed: 0, offsets: [] }
    const conf = MODES[value]
    const pattern = getRhythmStyle(style).pattern
    const loops = loopsForDuration(pattern, conf.tempoMs)
    const fullPattern = Array.from({ length: loops }, () => pattern).flat()
    totalBeats.current = fullPattern.length
    beatIndex.current = 0
    setDots(Array.from({ length: fullPattern.length }, () => null))
    setFeedback(t('rhythm_now_your_turn'))
    setPhase('play')
    runBeat(conf, fullPattern)
  }

  function runBeat(conf, fullPattern) {
    if (beatIndex.current >= fullPattern.length) {
      finish()
      return
    }
    setPulse(true)
    playClick()
    setTimeout(() => setPulse(false), 200)
    awaiting.current = true
    hit.current = false
    beatTime.current = performance.now()
    const idx = beatIndex.current
    const gapMs = fullPattern[idx] * conf.tempoMs

    tickTimer.current = setTimeout(() => {
      if (awaiting.current && !hit.current) {
        stats.current.missed++
        setDots((d) => { const next = [...d]; next[idx] = 'miss'; return next })
      }
      awaiting.current = false
      beatIndex.current++
      runBeat(conf, fullPattern)
    }, Math.max(gapMs, conf.tolerance + 80))
  }

  function tap() {
    if (phase !== 'play') return
    if (!awaiting.current) return // extra taps between beats are simply ignored, never penalized
    hit.current = true
    const offset = performance.now() - beatTime.current
    stats.current.correct++
    stats.current.offsets.push(offset)
    setDots((d) => { const next = [...d]; next[beatIndex.current] = 'hit'; return next })
    setFeedback(`🎯 ${t('correct')}!`)
  }

  function computeConsistency(offsets, tolerance) {
    if (!offsets.length) return null
    const mean = offsets.reduce((a, b) => a + b, 0) / offsets.length
    const variance = offsets.reduce((a, b) => a + (b - mean) ** 2, 0) / offsets.length
    const stdDev = Math.sqrt(variance)
    return Math.max(0, Math.min(100, Math.round(100 - (stdDev / tolerance) * 100)))
  }

  async function finish() {
    clearTimeout(tickTimer.current)
    const res = await record({
      difficulty: mode,
      rounds: totalBeats.current,
      correct: stats.current.correct,
      incorrect: 0,
      missed: stats.current.missed,
      times: stats.current.offsets,
    })
    setResult({ score: res.score, avgResponseMs: res.average_response_time, correct: res.correct, errors: res.errors })
    setConsistency(computeConsistency(stats.current.offsets, MODES[mode].tolerance))
    setPhase('results')
  }

  function backToModes() {
    clearTimeout(tickTimer.current)
    setPulse(false)
    setPhase('mode')
  }

  function replay() {
    if (mode === 'listen_first') startListen()
    else startPlay(mode)
  }

  return (
    <div className="min-h-screen">
      <PatientTopbar title={t('rhythm_tap')} back="/games" />
      <div className="max-w-2xl mx-auto px-6 py-6 text-center">
        <p className="text-ink-soft mb-2">{t('rhythm_tap_instructions')}</p>

        {phase === 'style' && (
          <div className="flex flex-col items-center gap-6 py-10">
            <p className="text-ink-soft text-lg">{t('rhythm_choose_style')}</p>
            <div className="flex flex-wrap justify-center gap-4">
              {RHYTHM_STYLES.map((s) => (
                <button
                  key={s.code}
                  onClick={() => chooseStyle(s.code)}
                  className="flex flex-col items-center gap-1 px-8 py-6 rounded-2xl border-2 border-line bg-surface hover:border-primary hover:bg-primary-tint transition min-w-[180px]"
                >
                  <span className="text-lg font-semibold text-ink">{t(s.labelKey)}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {phase === 'mode' && (
          <div className="flex flex-col items-center gap-6 py-10">
            <p className="text-ink-soft text-lg">{t('choose_difficulty')}</p>
            <div className="flex flex-wrap justify-center gap-4">
              {['listen_first', 'easy', 'medium', 'advanced'].map((value) => (
                <button
                  key={value}
                  onClick={() => chooseMode(value)}
                  className="flex flex-col items-center gap-1 px-8 py-6 rounded-2xl border-2 border-line bg-surface hover:border-primary hover:bg-primary-tint transition min-w-[140px]"
                >
                  <span className="text-lg font-semibold text-ink">{t(value)}</span>
                  <span className="text-sm text-ink-faint">{value === 'listen_first' ? '' : MODES[value].sub}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {phase === 'listen' && (
          <>
            <p className="text-sm text-ink-faint mb-4">{t('rhythm_listen_instructions')}</p>
            <div className={`text-7xl mb-6 transition-transform ${pulse ? 'scale-125' : 'scale-100'}`}>🥁</div>
            <p className="text-sm font-semibold text-primary mb-6 min-h-6">{feedback}</p>
            {feedback === t('rhythm_listen_done') && (
              <div className="flex flex-wrap justify-center gap-3">
                <button onClick={() => setPhase('mode')} className="px-6 py-3 rounded-full bg-primary text-white font-semibold">{t('choose_difficulty')}</button>
                <button onClick={startListen} className="px-6 py-3 rounded-full border-2 border-primary text-primary font-semibold">🔁 {t('play_again')}</button>
              </div>
            )}
          </>
        )}

        {phase === 'play' && (
          <>
            <div className={`text-7xl mb-4 transition-transform ${pulse ? 'scale-125' : 'scale-100'}`}>🥁</div>
            <div className="flex flex-wrap justify-center gap-2 mb-6 max-w-lg mx-auto">
              {dots.map((d, i) => (
                <span key={i} className={`w-3.5 h-3.5 rounded-full ${d === 'hit' ? 'bg-primary' : d === 'miss' ? 'bg-accent' : 'bg-line'}`} />
              ))}
            </div>
            <button onClick={tap} className="px-14 py-8 rounded-2xl bg-accent text-white font-bold text-2xl mb-3 active:scale-95 transition">{t('rhythm_tap_button')}</button>
            <p className="text-sm font-semibold text-primary min-h-6">{feedback || t('keep_trying')}</p>
            <button onClick={backToModes} className="mt-4 text-sm text-ink-faint underline">← {t('back_to_games')}</button>
          </>
        )}

        {phase === 'results' && result && (
          <>
            <ResultsPanel
              difficulty={mode}
              score={result.score}
              correct={result.correct}
              errors={result.errors}
              avgResponseMs={result.avgResponseMs}
              onReplay={replay}
              onChangeDifficulty={() => setPhase('mode')}
            />
            {consistency !== null && (
              <p className="text-sm text-ink-soft -mt-2">{t('rhythm_consistency')}: <span className="font-semibold text-primary">{consistency}%</span></p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
