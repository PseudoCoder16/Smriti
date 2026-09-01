import { useSettings } from '../context/SettingsContext.jsx'

export default function DifficultyPicker({ options, onSelect }) {
  const { t } = useSettings()
  return (
    <div className="flex flex-col items-center gap-6 py-10">
      <p className="text-ink-soft text-lg">{t('choose_difficulty')}</p>
      <div className="flex flex-wrap justify-center gap-4">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className="flex flex-col items-center gap-1 px-8 py-6 rounded-2xl border-2 border-line bg-surface hover:border-primary hover:bg-primary-tint transition min-w-[140px]"
          >
            <span className="text-lg font-semibold text-ink">{t(opt.value)}</span>
            <span className="text-sm text-ink-faint">{opt.sub}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
