// Content source for the Family Memory game.
//
// Builds each session's card list from two sources:
// 1. Personalized cards from caregiver-entered family data (photo/name/
//    hobby/song), if the caregiver has added any for this patient.
// 2. Generic culture/festival reminiscence cards (culturalContent.js),
//    restricted to the same 2-option language logic as Music Memory.
//
// Personalized cards always come first, then generic cards fill the rest —
// if no family data exists yet, this returns exactly today's generic-only
// behavior, so nothing breaks for patients without family data on file.
import { REMINISCENCE_CARDS } from './culturalContent.js'
import { getFamilyMembers } from './patientFamilyData.js'

function personalizedCards(members) {
  return members.map((m) => {
    if (m.hobbyOrSong) {
      return {
        theme: 'Family',
        emoji: '👪',
        photo: m.photoDataUrl || null,
        prompt: `Do you remember ${m.name}${m.relation ? ` (your ${m.relation})` : ''}? Was their favourite thing "${m.hobbyOrSong}"?`,
      }
    }
    return {
      theme: 'Family',
      emoji: '👪',
      photo: m.photoDataUrl || null,
      prompt: `Do you remember ${m.name}${m.relation ? ` (your ${m.relation})` : ''}?`,
    }
  })
}

export function getFamilyMemoryCards({ patientId, culture }) {
  const members = getFamilyMembers(patientId)
  const generic = REMINISCENCE_CARDS[culture] ?? REMINISCENCE_CARDS.en
  return [...personalizedCards(members), ...generic]
}
