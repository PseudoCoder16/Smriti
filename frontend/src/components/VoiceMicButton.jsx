import { useState } from 'react'
import { useSettings } from '../context/SettingsContext.jsx'
import { listen, isSTTAvailable } from '../utils/voiceService.js'

// Large, clearly-labeled microphone control with an always-visible text
// status (never relies on the icon alone). Speech-to-text errors (denied
// permission, no speech, unsupported browser, timeout, offline) all resolve
// into one of these calm states rather than crashing or blocking the screen.
const STATUS_TEXT = {
  idle: '🎤 Tap to speak',
  listening: '🎙 Listening...',
  processing: 'Processing...',
  error: 'Could not understand. Try again.',
  unsupported: 'Voice unavailable — use the buttons.',
}

export default function VoiceMicButton({ onResult }) {
  const { language, simpleMode } = useSettings()
  const [status, setStatus] = useState('idle')
  const supported = isSTTAvailable(language)

  async function handleTap() {
    if (!supported || status === 'listening' || status === 'processing') return
    setStatus('listening')
    const result = await listen(language)
    setStatus('processing')

    if (result.ok && result.text) {
      setStatus('idle')
      onResult(result.text)
      return
    }
    if (result.reason === 'not-allowed') {
      setStatus('unsupported')
    } else {
      setStatus('error')
    }
    setTimeout(() => setStatus('idle'), 2500)
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={handleTap}
        disabled={!supported || status === 'listening' || status === 'processing'}
        aria-label={supported ? 'Tap to speak' : 'Voice unavailable, use the buttons'}
        className={`rounded-full flex items-center justify-center transition disabled:opacity-70 ${
          simpleMode ? 'w-24 h-24 text-4xl' : 'w-16 h-16 text-2xl'
        } ${
          status === 'listening'
            ? 'bg-clay text-white animate-pulse'
            : supported
              ? 'bg-primary-tint text-primary hover:bg-line'
              : 'bg-line text-ink-faint'
        }`}
      >
        🎤
      </button>
      <p className={`font-semibold text-ink-soft text-center ${simpleMode ? 'text-base max-w-[14rem]' : 'text-xs max-w-[11rem]'}`}>
        {supported ? STATUS_TEXT[status] : STATUS_TEXT.unsupported}
      </p>
    </div>
  )
}
