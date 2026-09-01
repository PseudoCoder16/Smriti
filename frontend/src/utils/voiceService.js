// Centralized voice service for Smriti — TTS + STT behind one API, so
// components never touch the Web Speech API directly.
//
// HONEST CAPABILITY NOTES (do not overclaim beyond these):
// - speechSynthesis (TTS) genuinely runs on-device/offline in every browser
//   that implements it — no network is needed once a voice is installed.
// - SpeechRecognition (STT) in most browsers (including Chrome's
//   webkitSpeechRecognition) is NOT on-device — it streams audio to a cloud
//   recognition service, despite living in a browser API. A small number of
//   very recent Chrome builds expose experimental on-device hooks
//   (`processLocally`, `SpeechRecognition.available()`, `.install()`); this
//   service opportunistically uses them when present but never assumes they
//   exist. Where they're absent, STT requires a network connection — the
//   offline guarantee for this app is that buttons/text always work
//   regardless of whether voice does.
// - `isSTTAvailable(language)` is a coarse *browser-level* feature check
//   (does a recognition engine exist at all). The Web Speech API gives no
//   synchronous way to know whether a specific language will actually be
//   recognized — that's only discoverable by attempting it.
// - `isTTSAvailable(language)` is a real per-language check: it inspects the
//   actual installed voice list.

export const LOCALE_MAP = {
  en: 'en-US',
  hi: 'hi-IN',
  as: 'as-IN',
  mni: 'mni-IN',
  mz: 'lus-IN', // ISO 639-3 code for Mizo is "lus" — the app's own language
  // code stays "mz" everywhere else (Phase 4 decision), this is only the
  // BCP-47 tag handed to the browser's speech APIs.
}

// Maps a "fixed phrase" key (matching i18n/translations.js keys where
// possible) to a local recorded-audio filename, used as an offline fallback
// when no browser voice exists for the selected language. Files are not
// required to exist yet — see public/audio/voice/README.md.
function audioFallbackPath(language, phraseKey) {
  return `/audio/voice/${language}/${phraseKey}.mp3`
}

// --- TTS ---------------------------------------------------------------

let cachedVoices = []
function refreshVoices() {
  try {
    cachedVoices = window.speechSynthesis.getVoices()
  } catch {
    cachedVoices = []
  }
}
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  refreshVoices()
  window.speechSynthesis.onvoiceschanged = refreshVoices
}

// The Web Speech API exposes no structured gender field on SpeechSynthesisVoice
// — name-based sniffing is the only signal available, and it's best-effort:
// absent a hint, we fall back to whatever voice matched the language.
const FEMALE_NAME_HINTS = ['female', 'woman', 'zira', 'susan', 'samantha', 'victoria', 'karen', 'moira', 'tessa', 'veena', 'heera', 'lekha']

function isLikelyFemaleVoice(voice) {
  const name = voice.name?.toLowerCase() || ''
  return FEMALE_NAME_HINTS.some((hint) => name.includes(hint))
}

function findVoice(language) {
  const bcp47 = LOCALE_MAP[language]
  if (!bcp47) return null
  const prefix = bcp47.split('-')[0].toLowerCase()
  const candidates = cachedVoices.filter((v) => v.lang?.toLowerCase() === bcp47.toLowerCase())
  const prefixCandidates = candidates.length
    ? candidates
    : cachedVoices.filter((v) => v.lang?.toLowerCase().startsWith(prefix))
  if (!prefixCandidates.length) return null
  return prefixCandidates.find(isLikelyFemaleVoice) || prefixCandidates[0]
}

export function isTTSAvailable(language) {
  return Boolean(typeof window !== 'undefined' && 'speechSynthesis' in window && findVoice(language))
}

let fallbackAudio = null

/**
 * Speak `text` in `language`. Optionally pass `phraseKey` for one of the
 * fixed, pre-defined Smriti phrases (see VOICE_PHRASE_KEYS below) so a local
 * recorded file can be used if no browser voice covers this language.
 * Never throws; a total absence of voice capability is a silent no-op —
 * the calling screen already shows the text on its own.
 */
export function speak(text, language = 'en', phraseKey = null) {
  try {
    if (!text || typeof window === 'undefined') return

    if ('speechSynthesis' in window) {
      const voice = findVoice(language)
      if (voice) {
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.voice = voice
        utterance.lang = voice.lang
        utterance.rate = 0.95
        utterance.pitch = 1.0
        window.speechSynthesis.cancel()
        window.speechSynthesis.speak(utterance)
        return
      }
    }

    // No matching browser voice for this language — try a local recording
    // for known fixed phrases (silently does nothing if the file is missing).
    if (phraseKey) {
      fallbackAudio?.pause()
      fallbackAudio = new Audio(audioFallbackPath(language, phraseKey))
      fallbackAudio.play().catch(() => {
        // File not present yet, or playback blocked — text is already visible, so no-op.
      })
    }
  } catch {
    // Speech synthesis failed for any reason — never let voice break the app.
  }
}

/** Stops any in-progress speech (browser TTS and/or the recorded-audio fallback). */
export function stopSpeaking() {
  try {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel()
  } catch {
    // Ignore — nothing was speaking or the API is unavailable.
  }
  try {
    fallbackAudio?.pause()
  } catch {
    // Ignore.
  }
}

// --- STT -----------------------------------------------------------------

const SpeechRecognitionCtor =
  typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : null

export function isSTTAvailable(language) {
  return Boolean(SpeechRecognitionCtor) && Boolean(LOCALE_MAP[language])
}

/**
 * One-shot speech capture. Resolves (never rejects) with:
 *   { ok: true,  text: string }
 *   { ok: false, reason: 'unsupported' | 'not-allowed' | 'no-speech' |
 *                        'network' | 'timeout' | 'start-failed' | string, text: null }
 */
export function listen(language = 'en', { timeoutMs = 8000 } = {}) {
  return new Promise((resolve) => {
    if (!SpeechRecognitionCtor) {
      resolve({ ok: false, reason: 'unsupported', text: null })
      return
    }

    const recognition = new SpeechRecognitionCtor()
    recognition.lang = LOCALE_MAP[language] || LOCALE_MAP.en
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    // Best-effort on-device hint. Experimental API, absent on almost every
    // browser today — guarded so it never throws when unsupported.
    try {
      if ('processLocally' in recognition) recognition.processLocally = true
    } catch {
      // Ignore — not supported on this engine.
    }

    let settled = false
    const finish = (result) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      resolve(result)
    }

    const timer = setTimeout(() => {
      try {
        recognition.stop()
      } catch {
        // Already stopped.
      }
      finish({ ok: false, reason: 'timeout', text: null })
    }, timeoutMs)

    recognition.onresult = (e) => {
      const transcript = e.results?.[0]?.[0]?.transcript ?? ''
      finish({ ok: true, reason: null, text: normalizeTranscript(transcript) })
    }
    recognition.onerror = (e) => {
      finish({ ok: false, reason: e.error || 'error', text: null })
    }
    recognition.onend = () => {
      finish({ ok: false, reason: 'no-speech', text: null })
    }

    try {
      recognition.start()
    } catch {
      finish({ ok: false, reason: 'start-failed', text: null })
    }
  })
}

// --- Answer normalization / matching --------------------------------------

/** Lowercases, strips punctuation, and collapses whitespace. */
export function normalizeTranscript(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[.,!?;:'"()]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

const YES_NO_SYNONYMS = {
  yes: ['yes', 'yeah', 'yep', 'i remember', 'remember'],
  not_sure: ['not sure', 'unsure', 'maybe', 'dont know', "don't know"],
}

/**
 * Maps free-form recognized speech onto the 3 existing Song Recognition /
 * Family Memory response intents ('yes' | 'not_sure' | 'told_more').
 * Anything not clearly "yes" or "not sure" is treated as 'told_more' —
 * the exact same fallback behavior the app already had before voice
 * intent-matching existed (free-form speech = "the patient told us more").
 */
export function matchYesNoIntent(transcript) {
  const norm = normalizeTranscript(transcript)
  if (!norm) return 'told_more'
  if (YES_NO_SYNONYMS.yes.some((w) => norm.includes(w))) return 'yes'
  if (YES_NO_SYNONYMS.not_sure.some((w) => norm.includes(w))) return 'not_sure'
  return 'told_more'
}

const ENGLISH_MOOD_SYNONYMS = {
  Good: ['good', 'great', 'fine', 'happy', 'nice', 'wonderful'],
  Okay: ['okay', 'ok', 'alright', 'so so', 'so-so'],
  'Not Good': ['bad', 'sad', 'not good', 'terrible', 'unwell', 'tired'],
}

/**
 * Maps recognized speech to one of the check-in moods ('Good' | 'Okay' |
 * 'Not Good'), or null if nothing matched. `labels` (optional) supplies the
 * currently-displayed translated word for each mood (e.g. t('good')) so a
 * patient's own-language answer is matched too, without this service
 * needing its own separate translation dictionary.
 */
export function matchMoodIntent(transcript, labels = {}) {
  const norm = normalizeTranscript(transcript)
  if (!norm) return null

  const candidates = [
    { mood: 'Good', words: [labels.good, ...ENGLISH_MOOD_SYNONYMS.Good] },
    { mood: 'Okay', words: [labels.okay, ...ENGLISH_MOOD_SYNONYMS.Okay] },
    { mood: 'Not Good', words: [labels.not_good, ...ENGLISH_MOOD_SYNONYMS['Not Good']] },
  ]

  for (const { mood, words } of candidates) {
    if (words.filter(Boolean).some((w) => norm.includes(normalizeTranscript(w)))) return mood
  }
  return null
}
