// Placeholder cultural content per NER language/region for the two new
// patient games. Illustrations are emoji-based placeholders (per project
// decision — no real photos/audio embedded). Content should be reviewed by
// someone from each community before real use; treat as a starting scaffold.

export const CULTURES = [
  { code: 'en', label: 'General NER' },
  { code: 'as', label: 'Assamese' },
  { code: 'mni', label: 'Manipuri' },
  { code: 'mz', label: 'Mizo' },
]

// ---------------- Remember My Story — reminiscence cards ----------------
// Each card: theme category, emoji illustration, and a gentle prompt question.
export const REMINISCENCE_CARDS = {
  en: [
    { theme: 'Festival', emoji: '🎉🪘', prompt: 'Does this remind you of a festival you celebrated?' },
    { theme: 'Village life', emoji: '🏘️🌄', prompt: 'Did you grow up in a village like this?' },
    { theme: 'Occupation', emoji: '🌾👨‍🌾', prompt: 'Which activity do you remember doing when you were young?' },
    { theme: 'Clothing', emoji: '🧵👘', prompt: 'Do you remember wearing clothes like this for special days?' },
    { theme: 'Food', emoji: '🍚🍲', prompt: 'Does this remind you of a favourite home-cooked meal?' },
    { theme: 'Landscape', emoji: '⛰️🌿', prompt: 'Does this hillside remind you of home?' },
  ],
  as: [
    { theme: 'Bihu Festival', emoji: '🎉🪘', prompt: 'এইটোৱে আপোনাক বিহুৰ কথা মনত পেলায় নেকি?' },
    { theme: 'Village life', emoji: '🛶🏞️', prompt: 'আপুনি এনে গাঁৱত ডাঙৰ হৈছিল নেকি?' },
    { theme: 'Tea garden', emoji: '🍃🧺', prompt: 'চাহ পাত টিপা মনত আছে নেকি?' },
    { theme: 'Mekhela Chador', emoji: '🥻', prompt: 'বিশেষ দিনত এনে কাপোৰ পিন্ধিছিল নেকি?' },
    { theme: 'Food', emoji: '🍛🐟', prompt: 'এইটোৱে আপোনাৰ প্ৰিয় ভাত-মাছৰ কথা মনত পেলায় নেকি?' },
    { theme: 'Bamboo house', emoji: '🏠🎍', prompt: 'এনে বাঁহৰ ঘৰত থাকিছিল নেকি?' },
  ],
  mni: [
    { theme: 'Yaoshang Festival', emoji: '🎊🎨', prompt: 'Masi Yaoshang panba nangna ningsingbra?' },
    { theme: 'Loktak village', emoji: '🛶🌾', prompt: 'Masigumba khunda nahakna hourakpra?' },
    { theme: 'Ras Lila dance', emoji: '💃🎶', prompt: 'Masigumba jagoi nahakna uba matam ningsingbra?' },
    { theme: 'Handloom weaving', emoji: '🧵🧶', prompt: 'Phee saba nahakna touba matam ningsingbra?' },
    { theme: 'Phanek clothing', emoji: '👘', prompt: 'Numit khudingda masigumba phi setpra?' },
    { theme: 'Food', emoji: '🍲🐟', prompt: 'Eromba chaba nangna ningsingbra?' },
  ],
  mz: [
    { theme: 'Chapchar Kut', emoji: '🎋🎉', prompt: 'Hei hi Chapchar Kut i hriatreh em?' },
    { theme: 'Khua (village)', emoji: '🏘️⛰️', prompt: 'Hei anga khuaah nge i ṭhian?' },
    { theme: 'Lo neih (farming)', emoji: '🌾👨‍🌾', prompt: 'I naupan laia lo i neih ṭhin em?' },
    { theme: 'Cheraw dance', emoji: '🎍💃', prompt: 'Cheraw i lam ṭhin em?' },
    { theme: 'Puanchei', emoji: '🧣', prompt: 'Ni pawimawh takah hian puan hi i silh ṭhin em?' },
    { theme: 'Food', emoji: '🥘🎍', prompt: 'Bekang ei hi i duh em?' },
  ],
}

// ---------------- Music & Memory — track metadata ----------------
// audioSrc points to files that don't exist yet in this repo — see
// frontend/public/songs/README.md for exactly which files to drop in.
// The Song Recognition game shows a friendly "audio coming soon" fallback
// until each file exists, so missing audio never blocks the game.
export const MUSIC_TRACKS = {
  en: [
    { title: 'Folk melody 1', audioSrc: '/songs/general/1.mp3' },
    { title: 'Folk melody 2', audioSrc: '/songs/general/2.mp3' },
    { title: 'Folk melody 3', audioSrc: '/songs/general/3.mp3' },
  ],
  as: [
    { title: 'Assamese Bihu song 1', audioSrc: '/songs/assamese/1.mp3' },
    { title: 'Assamese Bihu song 2', audioSrc: '/songs/assamese/2.mp3' },
    { title: 'Assamese folk song 3', audioSrc: '/songs/assamese/3.mp3' },
  ],
  mni: [
    { title: 'Manipuri folk song 1', audioSrc: '/songs/manipuri/1.mp3' },
    { title: 'Manipuri folk song 2', audioSrc: '/songs/manipuri/2.mp3' },
    { title: 'Manipuri folk song 3', audioSrc: '/songs/manipuri/3.mp3' },
  ],
  mz: [
    { title: 'Mizo hla 1', audioSrc: '/songs/mizo/1.mp3' },
    { title: 'Mizo hla 2', audioSrc: '/songs/mizo/2.mp3' },
    { title: 'Mizo hla 3', audioSrc: '/songs/mizo/3.mp3' },
  ],
}
