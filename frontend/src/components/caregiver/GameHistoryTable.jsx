export default function GameHistoryTable({ entries }) {
  return (
    <div className="flex flex-col gap-1">
      {entries.map((e, i) => (
        <div key={i} className="flex flex-wrap items-center justify-between gap-2 border-b border-line last:border-0 py-2 text-sm">
          <div>
            <div className="font-semibold">{e.game}</div>
            <div className="text-xs text-ink-faint">{e.difficulty} · {new Date(e.datetime).toLocaleString()}</div>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-soft">
            <span>Score: <b className="text-ink">{e.score}</b></span>
            <span>Accuracy: <b className="text-ink">{e.accuracy}%</b></span>
            <span>Errors: <b className="text-ink">{e.errors}</b></span>
            <span>Time: <b className="text-ink">{e.responseTime}s</b></span>
          </div>
        </div>
      ))}
    </div>
  )
}
