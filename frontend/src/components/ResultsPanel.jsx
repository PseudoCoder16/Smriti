import { useNavigate } from 'react-router-dom'
import { useSettings } from '../context/SettingsContext.jsx'

export default function ResultsPanel({ difficulty, score, correct, errors, avgResponseMs, onReplay, onChangeDifficulty }) {
  const navigate = useNavigate()
  const { t } = useSettings()
  const avgLabel = avgResponseMs ? (avgResponseMs / 1000).toFixed(1) + 's' : '—'

  return (
    <div className="flex flex-col items-center gap-6 py-10">
      <h3 className="text-xl patient-serif">{t('session_complete')} — 5 {t('round')}s ({t(difficulty)})</h3>
      <div className="grid grid-cols-4 gap-4 w-full max-w-lg">
        {[
          [t('score'), `${score}%`],
          [t('correct'), correct],
          [t('errors'), errors],
          [t('avg_response'), avgLabel],
        ].map(([label, value]) => (
          <div key={label} className="bg-surface border border-line rounded-xl py-4 text-center">
            <div className="text-2xl font-bold text-primary">{value}</div>
            <div className="text-xs text-ink-faint mt-1">{label}</div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <button onClick={onReplay} className="px-6 py-3 rounded-full bg-primary text-white font-semibold shadow-sm hover:bg-primary-dark transition">🔁 {t('play_again')}</button>
        <button onClick={onChangeDifficulty} className="px-6 py-3 rounded-full border-2 border-primary text-primary font-semibold hover:bg-primary-tint transition">🎚️ {t('change_difficulty')}</button>
        <button onClick={() => navigate('/games')} className="px-6 py-3 rounded-full text-ink-soft font-semibold hover:bg-line transition">← {t('back_to_games')}</button>
      </div>
    </div>
  )
}
