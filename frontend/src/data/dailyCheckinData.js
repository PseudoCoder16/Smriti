// Local "already answered today" tracker for the dashboard avatar check-in
// popup (DailyCheckinPopup.jsx). The mood itself is saved for real via the
// /checkin API (Phase 8) — this local copy only lets the popup decide
// whether to show itself again without needing a network round-trip.

const STORAGE_KEY = 'smriti_daily_checkin'

function readAll() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

function writeAll(all) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
  } catch {
    // Storage full/unavailable — the popup still works for this session, just isn't remembered.
  }
}

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

/** Returns today's saved entry for this patient, or null if not answered yet today. */
export function getTodayCheckin(patientId) {
  if (!patientId) return null
  const entry = readAll()[patientId]
  return entry && entry.date === todayKey() ? entry : null
}

export function saveDailyCheckin(patientId, mood) {
  if (!patientId) return null
  const entry = { mood, timestamp: new Date().toISOString(), date: todayKey() }
  const all = readAll()
  all[patientId] = entry
  writeAll(all)
  return entry
}
