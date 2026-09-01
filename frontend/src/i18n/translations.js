// Best-effort translations for patient-facing UI chrome and the core game
// flow (titles, instructions, buttons, feedback, difficulty labels, result
// screens). Game *content* (reminiscence prompts, song titles) is not
// translated here — see data/culturalContent.js for that.
//
// Hindi translations are reasonably high-confidence. Assamese, Manipuri and
// Mizo are best-effort and should be reviewed by a native speaker of each
// language before this ships to real patients — same caveat the previous
// version of this file already carried, now extended to the larger key set.
export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'as', label: 'অসমীয়া (Assamese)' },
  { code: 'mni', label: 'মৈতৈলোন্ (Manipuri)' },
  { code: 'mz', label: 'Mizo ṭawng' },
]

export const STRINGS = {
  // ---------------- Greetings / dashboard chrome (existing) ----------------
  good_morning: { en: 'Good morning', hi: 'सुप्रभात', as: 'শুভ ৰাতিপুৱা', mni: 'অয়াম্বা মায়েক পুম্নমক থাগৎচরি', mz: 'Zing tha' },
  good_afternoon: { en: 'Good afternoon', hi: 'शुभ दोपहर', as: 'শুভ অপৰাহ্ণ', mni: 'নুমিৎ পুম্নমক থাগৎচরি', mz: 'Chawhnu tha' },
  good_evening: { en: 'Good evening', hi: 'शुभ संध्या', as: 'শুভ সন্ধিয়া', mni: 'নুমিৎ শাং থাগৎচরি', mz: 'Zan tha' },
  how_feeling: { en: 'How are you feeling today?', hi: 'आज आप कैसा महसूस कर रहे हैं?', as: 'আজি আপুনি কেনে অনুভৱ কৰিছে?', mni: 'ঙসি নহাক্কী পুক্‌ণিং করম্না লৈরি?', mz: 'Tunlai i rilru chu engtin nge a awm?' },
  play_today: { en: 'Play Today', hi: 'आज खेलें', as: 'আজি খেলক', mni: 'ঙসি শান্নু', mz: 'Tunlai en rawh' },
  medicine: { en: 'Medicine', hi: 'दवाई', as: 'ঔষধ', mni: 'লৈ', mz: 'Damdawi' },
  messages: { en: 'Messages', hi: 'संदेश', as: 'বাৰ্তা', mni: 'পাউ', mz: 'Thuchah' },
  checkin: { en: 'Check-in', hi: 'चेक-इन', as: 'চেক-ইন', mni: 'চেক-ইন', mz: 'Check-in' },
  progress: { en: 'My Progress', hi: 'मेरी प्रगति', as: 'মোৰ অগ্ৰগতি', mni: 'ঐগী মশাংতাবা', mz: 'Ka Hmasawnna' },
  switch_user: { en: 'Switch user', hi: 'उपयोगकर्ता बदलें', as: 'ব্যৱহাৰকাৰী সলনি কৰক', mni: 'শীজিন্নবা মি হোংদোক', mz: 'User dang' },
  pending_today: { en: 'Pending today', hi: 'आज बाकी', as: 'আজি বাকী থকা', mni: 'ঙসি লাইথোকপা', mz: 'Tuni a la nghah tur' },
  taken: { en: 'Taken', hi: 'ले ली गई', as: 'লোৱা হৈছে', mni: 'লৌখ্রে', mz: 'Ei tawh' },
  patient_login: { en: 'Log in with your Patient ID and PIN.', hi: 'अपने पेशेंट आईडी और पिन से लॉग इन करें।', as: 'আপোনাৰ Patient ID আৰু PIN ৰে লগইন কৰক।', mni: 'নহাক্কী Patient ID অমসুং PIN গী মতুংইন্না Log in তৌবিয়ু।', mz: 'I Patient ID leh PIN hmangin Log in rawh.' },
  simple_mode: { en: 'Simple Mode (bigger text)', hi: 'सरल मोड (बड़ा टेक्स्ट)', as: 'সৰল অৱস্থা (ডাঙৰ লিখনী)', mni: 'য়াম্না লাইথোকপা মোড (অচৌবা লিখ)', mz: 'Simple Mode (ziah lian zawk)' },
  choose_language: { en: 'Choose your language', hi: 'अपनी भाषा चुनें', as: 'আপোনাৰ ভাষা বাছক', mni: 'নহাক্কী লোল খনবিয়ু', mz: 'I ṭawng thlang rawh' },
  music_memory: { en: 'Music & Memory', hi: 'गीत पहचान', as: 'সংগীত আৰু স্মৃতি', mni: 'ইশৈ অমসুং নিংশিং', mz: 'Hla leh Hriatreh' },
  remember_my_story: { en: 'Remember My Story', hi: 'मेरी कहानी याद रखें', as: 'মোৰ কাহিনী মনত পেলাওক', mni: 'ঐগী ৱারী নিংশিংবিয়ু', mz: 'Ka Thawnthu Hriatreh' },

  // ---------------- Dashboard nav / new game titles ----------------
  welcome: { en: 'Welcome to Smriti', hi: 'स्मृति में आपका स्वागत है', as: 'স্মৃতিলৈ আপোনাক স্বাগতম', mni: 'Smriti-da nakhoibu taramba', mz: 'Smriti-ah i lo kal chhung' },
  games: { en: 'Games', hi: 'खेल', as: 'খেল', mni: 'শান্নবা', mz: 'En dan' },
  play: { en: 'Play', hi: 'खेलें', as: 'খেলক', mni: 'শান্নু', mz: 'En rawh' },
  history: { en: 'History', hi: 'इतिहास', as: 'ইতিহাস', mni: 'ৱারী মমাং', mz: 'Hmasa lai' },
  settings: { en: 'Settings', hi: 'सेटिंग्स', as: 'ছেটিংছ', mni: 'শেমগৎপা', mz: 'Rem dan' },
  logout: { en: 'Log out', hi: 'लॉग आउट', as: 'লগ আউট কৰক', mni: 'Log out তৌবিয়ু', mz: 'Log out rawh' },
  language: { en: 'Language', hi: 'भाषा', as: 'ভাষা', mni: 'লোল', mz: 'Ṭawng' },
  color_sort: { en: 'Color Sort', hi: 'रंग छाँटें', as: 'ৰং সজোৱা খেল', mni: 'মচু য়েন্নবা', mz: 'Rong Then Dan' },
  rhythm_tap: { en: 'Rhythm & Tap', hi: 'ताल पर टैप करें', as: 'তাল আৰু টেপ', mni: 'শক্ থোক্না তেপ তৌবা', mz: 'Rhythm leh Tap' },
  pattern_recognition: { en: 'Pattern Recognition', hi: 'पैटर्न पहचान', as: 'আকৃতি চিনাক্তকৰণ', mni: 'পাত্তেৰ্ন খংবা', mz: 'Pattern Hriatna' },

  // ---------------- Generic game vocabulary (reused across all games) ----------------
  start_game: { en: 'Start Game', hi: 'खेल शुरू करें', as: 'খেল আৰম্ভ কৰক', mni: 'শান্নবা হৌদোকপা', mz: 'En Ṭan Rawh' },
  instructions: { en: 'Instructions', hi: 'निर्देश', as: 'নিৰ্দেশনা', mni: 'তাক্না ইন্দোকপা', mz: 'Zilhnathu' },
  round: { en: 'Round', hi: 'राउंड', as: 'ৰাউণ্ড', mni: 'ৰাউণ্ড', mz: 'Vawn' },
  correct: { en: 'Correct', hi: 'सही', as: 'শুদ্ধ', mni: 'চুম্মি', mz: 'A dik' },
  incorrect: { en: 'Incorrect', hi: 'गलत', as: 'ভুল', mni: 'চুমদে', mz: 'A dik lo' },
  errors: { en: 'Errors', hi: 'त्रुटियाँ', as: 'ভুলবোৰ', mni: 'অশোয়বা', mz: 'Sual' },
  missed: { en: 'Missed', hi: 'छूटा', as: 'বাদ পৰা', mni: 'চোকখিদবা', mz: 'A liam' },
  games_played: { en: 'Games played', hi: 'खेले गए खेल', as: 'খেলা খেল', mni: 'শানখিবা শান্নবা', mz: 'En zin tawh' },
  recent_sessions: { en: 'Recent sessions', hi: 'हाल के सत्र', as: 'শেহতীয়া অধিৱেশন', mni: 'নৌবা শেসনশিং', mz: 'Session hnuaisa' },
  mark_taken: { en: 'Mark taken', hi: 'ली गई के रूप में चिह्नित करें', as: 'খোৱা বুলি চিহ্নিত কৰক', mni: 'লৌখ্রে হায়না তাক তৌবিয়ু', mz: 'Ei tawh ti tarlan rawh' },
  try_again: { en: 'Try Again', hi: 'फिर कोशिश करें', as: 'পুনৰ চেষ্টা কৰক', mni: 'অমুক্তা হন্না তৌ', mz: 'Tih leh rawh' },
  great_job: { en: 'Great Job!', hi: 'बहुत बढ़िया!', as: 'বহুত ভাল!', mni: 'য়াম্না ফবা!', mz: 'Ṭha tak!' },
  next: { en: 'Next', hi: 'अगला', as: 'পৰৱৰ্তী', mni: 'মথংগী', mz: 'A dawt' },
  finish: { en: 'Finish', hi: 'समाप्त', as: 'সমাপ্ত', mni: 'লোইশিন', mz: 'Zo' },
  score: { en: 'Score', hi: 'स्कोर', as: 'স্ক\'ৰ', mni: 'স্কোর', mz: 'Score' },
  accuracy: { en: 'Accuracy', hi: 'सटीकता', as: 'শুদ্ধতা', mni: 'চুম্মিবা মায়েক', mz: 'A dikna zat' },
  time: { en: 'Time', hi: 'समय', as: 'সময়', mni: 'মতম', mz: 'Hun' },
  completed: { en: 'Completed', hi: 'पूर्ण', as: 'সম্পূৰ্ণ', mni: 'লোইশিনখ্রে', mz: 'A zo tawh' },
  choose_difficulty: { en: 'Choose a difficulty to begin', hi: 'शुरू करने के लिए कठिनाई चुनें', as: 'আৰম্ভ কৰিবলৈ কঠিনতা বাছক', mni: 'হৌদোকপগী কঠিনগী মায়েক খনবিয়ু', mz: 'Ṭan tûr chhak thliar rawh' },
  easy: { en: 'Easy', hi: 'आसान', as: 'সহজ', mni: 'য়াম্না লাইথোকপা', mz: 'A awlsam' },
  medium: { en: 'Medium', hi: 'मध्यम', as: 'মধ্যম', mni: 'মদ্যম', mz: 'A zar zawng' },
  hard: { en: 'Hard', hi: 'कठिन', as: 'কঠিন', mni: 'কঠিন', mz: 'A vang' },
  play_again: { en: 'Play Again', hi: 'फिर से खेलें', as: 'পুনৰ খেলক', mni: 'অমুক্তা শান্নু', mz: 'En leh rawh' },
  change_difficulty: { en: 'Change Difficulty', hi: 'कठिनाई बदलें', as: 'কঠিনতা সলনি কৰক', mni: 'কঠিনগী মায়েক হোংদোক', mz: 'Ṭan tûr dang thlang rawh' },
  back_to_games: { en: 'Back to Games', hi: 'खेलों पर वापस जाएँ', as: 'খেললৈ উভতি যাওক', mni: 'শান্নবগী হন্না হল্লক্কো', mz: 'En zawnah kir rawh' },
  avg_response: { en: 'Avg Response', hi: 'औसत प्रतिक्रिया', as: 'গড় সঁহাৰি সময়', mni: 'য়াম্লবা পাউখুম মতম', mz: 'Chhang dan average' },
  session_complete: { en: 'Session complete', hi: 'सत्र पूरा हुआ', as: 'অধিৱেশন সম্পূৰ্ণ হ\'ল', mni: 'শেসন লোইশিনখ্রে', mz: 'Session a zo tawh' },

  // ---------------- Medicine ----------------
  medicine_time: { en: 'Medicine Time', hi: 'दवाई का समय', as: 'ঔষধ খোৱাৰ সময়', mni: 'লৈ থাগৎপগী মতম', mz: 'Damdawi ei hun' },
  please_take_medicine: { en: 'Please take your medicine', hi: 'कृपया अपनी दवाई लें', as: 'অনুগ্ৰহ কৰি আপোনাৰ ঔষধ খাওক', mni: 'নহাক্কী লৈ থাগৎপিয়ু', mz: 'I damdawi la rawh' },
  remind_later: { en: 'Remind Me Later', hi: 'मुझे बाद में याद दिलाएं', as: 'পিছত মনত পেলাই দিয়ক', mni: 'মথংদা ননবা ফোংদোকপিয়ু', mz: 'Hunun min hriattir la rawh' },

  // ---------------- Messages ----------------
  message_from_caregiver: { en: 'Message from Caregiver', hi: 'देखभाल करने वाले का संदेश', as: 'যত্নকাৰীৰ পৰা বাৰ্তা', mni: 'ইঙন্নবগী পাউ', mz: 'Enkawltu thu' },
  listen: { en: 'Listen', hi: 'सुनें', as: 'শুনক', mni: 'তাউ', mz: 'Ngaithla rawh' },
  got_it: { en: 'Got it', hi: 'समझ गया', as: 'বুজি পালোঁ', mni: 'খংখ্রে', mz: 'Ka hria' },

  // ---------------- Check-in ----------------
  how_was_your_day: { en: 'How was your day?', hi: 'आपका दिन कैसा रहा?', as: 'আপোনাৰ দিনটো কেনেকুৱা গ\'ল?', mni: 'নহাক্কী নুমিৎ করম্না লৈরি?', mz: 'I ni chu engtin nge a lo awm?' },
  good: { en: 'Good', hi: 'अच्छा', as: 'ভাল', mni: 'ফবা', mz: 'A tha' },
  okay: { en: 'Okay', hi: 'ठीक-ठाक', as: 'ঠিকেই আছে', mni: 'ফবগা মরম', mz: 'A la awm ve' },
  not_good: { en: 'Not Good', hi: 'ठीक नहीं', as: 'ভাল নহয়', mni: 'ফদে', mz: 'A ṭha lo' },
  continue: { en: 'Continue', hi: 'जारी रखें', as: 'অব্যাহত ৰাখক', mni: 'মখা চৎলু', mz: 'Zom zel rawh' },
  thank_you_noted: { en: 'Thank you — noted.', hi: 'धन्यवाद — दर्ज कर लिया गया।', as: 'ধন্যবাদ — টুকি লোৱা হ\'ল।', mni: 'থাগৎচরি — ফোংদোকখ্রে।', mz: 'Ka lawm e — ka lo record tawh.' },

  // ---------------- Color Sort ----------------
  color_sort_instructions: {
    en: 'Move the same-colored balls into the same tube. Tap a tube to pick up its top ball, then tap another tube to place it there.',
    hi: 'एक ही रंग की गेंदों को एक ही ट्यूब में डालें। किसी ट्यूब को छूकर उसकी ऊपरी गेंद उठाएं, फिर दूसरी ट्यूब छूकर वहाँ रखें।',
    as: 'একে ৰঙৰ বলবোৰ একেটা টিউবত ৰাখক। ওপৰৰ বলটো তুলিবলৈ টিউবটোত টিপক, তাৰপিছত আন এটা টিউবত টিপি ৰাখক।',
    mni: 'মচু চুম্লবা বল খুদিংবু মচু চুম্লবা টিউব অমতা থমুবিয়ু। টিউব অদুগী মথক্তা লৈরিবা বল লৌগদবা টিউব অদু তেপ তৌবিয়ু, অদুগা মশক্তা তেপ তৌনা অতোপ্পা টিউবদা থমুবিয়ু।',
    mz: 'Ball rong inang inangte chu tube khat ah dah ho rawh. Tube pakhat tap ila a chungnung ball chu la ang che, tichuan tube dang tap leh la dah tur ah.',
  },
  color_sort_pick_a_tube: { en: 'That tube is empty — tap a tube with balls first.', hi: 'वह ट्यूब खाली है — पहले गेंदों वाली ट्यूब पर टैप करें।', as: 'সেই টিউবটো খালী — প্ৰথমে বল থকা টিউবত টিপক।', mni: 'টিউব অদু হাংলি — হন্না বল লৈরিবা টিউব তেপ তৌবিয়ু।', mz: 'Tube chu a chhung a rilru — ball nei tube tap hmasa rawh.' },

  // ---------------- Rhythm & Tap ----------------
  rhythm_tap_instructions: { en: 'Watch the drum pulse to the beat, then tap the button right as it pulses.', hi: 'ढोल की धड़कन देखें, फिर धड़कते समय बटन दबाएं।', as: 'ঢোলৰ তাল চাওক, তাল পৰাৰ সময়ত বুটামটো টিপক।', mni: 'পুং য়েংশিন্না তাউয়ু, অদুগা পুং থোক্তবা মতমদা বটন অদু তেপ তৌবিয়ু।', mz: 'Khuang khap chu en la, a khap veleh button chu tap rawh.' },
  rhythm_tap_button: { en: 'TAP', hi: 'टैप करें', as: 'টেপ কৰক', mni: 'তেপ তৌ', mz: 'TAP' },

  // ---------------- Pattern Recognition ----------------
  pattern_instructions: { en: 'Watch the shapes light up, then tap them back in the same order.', hi: 'आकृतियों को जलते हुए देखें, फिर उसी क्रम में उन्हें दबाएं।', as: 'আকৃতিবোৰ জ্বলি উঠা চাওক, তাৰপিছত একে ক্ৰমত টিপক।', mni: 'মশক অদু মঙখৎপা য়েংবিয়ু, অদুগা মখোয়বু চহি অদুমক্তা তেপ তৌরকউ।', mz: 'A eng danglam chu en la, a lo eng dan angin tap kir leh rawh.' },
  pattern_watch_carefully: { en: 'Watch carefully…', hi: 'ध्यान से देखें…', as: 'সাৱধানে চাওক…', mni: 'চেকশিন্না য়েংবিয়ু…', mz: 'Fîmkhur chian la…' },
  pattern_your_turn: { en: 'Your turn — tap them in order', hi: 'आपकी बारी — क्रम में दबाएं', as: 'আপোনাৰ পাল — ক্ৰমত টিপক', mni: 'নহাক্কী তুর — চহি অদুমক্তা তেপ তৌরকউ', mz: 'I vawn — a dan angin tap rawh' },

  // ---------------- Song Recognition ----------------
  song_choose_style: { en: 'Choose the music style', hi: 'संगीत शैली चुनें', as: 'সংগীতৰ ধৰণ বাছক', mni: 'ইশৈগী মায়েক খনবিয়ু', mz: 'Hla dan thlang rawh' },
  song_recognize_prompt: { en: 'Do you recognize this type of music?', hi: 'क्या आप इस प्रकार का संगीत पहचानते हैं?', as: 'আপুনি এই ধৰণৰ সংগীত চিনি পাইছে নেকি?', mni: 'ইশৈ অসিগুম্বা নহাক্না খংবিব্রা?', mz: 'Hla hi i hriatthiam em?' },
  song_word: { en: 'Song', hi: 'गीत', as: 'গীত', mni: 'ইশৈ', mz: 'Hla' },

  // ---------------- Family Memory ----------------
  story_choose_background: { en: 'Choose your background', hi: 'अपनी पृष्ठभूमि चुनें', as: 'আপোনাৰ পটভূমি বাছক', mni: 'নহাক্কী মপুং খনবিয়ু', mz: 'I hmun thlang rawh' },
  story_word: { en: 'Story', hi: 'कहानी', as: 'কাহিনী', mni: 'ৱারী', mz: 'Thawnthu' },

  // ---------------- Response buttons (shared: Song Recognition + Family Memory) ----------------
  yes_i_remember: { en: 'YES, I REMEMBER 😊', hi: 'हाँ, मुझे याद है 😊', as: 'হয়, মোৰ মনত আছে 😊', mni: 'হোয়, ঐহাক্না ননবিয়ু 😊', mz: 'AWI, KA HRIATREH 😊' },
  not_sure: { en: 'NOT SURE 🤔', hi: 'पक्का नहीं 🤔', as: 'নিশ্চিত নহয় 🤔', mni: 'চুম্মি খংদে 🤔', mz: 'KA HRIA LO 🤔' },
  tell_me_more: { en: 'TELL ME MORE 🎤', hi: 'और बताएं 🎤', as: 'অধিক কওক 🎤', mni: 'হেন্না হায়বিয়ু 🎤', mz: 'SAWI ZAWK ANG 🎤' },
  listening: { en: 'Listening… 🎤', hi: 'सुन रहे हैं… 🎤', as: 'শুনি আছোঁ… 🎤', mni: 'তাউরি… 🎤', mz: 'Ka ngaithla… 🎤' },
}

export function useTranslator(language) {
  return (key) => STRINGS[key]?.[language] || STRINGS[key]?.en || key
}
