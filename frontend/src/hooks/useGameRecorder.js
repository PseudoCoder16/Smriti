import { useAuth } from '../context/AuthContext.jsx'
import { api } from '../api/client.js'

export function useGameRecorder(gameType) {
  const { session } = useAuth()

  return async ({ difficulty, correct, errors, times }) => {
    const attempts = correct + errors
    const score = attempts ? Math.round((correct / attempts) * 100) : 0
    const avgResponseMs = times.length ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0

    try {
      await api.post('/game/result', {
        patient_id: session.patient_id,
        game_type: gameType,
        difficulty,
        score,
        correct,
        errors,
        avg_response_ms: avgResponseMs,
      })
    } catch (e) {
      console.error('Failed to record game result', e)
    }

    return { score, avgResponseMs }
  }
}
