import { useRef, useState } from 'react'
import { LOCALE_MAP } from '../utils/voiceService.js'

const SpeechRecognitionImpl =
  typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : null

export function useVoiceInput(onResult, language = 'en') {
  const [listening, setListening] = useState(false)
  const recognitionRef = useRef(null)

  const supported = Boolean(SpeechRecognitionImpl)

  function start() {
    if (!supported || listening) return
    const recognition = new SpeechRecognitionImpl()
    recognition.lang = LOCALE_MAP[language] || LOCALE_MAP.en
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript
      onResult(transcript)
    }
    recognition.onend = () => setListening(false)
    recognition.onerror = () => setListening(false)

    recognitionRef.current = recognition
    setListening(true)
    recognition.start()
  }

  function stop() {
    recognitionRef.current?.stop()
    setListening(false)
  }

  return { supported, listening, start, stop }
}
