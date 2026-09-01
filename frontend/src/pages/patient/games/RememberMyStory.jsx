import { useRef, useState } from 'react'
import PatientTopbar from '../../../components/PatientTopbar.jsx'
import DifficultyPicker from '../../../components/DifficultyPicker.jsx'
import ResultsPanel from '../../../components/ResultsPanel.jsx'
import ResponseButtons from '../../../components/ResponseButtons.jsx'
import { twoCultureOptions } from '../../../data/culturalContent.js'
import { getFamilyMemoryCards } from '../../../data/familyMemoryContent.js'
import { useAuth } from '../../../context/AuthContext.jsx'
import { useSettings } from '../../../context/SettingsContext.jsx'
import { useLocalGameResult } from '../../../hooks/useLocalGameResult.js'
import { matchYesNoIntent } from '../../../utils/voiceService.js'

// Difficulty controls how many distinct story cards are drawn from the
// culture's pool before being cycled to fill the standardized 5 rounds.
const DIFF = {
  easy: { distinct: 2, sub: 'A few themes repeated' },
  medium: { distinct: 4, sub: 'More variety' },
  hard: { distinct: 5, sub: 'Maximum variety' },
}
const TOTAL_ROUNDS = 5

// Unlike Music Memory's fully-shuffled playlist, this keeps `pool`'s given
// order (personalized family cards first, then generic culture cards, per
// getFamilyMemoryCards) so personalized cards are the ones actually shown
// in the earliest rounds rather than being randomized away.
function buildPlaylist(pool, distinctCount) {
  const subset = pool.slice(0, Math.min(distinctCount, pool.length))
  return Array.from({ length: TOTAL_ROUNDS }, (_, i) => subset[i % subset.length])
}

export default function RememberMyStory() {
  const { session } = useAuth()
  const { language, t } = useSettings()
  const record = useLocalGameResult('family_memory')

  // Only 2 style choices: the patient's own language, plus Hindi — same
  // logic as Music Memory (see twoCultureOptions).
  const cultureOptions = twoCultureOptions(language)
  const [culture, setCulture] = useState(cultureOptions[0].code)
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
    const cards = getFamilyMemoryCards({ patientId: session?.patient_id, culture })
    playlistRef.current = buildPlaylist(cards, DIFF[diff].distinct)
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

  const card = playlistRef.current[round - 1]

  return (
    <div className="min-h-screen">
      <PatientTopbar title={t('remember_my_story')} back="/home" />
      <div className="max-w-xl mx-auto px-6 py-8 text-center">
        <label className="block mb-6">
          <span className="block text-sm font-semibold text-ink-soft mb-2">{t('story_choose_background')}</span>
          <select value={culture} onChange={(e) => restart(e.target.value)} className="border border-line rounded-lg px-4 py-2">
            {cultureOptions.map((c) => <option key={c.code} value={c.code}>{c.label}</option>)}
          </select>
        </label>

        {phase === 'diff' && (
          <DifficultyPicker
            options={Object.entries(DIFF).map(([value, d]) => ({ value, label: value, sub: d.sub }))}
            onSelect={start}
          />
        )}

        {phase === 'play' && card && (
          <>
            <div className="inline-block bg-primary-tint text-primary text-sm font-semibold px-4 py-1 rounded-full mb-4">{t('story_word')} {round} / {TOTAL_ROUNDS}</div>
            <p className="text-sm text-ink-faint mb-2">{card.theme}</p>
            {card.photo ? (
              <div className="mb-6 bg-surface border border-line rounded-2xl py-6 flex items-center justify-center">
                <img src={card.photo} alt="" className="max-h-48 rounded-xl object-cover" />
              </div>
            ) : (
              <div className="text-7xl mb-6 bg-surface border border-line rounded-2xl py-10">{card.emoji}</div>
            )}
            <p className="text-lg font-semibold text-ink mb-6">{card.prompt}</p>
            <ResponseButtons onAnswer={answer} voiceTranscript={transcript} onVoiceResult={(text) => { setTranscript(text); answer(matchYesNoIntent(text)) }} />
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
