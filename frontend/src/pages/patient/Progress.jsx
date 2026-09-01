import { useEffect, useState } from 'react'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import PatientTopbar from '../../components/PatientTopbar.jsx'
import { api } from '../../api/client.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { useSettings } from '../../context/SettingsContext.jsx'

const GAME_LABELS = {
  memory_match: 'Memory Match',
  pattern_recognition: 'Pattern Recognition',
  routine_recall: 'Daily Routine Recall',
  tea_sorting: 'Tea Leaf Sorting',
  rhythm_tap: 'Rhythm & Tap',
}

export default function Progress() {
  const { session } = useAuth()
  const { t } = useSettings()
  const [perf, setPerf] = useState(null)
  const [games, setGames] = useState(null)

  useEffect(() => {
    api.get(`/patient/${session.patient_id}/performance`).then(setPerf)
    api.get(`/patient/${session.patient_id}/games?limit=6`).then((res) => setGames(res.sessions))
  }, [])

  return (
    <div className="min-h-screen">
      <PatientTopbar title={t('progress')} />
      <div className="max-w-2xl mx-auto px-6 py-8">
        {!perf ? (
          <p className="text-ink-soft">Loading…</p>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-4 mb-8">
              <Stat value={perf.games_completed} label={t('games_played')} />
              <Stat value={`${perf.accuracy_pct}%`} label={t('accuracy')} />
              <Stat value={`${(perf.avg_response_ms / 1000).toFixed(1)}s`} label={t('avg_response')} />
            </div>

            {perf.trend.length > 0 && (
              <div className="h-48 mb-8 bg-surface border border-line rounded-xl p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={perf.trend}>
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="accuracy_pct" stroke="#1F3D33" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            <h3 className="font-semibold text-ink-soft mb-3">{t('recent_sessions')}</h3>
            <div className="flex flex-col gap-2">
              {games === null && <p className="text-ink-soft">Loading…</p>}
              {games?.length === 0 && <p className="text-ink-faint text-sm">Play a game to start building your progress history.</p>}
              {games?.map((g) => (
                <div key={g.session_id} className="flex items-center justify-between bg-surface border border-line rounded-xl p-4">
                  <div>
                    <div className="font-semibold">{GAME_LABELS[g.game_type] || g.game_type}</div>
                    <div className="text-xs text-ink-faint">{t(g.difficulty)} · {new Date(g.timestamp).toLocaleString()}</div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${g.score >= 80 ? 'bg-primary-tint text-primary' : g.score >= 60 ? 'bg-accent-tint text-accent-dark' : 'bg-clay-tint text-clay'}`}>
                    {g.score}%
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function Stat({ value, label }) {
  return (
    <div className="bg-surface border border-line rounded-xl py-4 text-center">
      <div className="text-2xl font-bold text-primary">{value}</div>
      <div className="text-xs text-ink-faint mt-1">{label}</div>
    </div>
  )
}
