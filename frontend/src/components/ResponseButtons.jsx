import { useVoiceInput } from '../hooks/useVoiceInput.js'

export default function ResponseButtons({ onAnswer, voiceTranscript, onVoiceResult }) {
  const { supported, listening, start } = useVoiceInput(onVoiceResult)

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex flex-wrap justify-center gap-3">
        <button onClick={() => onAnswer('yes')} className="px-6 py-4 rounded-xl bg-primary-tint text-primary font-semibold text-lg">
          YES, I REMEMBER 😊
        </button>
        <button onClick={() => onAnswer('not_sure')} className="px-6 py-4 rounded-xl bg-accent-tint text-accent-dark font-semibold text-lg">
          NOT SURE 🤔
        </button>
        {supported && (
          <button
            onClick={start}
            className={`px-6 py-4 rounded-xl font-semibold text-lg ${listening ? 'bg-clay text-white animate-pulse' : 'bg-clay-tint text-clay'}`}
          >
            {listening ? 'Listening… 🎤' : 'TELL ME MORE 🎤'}
          </button>
        )}
      </div>
      {voiceTranscript && (
        <p className="text-sm text-ink-soft italic bg-surface border border-line rounded-lg px-4 py-2 max-w-md text-center">
          "{voiceTranscript}"
        </p>
      )}
    </div>
  )
}
