// Thin wrapper around the browser's built-in Web Speech API (SpeechSynthesis).
// This is not a new voice system — it's the exact mechanism already used for
// the patient Home greeting, extracted here so other patient screens can
// reuse it (e.g. reading a caregiver message aloud). Safe no-op if the
// browser doesn't support speech synthesis.
export function speak(text) {
  try {
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(text)
      u.rate = 0.95
      u.pitch = 1.0
      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(u)
    }
  } catch {
    // Web Speech API unavailable — silently skip.
  }
}
