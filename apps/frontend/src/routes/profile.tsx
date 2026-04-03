import { createFileRoute } from '@tanstack/react-router'
import MainLayout from '../components/layout/MainLayout'
import { User, Mail, Shield, Bell, Moon, Globe, Camera } from 'lucide-react'
import { motion } from 'framer-motion'
import { Avatar, AvatarFallback } from '../components/ui/avatar'

export const Route = createFileRoute('/profile')({
  component: ProfileComponent,
})

function ProfileComponent() {
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
    <MainLayout>
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
                <Avatar className="h-24 w-24 border-2 border-[#D4AF37]/30 shadow-[0_0_20px_rgba(212,175,55,0.15)] bg-[#1A1A1A]">
                  <AvatarFallback className="bg-transparent text-[#D4AF37] text-3xl font-bold">JD</AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 p-2 bg-[#D4AF37] text-black rounded-full shadow-lg hover:scale-110 transition-transform">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">John Doe</h1>
                <p className="text-muted-foreground flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#D4AF37]" /> Enterprise Admin
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors text-sm font-medium text-white">
                Edit Profile
              </button>
              <button className="px-4 py-2 rounded-lg bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90 transition-colors text-sm font-bold shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                Save Changes
              </button>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Info */}
            <div className="lg:col-span-2 space-y-8">
              <motion.section variants={itemVariants} className="glass-panel p-6 rounded-2xl border border-white/10">
                <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-[#D4AF37]" /> Personal Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Full Name</label>
                    <div className="p-3 bg-[#0A0A0A] border border-white/5 rounded-lg text-white">John Doe</div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Email Address</label>
                    <div className="p-3 bg-[#0A0A0A] border border-white/5 rounded-lg text-white">john@bidforge.com</div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Role</label>
                    <div className="p-3 bg-[#0A0A0A] border border-white/5 rounded-lg text-[#D4AF37] font-semibold">Chief Proposal Architect</div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Company</label>
                    <div className="p-3 bg-[#0A0A0A] border border-white/5 rounded-lg text-white">Ignisia Corp</div>
                  </div>
                </div>
              </motion.section>

              <motion.section variants={itemVariants} className="glass-panel p-6 rounded-2xl border border-white/10">
                <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-[#D4AF37]" /> Notification Preferences
                </h2>
                <div className="space-y-4">
                  {[
                    { label: "New Proposal Requests", sub: "Get notified when a new RFP is uploaded by the team." },
                    { label: "Compliance Alerts", sub: "Priority notifications for missing mandatory fields." },
                    { label: "Weekly Strategy Reports", sub: "Summary of proposal performance and win-rate analytics." }
                  ].map((notif, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-[#0A0A0A]/50 rounded-xl border border-white/5 group hover:border-[#D4AF37]/30 transition-colors">
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-white">{notif.label}</p>
                        <p className="text-xs text-muted-foreground">{notif.sub}</p>
                      </div>
                      <div className="w-10 h-5 bg-[#333] rounded-full relative cursor-pointer overflow-hidden p-1 shadow-inner">
                        <div className={`w-3 h-3 bg-white rounded-full transition-transform duration-300 ${i === 2 ? 'translate-x-0' : 'translate-x-5 bg-[#D4AF37]'}`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            </div>

            {/* Right Column: Settings */}
            <div className="space-y-8">
              <motion.section variants={itemVariants} className="glass-panel p-6 rounded-2xl border border-white/10">
                <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">System Settings</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center">
                        <Moon className="w-4 h-4 text-[#D4AF37]" />
                      </div>
                      <span className="text-sm text-white">Dark Mode</span>
                    </div>
                    <span className="text-xs text-[#D4AF37] font-bold">ENABLED</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#3B82F6]/10 flex items-center justify-center">
                        <Globe className="w-4 h-4 text-[#3B82F6]" />
                      </div>
                      <span className="text-sm text-white">Public Profile</span>
                    </div>
                    <div className="w-8 h-4 bg-white/5 rounded-full relative cursor-pointer"></div>
                  </div>
                </div>
              </motion.section>

              <motion.section variants={itemVariants} className="glass-panel p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-[#D4AF37]/5 to-transparent">
                <h3 className="text-sm font-bold text-[#D4AF37] mb-4 uppercase tracking-wider">Storage Usage</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-end mb-1">
                    <span className="text-2xl font-bold text-white">4.2<span className="text-xs text-muted-foreground ml-1">GB</span></span>
                    <span className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">Of 50 GB Used</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-[#D4AF37] w-[8.4%] shadow-[0_0_10px_#D4AF37]"></div>
                  </div>
                  <p className="text-[10px] text-muted-foreground italic leading-tight">
                    Your Enterprise plan includes priority AI processing and unlimited proposal analysis.
                  </p>
                </div>
              </motion.section>
            </div>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  )
}
