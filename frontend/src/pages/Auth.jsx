import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api/client.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useSettings } from '../context/SettingsContext.jsx'
import { LANGUAGES, LANGUAGE_NAME_BY_CODE } from '../i18n/translations.js'

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
  const { t } = useSettings()
  const [step, setStep] = useState(1)
  const [identifier, setIdentifier] = useState('')
  const [otp, setOtp] = useState('')

  return (
    <div>
      <p className="text-ink-soft text-sm mb-4">
        {t('demo_reset_notice_prefix')} {role === 'caregiver' ? t('email_label').toLowerCase() : t('username_word')} {t('demo_reset_notice_suffix')}
      </p>
      {step === 1 ? (
        <>
          <Field label={role === 'caregiver' ? t('email_label') : t('username_word')} value={identifier} onChange={(e) => setIdentifier(e.target.value)} />
          <button
            onClick={() => identifier && setStep(2)}
            className="w-full py-3 rounded-lg bg-primary text-white font-semibold"
          >
            {t('send_otp')}
          </button>
        </>
      ) : (
        <>
          <Field label={t('enter_otp')} value={otp} onChange={(e) => setOtp(e.target.value)} placeholder={t('otp_placeholder')} />
          <button
            onClick={onBack}
            className="w-full py-3 rounded-lg bg-primary text-white font-semibold"
          >
            {t('reset_and_continue')}
          </button>
        </>
      )}
      <button onClick={onBack} className="mt-4 text-sm font-semibold text-ink-soft">{t('back_to_login')}</button>
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
  const { t, language } = useSettings()

  const [role, setRole] = useState('patient') // patient | caregiver
  const [tab, setTab] = useState('login') // login | register
  const [forgot, setForgot] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const [patientLogin, setPatientLogin] = useState({ username: '', pin: '' })
  const [patientRegister, setPatientRegister] = useState({ name: '', age: '', gender: 'Female', language: LANGUAGE_NAME_BY_CODE[language] || 'Assamese', username: '', pin: '' })
  const [cgLogin, setCgLogin] = useState({ email: '', password: '' })
  const [cgRegister, setCgRegister] = useState({ name: '', email: '', phone: '', password: '' })

  // Keep the registration form's "Preferred language" field in sync with the
  // UI language the patient just picked (e.g. selecting Assamese above
  // auto-selects "Assamese" here too) — the patient can still change it
  // manually afterward if their spoken language differs from the UI language.
  useEffect(() => {
    const mapped = LANGUAGE_NAME_BY_CODE[language]
    if (mapped) setPatientRegister((p) => ({ ...p, language: mapped }))
  }, [language])

  async function submitPatientLogin(e) {
    e.preventDefault()
    loginAsPatient('dummy-patient-id', patientLogin.username || 'Demo Patient')
    navigate('/home')
  }

  async function submitPatientRegister(e) {
    e.preventDefault()
    loginAsPatient('dummy-patient-id', patientRegister.name || 'Demo Patient')
    navigate('/home')
  }

  async function submitCaregiverLogin(e) {
    e.preventDefault()
    loginAsCaregiver('dummy-cg-id', 'dummy-token')
    navigate('/dashboard')
  }

  async function submitCaregiverRegister(e) {
    e.preventDefault()
    loginAsCaregiver('dummy-cg-id', 'dummy-token')
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex items-center justify-between px-6 py-4">
        <span className="serif text-xl text-primary-dark">Smriti</span>
        <Link to="/" className="text-sm font-semibold text-ink-soft">{t('back_to_home')}</Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 pb-10">
        <div className="bg-surface border border-line rounded-2xl shadow-lg p-8 w-full max-w-md">
          {!forgot ? (
            <>
              <h2 className="text-2xl mb-1">
                {role === 'patient' ? (tab === 'login' ? t('welcome_back') : t('create_your_profile')) : tab === 'login' ? t('caregiver_login_title') : t('create_caregiver_account')}
              </h2>
              <p className="text-ink-soft text-sm mb-6">
                {role === 'patient' ? (tab === 'login' ? t('patient_login') : t('patient_register_subtitle')) : t('caregiver_subtitle')}
              </p>

              <div className="flex gap-2 mb-4">
                {['patient', 'caregiver'].map((r) => (
                  <button
                    key={r}
                    onClick={() => { setRole(r); setTab('login'); setError('') }}
                    className={`flex-1 py-2 rounded-lg font-semibold text-sm ${role === r ? 'bg-primary text-white' : 'bg-primary-tint text-ink-soft'}`}
                  >
                    {r === 'patient' ? `🧓 ${t('role_patient')}` : `🧑‍⚕️ ${t('role_caregiver')}`}
                  </button>
                ))}
              </div>

              <div className="flex gap-2 mb-6 border-b border-line">
                {['login', 'register'].map((t2) => (
                  <button
                    key={t2}
                    onClick={() => { setTab(t2); setError('') }}
                    className={`px-4 py-2 text-sm font-semibold border-b-2 -mb-px ${tab === t2 ? 'border-primary text-primary' : 'border-transparent text-ink-faint'}`}
                  >
                    {t2 === 'login' ? t('tab_login') : t('tab_register')}
                  </button>
                ))}
              </div>

              {role === 'patient' && <AccessibilityControls />}

              {role === 'patient' && tab === 'login' && (
                <form onSubmit={submitPatientLogin}>
                  <Field label={t('patient_id_username')} placeholder="e.g. dipali01" required
                    value={patientLogin.username} onChange={(e) => setPatientLogin({ ...patientLogin, username: e.target.value })} />
                  <Field label={t('pin_label')} type="password" placeholder={t('four_digit_pin')} required
                    value={patientLogin.pin} onChange={(e) => setPatientLogin({ ...patientLogin, pin: e.target.value })} />
                  <button type="button" onClick={() => setForgot(true)} className="text-sm text-accent font-semibold mb-3 block">{t('forgot_pin')}</button>
                  {error && <p className="text-clay text-sm mb-3">{error}</p>}
                  <button disabled={busy} className="w-full py-3 rounded-lg bg-primary text-white font-semibold disabled:opacity-60">
                    {busy ? t('logging_in') : t('log_in')}
                  </button>
                  <p className="text-xs text-ink-faint mt-4">
                    Demo accounts: <b>dipali01</b>, <b>temjen01</b>, <b>lalrin01</b>, <b>ibemhal01</b> — PIN <b>1234</b>.
                  </p>
                </form>
              )}

              {role === 'patient' && tab === 'register' && (
                <form onSubmit={submitPatientRegister}>
                  <Field label={t('full_name')} required value={patientRegister.name} onChange={(e) => setPatientRegister({ ...patientRegister, name: e.target.value })} />
                  <Field label={t('age_label')} type="number" min="40" max="110" required value={patientRegister.age} onChange={(e) => setPatientRegister({ ...patientRegister, age: e.target.value })} />
                  <label className="block mb-4 text-left">
                    <span className="block text-sm font-semibold text-ink-soft mb-1">{t('gender_label')}</span>
                    <select className="w-full border border-line rounded-lg px-4 py-3" value={patientRegister.gender} onChange={(e) => setPatientRegister({ ...patientRegister, gender: e.target.value })}>
                      <option value="Female">{t('gender_female')}</option>
                      <option value="Male">{t('gender_male')}</option>
                      <option value="Other">{t('gender_other')}</option>
                    </select>
                  </label>
                  <label className="block mb-4 text-left">
                    <span className="block text-sm font-semibold text-ink-soft mb-1">{t('preferred_language_label')}</span>
                    <select className="w-full border border-line rounded-lg px-4 py-3" value={patientRegister.language} onChange={(e) => setPatientRegister({ ...patientRegister, language: e.target.value })}>
                      <option>Assamese</option><option>Manipuri</option><option>Bodo</option><option>Khasi</option><option>Mizo</option><option>Ao Naga</option><option>Nepali</option><option>Hindi</option><option>English</option>
                    </select>
                  </label>
                  <Field label={t('choose_username')} required value={patientRegister.username} onChange={(e) => setPatientRegister({ ...patientRegister, username: e.target.value })} />
                  <Field label={t('choose_pin')} type="password" required value={patientRegister.pin} onChange={(e) => setPatientRegister({ ...patientRegister, pin: e.target.value })} />
                  {error && <p className="text-clay text-sm mb-3">{error}</p>}
                  <button disabled={busy} className="w-full py-3 rounded-lg bg-primary text-white font-semibold disabled:opacity-60">
                    {busy ? t('creating') : t('create_my_profile')}
                  </button>
                  <p className="text-xs text-ink-faint mt-4">{t('caregiver_link_later')}</p>
                </form>
              )}

              {role === 'caregiver' && tab === 'login' && (
                <form onSubmit={submitCaregiverLogin}>
                  <Field label={t('email_label')} type="email" placeholder="you@example.com" required
                    value={cgLogin.email} onChange={(e) => setCgLogin({ ...cgLogin, email: e.target.value })} />
                  <Field label={t('password_label')} type="password" required
                    value={cgLogin.password} onChange={(e) => setCgLogin({ ...cgLogin, password: e.target.value })} />
                  <button type="button" onClick={() => setForgot(true)} className="text-sm text-accent font-semibold mb-3 block">{t('forgot_password')}</button>
                  {error && <p className="text-clay text-sm mb-3">{error}</p>}
                  <button disabled={busy} className="w-full py-3 rounded-lg bg-primary text-white font-semibold disabled:opacity-60">
                    {busy ? t('logging_in') : t('log_in_to_dashboard')}
                  </button>
                  <p className="text-xs text-ink-faint mt-4">Demo caregiver: <b>demo@smriti.care</b> — password <b>demo123</b>.</p>
                </form>
              )}

              {role === 'caregiver' && tab === 'register' && (
                <form onSubmit={submitCaregiverRegister}>
                  <Field label={t('full_name')} required value={cgRegister.name} onChange={(e) => setCgRegister({ ...cgRegister, name: e.target.value })} />
                  <Field label={t('email_label')} type="email" required value={cgRegister.email} onChange={(e) => setCgRegister({ ...cgRegister, email: e.target.value })} />
                  <Field label={t('phone_number')} required value={cgRegister.phone} onChange={(e) => setCgRegister({ ...cgRegister, phone: e.target.value })} />
                  <Field label={t('password_label')} type="password" required value={cgRegister.password} onChange={(e) => setCgRegister({ ...cgRegister, password: e.target.value })} />
                  {error && <p className="text-clay text-sm mb-3">{error}</p>}
                  <button disabled={busy} className="w-full py-3 rounded-lg bg-primary text-white font-semibold disabled:opacity-60">
                    {busy ? t('creating') : t('create_account')}
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
