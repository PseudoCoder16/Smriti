import { Link } from 'react-router-dom'

const GAMES = [
  { emoji: '🃏', name: 'Memory Match', sub: 'Recall & pairing' },
  { emoji: '🔷', name: 'Pattern Recognition', sub: 'Attention & focus' },
  { emoji: '🪥', name: 'Daily Routine Recall', sub: 'Sequencing memory' },
  { emoji: '🍃', name: 'Tea Leaf Sorting', sub: 'Visual discrimination' },
  { emoji: '🥁', name: 'Rhythm & Tap', sub: 'Auditory & motor timing' },
]

const FEATURES = [
  ['🧠', 'AI-adaptive difficulty'],
  ['🗣️', 'Multilingual voice guidance'],
  ['🎋', 'Culturally rooted themes'],
  ['📈', 'Caregiver dashboard'],
  ['📶', 'Offline-first sync'],
  ['🔒', 'Secure patient data'],
]

export default function Landing() {
  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-10 bg-bg/90 backdrop-blur border-b border-line">
        <div className="max-w-6xl mx-auto px-7 py-4 flex items-center justify-between">
          <span className="serif text-xl text-primary-dark">Smriti</span>
          <div className="hidden sm:flex gap-8 text-sm font-semibold text-ink-soft">
            <a href="#games" className="hover:text-primary">Games</a>
            <a href="#features" className="hover:text-primary">Why Smriti</a>
          </div>
          <Link to="/auth" className="px-6 py-3 rounded-lg bg-primary text-white font-semibold text-sm">
            Login / Register
          </Link>
        </div>
      </nav>

      <section className="text-center pt-16 pb-4">
        <div
          className="serif italic font-semibold text-[clamp(3.2rem,9vw,6.5rem)] leading-none bg-clip-text text-transparent"
          style={{ backgroundImage: 'linear-gradient(100deg, var(--color-primary) 8%, var(--color-accent) 55%, var(--color-primary) 100%)' }}
        >
          smriti
        </div>
        <p className="text-ink-soft mt-2">memory, made gentle</p>
      </section>

      <section id="games" className="max-w-6xl mx-auto px-7 py-14">
        <div className="text-center mb-8">
          <div className="uppercase text-xs font-bold tracking-wide text-accent mb-2">Inside the platform</div>
          <h2 className="text-3xl mb-2">Five cognitive games, one gentle routine</h2>
          <p className="text-ink-soft">Each game targets a different cognitive domain — memory, attention, sequencing, discrimination and motor timing.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {GAMES.map((g) => (
            <div key={g.name} className="bg-surface border border-line rounded-2xl px-6 py-5 text-center w-44">
              <div className="text-3xl mb-2">{g.emoji}</div>
              <h4 className="font-semibold text-sm">{g.name}</h4>
              <p className="text-xs text-ink-faint">{g.sub}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="max-w-6xl mx-auto px-7 py-14">
        <div className="text-center mb-8">
          <div className="uppercase text-xs font-bold tracking-wide text-accent mb-2">Why Smriti</div>
          <h2 className="text-3xl mb-2">Designed around the patient, built for the caregiver</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {FEATURES.map(([emoji, label]) => (
            <div key={label} className="bg-surface border border-line rounded-2xl p-6 text-center">
              <div className="text-2xl mb-2">{emoji}</div>
              <h3 className="text-sm font-semibold">{label}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-primary text-white">
        <div className="max-w-6xl mx-auto px-7 py-14 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl mb-2">Ready to try it with a patient or as a caregiver?</h2>
            <p className="text-white/80">No installation needed — works right in the browser.</p>
          </div>
          <Link to="/auth" className="px-8 py-4 rounded-lg bg-accent text-white font-semibold whitespace-nowrap">
            Get Started
          </Link>
        </div>
      </section>

      <footer className="text-center text-ink-faint text-sm py-8">© 2026 Smriti.</footer>
    </div>
  )
}
