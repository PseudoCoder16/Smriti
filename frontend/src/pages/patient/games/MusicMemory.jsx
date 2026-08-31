import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PatientTopbar from '../../../components/PatientTopbar.jsx'
import ResponseButtons from '../../../components/ResponseButtons.jsx'
import { CULTURES, MUSIC_TRACKS } from '../../../data/culturalContent.js'
import { useSettings } from '../../../context/SettingsContext.jsx'

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
  const navigate = useNavigate()
  const { language } = useSettings()
  const [culture, setCulture] = useState(CULTURES.some((c) => c.code === language) ? language : 'en')
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState([])
  const [transcript, setTranscript] = useState('')
  const [done, setDone] = useState(false)

  const tracks = MUSIC_TRACKS[culture]
  const track = tracks[index]

  function answer(value) {
    setAnswers((a) => [...a, value])
    setTranscript('')
    if (index + 1 < tracks.length) {
      setIndex(index + 1)
    } else {
      setDone(true)
    }
  }

  function restart(newCulture) {
    setCulture(newCulture)
    setIndex(0)
    setAnswers([])
    setTranscript('')
    setDone(false)
  }

  return (
    <div className="min-h-screen">
      <PatientTopbar title="Music & Memory" back="/home" />
      <div className="max-w-xl mx-auto px-6 py-8 text-center">
        <label className="block mb-6">
          <span className="block text-sm font-semibold text-ink-soft mb-2">Choose the music style</span>
          <select value={culture} onChange={(e) => restart(e.target.value)} className="border border-line rounded-lg px-4 py-2">
            {CULTURES.map((c) => <option key={c.code} value={c.code}>{c.label}</option>)}
          </select>
        </label>

        {!done ? (
          <>
            <p className="text-sm text-ink-faint mb-2">Song {index + 1} of {tracks.length}</p>
            <h2 className="text-xl serif mb-4">{track.title}</h2>
            <div className="mb-6"><AudioPlayer src={track.audioSrc} /></div>
            <p className="text-lg font-semibold text-ink mb-6">Do you recognize this type of music?</p>
            <ResponseButtons onAnswer={answer} voiceTranscript={transcript} onVoiceResult={(t) => { setTranscript(t); answer('told_more') }} />
          </>
        ) : (
          <div className="flex flex-col items-center gap-6 py-10">
            <h3 className="text-xl serif">Thanks for listening! 🎶</h3>
            <p className="text-ink-soft">You went through all {tracks.length} songs.</p>
            <div className="flex gap-3">
              <button onClick={() => restart(culture)} className="px-6 py-3 rounded-lg bg-primary text-white font-semibold">🔁 Play Again</button>
              <button onClick={() => navigate('/home')} className="px-6 py-3 rounded-lg text-ink-soft font-semibold">← Back to Home</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
