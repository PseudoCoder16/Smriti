// Content source for the Family Memory game.
//
// Today this just returns the placeholder, culture-based reminiscence cards
// from culturalContent.js — there is no per-patient data yet. `patientId` is
// accepted now so the call site is already correct for later: a caregiver
// will eventually supply real per-patient memory content (family photos,
// names, relationships, favorite song/hobby, familiar objects, etc.,
// presumably fetched from the backend once that exists). When that happens,
// only this function needs to change — RememberMyStory.jsx calls through it
// and does not assume any particular patient has the current placeholder
// family members.
import { REMINISCENCE_CARDS } from './culturalContent.js'

export function getFamilyMemoryCards({ patientId, culture }) {
  // eslint-disable-next-line no-unused-vars -- reserved for the future per-patient lookup described above
  void patientId
  return REMINISCENCE_CARDS[culture] ?? REMINISCENCE_CARDS.en
}
