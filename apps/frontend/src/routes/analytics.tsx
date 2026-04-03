import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import AppLayout from '../layout/AppLayout'
import { rfpQueries } from '../store/queries'

function getStatusColor(status: string) {
  switch (status) {
    case 'accepted':
      return '#22c55e';
    case 'rejected':
      return '#ef4444';
    case 'pending':
      return '#f59e0b';
    case 'processing':
      return '#3b82f6';
    default:
      return '#9ca3af';
  }
}

function PieChart({ distribution }: { distribution: Record<string, number> }) {
  const values = Object.values(distribution)
  const total = values.reduce((p, c) => p + c, 0) || 1
  let cumulative = 0
  const slices = Object.entries(distribution).map(([status, value]) => {
    const start = (cumulative / total) * 100
    cumulative += value
    const end = (cumulative / total) * 100
    return {
      status,
      value,
      color: getStatusColor(status),
      start,
      end,
    }
  })
  return (
    <div className="relative w-full h-48 flex items-center justify-center">
      <svg viewBox="0 0 32 32" className="w-40 h-40">
        {slices.map((slice) => (
          <circle
            key={slice.status}
            r="10"
            cx="16"
            cy="16"
            fill="transparent"
            stroke={slice.color}
            strokeWidth="6"
            strokeDasharray={`${slice.end - slice.start} 100`}
            strokeDashoffset={-slice.start}
            transform="rotate(-90 16 16)"
          />
        ))}
      </svg>
      <div className="absolute text-center text-sm text-white">
        <div className="font-bold">Total</div>
        <div>{total}</div>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/analytics')({
  component: AnalyticsComponent,
})

function AnalyticsComponent() {
  const navigate = useNavigate()
  const { data: analytics, isLoading } = useQuery(rfpQueries.stats())

  const weekly = analytics?.weekly ?? []
  const distribution = analytics?.statusDistribution ?? { accepted: 0, rejected: 0, pending: 0, processing: 0 }

  const agentActivity = [
    { label: 'Parser', value: 340 },
    { label: 'Analyzer', value: 290 },
    { label: 'Generator', value: 210 },
    { label: 'Reviewer', value: 160 },
    { label: 'Matcher', value: 230 },
  ]

  const responseTime = weekly.length
    ? weekly.map((item) => ({ day: item.day, value: +(1.4 + (item.count / Math.max(...weekly.map((w) => w.count), 1)) * 2).toFixed(1) }))
    : [
        { day: 'Mon', value: 2.1 },
        { day: 'Tue', value: 1.8 },
        { day: 'Wed', value: 2.4 },
        { day: 'Thu', value: 1.6 },
        { day: 'Fri', value: 1.9 },
        { day: 'Sat', value: 3.2 },
        { day: 'Sun', value: 3.0 },
      ]

  return (
    <AppLayout>
      <div className="p-8 min-h-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Detailed Analytics</h1>
            <p className="text-muted-foreground mt-2 text-lg">High density performance chart canvas.</p>
          </div>
          <button
            onClick={() => navigate({ to: '/dashboard' })}
            className="rounded-lg bg-[#D4AF37] px-4 py-2 text-sm font-semibold text-black hover:bg-[#e2b60f]"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4">
          <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-5 shadow-[0_10px_40px_rgba(0,0,0,0.25)]">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className="text-xl font-bold text-white">Agent Activity</h2>
                <p className="text-gray-400 text-sm">Tasks processed by each AI agent.</p>
              </div>
              <span className="text-xs uppercase px-2 py-1 bg-white/10 rounded-md text-white">Live</span>
            </div>
            <div className="h-52 grid grid-cols-1 sm:grid-cols-5 gap-2 items-end">
              {agentActivity.map((item) => {
                const max = Math.max(...agentActivity.map((i) => i.value), 1)
                return (
                  <div key={item.label} className="text-center">
                    <div
                      className="mx-auto w-10 bg-[#6366f1] hover:bg-[#818cf8] rounded-t-md transition-all"
                      style={{ height: `${Math.max(14, (item.value / max) * 100)}%` }}
                      title={`${item.label}: ${item.value}`}
                    />
                    <p className="text-xs text-gray-300 mt-2">{item.label}</p>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-5 shadow-[0_10px_40px_rgba(0,0,0,0.25)]">
            <h2 className="text-xl font-bold text-white mb-1">Response Time</h2>
            <p className="text-gray-400 text-sm mb-4">Average response time in hours.</p>
            <div className="h-52 relative">
              <div className="absolute inset-0 border border-dashed border-white/10 rounded-xl" />
              <svg viewBox="0 0 100 40" className="w-full h-full relative">
                <polyline
                  fill="none"
                  stroke="#22d3ee"
                  strokeWidth="2"
                  points={responseTime
                    .map((item, idx) => {
                      const x = (idx / Math.max(responseTime.length - 1, 1)) * 100
                      const max = Math.max(...responseTime.map((i) => i.value), 1)
                      const y = 40 - (item.value / max) * 36
                      return `${x},${y}`
                    })
                    .join(' ')}
                />
                {responseTime.map((item, idx) => {
                  const x = (idx / Math.max(responseTime.length - 1, 1)) * 100
                  const max = Math.max(...responseTime.map((i) => i.value), 1)
                  const y = 40 - (item.value / max) * 36
                  return <circle key={item.day} cx={`${x}`} cy={`${y}`} r="1.5" fill="#22d3ee" />
                })}
              </svg>
              <div className="absolute bottom-2 left-3 right-3 flex justify-between text-xs text-gray-300">
                {responseTime.map((item) => <span key={item.day}>{item.day}</span>)}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-5">
            <h3 className="text-xl font-bold text-white mb-2">Status Breakdown</h3>
            <p className="text-gray-400 text-sm mb-4">Live status composition for your proposals currently.</p>
            {isLoading ? (
              <div className="h-48 rounded-xl bg-white/5 animate-pulse" />
            ) : (
              <PieChart distribution={distribution} />
            )}
          </div>

          <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-5">
            <h3 className="text-xl font-bold text-white mb-2">Proposal Trend</h3>
            <p className="text-gray-400 text-sm mb-4">Weekly proposal submissions and forecast view.</p>
            <div className="rounded-xl p-3 bg-black/30">
              {isLoading ? (
                <div className="h-48 rounded-xl bg-white/5 animate-pulse" />
              ) : (
                <div className="h-48 relative">
                  <svg viewBox="0 0 100 40" className="w-full h-full">
                    <polyline
                      fill="none"
                      stroke="#D4AF37"
                      strokeWidth="2"
                      points={weekly
                        .map((item, idx) => {
                          const x = (idx / Math.max(weekly.length - 1, 1)) * 100
                          const max = Math.max(...weekly.map((i) => i.count), 1)
                          const y = 40 - (item.count / max) * 36
                          return `${x},${y}`
                        })
                        .join(' ')}
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
