const TREND_LABELS = {
  improving: 'Improving 📈',
  declining: 'Declining 📉',
  stable: 'Stable ➡️',
}

export default function AIInsightCard({ insight }) {
  const trendLabel = TREND_LABELS[insight.performanceTrend] || insight.performanceTrend

  return (
    <div className="bg-primary-tint border border-primary/20 rounded-2xl p-6">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        🧠 AI Performance Insight <span className="text-xs font-normal text-ink-faint">(demo data)</span>
      </h3>
      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-xs font-semibold text-ink-faint uppercase mb-1">Performance trend</div>
          <div className="font-semibold text-primary">{trendLabel}</div>
        </div>
        <div>
          <div className="text-xs font-semibold text-ink-faint uppercase mb-1">Recommended difficulty</div>
          <div className="font-semibold text-primary">{insight.currentDifficulty} → {insight.recommendedDifficulty}</div>
        </div>
      </div>
      <p className="text-sm text-ink-soft mb-2">{insight.insight}</p>
      <p className="text-xs text-ink-faint italic">Reason: {insight.reason}</p>
      <p className="text-[11px] text-ink-faint mt-4">
        This is a gameplay-performance summary intended to guide difficulty selection — not a medical or diagnostic assessment.
      </p>
    </div>
  )
}
