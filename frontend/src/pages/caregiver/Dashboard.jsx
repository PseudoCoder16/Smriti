import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { api } from '../../api/client.js'
import { useAuth } from '../../context/AuthContext.jsx'
import GamePerformanceChart from '../../components/caregiver/GamePerformanceChart.jsx'
import AIInsightCard from '../../components/caregiver/AIInsightCard.jsx'
import GameHistoryTable from '../../components/caregiver/GameHistoryTable.jsx'
import {
  mockPerformanceSummary,
  mockGamePerformance,
  mockGameHistory,
  mockAIInsight,
} from '../../data/caregiverMockData.js'
import { getFamilyMembers, addFamilyMember, removeFamilyMember } from '../../data/patientFamilyData.js'

const GAME_LABELS = {
  memory_match: 'Memory Match',
  pattern_recognition: 'Pattern Recognition',
  routine_recall: 'Daily Routine Recall',
  tea_sorting: 'Tea Leaf Sorting',
  rhythm_tap: 'Rhythm & Tap',
  color_sort: 'Color Sort',
  song_recognition: 'Music & Memory',
  family_memory: 'Remember My Story',
}

const CHECKIN_EMOJI = { Good: '🙂', Okay: '😐', 'Not Good': '🙁' }

function Field({ label, ...props }) {
  return (
    <label className="block mb-3 text-left">
      <span className="block text-xs font-semibold text-ink-soft mb-1">{label}</span>
      <input {...props} className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" />
    </label>
  )
}

function Panel({ title, children }) {
  return (
    <div className="bg-surface border border-line rounded-2xl p-6">
      <h3 className="font-semibold mb-4">{title}</h3>
      {children}
    </div>
  )
}

export default function Dashboard() {
  const { session, logout } = useAuth()
  const navigate = useNavigate()

  const [patients, setPatients] = useState([])
  const [selected, setSelected] = useState(null)
  const [profile, setProfile] = useState(null)
  const [perf, setPerf] = useState(null)
  const [games, setGames] = useState([])
  const [medicine, setMedicine] = useState([])
  const [messages, setMessages] = useState([])
  const [latestCheckin, setLatestCheckin] = useState(null)

  const [showAddPatient, setShowAddPatient] = useState(false)
  const [newPatient, setNewPatient] = useState({ name: '', age: '', gender: 'Female', language: 'Assamese', username: '', pin: '' })
  const [newMedicine, setNewMedicine] = useState({ name: '', time: '', frequency: 'Daily' })
  const [msgText, setMsgText] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState('')

  const [familyMembers, setFamilyMembers] = useState([])
  const [newMember, setNewMember] = useState({ name: '', relation: '', hobbyOrSong: '', photoDataUrl: '' })

  async function loadPatients() {
    const res = await api.get('/patient', session.token)
    setPatients(res.patients)
    if (!selected && res.patients.length) setSelected(res.patients[0].patient_id)
  }

  async function loadPatientData(id) {
    const [p, pf, g, m, msgs, ci] = await Promise.all([
      api.get(`/patient/${id}`),
      api.get(`/patient/${id}/performance`),
      api.get(`/patient/${id}/games?limit=8`),
      api.get(`/medicine/${id}`),
      api.get(`/messages/${id}`),
      api.get(`/checkin/${id}?limit=1`),
    ])
    setProfile(p); setPerf(pf); setGames(g.sessions); setMedicine(m.medicine); setMessages(msgs.messages)
    setLatestCheckin(ci.checkins[0] || null)
  }

  useEffect(() => { loadPatients() }, [])
  useEffect(() => { if (selected) loadPatientData(selected) }, [selected])
  useEffect(() => { setFamilyMembers(getFamilyMembers(selected)); setNewMember({ name: '', relation: '', hobbyOrSong: '', photoDataUrl: '' }) }, [selected])

  function handlePhotoChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setNewMember((m) => ({ ...m, photoDataUrl: reader.result }))
    reader.readAsDataURL(file)
  }

  function submitFamilyMember(e) {
    e.preventDefault()
    if (!newMember.name.trim()) return
    addFamilyMember(selected, newMember)
    setFamilyMembers(getFamilyMembers(selected))
    setNewMember({ name: '', relation: '', hobbyOrSong: '', photoDataUrl: '' })
  }

  function deleteFamilyMember(id) {
    removeFamilyMember(selected, id)
    setFamilyMembers(getFamilyMembers(selected))
  }

  const alerts = useMemo(() => {
    if (!perf) return []
    const list = []
    medicine.filter((m) => m.status !== 'taken').forEach((m) => list.push({ icon: '⚠️', text: `${m.name} pending (${m.time})` }))
    if (perf.trend.length >= 2) {
      const last = perf.trend[perf.trend.length - 1]
      const prev = perf.trend[perf.trend.length - 2]
      if (last.accuracy_pct < prev.accuracy_pct - 10) list.push({ icon: '⚠️', text: 'Recent game performance decreased' })
    }
    const today = new Date().toISOString().slice(0, 10)
    const playedToday = games.some((g) => g.timestamp.slice(0, 10) === today)
    if (!playedToday) list.push({ icon: 'ℹ️', text: "Patient hasn't completed today's activity" })
    return list
  }, [perf, medicine, games])

  async function addPatient(e) {
    e.preventDefault()
    setError('')
    try {
      await api.post('/register/patient', {
        name: newPatient.name,
        age: Number(newPatient.age),
        gender: newPatient.gender,
        language: newPatient.language,
        username: newPatient.username.toLowerCase(),
        pin: newPatient.pin,
      }, session.token)
      setShowAddPatient(false)
      setNewPatient({ name: '', age: '', gender: 'Female', language: 'Assamese', username: '', pin: '' })
      await loadPatients()
    } catch (err) {
      setError(err.message)
    }
  }

  async function addMedicine(e) {
    e.preventDefault()
    await api.post('/medicine', { patient_id: selected, ...newMedicine }, session.token)
    setNewMedicine({ name: '', time: '', frequency: 'Daily' })
    loadPatientData(selected)
  }

  async function sendMessage() {
    if (!msgText.trim()) return
    await api.post('/message', { patient_id: selected, text: msgText.trim() }, session.token)
    setMsgText('')
    setNote('Message sent to patient.')
    setTimeout(() => setNote(''), 2500)
    loadPatientData(selected)
  }

  return (
    <div className="min-h-screen">
      <div className="bg-primary-dark text-white px-6 py-4 flex items-center justify-between">
        <span className="serif text-lg">Smriti <span className="font-sans font-medium opacity-70 text-sm">— Caregiver View</span></span>
        <div className="flex items-center gap-4">
          <select value={selected || ''} onChange={(e) => setSelected(e.target.value)} className="text-ink text-sm rounded-lg px-3 py-2">
            {patients.map((p) => <option key={p.patient_id} value={p.patient_id}>{p.name}</option>)}
          </select>
          <button onClick={() => setShowAddPatient(true)} className="text-sm font-semibold bg-white/10 px-3 py-2 rounded-lg">+ Add Patient</button>
          <button onClick={() => { logout(); navigate('/') }} className="text-sm font-semibold opacity-80">Log out</button>
        </div>
      </div>

      {showAddPatient && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-20 px-4">
          <form onSubmit={addPatient} className="bg-surface rounded-2xl p-6 w-full max-w-sm">
            <h3 className="font-semibold text-lg mb-4">Add a new patient</h3>
            <Field label="Full name" required value={newPatient.name} onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })} />
            <Field label="Age" type="number" required value={newPatient.age} onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })} />
            <label className="block mb-3 text-left">
              <span className="block text-xs font-semibold text-ink-soft mb-1">Gender</span>
              <select className="w-full border border-line rounded-lg px-3 py-2 text-sm" value={newPatient.gender} onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}>
                <option>Female</option><option>Male</option><option>Other</option>
              </select>
            </label>
            <label className="block mb-3 text-left">
              <span className="block text-xs font-semibold text-ink-soft mb-1">Language</span>
              <select className="w-full border border-line rounded-lg px-3 py-2 text-sm" value={newPatient.language} onChange={(e) => setNewPatient({ ...newPatient, language: e.target.value })}>
                <option>Assamese</option><option>Manipuri</option><option>Bodo</option><option>Khasi</option><option>Mizo</option><option>Ao Naga</option><option>Nepali</option><option>Hindi</option><option>English</option>
              </select>
            </label>
            <Field label="Username" required value={newPatient.username} onChange={(e) => setNewPatient({ ...newPatient, username: e.target.value })} />
            <Field label="PIN" required value={newPatient.pin} onChange={(e) => setNewPatient({ ...newPatient, pin: e.target.value })} />
            {error && <p className="text-clay text-sm mb-2">{error}</p>}
            <div className="flex gap-2 mt-2">
              <button type="submit" className="flex-1 py-2 rounded-lg bg-primary text-white font-semibold">Create</button>
              <button type="button" onClick={() => setShowAddPatient(false)} className="flex-1 py-2 rounded-lg border border-line font-semibold">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col gap-6">
        {profile && (
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center text-xl">{profile.name[0]}</div>
            <div>
              <h2 className="text-xl font-semibold">{profile.name}</h2>
              <p className="text-sm text-ink-faint">Age {profile.age} · {profile.gender} · {profile.language}</p>
            </div>
          </div>
        )}

        <Panel title="👪 Family Memories — for the Remember My Story game">
          <p className="text-xs text-ink-faint mb-4">
            Add photos and details for this patient's family members. The game will ask them
            personalized questions built from what you add here, before the general culture questions.
          </p>
          <form onSubmit={submitFamilyMember} className="grid sm:grid-cols-2 gap-3 mb-4">
            <Field label="Family member's name" required value={newMember.name} onChange={(e) => setNewMember({ ...newMember, name: e.target.value })} />
            <Field label="Relation (e.g. Daughter)" value={newMember.relation} onChange={(e) => setNewMember({ ...newMember, relation: e.target.value })} />
            <Field label="Favourite hobby or song" value={newMember.hobbyOrSong} onChange={(e) => setNewMember({ ...newMember, hobbyOrSong: e.target.value })} />
            <label className="block mb-3 text-left">
              <span className="block text-xs font-semibold text-ink-soft mb-1">Photo (optional)</span>
              <input type="file" accept="image/*" onChange={handlePhotoChange} className="w-full text-sm" />
            </label>
            <button type="submit" className="sm:col-span-2 bg-primary text-white rounded-lg text-sm font-semibold py-2">+ Add Family Member</button>
          </form>
          <div className="grid sm:grid-cols-2 gap-3">
            {familyMembers.length === 0 && <p className="text-sm text-ink-faint">No family members added yet.</p>}
            {familyMembers.map((m) => (
              <div key={m.id} className="flex items-center gap-3 border border-line rounded-xl p-3">
                {m.photoDataUrl ? (
                  <img src={m.photoDataUrl} alt="" className="w-12 h-12 rounded-full object-cover shrink-0" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary-tint flex items-center justify-center text-lg shrink-0">👤</div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-sm truncate">{m.name}{m.relation ? ` · ${m.relation}` : ''}</div>
                  {m.hobbyOrSong && <div className="text-xs text-ink-faint truncate">{m.hobbyOrSong}</div>}
                </div>
                <button onClick={() => deleteFamilyMember(m.id)} className="text-xs text-clay font-semibold shrink-0">Remove</button>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="❤️ Latest Check-in">
          {latestCheckin ? (
            <div className="flex items-center gap-4">
              <span className="text-4xl">{CHECKIN_EMOJI[latestCheckin.mood] || '💬'}</span>
              <div>
                <div className="font-semibold">{latestCheckin.mood}</div>
                <div className="text-xs text-ink-faint">{new Date(latestCheckin.timestamp).toLocaleString()}</div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-ink-faint">No check-in recorded yet.</p>
          )}
        </Panel>

        {perf && (
          <div className="grid sm:grid-cols-4 gap-4">
            <StatCard value={perf.games_completed} label="Games completed" />
            <StatCard value={`${perf.accuracy_pct}%`} label="Accuracy" />
            <StatCard value={`${perf.error_rate_pct}%`} label="Error rate" />
            <StatCard value={`${(perf.avg_response_ms / 1000).toFixed(1)}s`} label="Avg response time" />
          </div>
        )}

        <Panel title="📊 Performance Summary — Demo data">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <StatCard value={mockPerformanceSummary.gamesCompleted} label="Games completed" />
            <StatCard value={`${mockPerformanceSummary.accuracy}%`} label="Accuracy" />
            <StatCard value={`${mockPerformanceSummary.precision}%`} label="Precision" />
            <StatCard value={`${mockPerformanceSummary.errorRate}%`} label="Error rate" />
            <StatCard value={`${mockPerformanceSummary.averageResponseTime}s`} label="Avg response time" />
            <StatCard value={`${mockPerformanceSummary.overallScore}%`} label="Overall score" />
          </div>
        </Panel>

        <Panel title="🎮 Game-wise Performance — Demo data">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
            {mockGamePerformance.map((g) => (
              <div key={g.game_id} className="bg-primary-tint rounded-xl py-3 text-center">
                <div className="text-lg font-bold text-primary">{g.accuracy}%</div>
                <div className="text-xs text-ink-faint mt-1">{g.label}</div>
              </div>
            ))}
          </div>
          <GamePerformanceChart data={mockGamePerformance} />
        </Panel>

        {perf && perf.trend.length > 0 && (
          <div className="grid sm:grid-cols-2 gap-6">
            <Panel title="Accuracy & error rate trend">
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={perf.trend}>
                    <CartesianGrid stroke="#EFECE2" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="accuracy_pct" name="Accuracy %" stroke="#1F3D33" strokeWidth={2} />
                    <Line type="monotone" dataKey="error_rate_pct" name="Error rate %" stroke="#9C5642" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Panel>
            <Panel title="Games completed & response time">
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={perf.trend}>
                    <CartesianGrid stroke="#EFECE2" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="games_completed" name="Games completed" fill="#B8863B" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Panel>
          </div>
        )}

        <Panel title="⚠️ Alerts">
          {alerts.length === 0 ? (
            <p className="text-sm text-primary">✅ No alerts — everything looks good today.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {alerts.map((a, i) => (
                <div key={i} className="flex items-center gap-2 text-sm bg-accent-tint text-accent-dark rounded-lg px-3 py-2">
                  <span>{a.icon}</span>{a.text}
                </div>
              ))}
            </div>
          )}
        </Panel>

        <AIInsightCard insight={mockAIInsight} />

        <Panel title="🎮 Recent game sessions">
          <div className="flex flex-col gap-2">
            {games.length === 0 && <p className="text-sm text-ink-faint">No game sessions recorded yet.</p>}
            {games.map((g) => (
              <div key={g.session_id} className="flex justify-between text-sm border-b border-line last:border-0 py-2">
                <span>{GAME_LABELS[g.game_id] || g.game_id} <span className="text-ink-faint">({g.difficulty})</span></span>
                <span className="font-semibold">{g.score}%</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="📋 Game History — Demo data">
          <GameHistoryTable entries={mockGameHistory} />
        </Panel>

        <Panel title="💊 Medicine">
          <form onSubmit={addMedicine} className="grid sm:grid-cols-4 gap-3 mb-4">
            <input placeholder="Medicine name" required value={newMedicine.name} onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })} className="border border-line rounded-lg px-3 py-2 text-sm" />
            <input placeholder="Time e.g. 7:00 PM" required value={newMedicine.time} onChange={(e) => setNewMedicine({ ...newMedicine, time: e.target.value })} className="border border-line rounded-lg px-3 py-2 text-sm" />
            <input placeholder="Frequency e.g. Daily" required value={newMedicine.frequency} onChange={(e) => setNewMedicine({ ...newMedicine, frequency: e.target.value })} className="border border-line rounded-lg px-3 py-2 text-sm" />
            <button className="bg-primary text-white rounded-lg text-sm font-semibold">+ Add Medicine</button>
          </form>
          <div className="flex flex-col gap-2">
            {medicine.map((m) => (
              <div key={m.medicine_id} className="flex justify-between items-center text-sm border-b border-line last:border-0 py-2">
                <span>{m.name} · {m.time}</span>
                <span className={m.status === 'taken' ? 'text-primary font-semibold' : 'text-accent-dark font-semibold'}>
                  {m.status === 'taken' ? '✓ Taken' : m.status === 'remind_later' ? '🔔 Remind Later' : '⏳ Pending'}
                </span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="💬 Send a message to patient">
          <div className="flex gap-3 mb-2">
            <input
              value={msgText}
              onChange={(e) => setMsgText(e.target.value)}
              placeholder="Please take your afternoon medicine."
              className="flex-1 border border-line rounded-lg px-3 py-2 text-sm"
            />
            <button onClick={sendMessage} className="bg-primary text-white px-5 rounded-lg font-semibold text-sm">Send</button>
          </div>
          {note && <p className="text-sm text-primary">{note}</p>}
          <div className="flex flex-col gap-2 mt-3">
            {messages.slice(0, 5).map((m) => (
              <div key={m.message_id} className="text-sm text-ink-soft border-t border-line pt-2">{m.text} <span className="text-ink-faint">· {new Date(m.timestamp).toLocaleString()}</span></div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  )
}

function StatCard({ value, label }) {
  return (
    <div className="bg-surface border border-line rounded-xl py-4 text-center">
      <div className="text-2xl font-bold text-primary">{value}</div>
      <div className="text-xs text-ink-faint mt-1">{label}</div>
    </div>
  )
}
