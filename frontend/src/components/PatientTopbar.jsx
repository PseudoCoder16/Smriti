import { useNavigate } from 'react-router-dom'

export default function PatientTopbar({ title, back = '/home' }) {
  const navigate = useNavigate()
  return (
    <div className="flex items-center gap-3 px-6 py-4 border-b border-line bg-surface">
      <button
        onClick={() => navigate(back)}
        className="w-10 h-10 rounded-full bg-primary-tint text-primary text-lg flex items-center justify-center hover:bg-line"
        aria-label="Back"
      >
        🏠
      </button>
      <h1 className="text-xl serif text-ink">{title}</h1>
    </div>
  )
}
