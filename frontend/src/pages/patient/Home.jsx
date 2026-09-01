import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import AlertsPopover from '../../components/AlertsPopover.jsx'
import DailyCheckinPopup from '../../components/DailyCheckinPopup.jsx'
import ProfileMenu from '../../components/ProfileMenu.jsx'
import ReminderStrip from '../../components/ReminderStrip.jsx'
import TiltedCard from '../TiltedCard.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { useSettings } from '../../context/SettingsContext.jsx'
import { LANGUAGES } from '../../i18n/translations.js'
import { speak } from '../../utils/voiceService.js'

// Same 5 games, same images/colors, same descriptions as the public Landing
// page's "Inside the Platform" section — kept as the single source of truth
// there; this array only supplies the route + translation key each maps to.
function useGameTiles(t) {
  return [
    {
      to: '/games/music-memory',
      title: t('music_memory'),
      desc: 'Recall melodies from your past and match familiar tunes to strengthen auditory memory.',
      bgColor: '#C8E6C9',
      img: 'https://lh3.googleusercontent.com/aida/AEtjO1WORpLxeo0narmz-Xgsz8r5jWtM7azxr-1RiYAfkyEUdGIsKh94ydE1BixdbN8RkvqMm2deMiJLaqfqKAPG0DkrGIXicWRHvCk-Cn48TvMQWO2pilqYMES40zHlQkamNFf0Xx3DDOezSkzNvpYGq14_clV53tPV8TrjQD-vAJ2DayA4O3LHJmpw-igaB0SGfv_fW5gdV0duhpY6HFuiGRYUBevlagvC2wWO95dOewIsBY8SYDyITLFcUck',
    },
    {
      to: '/games/remember-my-story',
      title: t('remember_my_story'),
      desc: 'Identify family members and loved ones through photos to reinforce facial recognition.',
      bgColor: '#BBDEFB',
      img: 'https://lh3.googleusercontent.com/aida/AEtjO1WgceprIvRHAQxQ6jN7SCJeIUyRzzKf2G85Zg1m_05k_klDHI1YCYcjlUplRRyhXma_I2N4K_vS8I8MpMsdnARasFGoiMIQLYx-D_ZbyzmE0IzJwNhzqTTnCGtFEIZPtXRcQT5cMBUXOtetvjJADyTsx6c2JbhcU0fZ4m9ppGZVmULaj9xv2lgSP_JPJZLuZ7uPghZjpiTsk8DpBt7bU0No7NnC_LWDdE0H1BIl0LMKFt6N-zXxTWiUfC0',
    },
    {
      to: '/games/color-sort',
      title: t('color_sort'),
      desc: 'Sort objects by color and shape to sharpen visual discrimination and attention.',
      bgColor: '#FFE0B2',
      img: 'https://lh3.googleusercontent.com/aida/AEtjO1WTKtNfLjDoYY4JFdkkn5Iz811kHMJgw3KcKlhHZDWo_2qCNzF04sU6zbk82PMDVhaEvULRBDwAOZUoi_2Gsy1K_ufPs9d4Y38AOMGRDn7PpCfeHWjZs0J-Dym4GX7SXlyIbDRHHXX6Uv5FDuPeiM7ur_tOjUP9F4zSf1om6OCSK4rC9rnR9uSebYf13svf_PrZsknxV_rrp44f1SslI9FJbkPXn-sOwV9x9XinhFrwUmI4-11oAfke354',
    },
    {
      to: '/games/rhythm-tap',
      title: t('rhythm_tap'),
      desc: 'Follow rhythmic patterns and tap along to exercise motor timing and coordination.',
      bgColor: '#F8BBD0',
      img: 'https://lh3.googleusercontent.com/aida/AEtjO1VtXZpVzXePs_KGuJLm_9NTRtPriBQ_EzZoteaCQnxYxm0-IX8J6arObNw4j2VKRHzPZLlTdXv6BD2U2KD6Wg5ZCKwtJjJf8K1grBwlhtBOibVZx6jUWIu8UluM780lsF_vOWO615py0W3uJvY2R8NeUzkXSIiuLSLc91G9E3dLb5y7Br5g8wcNEpNUSu_8P-ORPbonkjO7w9_DUr4NtpcAZslpUijtN9eQzCMp-KVKY9TjKvzr16kGDX4',
    },
    {
      to: '/games/pattern',
      title: t('pattern_recognition'),
      desc: 'Spot patterns in sequences and shapes to train attention and cognitive focus.',
      bgColor: '#D1C4E9',
      img: 'https://lh3.googleusercontent.com/aida/AEtjO1UA2u9MwDfGA37jCJJj2PNr3aU30KbsjVXop5yIdm9LkyrN-0vgo7hi_bNfOnNWlATaHVzfc5F9g4QesQKnhZPZNcRnjwNC7H0qr_DCZju96ee6iEyCDWIL9Zh4Z8UsOTLnnFdWBunSYPBYVLf8aa2FDNZCgJgVqhx2M33THgpXaZPIU9Kx9jB4dkbDHo72V6JoSN3vm3sMIWC8ykhGPI3Gbd1mfXwTxZiCeWnp9OWEoboedi02bhAp6g',
    },
  ]
}

export default function Home() {
  const { session } = useAuth()
  const { t, simpleMode, setSimpleMode, language, setLanguage } = useSettings()
  const navigate = useNavigate()
  const gameTiles = useGameTiles(t)

  const timeGreet = useMemo(() => {
    const hour = new Date().getHours()
    return hour < 12 ? t('good_morning') : hour < 17 ? t('good_afternoon') : t('good_evening')
  }, [t])
  const first = session.name.split(' ')[0]

  useEffect(() => {
    speak(`${timeGreet}, ${first}!`, language)
  }, [timeGreet, first, language])

  return (
    <div className="min-h-screen flex flex-col">
      <DailyCheckinPopup />
      <div className="flex items-center justify-between px-6 py-4 border-b border-line shrink-0 gap-4 bg-surface">
        <div className="min-w-0">
          <span className="patient-serif text-sm text-primary-dark block mb-1">Smriti</span>
          <h1 className="text-xl patient-serif leading-tight truncate">{timeGreet} 👋, {first}!</h1>
          <p className="text-xs text-ink-faint">{t('how_feeling')}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <AlertsPopover />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="text-sm border border-line rounded-full px-3 py-2"
            aria-label={t('choose_language')}
          >
            {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
          </select>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <span className="text-xs font-semibold text-ink-soft hidden sm:inline">{t('simple_mode')}</span>
            <span
              onClick={() => setSimpleMode(!simpleMode)}
              className={`w-11 h-6 rounded-full flex items-center px-0.5 transition ${simpleMode ? 'bg-primary justify-end' : 'bg-line justify-start'}`}
            >
              <span className="w-5 h-5 rounded-full bg-white shadow" />
            </span>
          </label>
          <ProfileMenu />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-8" style={{ background: 'linear-gradient(180deg, #f9f8f3 0%, #ffffff 100%)' }}>
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-bold text-accent tracking-[0.2em] uppercase mb-4 text-center">{t('play')}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 justify-items-center mb-10">
            {gameTiles.map((g) => (
              <TiltedCard
                key={g.to}
                imageSrc={g.img}
                altText={g.title}
                title={g.title}
                description={g.desc}
                bgColor={g.bgColor}
                rotateAmplitude={10}
                scaleOnHover={1.04}
                onClick={() => navigate(g.to)}
              />
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate('/checkin')}
              className="flex items-center gap-3 bg-surface border border-line rounded-full px-6 py-3 hover:border-primary hover:bg-primary-tint transition shadow-sm"
            >
              <span className="text-2xl">❤️</span>
              <span className="text-sm font-semibold">{t('checkin')}</span>
            </button>
            <button
              onClick={() => navigate('/progress')}
              className="flex items-center gap-3 bg-surface border border-line rounded-full px-6 py-3 hover:border-primary hover:bg-primary-tint transition shadow-sm"
            >
              <span className="text-2xl">🏆</span>
              <span className="text-sm font-semibold">{t('progress')}</span>
            </button>
          </div>
        </div>
      </div>

      <ReminderStrip />
    </div>
  )
}
