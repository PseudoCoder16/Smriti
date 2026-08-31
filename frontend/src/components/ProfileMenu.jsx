import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useSettings } from '../context/SettingsContext.jsx'

export default function ProfileMenu() {
  const { session, logout } = useAuth()
  const { t } = useSettings()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const first = session.name.split(' ')[0]

  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((v) => !v)} className="flex items-center gap-2">
        <span className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold">{first[0]}</span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-surface border border-line rounded-xl shadow-lg z-30 p-2">
          <div className="px-2 py-2 text-sm font-semibold text-ink border-b border-line">{first}</div>
          <button
            onClick={() => { logout(); navigate('/') }}
            className="w-full text-left px-2 py-2 text-sm text-ink-soft hover:text-primary"
          >
            {t('switch_user')}
          </button>
        </div>
      )}
    </div>
  )
}
