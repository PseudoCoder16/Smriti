// Centralized mock data for the caregiver dashboard's Phase 3 additions.
//
// Every value here is placeholder/demo data — nothing here reflects a real
// patient, a real ML prediction, or a medical measurement. Each export notes
// the future real source that is expected to replace it, so the swap from
// mock to live data touches only these exports, not the components that
// consume them.

// Future: no backend endpoint for this yet — a future adaptive-difficulty
// endpoint would supply currentDifficulty.
export const mockCheckIn = {
  mood: 'Good',
  emoji: '🙂',
  time: '9:30 AM',
}

// Future: GET /patient/{patient_id}/performance already returns
// games_completed/accuracy_pct/error_rate_pct/avg_response_ms — `precision`
// and `overallScore` are not computed anywhere server-side yet.
export const mockPerformanceSummary = {
  gamesCompleted: 4,
  accuracy: 78,
  precision: 81,
  errorRate: 22,
  averageResponseTime: 4.2, // seconds
  overallScore: 78,
}

// Future: an aggregation of GET /patient/{patient_id}/games grouped by
// game_id — not implemented server-side yet.
export const mockGamePerformance = [
  { game_id: 'song_recognition', label: 'Song Recognition', accuracy: 85 },
  { game_id: 'family_memory', label: 'Family Memory', accuracy: 91 },
  { game_id: 'color_sort', label: 'Color Sort', accuracy: 74 },
  { game_id: 'rhythm_tap', label: 'Rhythm & Tap', accuracy: 68 },
  { game_id: 'pattern_recognition', label: 'Pattern Recognition', accuracy: 82 },
]

// Future: GET /games/{patient_id}/history
export const mockGameHistory = [
  { game: 'Song Recognition', datetime: '2026-08-30T15:10:00Z', difficulty: 'Medium', score: 82, accuracy: 85, errors: 1, responseTime: 3.2 },
  { game: 'Family Memory', datetime: '2026-08-30T11:05:00Z', difficulty: 'Easy', score: 91, accuracy: 91, errors: 0, responseTime: 2.8 },
  { game: 'Color Sort', datetime: '2026-08-29T16:40:00Z', difficulty: 'Hard', score: 74, accuracy: 74, errors: 4, responseTime: 5.1 },
  { game: 'Rhythm & Tap', datetime: '2026-08-29T10:20:00Z', difficulty: 'Medium', score: 68, accuracy: 68, errors: 6, responseTime: 4.6 },
  { game: 'Pattern Recognition', datetime: '2026-08-28T14:00:00Z', difficulty: 'Medium', score: 82, accuracy: 82, errors: 2, responseTime: 3.9 },
]

// Future: derived from GET /patient/{patient_id}/performance?days=N, which
// already returns a `trend` array — this mock just names sessions instead
// of dates to match the spec's example.
export const mockPerformanceTrend = [
  { session: 'Session 1', accuracy: 61 },
  { session: 'Session 2', accuracy: 67 },
  { session: 'Session 3', accuracy: 73 },
  { session: 'Session 4', accuracy: 81 },
  { session: 'Session 5', accuracy: 78 },
]

export const mockResponseTimeTrend = [
  { session: 'Session 1', responseTime: 6.2 },
  { session: 'Session 2', responseTime: 5.7 },
  { session: 'Session 3', responseTime: 5.1 },
  { session: 'Session 4', responseTime: 4.5 },
  { session: 'Session 5', responseTime: 4.2 },
]

// Future: response shape from an eventual ML adaptive-difficulty endpoint —
// no such model or endpoint exists in this codebase yet. This is a
// gameplay-performance summary only, never a medical or diagnostic claim.
export const mockAIInsight = {
  performanceTrend: 'improving',
  currentDifficulty: 'Medium',
  recommendedDifficulty: 'Hard',
  insight: 'The patient is performing well in memory-based activities. Attention-based activities show comparatively lower performance.',
  reason: 'Strong recent performance.',
}
