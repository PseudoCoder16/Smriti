import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export default function GamePerformanceChart({ data }) {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ bottom: 24 }}>
          <CartesianGrid stroke="#EFECE2" />
          <XAxis dataKey="label" tick={{ fontSize: 11 }} angle={-15} textAnchor="end" interval={0} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
          <Tooltip />
          <Bar dataKey="accuracy" name="Accuracy %" fill="#1F3D33" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
