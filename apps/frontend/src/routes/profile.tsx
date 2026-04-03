import { createFileRoute } from '@tanstack/react-router'
import AppLayout from '../layout/AppLayout'
import { User, Bell, Camera } from 'lucide-react'
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
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  }

  return (
    <AppLayout>
      <div className="p-8 max-w-5xl mx-auto min-h-full pb-32">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-10"
        >
          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <Avatar className="h-24 w-24 border-2 border-primary/30 shadow-[0_0_20px_rgba(234,179,8,0.12)] bg-[#1A1A1A]">
                  <AvatarFallback className="bg-transparent text-primary text-3xl font-bold">
                    {profile?.name ? profile.name.slice(0, 2).toUpperCase() : '..'}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 p-2 bg-primary text-black rounded-full shadow-lg hover:scale-110 transition-transform">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">
                  {loading ? 'Loading...' : profile?.name || 'Unknown'}
                </h1>
                <p className="text-muted-foreground text-sm">{profile?.login_email || ''}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors text-sm font-medium text-white">
                Edit Profile
              </button>
              <button className="px-4 py-2 rounded-lg bg-primary text-black hover:bg-primary/90 transition-colors text-sm font-bold shadow-[0_0_15px_rgba(234,179,8,0.25)]">
                Save Changes
              </button>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Info */}
            <div className="lg:col-span-2 space-y-8">
              <motion.section variants={itemVariants} className="glass-panel p-6 rounded-2xl border border-white/10">
                <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" /> Personal Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Company Name</label>
                    <div className="p-3 bg-[#0A0A0A] border border-white/5 rounded-lg text-white">
                      {loading ? 'Loading...' : profile?.name || 'Unknown'}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Email Address</label>
                    <div className="p-3 bg-[#0A0A0A] border border-white/5 rounded-lg text-white">
                      {loading ? '...' : profile?.login_email || ''}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Company Size</label>
                    <div className="p-3 bg-[#0A0A0A] border border-white/5 rounded-lg text-white">
                      {loading ? '...' : profile?.size || 'N/A'}
                    </div>
                  </div>
                </div>
              </motion.section>

              <motion.section variants={itemVariants} className="glass-panel p-6 rounded-2xl border border-white/10">
                <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary" /> Notification Preferences
                </h2>
                <div className="space-y-4">
                  {[
                    { label: "New Proposal Requests", sub: "Get notified when a new RFP is uploaded by the team.", active: true },
                    { label: "Compliance Alerts", sub: "Priority notifications for missing mandatory fields.", active: true },
                    { label: "Weekly Strategy Reports", sub: "Summary of proposal performance and win-rate analytics.", active: false }
                  ].map((notif, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-[#0A0A0A]/50 rounded-xl border border-white/5 group hover:border-primary/30 transition-colors">
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-white">{notif.label}</p>
                        <p className="text-xs text-muted-foreground">{notif.sub}</p>
                      </div>
                      <div className={`w-10 h-5 rounded-full relative cursor-pointer overflow-hidden p-0.5 shadow-inner transition-colors duration-300 ${notif.active ? 'bg-primary/30' : 'bg-white/10'}`}>
                        <div className={`w-4 h-4 rounded-full transition-transform duration-300 ${notif.active ? 'translate-x-5 bg-primary' : 'translate-x-0 bg-white/40'}`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            </div>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  )
}
