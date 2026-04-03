import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft, TrendingUp, TrendingDown, Clock,
  CheckCircle, FileText, Bot, BarChart3, PieChart as PieChartIcon,
  ArrowUpRight, Sparkles, Target, Timer, Zap
} from 'lucide-react'
import AppLayout from '../layout/AppLayout'
import { rfpQueries } from '../store/queries'

// ── Dummy data for demo (will be replaced by backend later) ──────────────────

const DUMMY_WEEKLY = [
  { day: 'Mon', count: 12 },
  { day: 'Tue', count: 19 },
  { day: 'Wed', count: 8 },
  { day: 'Thu', count: 24 },
  { day: 'Fri', count: 31 },
  { day: 'Sat', count: 14 },
  { day: 'Sun', count: 7 },
]

const DUMMY_MONTHLY = [
  { month: 'Jan', proposals: 42, accepted: 28, rejected: 8 },
  { month: 'Feb', proposals: 56, accepted: 38, rejected: 12 },
  { month: 'Mar', proposals: 71, accepted: 52, rejected: 9 },
  { month: 'Apr', proposals: 63, accepted: 45, rejected: 11 },
  { month: 'May', proposals: 89, accepted: 67, rejected: 14 },
  { month: 'Jun', proposals: 95, accepted: 74, rejected: 10 },
]

const DUMMY_DISTRIBUTION = { accepted: 74, rejected: 10, pending: 18, processing: 6 }

const DUMMY_AGENT_ACTIVITY = [
  { label: 'Parser', value: 342, icon: FileText, trend: +12 },
  { label: 'Explorer', value: 289, icon: Target, trend: +8 },
  { label: 'Summariser', value: 214, icon: Sparkles, trend: -3 },
  { label: 'Generator', value: 167, icon: Zap, trend: +21 },
  { label: 'Reviewer', value: 198, icon: CheckCircle, trend: +5 },
]

const DUMMY_RESPONSE_TIME = [
  { day: 'Mon', value: 2.1 },
  { day: 'Tue', value: 1.8 },
  { day: 'Wed', value: 1.5 },
  { day: 'Thu', value: 2.4 },
  { day: 'Fri', value: 1.3 },
  { day: 'Sat', value: 1.9 },
  { day: 'Sun', value: 2.8 },
]

const DUMMY_TOP_SOURCES = [
  { name: 'procurement@acme.com', count: 34, pct: 36 },
  { name: 'bids@globalcorp.io', count: 28, pct: 29 },
  { name: 'rfp@techvault.com', count: 18, pct: 19 },
  { name: 'vendor@megacorp.net', count: 15, pct: 16 },
]

// ── Glassmorphism card wrapper ───────────────────────────────────────────────

function GlassCard({ children, className = '', span = '' }: { children: React.ReactNode; className?: string; span?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      el.style.setProperty('--mx', `${e.clientX - rect.left}px`)
      el.style.setProperty('--my', `${e.clientY - rect.top}px`)
    }
    el.addEventListener('mousemove', handleMove)
    return () => el.removeEventListener('mousemove', handleMove)
  }, [])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className={`relative group bg-[#111111] border border-white/[0.08] rounded-2xl p-6 overflow-hidden ${span} ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition duration-300"
        style={{ background: 'radial-gradient(500px circle at var(--mx,0) var(--my,0), rgba(212,175,55,0.07), transparent 40%)' }}
      />
      <div className="relative z-10 h-full flex flex-col">{children}</div>
    </motion.div>
  )
}

// ── Stat card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, change, icon: Icon, color, delay = 0 }: {
  label: string; value: number | string; change?: number; icon: any; color: string; delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.23, 1, 0.32, 1] }}
      className="relative group bg-[#111111] border border-white/[0.08] rounded-2xl p-5 overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-24 h-24 opacity-[0.04]">
        <Icon className="w-full h-full" style={{ color }} />
      </div>
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-xl" style={{ backgroundColor: `${color}15` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <span className="text-sm text-gray-400 font-medium">{label}</span>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-3xl font-bold text-white tracking-tight">{value}</span>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg ${change >= 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
            {change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {change >= 0 ? '+' : ''}{change}%
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ── Donut chart (SVG) ────────────────────────────────────────────────────────

function DonutChart({ distribution }: { distribution: Record<string, number> }) {
  const colorMap: Record<string, string> = {
    accepted: '#22C55E',
    rejected: '#EF4444',
    pending: '#F59E0B',
    processing: '#3B82F6',
  }
  const entries = Object.entries(distribution)
  const total = entries.reduce((s, [, v]) => s + v, 0) || 1
  let cum = 0

  return (
    <div className="flex items-center gap-8">
      <div className="relative">
        <svg viewBox="0 0 36 36" className="w-44 h-44">
          {entries.map(([status, value]) => {
            const pct = (value / total) * 100
            const offset = 100 - cum
            cum += pct
            return (
              <circle
                key={status}
                cx="18" cy="18" r="14"
                fill="none"
                stroke={colorMap[status] ?? '#9CA3AF'}
                strokeWidth="4"
                strokeDasharray={`${pct} ${100 - pct}`}
                strokeDashoffset={offset}
                strokeLinecap="round"
                className="transition-all duration-700"
              />
            )
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-white">{total}</span>
          <span className="text-[10px] text-gray-500 uppercase tracking-widest">Total</span>
        </div>
      </div>

      <div className="space-y-3">
        {entries.map(([status, value]) => (
          <div key={status} className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colorMap[status] }} />
            <div>
              <p className="text-sm text-white capitalize font-medium">{status}</p>
              <p className="text-xs text-gray-500">{value} ({Math.round((value / total) * 100)}%)</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Mini bar chart for monthly data ──────────────────────────────────────────

function MonthlyBarChart({ data }: { data: typeof DUMMY_MONTHLY }) {
  const maxVal = Math.max(...data.map(d => d.proposals), 1)
  return (
    <div className="flex items-end gap-3 h-full w-full px-2">
      {data.map((item, i) => (
        <div key={item.month} className="flex-1 flex flex-col items-center gap-1">
          <div className="relative w-full flex items-end gap-0.5 h-40">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(item.accepted / maxVal) * 100}%` }}
              transition={{ duration: 0.8, delay: i * 0.08 }}
              className="flex-1 bg-[#22C55E] rounded-t-sm min-h-[2px]"
              title={`Accepted: ${item.accepted}`}
            />
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(item.rejected / maxVal) * 100}%` }}
              transition={{ duration: 0.8, delay: i * 0.08 + 0.1 }}
              className="flex-1 bg-[#EF4444] rounded-t-sm min-h-[2px]"
              title={`Rejected: ${item.rejected}`}
            />
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${((item.proposals - item.accepted - item.rejected) / maxVal) * 100}%` }}
              transition={{ duration: 0.8, delay: i * 0.08 + 0.2 }}
              className="flex-1 bg-[#D4AF37] rounded-t-sm min-h-[2px]"
              title={`Pending: ${item.proposals - item.accepted - item.rejected}`}
            />
          </div>
          <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">{item.month}</span>
        </div>
      ))}
    </div>
  )
}

// ── Sparkline SVG ────────────────────────────────────────────────────────────

function Sparkline({ data, color = '#D4AF37', height = 48 }: { data: number[]; color?: string; height?: number }) {
  const max = Math.max(...data, 1)
  const w = 100
  const h = height
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * (h - 8)}`).join(' ')
  const fillPoints = `0,${h} ${points} ${w},${h}`

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height }}>
      <defs>
        <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon fill={`url(#grad-${color.replace('#', '')})`} points={fillPoints} />
      <polyline fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={points} />
      {data.map((v, i) => (
        <circle
          key={i}
          cx={(i / (data.length - 1)) * w}
          cy={h - (v / max) * (h - 8)}
          r="2.5"
          fill={color}
          className="opacity-0 hover:opacity-100 transition-opacity"
        />
      ))}
    </svg>
  )
}

// ── Main component ───────────────────────────────────────────────────────────

export const Route = createFileRoute('/analytics')({
  component: AnalyticsComponent,
})

function AnalyticsComponent() {
  const navigate = useNavigate()
  const { data: analytics, isLoading } = useQuery(rfpQueries.stats())
  const { data: rfps = [] } = useQuery(rfpQueries.list())

  // ── All data from backend, computed fallback from RFP list ─────────────────
  const backendStats = analytics?.stats
  const weekly = analytics?.weekly && analytics.weekly.length > 0 ? analytics.weekly : DUMMY_WEEKLY
  const distribution = analytics?.statusDistribution ?? (rfps.length > 0 ? {
    accepted: rfps.filter(r => r.status === 'completed').length,
    rejected: rfps.filter(r => ['parse_rejected', 'explore_rejected', 'summarise_rejected', 'failed'].includes(r.status)).length,
    pending: rfps.filter(r => ['parsed', 'explored', 'summarised'].includes(r.status)).length,
    processing: rfps.filter(r => ['processing', 'exploring', 'summarising', 'generating_document'].includes(r.status)).length,
  } : DUMMY_DISTRIBUTION)

  const totalProposals = backendStats?.total ?? (rfps.length || 0)
  const accepted = backendStats?.accepted ?? rfps.filter(r => r.status === 'completed').length
  const rejected = backendStats?.rejected ?? rfps.filter(r => ['parse_rejected', 'explore_rejected', 'summarise_rejected', 'failed'].includes(r.status)).length

  // Derive agent activity from real RFP data
  const agentActivity = rfps.length > 0
    ? [
        { label: 'Parser', value: rfps.length, icon: FileText, trend: +12 },
        { label: 'Explorer', value: rfps.filter(r => !['parsed', 'processing'].includes(r.status)).length, icon: Target, trend: +8 },
        { label: 'Summariser', value: rfps.filter(r => ['summarised', 'generating_document', 'completed'].includes(r.status)).length, icon: Sparkles, trend: -3 },
        { label: 'Generator', value: rfps.filter(r => r.status === 'completed').length, icon: Zap, trend: +21 },
        { label: 'Reviewer', value: accepted + rejected, icon: CheckCircle, trend: +5 },
      ]
    : DUMMY_AGENT_ACTIVITY

  const avgResponseTime = (DUMMY_RESPONSE_TIME.reduce((s, d) => s + d.value, 0) / DUMMY_RESPONSE_TIME.length).toFixed(1)
  const successRate = Math.round((accepted / Math.max(totalProposals, 1)) * 100)

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 min-h-full overflow-y-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4"
        >
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 bg-[#D4AF37]/10 rounded-xl">
                <BarChart3 className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Analytics Dashboard</h1>
            </div>
            <p className="text-gray-400 text-sm ml-14">Comprehensive performance insights and pipeline metrics</p>
          </div>
          <button
            onClick={() => navigate({ to: '/dashboard' })}
            className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 px-4 py-2.5 text-sm font-medium text-white transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </motion.div>

        {/* KPI Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard label="Total Proposals" value={totalProposals} change={12} icon={FileText} color="#3B82F6" delay={0} />
          <StatCard label="Success Rate" value={`${successRate}%`} change={5} icon={Target} color="#22C55E" delay={0.1} />
          <StatCard label="Avg Response" value={`${avgResponseTime}h`} change={-8} icon={Timer} color="#F59E0B" delay={0.2} />
          <StatCard label="Active Agents" value={5} icon={Bot} color="#8B5CF6" delay={0.3} />
        </div>

        {/* Row 1: Monthly Trends + Status Breakdown */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 mb-4">
          <GlassCard span="xl:col-span-3">
            <div className="flex items-center justify-between mb-1">
              <div>
                <h2 className="text-lg font-bold text-white">Monthly Proposal Trends</h2>
                <p className="text-xs text-gray-500">Accepted vs rejected vs pending per month</p>
              </div>
              <div className="flex items-center gap-4 text-[10px] uppercase tracking-wider">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#22C55E]" />Accepted</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#EF4444]" />Rejected</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#D4AF37]" />Pending</span>
              </div>
            </div>
            <div className="flex-1 min-h-0 mt-4">
              <MonthlyBarChart data={DUMMY_MONTHLY} />
            </div>
          </GlassCard>

          <GlassCard span="xl:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-white">Status Breakdown</h2>
                <p className="text-xs text-gray-500">Current pipeline distribution</p>
              </div>
              <PieChartIcon className="w-5 h-5 text-gray-600" />
            </div>
            <div className="flex-1 flex items-center justify-center">
              {isLoading ? (
                <div className="w-44 h-44 rounded-full bg-white/5 animate-pulse" />
              ) : (
                <DonutChart distribution={distribution} />
              )}
            </div>
          </GlassCard>
        </div>

        {/* Row 2: Agent Activity + Response Time */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4">
          <GlassCard>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-white">AI Agent Performance</h2>
                <p className="text-xs text-gray-500">Tasks processed by each pipeline agent</p>
              </div>
            </div>
            <div className="space-y-3 flex-1">
              {agentActivity.map((agent, i) => {
                const maxVal = Math.max(...agentActivity.map(a => a.value), 1)
                const pct = (agent.value / maxVal) * 100
                return (
                  <motion.div
                    key={agent.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="group"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-[#D4AF37]/10">
                          <agent.icon className="w-3.5 h-3.5 text-[#D4AF37]" />
                        </div>
                        <span className="text-sm text-white font-medium">{agent.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-white font-bold">{agent.value}</span>
                        <span className={`text-[10px] font-semibold ${agent.trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {agent.trend >= 0 ? '+' : ''}{agent.trend}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1, delay: i * 0.1, ease: 'easeOut' }}
                        className="h-full rounded-full bg-gradient-to-r from-[#D4AF37] to-[#E5B80B]"
                      />
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-lg font-bold text-white">Response Time Trend</h2>
                <p className="text-xs text-gray-500">Average response time in hours (lower is better)</p>
              </div>
              <Clock className="w-5 h-5 text-gray-600" />
            </div>
            <div className="flex-1 flex flex-col justify-end">
              <Sparkline data={DUMMY_RESPONSE_TIME.map(d => d.value)} color="#22D3EE" height={120} />
              <div className="flex justify-between mt-2 px-1">
                {DUMMY_RESPONSE_TIME.map(d => (
                  <span key={d.day} className="text-[10px] text-gray-500 font-medium">{d.day}</span>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Row 3: Weekly Volume + Top Sources */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <GlassCard>
            <div className="mb-4">
              <h2 className="text-lg font-bold text-white">Weekly Volume</h2>
              <p className="text-xs text-gray-500">RFPs processed this week</p>
            </div>
            <div className="flex-1 flex flex-col justify-end">
              <Sparkline data={weekly.map((w: any) => w.count)} color="#D4AF37" height={100} />
              <div className="flex justify-between mt-2 px-1">
                {weekly.map((w: any) => (
                  <span key={w.day} className="text-[10px] text-gray-500 font-medium">{w.day}</span>
                ))}
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-white">Top Sources</h2>
                <p className="text-xs text-gray-500">Highest volume email sources</p>
              </div>
              <ArrowUpRight className="w-5 h-5 text-gray-600" />
            </div>
            <div className="space-y-3 flex-1">
              {DUMMY_TOP_SOURCES.map((source, i) => (
                <motion.div
                  key={source.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center text-xs font-bold text-[#D4AF37]">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate font-medium">{source.name}</p>
                    <div className="w-full h-1.5 bg-white/5 rounded-full mt-1.5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${source.pct}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                        className="h-full rounded-full bg-gradient-to-r from-[#D4AF37]/60 to-[#D4AF37]"
                      />
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 font-semibold tabular-nums">{source.count}</span>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </AppLayout>
  )
}
