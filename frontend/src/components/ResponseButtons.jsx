import { useVoiceInput } from '../hooks/useVoiceInput.js'
import { useSettings } from '../context/SettingsContext.jsx'

export default function ResponseButtons({ onAnswer, voiceTranscript, onVoiceResult }) {
  const { t, language } = useSettings()
  const { supported, listening, start } = useVoiceInput(onVoiceResult, language)

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex flex-wrap justify-center gap-3">
        <button onClick={() => onAnswer('yes')} className="px-6 py-4 rounded-full bg-primary-tint text-primary font-semibold text-lg">
          {t('yes_i_remember')}
        </button>
        <button onClick={() => onAnswer('not_sure')} className="px-6 py-4 rounded-full bg-accent-tint text-accent-dark font-semibold text-lg">
          {t('not_sure')}
        </button>
        {supported && (
          <button
            onClick={start}
            className={`px-6 py-4 rounded-full font-semibold text-lg ${listening ? 'bg-clay text-white animate-pulse' : 'bg-clay-tint text-clay'}`}
          >
            {listening ? t('listening') : t('tell_me_more')}
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
