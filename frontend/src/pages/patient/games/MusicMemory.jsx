import { useRef, useState } from 'react'
import PatientTopbar from '../../../components/PatientTopbar.jsx'
import DifficultyPicker from '../../../components/DifficultyPicker.jsx'
import ResultsPanel from '../../../components/ResultsPanel.jsx'
import ResponseButtons from '../../../components/ResponseButtons.jsx'
import { CULTURES, MUSIC_TRACKS } from '../../../data/culturalContent.js'
import { useSettings } from '../../../context/SettingsContext.jsx'
import { useLocalGameResult } from '../../../hooks/useLocalGameResult.js'

// Difficulty controls how many distinct songs are drawn from the culture's
// pool before being cycled to fill the standardized 5 rounds — easy repeats
// one familiar song, hard mixes in every song available.
const DIFF = {
  easy: { distinct: 1, sub: 'Same song repeated' },
  medium: { distinct: 2, sub: '2 songs mixed' },
  hard: { distinct: 3, sub: 'All songs mixed' },
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

function buildPlaylist(pool, distinctCount) {
  const subset = shuffle(pool).slice(0, Math.min(distinctCount, pool.length))
  return shuffle(Array.from({ length: TOTAL_ROUNDS }, (_, i) => subset[i % subset.length]))
}

function AudioPlayer({ src }) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <div className="bg-primary-tint text-primary text-sm rounded-xl px-4 py-6 text-center">
        🎵 Audio coming soon — this track hasn't been added yet.
      </div>
    )
  }
  return <audio key={src} controls src={src} className="w-full" onError={() => setFailed(true)} />
}

export default function MusicMemory() {
  const { language, t } = useSettings()
  const record = useLocalGameResult('song_recognition')

  const [culture, setCulture] = useState(CULTURES.some((c) => c.code === language) ? language : 'en')
  const [phase, setPhase] = useState('diff') // diff | play | results
  const [difficulty, setDifficulty] = useState(null)
  const [round, setRound] = useState(0)
  const [transcript, setTranscript] = useState('')
  const [result, setResult] = useState(null)

  const stats = useRef({ correct: 0, incorrect: 0, times: [] })
  const playlistRef = useRef([])
  const roundStart = useRef(0)

  function start(diff) {
    stats.current = { correct: 0, incorrect: 0, times: [] }
    setDifficulty(diff)
    playlistRef.current = buildPlaylist(MUSIC_TRACKS[culture], DIFF[diff].distinct)
    setTranscript('')
    setRound(1)
    setPhase('play')
    roundStart.current = performance.now()
  }

  function answer(value) {
    const rt = performance.now() - roundStart.current
    if (value === 'yes') stats.current.correct++
    else stats.current.incorrect++
    stats.current.times.push(rt)
    setTranscript('')

    if (round >= TOTAL_ROUNDS) {
      finish(difficulty)
    } else {
      setRound((r) => r + 1)
      roundStart.current = performance.now()
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

  function restart(newCulture) {
    setCulture(newCulture)
    setDifficulty(null)
    setRound(0)
    setTranscript('')
    setResult(null)
    setPhase('diff')
  }

  const track = playlistRef.current[round - 1]

  return (
    <div className="min-h-screen">
      <PatientTopbar title={t('music_memory')} back="/home" />
      <div className="max-w-xl mx-auto px-6 py-8 text-center">
        <label className="block mb-6">
          <span className="block text-sm font-semibold text-ink-soft mb-2">{t('song_choose_style')}</span>
          <select value={culture} onChange={(e) => restart(e.target.value)} className="border border-line rounded-lg px-4 py-2">
            {CULTURES.map((c) => <option key={c.code} value={c.code}>{c.label}</option>)}
          </select>
        </label>

        {phase === 'diff' && (
          <DifficultyPicker
            options={Object.entries(DIFF).map(([value, d]) => ({ value, label: value, sub: d.sub }))}
            onSelect={start}
          />
        )}

        {phase === 'play' && track && (
          <>
            <div className="inline-block bg-primary-tint text-primary text-sm font-semibold px-4 py-1 rounded-full mb-4">{t('song_word')} {round} / {TOTAL_ROUNDS}</div>
            <h2 className="text-xl serif mb-4">{track.title}</h2>
            <div className="mb-6"><AudioPlayer src={track.audioSrc} /></div>
            <p className="text-lg font-semibold text-ink mb-6">{t('song_recognize_prompt')}</p>
            <ResponseButtons onAnswer={answer} voiceTranscript={transcript} onVoiceResult={(text) => { setTranscript(text); answer('told_more') }} />
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
