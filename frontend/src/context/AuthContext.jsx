import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

function loadSession() {
  try {
    return JSON.parse(localStorage.getItem('smriti_session') || 'null')
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(loadSession)

  useEffect(() => {
    if (session) localStorage.setItem('smriti_session', JSON.stringify(session))
    else localStorage.removeItem('smriti_session')
  }, [session])

  const loginAsPatient = (patient_id, name) => setSession({ role: 'patient', patient_id, name })
  const loginAsCaregiver = (caregiver_id, token) => setSession({ role: 'caregiver', caregiver_id, token })
  const logout = () => setSession(null)

  return (
    <AuthContext.Provider value={{ session, loginAsPatient, loginAsCaregiver, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
