// Structured event/session data model for Pattern Recognition — kept
// completely separate from PatternGame.jsx's gameplay logic so a future ML
// model can consume player behavior without touching the game component.
//
// No ML is implemented here (per spec) — this only defines the shape of
// the data and a local-only sink for it, matching the same "local for now,
// swap the sink later" approach as useLocalGameResult.js.

let sessionId = null

/** Call once when a Pattern Recognition play session starts (a fresh mount / "Start Game"). */
export function startPatternSession() {
  sessionId = `pattern-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  return sessionId
}

/**
 * One structured event per submitted attempt. All fields are non-sensitive
 * gameplay features — no PII, no clinical claims.
 */
export function buildPatternAttemptEvent({
  level,
  gridSize,
  targetCellCount,
  displayDurationMs,
  targetCells,
  selectedCells,
  attemptNumber,
  reactionTimeMs,
  correctionCount,
  completionStatus, // 'success' | 'retry' | 'level_complete'
}) {
  const targetSet = new Set(targetCells)
  const selectedSet = new Set(selectedCells)
  const correctCells = selectedCells.filter((c) => targetSet.has(c))
  const incorrectCells = selectedCells.filter((c) => !targetSet.has(c))
  const missedCells = targetCells.filter((c) => !selectedSet.has(c))
  const accuracy = targetCellCount ? Math.round((correctCells.length / targetCellCount) * 100) : 0

  return {
    sessionId,
    timestamp: new Date().toISOString(),
    level,
    gridSize,
    targetCellCount,
    displayDurationMs,
    targetCells,
    selectedCells,
    correctCells,
    incorrectCells,
    missedCells,
    accuracy,
    attemptNumber,
    reactionTimeMs,
    correctionCount,
    completionStatus,
  }
}

/** Local-only sink for now — swap for a real API call once a backend/ML pipeline exists. */
export function recordPatternAttemptEvent(event) {
  console.log('[pattern game event]', event)
  return event
}
