import { useAuth } from '../context/AuthContext.jsx'
import { api } from '../api/client.js'

// Single shared result builder used by every patient game, so they all
// produce the exact same standardized result shape (this exact shape is
// also FastAPI's GameResultRequest — see backend/models/schemas.py).
//
// `missed` is optional and only meaningful for a game that can have a
// genuine "no response given" outcome distinct from an active wrong answer
// (currently only Rhythm & Tap, where a beat can expire untapped). Every
// other game leaves it at 0, which makes `precision` collapse to the same
// value as `accuracy` — intentional: we don't invent a clinically
// meaningful precision where the game has no real attempted-vs-not-attempted
// distinction to measure it from.
//
// There is no existing ML model/pipeline in this codebase to align this
// definition with (checked: no training/inference code, no scikit-learn
// dependency, nothing reads game_sessions data for prediction). `precision`
// here is purely a gameplay metric — "of the responses actually given
// (excluding no-response opportunities), what fraction were correct" — and
// should be treated as such by any future ML work, not as a clinical measure.
export function useLocalGameResult(gameId) {
  const { session } = useAuth()

  return async ({ difficulty, rounds, correct, incorrect, missed = 0, times, completed = true }) => {
    const wrong = incorrect ?? 0
    const attempted = correct + wrong // opportunities where a response was actually given
    const totalOpportunities = attempted + missed // every round/opportunity, including no-response ones

    const accuracy = totalOpportunities ? Math.round((correct / totalOpportunities) * 100) : 0
    const precision = attempted ? Math.round((correct / attempted) * 100) : 0
    const errorRate = totalOpportunities ? Math.round(((totalOpportunities - correct) / totalOpportunities) * 100) : 0
    const avgResponseMs = times?.length ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0

    const result = {
      patient_id: session?.patient_id ?? null,
      game_id: gameId,
      difficulty,
      rounds,
      correct,
      incorrect: wrong,
      errors: wrong + missed,
      accuracy,
      precision,
      error_rate: errorRate,
      average_response_time: avgResponseMs,
      score: accuracy,
      completed,
      timestamp: new Date().toISOString(),
    }

    try {
      await api.post('/game/result', result)
    } catch (err) {
      // Never let a save failure block the game's own results screen —
      // the result is still returned below either way.
      console.warn('[game result] failed to save to backend', err)
    }
    return result
  }
}
