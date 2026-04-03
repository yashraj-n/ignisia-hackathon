import { createFileRoute } from '@tanstack/react-router'
import AppLayout from '../layout/AppLayout'
import { User, Zap, LogOut, Mail, Building2, Users, Briefcase, Calendar, Monitor, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import { Avatar, AvatarFallback } from '../components/ui/avatar'
import { useEffect, useState } from 'react'
import { useRouter } from '@tanstack/react-router'

export const Route = createFileRoute('/profile')({
  component: ProfileComponent,
})

function ProfileComponent() {
  const router = useRouter()
  const [profile, setProfile] = useState<{ name: string; login_email: string; size: number } | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')

    fetch('http://localhost:9000/api/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.company) {
          setProfile(data.company)
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [router])

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0 }
  }

  const handleSignOut = () => {
    localStorage.removeItem('token')
    router.navigate({ to: '/auth' })
  }

  return (
    <AppLayout>
      <div className="p-8 max-w-5xl mx-auto min-h-full pb-32">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-8"
        >
          {/* ── Profile Header Card ─────────────────────────────────────── */}
          <motion.div
            variants={itemVariants}
            className="bg-[#111111] border border-white/[0.08] rounded-2xl p-8 relative overflow-hidden"
          >
            {/* Subtle accent gradient */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4AF37]/0 via-[#D4AF37]/60 to-[#D4AF37]/0" />

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <Avatar className="h-20 w-20 border-2 border-[#D4AF37]/30 shadow-[0_0_25px_rgba(212,175,55,0.12)] bg-[#1A1A1A] shrink-0">
                <AvatarFallback className="bg-transparent text-[#D4AF37] text-2xl font-bold">
                  {profile?.name ? profile.name.slice(0, 2).toUpperCase() : '..'}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <h1 className="text-3xl font-bold text-white mb-1 truncate">
                  {loading ? 'Loading...' : profile?.name || 'Unknown'}
                </h1>
                <p className="text-gray-400 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                  {profile?.login_email || 'No email'}
                </p>
              </div>

              <div className="flex gap-3 shrink-0">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 transition-colors text-sm font-semibold text-white"
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
                {isEditing && (
                  <button className="px-5 py-2.5 rounded-xl bg-[#D4AF37] text-black hover:bg-[#E5B80B] transition-colors text-sm font-bold shadow-[0_0_15px_rgba(212,175,55,0.25)]">
                    Save Changes
                  </button>
                )}
              </div>
            </div>
          </motion.div>

          {/* ── Two Column Grid ──────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* ── Personal Information ────────────────────────────────────── */}
            <motion.div
              variants={itemVariants}
              className="bg-[#111111] border border-white/[0.08] rounded-2xl p-6"
            >
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#D4AF37]/10">
                  <User className="w-4 h-4 text-[#D4AF37]" />
                </div>
                Personal Information
              </h2>
              <div className="space-y-5">
                <InfoField
                  icon={Building2}
                  label="Company Name"
                  value={loading ? 'Loading...' : profile?.name || 'Unknown'}
                  isEditing={isEditing}
                  type="text"
                />
                <InfoField
                  icon={Mail}
                  label="Email Address"
                  value={loading ? '...' : profile?.login_email || ''}
                  isEditing={isEditing}
                  type="email"
                />
                <InfoField
                  icon={Users}
                  label="Company Size"
                  value={loading ? '...' : String(profile?.size || 'N/A')}
                  isEditing={isEditing}
                  type="select"
                  options={['1-10', '11-50', '51-200', '201-500', '500+']}
                />
                <InfoField
                  icon={Briefcase}
                  label="Industry"
                  value="Not specified"
                  isEditing={isEditing}
                  type="text"
                  placeholder="Enter your industry"
                />
              </div>
            </motion.div>

            {/* ── Quick Stats + Session ───────────────────────────────────── */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <motion.div
                variants={itemVariants}
                className="bg-[#111111] border border-white/[0.08] rounded-2xl p-6"
              >
                <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#D4AF37]/10">
                    <Zap className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  Quick Stats
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <StatTile icon={Calendar} label="Account Created" value="Mar 1, 2024" />
                  <StatTile icon={Clock} label="Last Login" value="Today, 2:45 PM" />
                  <StatTile icon={Monitor} label="Active Sessions" value="1 Device" />
                </div>
              </motion.div>

              {/* Session Management */}
              <motion.div
                variants={itemVariants}
                className="bg-[#111111] border border-white/[0.08] rounded-2xl p-6"
              >
                <h2 className="text-lg font-bold text-white mb-4">Session</h2>
                <p className="text-sm text-gray-500 mb-4">Sign out of your current session on this device.</p>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 hover:bg-red-500/20 hover:border-red-500/50 transition-all font-semibold text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  )
}

// ── Reusable info field component ──────────────────────────────────────────────

function InfoField({
  icon: Icon,
  label,
  value,
  isEditing,
  type = 'text',
  placeholder,
  options,
}: {
  icon: any
  label: string
  value: string
  isEditing: boolean
  type?: 'text' | 'email' | 'select'
  placeholder?: string
  options?: string[]
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs uppercase tracking-widest text-gray-500 font-bold flex items-center gap-2">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </label>
      {isEditing ? (
        type === 'select' ? (
          <select
            defaultValue={value}
            className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#D4AF37]/40 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/30 transition-all text-sm"
          >
            <option value="">Select size</option>
            {options?.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            defaultValue={value}
            placeholder={placeholder}
            className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#D4AF37]/40 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/30 transition-all text-sm"
          />
        )
      ) : (
        <div className="px-4 py-2.5 bg-[#0A0A0A] border border-white/5 rounded-xl text-white text-sm">
          {value || <span className="text-gray-600">Not specified</span>}
        </div>
      )}
    </div>
  )
}

// ── Stat tile component ───────────────────────────────────────────────────────

function StatTile({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="p-4 bg-[#0A0A0A]/60 rounded-xl border border-white/5 text-center">
      <Icon className="w-5 h-5 text-[#D4AF37] mx-auto mb-2" />
      <p className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-1">{label}</p>
      <p className="text-white font-semibold text-sm">{value}</p>
    </div>
  )
}
