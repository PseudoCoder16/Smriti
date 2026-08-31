import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api/client.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useSettings } from '../context/SettingsContext.jsx'
import { LANGUAGES } from '../i18n/translations.js'

function Field({ label, ...props }) {
  return (
    <label className="block mb-4 text-left">
      <span className="block text-sm font-semibold text-ink-soft mb-1">{label}</span>
      <input
        {...props}
        className="w-full border border-line rounded-lg px-4 py-3 text-ink focus:outline-none focus:border-primary"
      />
    </label>
  )
}

function ForgotFlow({ role, onBack }) {
  const [step, setStep] = useState(1)
  const [identifier, setIdentifier] = useState('')
  const [otp, setOtp] = useState('')

  return (
    <div>
      <p className="text-ink-soft text-sm mb-4">
        Demo only — not wired to the backend yet. Enter your {role === 'caregiver' ? 'email' : 'username'} to see the mock reset flow.
      </p>
      {step === 1 ? (
        <>
          <Field label={role === 'caregiver' ? 'Email' : 'Username'} value={identifier} onChange={(e) => setIdentifier(e.target.value)} />
          <button
            onClick={() => identifier && setStep(2)}
            className="w-full py-3 rounded-lg bg-primary text-white font-semibold"
          >
            Send OTP
          </button>
        </>
      ) : (
        <>
          <Field label="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="4-6 digit code" />
          <button
            onClick={onBack}
            className="w-full py-3 rounded-lg bg-primary text-white font-semibold"
          >
            Reset & Continue
          </button>
        </>
      )}
      <button onClick={onBack} className="mt-4 text-sm font-semibold text-ink-soft">← Back to login</button>
    </div>
  )
}

function AccessibilityControls() {
  const { simpleMode, setSimpleMode, language, setLanguage, t } = useSettings()
  return (
    <div className="mb-6 flex flex-col gap-3 bg-primary-tint rounded-xl p-4">
      <label className="flex items-center justify-between cursor-pointer">
        <span className="font-semibold text-primary text-sm">{t('simple_mode')}</span>
        <input type="checkbox" checked={simpleMode} onChange={(e) => setSimpleMode(e.target.checked)} className="w-5 h-5" />
      </label>
      <label className="block">
        <span className="block text-sm font-semibold text-primary mb-1">{t('choose_language')}</span>
        <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full border border-line rounded-lg px-3 py-2 text-sm">
          {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
        </select>
      </label>
    </div>
  )
}

export default function Auth() {
  const navigate = useNavigate()
  const { loginAsPatient, loginAsCaregiver } = useAuth()
  const { t } = useSettings()

  const [role, setRole] = useState('patient') // patient | caregiver
  const [tab, setTab] = useState('login') // login | register
  const [forgot, setForgot] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const [patientLogin, setPatientLogin] = useState({ username: '', pin: '' })
  const [patientRegister, setPatientRegister] = useState({ name: '', age: '', gender: 'Female', language: 'Assamese', username: '', pin: '' })
  const [cgLogin, setCgLogin] = useState({ email: '', password: '' })
  const [cgRegister, setCgRegister] = useState({ name: '', email: '', phone: '', password: '' })

  async function submitPatientLogin(e) {
    e.preventDefault()
    setError(''); setBusy(true)
    try {
      const res = await api.post('/login/patient', patientLogin)
      loginAsPatient(res.patient_id, res.name)
      navigate('/home')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function submitPatientRegister(e) {
    e.preventDefault()
    setError(''); setBusy(true)
    try {
      const res = await api.post('/register/patient/self', {
        name: patientRegister.name,
        age: Number(patientRegister.age),
        gender: patientRegister.gender,
        language: patientRegister.language,
        username: patientRegister.username.toLowerCase(),
        pin: patientRegister.pin,
      })
      loginAsPatient(res.patient_id, res.name)
      navigate('/home')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function submitCaregiverLogin(e) {
    e.preventDefault()
    setError(''); setBusy(true)
    try {
      const res = await api.post('/login/caregiver', cgLogin)
      loginAsCaregiver(res.caregiver_id, res.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function submitCaregiverRegister(e) {
    e.preventDefault()
    setError(''); setBusy(true)
    try {
      const res = await api.post('/register/caregiver', {
        name: cgRegister.name,
        email: cgRegister.email,
        phone: cgRegister.phone,
        password: cgRegister.password,
      })
      loginAsCaregiver(res.caregiver_id, res.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex items-center justify-between px-6 py-4">
        <span className="serif text-xl text-primary-dark">Smriti</span>
        <Link to="/" className="text-sm font-semibold text-ink-soft">← Back to home</Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 pb-10">
        <div className="bg-surface border border-line rounded-2xl shadow-lg p-8 w-full max-w-md">
          {!forgot ? (
            <>
              <h2 className="text-2xl mb-1">
                {role === 'patient' ? (tab === 'login' ? 'Welcome back' : 'Create your profile') : tab === 'login' ? 'Caregiver login' : 'Create a caregiver account'}
              </h2>
              <p className="text-ink-soft text-sm mb-6">
                {role === 'patient' ? (tab === 'login' ? t('patient_login') : 'A few details to get you started — no caregiver needed.') : 'Monitor and support your patients.'}
              </p>

              <div className="flex gap-2 mb-4">
                {['patient', 'caregiver'].map((r) => (
                  <button
                    key={r}
                    onClick={() => { setRole(r); setTab('login'); setError('') }}
                    className={`flex-1 py-2 rounded-lg font-semibold text-sm capitalize ${role === r ? 'bg-primary text-white' : 'bg-primary-tint text-ink-soft'}`}
                  >
                    {r === 'patient' ? '🧓 Patient' : '🧑‍⚕️ Caregiver'}
                  </button>
                ))}
              </div>

              <div className="flex gap-2 mb-6 border-b border-line">
                {['login', 'register'].map((t2) => (
                  <button
                    key={t2}
                    onClick={() => { setTab(t2); setError('') }}
                    className={`px-4 py-2 text-sm font-semibold capitalize border-b-2 -mb-px ${tab === t2 ? 'border-primary text-primary' : 'border-transparent text-ink-faint'}`}
                  >
                    {t2}
                  </button>
                ))}
              </div>

              {role === 'patient' && <AccessibilityControls />}

              {role === 'patient' && tab === 'login' && (
                <form onSubmit={submitPatientLogin}>
                  <Field label="Patient ID / Username" placeholder="e.g. dipali01" required
                    value={patientLogin.username} onChange={(e) => setPatientLogin({ ...patientLogin, username: e.target.value })} />
                  <Field label="PIN" type="password" placeholder="4-digit PIN" required
                    value={patientLogin.pin} onChange={(e) => setPatientLogin({ ...patientLogin, pin: e.target.value })} />
                  <button type="button" onClick={() => setForgot(true)} className="text-sm text-accent font-semibold mb-3 block">Forgot PIN?</button>
                  {error && <p className="text-clay text-sm mb-3">{error}</p>}
                  <button disabled={busy} className="w-full py-3 rounded-lg bg-primary text-white font-semibold disabled:opacity-60">
                    {busy ? 'Logging in…' : 'Log in'}
                  </button>
                  <p className="text-xs text-ink-faint mt-4">
                    Demo accounts: <b>dipali01</b>, <b>temjen01</b>, <b>lalrin01</b>, <b>ibemhal01</b> — PIN <b>1234</b>.
                  </p>
                </form>
              )}

              {role === 'patient' && tab === 'register' && (
                <form onSubmit={submitPatientRegister}>
                  <Field label="Full name" required value={patientRegister.name} onChange={(e) => setPatientRegister({ ...patientRegister, name: e.target.value })} />
                  <Field label="Age" type="number" min="40" max="110" required value={patientRegister.age} onChange={(e) => setPatientRegister({ ...patientRegister, age: e.target.value })} />
                  <label className="block mb-4 text-left">
                    <span className="block text-sm font-semibold text-ink-soft mb-1">Gender</span>
                    <select className="w-full border border-line rounded-lg px-4 py-3" value={patientRegister.gender} onChange={(e) => setPatientRegister({ ...patientRegister, gender: e.target.value })}>
                      <option>Female</option><option>Male</option><option>Other</option>
                    </select>
                  </label>
                  <label className="block mb-4 text-left">
                    <span className="block text-sm font-semibold text-ink-soft mb-1">Preferred language</span>
                    <select className="w-full border border-line rounded-lg px-4 py-3" value={patientRegister.language} onChange={(e) => setPatientRegister({ ...patientRegister, language: e.target.value })}>
                      <option>Assamese</option><option>Manipuri</option><option>Bodo</option><option>Khasi</option><option>Mizo</option><option>Ao Naga</option><option>Nepali</option><option>Hindi</option><option>English</option>
                    </select>
                  </label>
                  <Field label="Choose a username" required value={patientRegister.username} onChange={(e) => setPatientRegister({ ...patientRegister, username: e.target.value })} />
                  <Field label="Choose a PIN" type="password" required value={patientRegister.pin} onChange={(e) => setPatientRegister({ ...patientRegister, pin: e.target.value })} />
                  {error && <p className="text-clay text-sm mb-3">{error}</p>}
                  <button disabled={busy} className="w-full py-3 rounded-lg bg-primary text-white font-semibold disabled:opacity-60">
                    {busy ? 'Creating…' : 'Create my profile'}
                  </button>
                  <p className="text-xs text-ink-faint mt-4">A caregiver can link your profile to their dashboard later.</p>
                </form>
              )}

              {role === 'caregiver' && tab === 'login' && (
                <form onSubmit={submitCaregiverLogin}>
                  <Field label="Email" type="email" placeholder="you@example.com" required
                    value={cgLogin.email} onChange={(e) => setCgLogin({ ...cgLogin, email: e.target.value })} />
                  <Field label="Password" type="password" required
                    value={cgLogin.password} onChange={(e) => setCgLogin({ ...cgLogin, password: e.target.value })} />
                  <button type="button" onClick={() => setForgot(true)} className="text-sm text-accent font-semibold mb-3 block">Forgot password?</button>
                  {error && <p className="text-clay text-sm mb-3">{error}</p>}
                  <button disabled={busy} className="w-full py-3 rounded-lg bg-primary text-white font-semibold disabled:opacity-60">
                    {busy ? 'Logging in…' : 'Log in to dashboard'}
                  </button>
                  <p className="text-xs text-ink-faint mt-4">Demo caregiver: <b>demo@smriti.care</b> — password <b>demo123</b>.</p>
                </form>
              )}

              {role === 'caregiver' && tab === 'register' && (
                <form onSubmit={submitCaregiverRegister}>
                  <Field label="Full name" required value={cgRegister.name} onChange={(e) => setCgRegister({ ...cgRegister, name: e.target.value })} />
                  <Field label="Email" type="email" required value={cgRegister.email} onChange={(e) => setCgRegister({ ...cgRegister, email: e.target.value })} />
                  <Field label="Phone number" required value={cgRegister.phone} onChange={(e) => setCgRegister({ ...cgRegister, phone: e.target.value })} />
                  <Field label="Password" type="password" required value={cgRegister.password} onChange={(e) => setCgRegister({ ...cgRegister, password: e.target.value })} />
                  {error && <p className="text-clay text-sm mb-3">{error}</p>}
                  <button disabled={busy} className="w-full py-3 rounded-lg bg-primary text-white font-semibold disabled:opacity-60">
                    {busy ? 'Creating…' : 'Create account'}
                  </button>
                </form>
              )}
            </>
          ) : (
            <ForgotFlow role={role} onBack={() => setForgot(false)} />
          )}
        </div>
      </div>
    </div>
  )
}
