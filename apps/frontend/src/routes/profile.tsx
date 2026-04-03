import { createFileRoute } from '@tanstack/react-router'
import AppLayout from '../layout/AppLayout'
import { User, Bell, Camera, Zap, LogOut } from 'lucide-react'
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
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  }

  const handleSignOut = () => {
    localStorage.removeItem('token')
    router.navigate({ to: '/auth' })
  }

  return (
    <AppLayout>
      <div className="p-8 max-w-7xl mx-auto min-h-full pb-32">
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
                <button className="absolute bottom-0 right-0 p-2 bg-primary text-black rounded-full shadow-lg hover:scale-110 transition-transform group-hover:shadow-[0_0_20px_rgba(234,179,8,0.4)]">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-1">
                  {loading ? 'Loading...' : profile?.name || 'Unknown'}
                </h1>
                <p className="text-muted-foreground text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  {profile?.login_email || ''}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="px-6 py-2.5 rounded-lg border border-white/10 hover:bg-white/5 transition-colors text-sm font-semibold text-white"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
              <button className="px-6 py-2.5 rounded-lg bg-primary text-black hover:bg-primary/90 transition-colors text-sm font-bold shadow-[0_0_15px_rgba(234,179,8,0.25)]">
                Save Changes
              </button>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Info */}
            <div className="lg:col-span-2 space-y-8">
              {/* Personal Information */}
              <motion.section variants={itemVariants} className="glass-panel p-6 rounded-2xl border border-white/10">
                <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" /> Personal Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Company Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        defaultValue={loading ? 'Loading...' : profile?.name || 'Unknown'}
                        className="w-full px-4 py-2 bg-[#0A0A0A] border border-primary/50 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
                      />
                    ) : (
                      <div className="p-3 bg-[#0A0A0A] border border-white/5 rounded-lg text-white">
                        {loading ? 'Loading...' : profile?.name || 'Unknown'}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Email Address</label>
                    {isEditing ? (
                      <input
                        type="email"
                        defaultValue={loading ? '...' : profile?.login_email || ''}
                        className="w-full px-4 py-2 bg-[#0A0A0A] border border-primary/50 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
                      />
                    ) : (
                      <div className="p-3 bg-[#0A0A0A] border border-white/5 rounded-lg text-white">
                        {loading ? '...' : profile?.login_email || ''}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Company Size</label>
                    {isEditing ? (
                      <select className="w-full px-4 py-2 bg-[#0A0A0A] border border-primary/50 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all">
                        <option value="">Select size</option>
                        <option>1-10</option>
                        <option>11-50</option>
                        <option>51-200</option>
                        <option>201-500</option>
                      </select>
                    ) : (
                      <div className="p-3 bg-[#0A0A0A] border border-white/5 rounded-lg text-white">
                        {loading ? '...' : profile?.size || 'N/A'}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Industry</label>
                    {isEditing ? (
                      <input
                        type="text"
                        placeholder="Enter your industry"
                        className="w-full px-4 py-2 bg-[#0A0A0A] border border-primary/50 rounded-lg text-white placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
                      />
                    ) : (
                      <div className="p-3 bg-[#0A0A0A] border border-white/5 rounded-lg text-muted-foreground">
                        Not specified
                      </div>
                    )}
                  </div>
                </div>
              </motion.section>

              {/* Notification Preferences */}
              <motion.section variants={itemVariants} className="glass-panel p-6 rounded-2xl border border-white/10">
                <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary" /> Notification Preferences
                </h2>
                <div className="space-y-4">
                  {[
                    { label: "New Proposal Requests", sub: "Get notified when a new RFP is uploaded by the team.", active: true },
                    { label: "Competitor Updates", sub: "Notifications when new competitors are added to the system.", active: true },
                    { label: "Inventory Changes", sub: "Get alerted on inventory modifications and updates.", active: false },
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

            {/* Right Column: Session & Security */}
            <div className="space-y-8">
              {/* Account Activity */}
              <motion.section variants={itemVariants} className="glass-panel p-6 rounded-2xl border border-white/10">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" /> Quick Stats
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-[#0A0A0A]/50 rounded-xl border border-white/5">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-1">Account Created</p>
                    <p className="text-white font-semibold">March 1, 2024</p>
                  </div>
                  <div className="p-4 bg-[#0A0A0A]/50 rounded-xl border border-white/5">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-1">Last Login</p>
                    <p className="text-white font-semibold">Today at 2:45 PM</p>
                  </div>
                  <div className="p-4 bg-[#0A0A0A]/50 rounded-xl border border-white/5">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-1">Active Sessions</p>
                    <p className="text-white font-semibold">1 Device</p>
                  </div>
                </div>
              </motion.section>



              {/* Session Management */}
              <motion.section variants={itemVariants} className="glass-panel p-6 rounded-2xl border border-white/10">
                <h3 className="text-lg font-bold text-white mb-4">Session</h3>
                <button 
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/20 border border-red-500/50 rounded-lg text-red-100 hover:bg-red-500/30 transition-colors font-semibold text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </motion.section>
            </div>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  )
}
