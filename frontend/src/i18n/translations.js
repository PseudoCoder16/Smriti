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

// Maps the UI language code to the matching option value in the patient
// registration form's "Preferred language" dropdown (a free-text list of
// NER language names, wider than the 5 UI locales) — used to auto-select
// that field when the patient picks a UI language.
export const LANGUAGE_NAME_BY_CODE = {
  en: 'English',
  hi: 'Hindi',
  as: 'Assamese',
  mni: 'Manipuri',
  mz: 'Mizo',
}

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
  lets_play_a_game: { en: "Let's play a game.", hi: 'चलो एक खेल खेलते हैं।', as: 'আহক এটা খেল খেলোঁ।', mni: 'শান্নবা অমা শানসি।', mz: "En dan khat en ei rawh sei." },

  // ---------------- Auth (login/registration) page ----------------
  back_to_home: { en: '← Back to home', hi: '← होम पर वापस जाएँ', as: '← ঘৰলৈ উভতি যাওক', mni: '← হোমদা হন্না হল্লক্কো', mz: '← Home ah kir rawh' },
  welcome_back: { en: 'Welcome back', hi: 'वापसी पर स्वागत है', as: 'পুনৰাই স্বাগতম', mni: 'হন্না লক্লবদা তরাম্বা', mz: 'Kir leh na kan lawm e' },
  create_your_profile: { en: 'Create your profile', hi: 'अपनी प्रोफ़ाइल बनाएं', as: 'আপোনাৰ প্ৰ\'ফাইল সৃষ্টি কৰক', mni: 'নহাক্কী প্রফাইল শেম্বিয়ু', mz: 'I profile siam rawh' },
  caregiver_login_title: { en: 'Caregiver login', hi: 'देखभालकर्ता लॉगिन', as: 'যত্নকাৰী লগইন', mni: 'ইঙন্নবগী লগইন', mz: 'Enkawltu login' },
  create_caregiver_account: { en: 'Create a caregiver account', hi: 'देखभालकर्ता खाता बनाएं', as: 'যত্নকাৰীৰ একাউণ্ট সৃষ্টি কৰক', mni: 'ইঙন্নবগী একাউন্ট শেম্বিয়ু', mz: 'Enkawltu account siam rawh' },
  patient_register_subtitle: { en: 'A few details to get you started — no caregiver needed.', hi: 'शुरू करने के लिए कुछ विवरण — देखभालकर्ता की आवश्यकता नहीं।', as: 'আৰম্ভ কৰিবলৈ কেইটামান তথ্য — যত্নকাৰীৰ প্ৰয়োজন নাই।', mni: 'হৌদোকপগী তাক খরা — ইঙন্নবা তাদে।', mz: 'I ṭan tûra thil tlêm — enkawltu a ngai lo.' },
  caregiver_subtitle: { en: 'Monitor and support your patients.', hi: 'अपने मरीजों की निगरानी और सहायता करें।', as: 'আপোনাৰ ৰোগীসকলক নিৰীক্ষণ আৰু সহায় কৰক।', mni: 'নহাক্কী পেসেন্টশিংবু য়েংশিন্না মতেং পাংবিয়ু।', mz: 'I patient-te enkawl la ṭanpui rawh.' },
  role_patient: { en: 'Patient', hi: 'मरीज़', as: 'ৰোগী', mni: 'পেসেন্ট', mz: 'Damdawi ei tu' },
  role_caregiver: { en: 'Caregiver', hi: 'देखभालकर्ता', as: 'যত্নকাৰী', mni: 'ইঙন্নবা', mz: 'Enkawltu' },
  tab_login: { en: 'Login', hi: 'लॉगिन', as: 'লগইন', mni: 'লগইন', mz: 'Login' },
  tab_register: { en: 'Register', hi: 'रजिस्टर', as: 'ৰেজিষ্টাৰ', mni: 'রেজিস্টর', mz: 'Register' },
  patient_id_username: { en: 'Patient ID / Username', hi: 'पेशेंट आईडी / यूज़रनेम', as: 'Patient ID / ব্যৱহাৰকাৰীৰ নাম', mni: 'Patient ID / শীজিন্নবা মিং', mz: 'Patient ID / Username' },
  pin_label: { en: 'PIN', hi: 'पिन', as: 'পিন', mni: 'পিন', mz: 'PIN' },
  four_digit_pin: { en: '4-digit PIN', hi: '4-अंकों का पिन', as: '৪-অংকৰ পিন', mni: 'অহুম ৪গী পিন', mz: 'PIN hejat 4' },
  forgot_pin: { en: 'Forgot PIN?', hi: 'पिन भूल गए?', as: 'পিন পাহৰিলে নেকি?', mni: 'পিন কাউখ্রবরা?', mz: 'PIN theihnghilh?' },
  logging_in: { en: 'Logging in…', hi: 'लॉग इन हो रहा है…', as: 'লগইন হৈ আছে…', mni: 'লগইন তৌরি…', mz: 'Login zel…' },
  log_in: { en: 'Log in', hi: 'लॉग इन करें', as: 'লগইন কৰক', mni: 'লগইন তৌ', mz: 'Login rawh' },
  full_name: { en: 'Full name', hi: 'पूरा नाम', as: 'সম্পূৰ্ণ নাম', mni: 'মপুং ফাবা মিং', mz: 'Hming dik tak' },
  age_label: { en: 'Age', hi: 'उम्र', as: 'বয়স', mni: 'চহি', mz: 'Kum' },
  gender_label: { en: 'Gender', hi: 'लिंग', as: 'লিংগ', mni: 'নুপী নুপা', mz: 'Nupa/nupui' },
  gender_female: { en: 'Female', hi: 'महिला', as: 'মহিলা', mni: 'নুপী', mz: 'Hmeichhia' },
  gender_male: { en: 'Male', hi: 'पुरुष', as: 'পুৰুষ', mni: 'নুপা', mz: 'Mipa' },
  gender_other: { en: 'Other', hi: 'अन्य', as: 'অন্য', mni: 'অতোপ্পা', mz: 'Dang' },
  preferred_language_label: { en: 'Preferred language', hi: 'पसंदीदा भाषा', as: 'পছন্দৰ ভাষা', mni: 'ৱাংখল্লবা লোল', mz: 'Duh zâwk ṭawng' },
  choose_username: { en: 'Choose a username', hi: 'एक यूज़रनेम चुनें', as: 'এটা ব্যৱহাৰকাৰীৰ নাম বাছক', mni: 'শীজিন্নবা মিং খনবিয়ু', mz: 'Username thlang rawh' },
  choose_pin: { en: 'Choose a PIN', hi: 'एक पिन चुनें', as: 'এটা পিন বাছক', mni: 'পিন খনবিয়ু', mz: 'PIN thlang rawh' },
  creating: { en: 'Creating…', hi: 'बनाया जा रहा है…', as: 'সৃষ্টি হৈ আছে…', mni: 'শেম্লি…', mz: 'Siam mek…' },
  create_my_profile: { en: 'Create my profile', hi: 'मेरी प्रोफ़ाइल बनाएं', as: 'মোৰ প্ৰ\'ফাইল সৃষ্টি কৰক', mni: 'ঐগী প্রফাইল শেম্বিয়ু', mz: 'Ka profile siam rawh' },
  caregiver_link_later: { en: 'A caregiver can link your profile to their dashboard later.', hi: 'एक देखभालकर्ता बाद में आपकी प्रोफ़ाइल को अपने डैशबोर्ड से जोड़ सकता है।', as: 'যত্নকাৰী এজনে পিছত আপোনাৰ প্ৰ\'ফাইল তেওঁলোকৰ ডেশ্ব\'ৰ্ডৰ সৈতে সংযোগ কৰিব পাৰে।', mni: 'ইঙন্নবা অমনা মথংদা নহাক্কী প্রফাইল মখোয়গী ড্যাশবোর্দগা মরি য়েংহনবা য়াই।', mz: 'Enkawltu chuan hunun i profile chu an dashboard-ah dah thei ang.' },
  email_label: { en: 'Email', hi: 'ईमेल', as: 'ইমেইল', mni: 'ইমেইল', mz: 'Email' },
  password_label: { en: 'Password', hi: 'पासवर्ड', as: 'পাছৱৰ্ড', mni: 'পাসৱার্ড', mz: 'Password' },
  forgot_password: { en: 'Forgot password?', hi: 'पासवर्ड भूल गए?', as: 'পাছৱৰ্ড পাহৰিলে নেকি?', mni: 'পাসৱার্ড কাউখ্রবরা?', mz: 'Password theihnghilh?' },
  log_in_to_dashboard: { en: 'Log in to dashboard', hi: 'डैशबोर्ड में लॉग इन करें', as: 'ডেশ্ব\'ৰ্ডত লগইন কৰক', mni: 'ড্যাশবোর্দদা লগইন তৌ', mz: 'Dashboard-ah login rawh' },
  phone_number: { en: 'Phone number', hi: 'फ़ोन नंबर', as: 'ফ\'ন নম্বৰ', mni: 'ফোন নম্বর', mz: 'Phone number' },
  create_account: { en: 'Create account', hi: 'खाता बनाएं', as: 'একাউণ্ট সৃষ্টি কৰক', mni: 'একাউন্ট শেম্বিয়ু', mz: 'Account siam rawh' },
  username_word: { en: 'username', hi: 'यूज़रनेम', as: 'ব্যৱহাৰকাৰীৰ নাম', mni: 'শীজিন্নবা মিং', mz: 'username' },
  demo_reset_notice_prefix: { en: 'Demo only — not wired to the backend yet. Enter your', hi: 'केवल डेमो — अभी बैकएंड से नहीं जुड़ा है। अपना', as: 'কেৱল ডেম\' — এতিয়াও বেকএণ্ডৰ সৈতে সংযুক্ত হোৱা নাই। আপোনাৰ', mni: 'ডেমো ওইনমক — হৌজিক ফাওবা ব্যাকএন্দদা মরি লৈরদে। নহাক্কী', mz: 'Demo mai — backend-ah lo zawm lo va. I' },
  demo_reset_notice_suffix: { en: 'to see the mock reset flow.', hi: 'दर्ज करें ताकि मॉक रीसेट फ़्लो देखा जा सके।', as: 'দিয়ক মক ৰিছেট ফ্ল\' চাবলৈ।', mni: 'ইনবিয়ু মক রিসেট ফ্লো উবা।', mz: 'chhu inbawm reset flow en tûr han lo entîr rawh.' },
  send_otp: { en: 'Send OTP', hi: 'OTP भेजें', as: 'OTP প্ৰেৰণ কৰক', mni: 'OTP থাদোকপিয়ু', mz: 'OTP thawn rawh' },
  enter_otp: { en: 'Enter OTP', hi: 'OTP दर्ज करें', as: 'OTP দিয়ক', mni: 'OTP ইনবিয়ু', mz: 'OTP tarlan rawh' },
  otp_placeholder: { en: '4-6 digit code', hi: '4-6 अंकों का कोड', as: '৪-৬ অংকৰ ক\'ড', mni: 'অহুম ৪-৬গী কোড', mz: 'Code hejat 4-6' },
  reset_and_continue: { en: 'Reset & Continue', hi: 'रीसेट करें और जारी रखें', as: 'ৰিছেট কৰক আৰু অব্যাহত ৰাখক', mni: 'রিসেট তৌ অমসুং মখা চৎলু', mz: 'Reset leh Zom Zel' },
  back_to_login: { en: '← Back to login', hi: '← लॉगिन पर वापस जाएँ', as: '← লগইনলৈ উভতি যাওক', mni: '← লগইনদা হন্না হল্লক্কো', mz: '← Login ah kir rawh' },
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
  advanced: { en: 'Advanced', hi: 'उन्नत', as: 'উন্নত', mni: 'হেন্না চাংবা', mz: 'A ropui zawk' },
  listen_first: { en: 'Listen First', hi: 'पहले सुनें', as: 'প্ৰথমে শুনক', mni: 'হন্না তাউ', mz: 'Ngaithla masa' },
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
  mood_response_good: { en: "That's good to hear!", hi: 'यह सुनकर अच्छा लगा!', as: 'এইটো শুনি ভাল লাগিল!', mni: 'মসি তাবা য়ামনা ফবা!', mz: 'Chu chu ka hria a tha!' },
  mood_response_okay: { en: "Okay. Let's have a good day.", hi: 'ठीक है। एक अच्छा दिन बिताएं।', as: 'ঠিক আছে। এটা ভাল দিন কটাওঁ।', mni: 'ফবগা মরম। নুমিৎ অমা ফবা তৌশি।', mz: 'A la awm ve. Ni ṭha kan hmang ang.' },
  mood_response_not_good: { en: "I'm sorry you're having a difficult day.", hi: 'मुझे खेद है कि आपका दिन कठिन रहा।', as: 'মই দুঃখিত যে আপোনাৰ দিনটো কঠিন হৈছে।', mni: 'নহাক্কী নুমিৎ ৱাংথোক্না লৈরিবা মতমদা ঐগী মৱাইশক ফোংদোকই।', mz: 'I ni harsa e tih ka hriat avangin ka lungchhia hle.' },

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
  rhythm_choose_style: { en: 'Choose a rhythm style', hi: 'एक ताल शैली चुनें', as: 'এটা তাল শৈলী বাছক', mni: 'শক্ থোক্না অমা খনবিয়ু', mz: 'Rhythm dan thlang rawh' },
  rhythm_style_assamese: { en: 'Assamese (Bihu Dhol)', hi: 'असमिया (बिहू ढोल)', as: 'অসমীয়া (বিহু ঢোল)', mni: 'অসমীয়া (Bihu Dhol)', mz: 'Assamese (Bihu Dhol)' },
  rhythm_style_manipuri: { en: 'Manipuri (Pung Cholom)', hi: 'मणिपुरी (पुंग चोलोम)', as: 'মণিপুৰী (Pung Cholom)', mni: 'মৈতৈলোন্ (Pung Cholom)', mz: 'Manipuri (Pung Cholom)' },
  rhythm_listen_instructions: { en: "Just listen to the rhythm — no tapping needed yet.", hi: 'बस ताल को सुनें — अभी टैप करने की ज़रूरत नहीं।', as: 'কেৱল তালটো শুনক — এতিয়াই টেপ কৰাৰ প্ৰয়োজন নাই।', mni: 'শক্ অদু তাউ — হৌজিক তেপ তৌগদবা তাদে।', mz: 'Rhythm hi ngaithla mai — tap a ngai reng lo.' },
  rhythm_now_your_turn: { en: 'Now tap along with the rhythm.', hi: 'अब ताल के साथ टैप करें।', as: 'এতিয়া তালৰ লগত টেপ কৰক।', mni: 'হৌজিক শক্ অদুগা লোয়ননা তেপ তৌ।', mz: 'Tunah chuan rhythm nen tap rawh.' },
  rhythm_consistency: { en: 'Rhythm consistency', hi: 'ताल की निरंतरता', as: 'তাল ধাৰাবাহিকতা', mni: 'শক্কী চুম্না লেপ্পা', mz: 'Rhythm inzawm dan' },
  rhythm_listen_done: { en: "Nice listening! Ready to try tapping?", hi: 'बढ़िया सुना! अब टैप करने के लिए तैयार हैं?', as: 'ভালদৰে শুনিলে! এতিয়া টেপ কৰিবলৈ সাজু নেকি?', mni: 'ফবনা তাউরে! হৌজিক তেপ তৌবা থৌরাং তৌরবরা?', mz: 'Ngaithla thiam takin! Tap i ṭan tûr ni em?' },
  keep_trying: { en: 'Keep trying — you\'re doing fine.', hi: 'कोशिश करते रहें — आप अच्छा कर रहे हैं।', as: 'চেষ্টা কৰি থাকক — আপুনি ভালদৰে কৰি আছে।', mni: 'হোৎনরিবু — নহাক্না ফবনা তৌরি।', mz: 'Tih zel rawh — i ṭha lem.' },

  // ---------------- Pattern Recognition ----------------
  pattern_instructions: { en: 'Watch which cells light up, then tap the same cells once they disappear.', hi: 'देखें कौन से सेल जलते हैं, फिर गायब होने के बाद वही सेल दबाएं।', as: 'কোনবোৰ কোষ জ্বলি উঠে চাওক, তাৰপিছত অদৃশ্য হোৱাৰ পিছত একে কোষবোৰ টিপক।', mni: 'কোন কোন সেল মঙখৎলি হায়না য়েংবিয়ু, অদুগা মাংখিরবা মতুংদা মদুগুম্না সেলশিং অদু তেপ তৌ।', mz: 'Cell engzat lo eng chu en la, a bo hnu chuan cell dang bawk tap kir rawh.' },
  pattern_watch_carefully: { en: 'Watch carefully…', hi: 'ध्यान से देखें…', as: 'সাৱধানে চাওক…', mni: 'চেকশিন্না য়েংবিয়ু…', mz: 'Fîmkhur chian la…' },
  pattern_your_turn: { en: 'Now recreate the pattern', hi: 'अब पैटर्न को दोबारा बनाएं', as: 'এতিয়া আকৃতিটো পুনৰ সৃষ্টি কৰক', mni: 'হৌজিক পাত্তেৰ্ন অদু অমুক্তা শেম্মু', mz: 'Tunah chuan pattern chu siam let rawh' },
  clear: { en: 'Clear', hi: 'साफ़ करें', as: 'পৰিষ্কাৰ কৰক', mni: 'সেংদোকউ', mz: 'Sut rawh' },
  submit: { en: 'Submit', hi: 'सबमिट करें', as: 'দাখিল কৰক', mni: 'পীরকউ', mz: 'Thawn rawh' },
  retry: { en: 'Retry', hi: 'फिर कोशिश करें', as: 'পুনৰ চেষ্টা কৰক', mni: 'অমুক্তা হন্না তৌ', mz: 'Tih leh rawh' },
  next_level: { en: 'Next Level', hi: 'अगला स्तर', as: 'পৰৱৰ্তী স্তৰ', mni: 'মথংগী লেভেল', mz: 'Level dawt' },
  main_menu: { en: 'Main Menu', hi: 'मुख्य मेनू', as: 'মুখ্য মেনু', mni: 'মপুং মেনু', mz: 'Main Menu' },
  level_word: { en: 'Level', hi: 'स्तर', as: 'স্তৰ', mni: 'লেভেল', mz: 'Level' },
  pattern_great_job_desc: { en: 'You matched the pattern.', hi: 'आपने पैटर्न से मिलान किया।', as: 'আপুনি আকৃতিৰ সৈতে মিল খুৱাইছে।', mni: 'নহাক্না পাত্তেৰ্ন অদুগা চান্নবা লৈরে।', mz: 'Pattern kha i zo dawn a ni.' },
  pattern_almost_there: { en: 'Almost there!', hi: 'लगभग हो गया!', as: 'প্ৰায় হৈ গ\'ল!', mni: 'য়েংনা লোইরগনি!', mz: 'A vaibawn zo tawh!' },
  pattern_some_incorrect: { en: 'Some cells are different. Try again.', hi: 'कुछ सेल अलग हैं। फिर कोशिश करें।', as: 'কিছুমান কোষ বেলেগ। পুনৰ চেষ্টা কৰক।', mni: 'সেল খরা তোঙান তোঙানবা লৈরি। অমুক্তা হন্না তৌ।', mz: 'Cell ṭhenkhat a dang. Tih leh rawh.' },
  pattern_level_completed: { en: 'Level Completed!', hi: 'स्तर पूरा हुआ!', as: 'স্তৰ সম্পূৰ্ণ হ\'ল!', mni: 'লেভেল লোইশিনখ্রে!', mz: 'Level i zo tawh!' },

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
