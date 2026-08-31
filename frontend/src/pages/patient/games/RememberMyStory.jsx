import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PatientTopbar from '../../../components/PatientTopbar.jsx'
import ResponseButtons from '../../../components/ResponseButtons.jsx'
import { CULTURES, REMINISCENCE_CARDS } from '../../../data/culturalContent.js'
import { useSettings } from '../../../context/SettingsContext.jsx'

export default function RememberMyStory() {
  const navigate = useNavigate()
  const { language } = useSettings()
  const [culture, setCulture] = useState(CULTURES.some((c) => c.code === language) ? language : 'en')
  const [index, setIndex] = useState(0)
  const [transcript, setTranscript] = useState('')
  const [done, setDone] = useState(false)

  const cards = REMINISCENCE_CARDS[culture]
  const card = cards[index]

  function answer() {
    setTranscript('')
    if (index + 1 < cards.length) {
      setIndex(index + 1)
    } else {
      setDone(true)
    }
  }

  function restart(newCulture) {
    setCulture(newCulture)
    setIndex(0)
    setTranscript('')
    setDone(false)
  }

  return (
    <div className="min-h-screen">
      <PatientTopbar title="Remember My Story" back="/home" />
      <div className="max-w-xl mx-auto px-6 py-8 text-center">
        <label className="block mb-6">
          <span className="block text-sm font-semibold text-ink-soft mb-2">Choose your background</span>
          <select value={culture} onChange={(e) => restart(e.target.value)} className="border border-line rounded-lg px-4 py-2">
            {CULTURES.map((c) => <option key={c.code} value={c.code}>{c.label}</option>)}
          </select>
        </label>

        {!done ? (
          <>
            <p className="text-sm text-ink-faint mb-2">Story {index + 1} of {cards.length} · {card.theme}</p>
            <div className="text-7xl mb-6 bg-surface border border-line rounded-2xl py-10">{card.emoji}</div>
            <p className="text-lg font-semibold text-ink mb-6">{card.prompt}</p>
            <ResponseButtons onAnswer={answer} voiceTranscript={transcript} onVoiceResult={(t) => { setTranscript(t); answer() }} />
          </>
        ) : (
          <div className="flex flex-col items-center gap-6 py-10">
            <h3 className="text-xl serif">Thank you for sharing! 💛</h3>
            <p className="text-ink-soft">You went through all {cards.length} stories.</p>
            <div className="flex gap-3">
              <button onClick={() => restart(culture)} className="px-6 py-3 rounded-lg bg-primary text-white font-semibold">🔁 Go Again</button>
              <button onClick={() => navigate('/home')} className="px-6 py-3 rounded-lg text-ink-soft font-semibold">← Back to Home</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
