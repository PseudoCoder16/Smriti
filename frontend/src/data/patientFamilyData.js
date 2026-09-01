// Local-only store for caregiver-entered per-patient family memory data
// (family member name, relation, favourite hobby/song, and an optional
// photo saved as a data URL). No backend/Mongo exists yet for this — data
// lives in localStorage per patient_id and is meant to be swapped for a
// real API call later without changing the shape callers rely on.

const STORAGE_KEY = 'smriti_family_data'

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
    // Storage full/unavailable — caregiver's edit silently doesn't persist;
    // the form still reflects it for the current session.
  }
}

/** Returns the family member list for a patient (empty array if none saved yet). */
export function getFamilyMembers(patientId) {
  if (!patientId) return []
  return readAll()[patientId] || []
}

export function saveFamilyMembers(patientId, members) {
  if (!patientId) return
  const all = readAll()
  all[patientId] = members
  writeAll(all)
}

export function addFamilyMember(patientId, member) {
  const members = getFamilyMembers(patientId)
  const withId = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, ...member }
  saveFamilyMembers(patientId, [...members, withId])
  return withId
}

export function removeFamilyMember(patientId, memberId) {
  saveFamilyMembers(patientId, getFamilyMembers(patientId).filter((m) => m.id !== memberId))
}
