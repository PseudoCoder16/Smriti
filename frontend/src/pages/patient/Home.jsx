import { useEffect, useMemo, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import ProfileMenu from '../../components/ProfileMenu.jsx'
import ReminderStrip from '../../components/ReminderStrip.jsx'
import TiltedCard from '../TiltedCard.jsx'
import { api } from '../../api/client.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { useSettings } from '../../context/SettingsContext.jsx'
import { LANGUAGES } from '../../i18n/translations.js'
import { speak } from '../../utils/voiceService.js'

function useGameTiles(t) {
  return [
    {
      to: '/games/music-memory',
      title: t('music_memory'),
      desc: 'Recall melodies from your past and match familiar tunes to strengthen auditory memory.',
      bgColor: '#C8E6C9',
      img: '/images/games/music-memory.jpg',
    },
    {
      to: '/games/remember-my-story',
      title: t('remember_my_story'),
      desc: 'Identify family members and loved ones through photos to reinforce facial recognition.',
      bgColor: '#BBDEFB',
      img: '/images/games/remember-story.jpg',
    },
    {
      to: '/games/color-sort',
      title: t('color_sort'),
      desc: 'Sort objects by color and shape to sharpen visual discrimination and attention.',
      bgColor: '#FFE0B2',
      img: '/images/games/color-sort.jpg',
    },
    {
      to: '/games/rhythm-tap',
      title: t('rhythm_tap'),
      desc: 'Follow rhythmic patterns and tap along to exercise motor timing and coordination.',
      bgColor: '#F8BBD0',
      img: '/images/games/rhythm-tap.jpg',
    },
    {
      to: '/games/pattern',
      title: t('pattern_recognition'),
      desc: 'Spot patterns in sequences and shapes to train attention and cognitive focus.',
      bgColor: '#D1C4E9',
      img: '/images/games/pattern-recognition.jpg',
    },
  ]
}

function Stat({ value, label }) {
  return (
    <div className="bg-white border border-gray-100 shadow-sm rounded-2xl py-4 text-center">
      <div className="text-2xl font-bold text-forest">{value}</div>
      <div className="text-xs text-gray-500 font-medium mt-1">{label}</div>
    </div>
  )
}

export default function Home() {
  const { session } = useAuth()
  const { t, simpleMode, setSimpleMode, language, setLanguage } = useSettings()
  const navigate = useNavigate()
  const gameTiles = useGameTiles(t)

  const [perf, setPerf] = useState(null)
  const [messages, setMessages] = useState(null)
  const [isChatOpen, setIsChatOpen] = useState(false)

  const timeGreet = useMemo(() => {
    const hour = new Date().getHours()
    return hour < 12 ? t('good_morning') : hour < 17 ? t('good_afternoon') : t('good_evening')
  }, [t])
  const first = session?.name?.split(' ')[0] || 'Guest'

  useEffect(() => {
    speak(`${timeGreet}, ${first}!`, language)
  }, [timeGreet, first, language])

  useEffect(() => {
    if (session?.patient_id) {
      api.get(`/patient/${session.patient_id}/performance`).then(setPerf).catch(() => setPerf({
        games_completed: 0, accuracy_pct: 0, avg_response_ms: 0, trend: []
      }))
      api.get(`/messages/${session.patient_id}`).then((res) => setMessages(res.messages)).catch(() => setMessages([]))
    }
  }, [session?.patient_id])

  async function markRead(messageId) {
    setMessages((msgs) => msgs.map((m) => (m.message_id === messageId ? { ...m, read: true } : m)))
    try {
      await api.put(`/message/${messageId}`, { read: true })
    } catch (err) {
      console.warn('[messages] failed to save read status', err)
    }
  }

  return (
    <div className="patient-dashboard antialiased min-h-screen flex flex-col">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=Inter:wght@300;400;500;600&display=swap');
        
        .patient-dashboard {
          font-family: 'Inter', sans-serif;
          background-color: #f9f8f3;
          color: #1f2937;
        }
        
        .patient-dashboard h1, .patient-dashboard h2, .patient-dashboard h3, .patient-dashboard .font-serif-custom {
          font-family: 'Playfair Display', serif;
        }
        
        .text-gold { color: #C1A063; }
        .bg-forest { background-color: #1B3022; }
        .text-forest { color: #1B3022; }
      `}</style>

      {/* Header — matches landing page style */}
      <header className="w-full py-5 px-4 md:px-8 sticky top-0 z-50 backdrop-blur-md bg-white/50 border-b border-[#C1A063]/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-3xl font-serif-custom font-bold tracking-tight text-forest">
              <span className="text-black">smri</span><span className="text-gold">ti</span>
            </Link>
            <h1 className="text-lg font-serif-custom font-semibold text-forest hidden sm:block">{timeGreet} 👋, {first}!</h1>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="text-sm font-medium border border-gray-200 rounded-full px-4 py-2 bg-white text-gray-700 focus:outline-none focus:border-[#1B3022]"
              aria-label={t('choose_language')}
            >
              {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
            </select>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <span className="text-sm font-semibold text-gray-600 hidden md:inline">{t('simple_mode')}</span>
              <span
                onClick={() => setSimpleMode(!simpleMode)}
                className={`w-11 h-6 rounded-full flex items-center px-0.5 transition-colors ${simpleMode ? 'bg-[#1B3022] justify-end' : 'bg-gray-300 justify-start'}`}
              >
                <span className="w-5 h-5 rounded-full bg-white shadow-sm" />
              </span>
            </label>
            <ProfileMenu />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">

        {/* Games Section — exact same layout as Landing.jsx */}
        <section className="py-12 md:py-20 px-4 md:px-8 bg-white">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-xs font-bold text-gold tracking-[0.2em] uppercase mb-3">PLAY</p>


            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 justify-items-center">
              {gameTiles.map((g) => (
                <TiltedCard
                  key={g.to}
                  imageSrc={g.img}
                  altText={g.title}
                  title={g.title}
                  bgColor={g.bgColor}
                  rotateAmplitude={12}
                  scaleOnHover={1.05}
                  onClick={() => navigate(g.to)}
                  hoverReveal={true}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Progress Section */}
        <section className="py-12 md:py-20 px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <p className="text-xs font-bold text-gold tracking-[0.2em] uppercase mb-3">Your Journey</p>
              <h2 className="text-4xl md:text-5xl font-serif-custom font-bold text-forest mb-4 leading-tight">My Progress</h2>
            </div>

            {!perf ? (
              <p className="text-gray-500 text-center">Loading progress...</p>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                  <Stat value={perf.games_completed} label={t('games_played')} />
                  <Stat value={`${perf.accuracy_pct}%`} label={t('accuracy')} />
                  <Stat value={`${(perf.avg_response_ms / 1000).toFixed(1)}s`} label={t('avg_response')} />
                </div>

                {perf.trend && perf.trend.length > 0 && (
                  <div className="h-56 bg-white rounded-2xl p-4 border border-[#C1A063]/20 shadow-sm">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={perf.trend}>
                        <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Line type="monotone" dataKey="accuracy_pct" stroke="#1B3022" strokeWidth={3} dot={{ r: 4, fill: '#1B3022', strokeWidth: 0 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      {/* Floating Caregiver Chatbox */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-14 h-14 bg-[#1B3022] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#27473b] transition-all relative"
        >
          <span className="text-2xl">💬</span>
          {messages?.some(m => !m.read) && (
            <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 border-2 border-white rounded-full"></span>
          )}
        </button>

        {isChatOpen && (
          <div className="absolute bottom-16 right-0 w-[350px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col mb-4">
            <div className="p-4 bg-[#1B3022] text-white flex justify-between items-center">
              <h2 className="font-serif-custom font-bold text-lg">{t('message_from_caregiver')}</h2>
              <button onClick={() => setIsChatOpen(false)} className="text-white/80 hover:text-white text-xl">✕</button>
            </div>

            <div className="p-4 flex flex-col gap-3 max-h-[400px] overflow-y-auto bg-[#f9f8f3]">
              {messages === null && <p className="text-gray-500 text-center py-4">Loading messages...</p>}
              {messages?.length === 0 && (
                <div className="text-center py-8">
                  <span className="text-3xl block mb-2">📬</span>
                  <p className="text-gray-500 font-medium text-sm">No messages yet.</p>
                </div>
              )}
              {messages?.map((m) => (
                <div key={m.message_id} className={`p-3 rounded-2xl shadow-sm border ${m.read ? 'bg-white border-gray-100' : 'bg-white border-[#C1A063] ring-1 ring-[#C1A063]'}`}>
                  <div className="flex gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-[#1B3022]/10 flex items-center justify-center shrink-0">
                      <span className="text-sm">👩‍⚕️</span>
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium text-sm">{m.text}</p>
                      <p className="text-xs text-gray-400 mt-1">{new Date(m.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end mt-2">
                    <button
                      onClick={() => speak(m.text, language)}
                      className="px-2 py-1 rounded-md bg-[#1B3022]/10 text-[#1B3022] text-xs font-bold hover:bg-[#1B3022]/20 transition-colors"
                    >
                      🔊 {t('listen')}
                    </button>
                    <button
                      onClick={() => markRead(m.message_id)}
                      disabled={m.read}
                      className={`px-2 py-1 rounded-md text-xs font-bold transition-colors ${m.read ? 'bg-gray-100 text-gray-400' : 'bg-[#1B3022] text-white hover:bg-[#27473b]'}`}
                    >
                      {m.read ? `✔️ ${t('got_it')}` : t('got_it')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <ReminderStrip />
    </div>
  )
}
