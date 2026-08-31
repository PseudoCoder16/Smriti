// Best-effort translations for core patient-facing UI chrome only (not game
// internals). Assamese/Manipuri/Mizo strings should be reviewed by a native
// speaker before this ships to real patients.
export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'as', label: 'অসমীয়া (Assamese)' },
  { code: 'mni', label: 'মৈতৈলোন্ (Manipuri)' },
  { code: 'mz', label: 'Mizo ṭawng' },
]

export const STRINGS = {
  good_morning: { en: 'Good morning', as: 'শুভ ৰাতিপুৱা', mni: 'অয়াম্বা মায়েক পুম্নমক থাগৎচরি', mz: 'Zing tha' },
  good_afternoon: { en: 'Good afternoon', as: 'শুভ অপৰাহ্ণ', mni: 'নুমিৎ পুম্নমক থাগৎচরি', mz: 'Chawhnu tha' },
  good_evening: { en: 'Good evening', as: 'শুভ সন্ধিয়া', mni: 'নুমিৎ শাং থাগৎচরি', mz: 'Zan tha' },
  how_feeling: { en: 'How are you feeling today?', as: 'আজি আপুনি কেনে অনুভৱ কৰিছে?', mni: 'ঙসি নহাক্কী পুক্‌ণিং করম্না লৈরি?', mz: 'Tunlai i rilru chu engtin nge a awm?' },
  play_today: { en: 'Play Today', as: 'আজি খেলক', mni: 'ঙসি শান্নু', mz: 'Tunlai en rawh' },
  medicine: { en: 'Medicine', as: 'ঔষধ', mni: 'লৈ', mz: 'Damdawi' },
  messages: { en: 'Messages', as: 'বাৰ্তা', mni: 'পাউ', mz: 'Thuchah' },
  checkin: { en: 'Check-in', as: 'চেক-ইন', mni: 'চেক-ইন', mz: 'Check-in' },
  progress: { en: 'My Progress', as: 'মোৰ অগ্ৰগতি', mni: 'ঐগী মশাংতাবা', mz: 'Ka Hmasawnna' },
  switch_user: { en: 'Switch user', as: 'ব্যৱহাৰকাৰী সলনি কৰক', mni: 'শীজিন্নবা মি হোংদোক', mz: 'User dang' },
  pending_today: { en: 'Pending today', as: 'আজি বাকী থকা', mni: 'ঙসি লাইথোকপা', mz: 'Tuni a la nghah tur' },
  taken: { en: 'Taken', as: 'লোৱা হৈছে', mni: 'লৌখ্রে', mz: 'Ei tawh' },
  patient_login: { en: 'Log in with your Patient ID and PIN.', as: 'আপোনাৰ Patient ID আৰু PIN ৰে লগইন কৰক।', mni: 'নহাক্কী Patient ID অমসুং PIN গী মতুংইন্না Log in তৌবিয়ু।', mz: 'I Patient ID leh PIN hmangin Log in rawh.' },
  simple_mode: { en: 'Simple Mode (bigger text)', as: 'সৰল অৱস্থা (ডাঙৰ লিখনী)', mni: 'য়াম্না লাইথোকপা মোড (অচৌবা লিখ)', mz: 'Simple Mode (ziah lian zawk)' },
  choose_language: { en: 'Choose your language', as: 'আপোনাৰ ভাষা বাছক', mni: 'নহাক্কী লোল খনবিয়ু', mz: 'I ṭawng thlang rawh' },
  music_memory: { en: 'Music & Memory', as: 'সংগীত আৰু স্মৃতি', mni: 'ইশৈ অমসুং নিংশিং', mz: 'Hla leh Hriatreh' },
  remember_my_story: { en: 'Remember My Story', as: 'মোৰ কাহিনী মনত পেলাওক', mni: 'ঐগী ৱারী নিংশিংবিয়ু', mz: 'Ka Thawnthu Hriatreh' },
}

export function useTranslator(language) {
  return (key) => STRINGS[key]?.[language] || STRINGS[key]?.en || key
}
