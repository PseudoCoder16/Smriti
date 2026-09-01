// Simple, non-representational voice-assistant avatar (a friendly face, not
// depicting any specific person) used wherever the app "speaks" a prompt to
// the patient — currently the check-in screen. `speaking` just toggles a
// gentle pulse ring; there is no animation/lip-sync to keep this light.
export default function PatientAvatar({ message, speaking = false }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`w-20 h-20 rounded-full bg-primary-tint flex items-center justify-center text-4xl border-4 transition ${
          speaking ? 'border-accent animate-pulse' : 'border-primary-tint'
        }`}
        aria-hidden="true"
      >
        🙂
      </div>
      {message && (
        <div className="bg-surface border border-line rounded-2xl px-4 py-3 max-w-xs text-center text-sm text-ink shadow-sm">
          {message}
        </div>
      )}
    </div>
  )
}
