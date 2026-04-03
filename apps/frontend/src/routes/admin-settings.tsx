import { createFileRoute } from '@tanstack/react-router'
import MainLayout from '../components/layout/MainLayout'
import { Users, Key, ShieldCheck, Activity, CheckCircle2, MoreVertical, Search, PlusCircle, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { Avatar, AvatarFallback } from '../components/ui/avatar'

export const Route = createFileRoute('/admin-settings')({
  component: AdminSettingsComponent,
})

function AdminSettingsComponent() {
  const teamMembers = [
    { name: "John Doe", email: "john@bidforge.com", role: "Super Admin", status: "Active" },
    { name: "Sarah Chen", email: "sarah@bidforge.com", role: "Proposal Editor", status: "Active" },
    { name: "Michael Vance", email: "mike@ignisia.io", role: "Viewer", status: "Inactive" },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.08
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { opacity: 1, scale: 1 }
  }

  return (
    <MainLayout>
      <div className="p-8 max-w-7xl mx-auto space-y-12 pb-40">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/20 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
                <ShieldCheck className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Admin Control Center</h1>
            </div>
            <p className="text-muted-foreground text-sm font-medium">Manage your enterprise environment and security configurations.</p>
          </div>
          <div className="flex gap-3">
             <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white font-medium text-sm">
                Export Audit Logs
             </button>
             <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#D4AF37]/90 transition-colors text-black font-bold text-sm shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                <PlusCircle className="w-4 h-4" /> Global Config Update
             </button>
          </div>
        </header>

        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={containerVariants}
          className="grid grid-cols-1 lg:grid-cols-4 gap-8"
        >
          {/* Quick Stats Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            <motion.section variants={cardVariants} className="glass-panel p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-[#D4AF37]/5 to-transparent">
              <h2 className="text-xs font-bold text-white uppercase tracking-[0.2em] mb-6 opacity-60">System Health</h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold mb-1 uppercase tracking-tighter">
                    <span className="text-muted-foreground">AI Queue Load</span>
                    <span className="text-[#22C55E]">Optimal</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-[#22C55E] w-[12%] shadow-[0_0_8px_#22C55E]"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold mb-1 uppercase tracking-tighter">
                    <span className="text-muted-foreground">Encryption Status</span>
                    <span className="text-[#3B82F6]">Secured</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full flex gap-1">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="h-full flex-1 bg-[#3B82F6] rounded-full"></div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.section>

            <motion.section variants={cardVariants} className="glass-panel p-6 rounded-2xl border border-white/10">
              <h2 className="text-xs font-bold text-white uppercase tracking-[0.2em] mb-6 opacity-60">Active Integrations</h2>
              <div className="space-y-4">
                {['Slack', 'Microsoft Teams', 'Gmail', 'Salesforce'].map((app, i) => (
                   <div key={app} className="flex items-center justify-between p-3 bg-[#0A0A0A]/80 rounded-xl border border-white/5">
                      <span className="text-sm text-white font-medium">{app}</span>
                      <div className={`w-2 h-2 rounded-full ${i % 2 === 0 ? 'bg-[#22C55E] shadow-[0_0_8px_#22C55E]' : 'bg-white/10'}`}></div>
                   </div>
                ))}
              </div>
            </motion.section>
          </div>

          {/* Main Controls */}
          <div className="lg:col-span-3 space-y-8">
            {/* Team Management */}
            <motion.section variants={cardVariants} className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#3B82F6]/10 flex items-center justify-center border border-[#3B82F6]/20 text-[#3B82F6]">
                    <Users className="w-4 h-4" />
                  </div>
                  <h2 className="text-lg font-bold text-white">Team Management</h2>
                </div>
                <div className="relative">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                   <input 
                     placeholder="Search members..." 
                     className="bg-[#0A0A0A] border border-white/5 pl-9 pr-4 py-1.5 rounded-lg text-sm text-white outline-none focus:border-[#D4AF37]/50 transition-all"
                   />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-[#1A1A1A]/30 border-b border-white/5">
                      <th className="px-6 py-4 text-xs uppercase font-bold text-muted-foreground tracking-widest">Member</th>
                      <th className="px-6 py-4 text-xs uppercase font-bold text-muted-foreground tracking-widest">Role</th>
                      <th className="px-6 py-4 text-xs uppercase font-bold text-muted-foreground tracking-widest">Status</th>
                      <th className="px-6 py-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {teamMembers.map((member, i) => (
                      <tr key={i} className="hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 border border-white/10 shadow-sm transition-transform group-hover:scale-105">
                              <AvatarFallback className="bg-[#1A1A1A] text-[10px] font-bold text-white">{member.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-semibold text-white">{member.name}</p>
                              <p className="text-xs text-muted-foreground">{member.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                           <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white font-medium">{member.role}</span>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-2">
                             <div className={`w-1.5 h-1.5 rounded-full ${member.status === 'Active' ? 'bg-[#22C55E]' : 'bg-[#EF4444]'}`}></div>
                             <span className="text-xs text-muted-foreground">{member.status}</span>
                           </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <button className="text-muted-foreground hover:text-white transition-colors">
                              <MoreVertical className="w-4 h-4" />
                           </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.section>

            {/* API & Security */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <motion.section variants={cardVariants} className="glass-panel p-6 rounded-2xl border border-white/10">
                  <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2 uppercase tracking-widest">
                    <Key className="w-4 h-4 text-[#D4AF37]" /> Organization API Access
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-[#0A0A0A] border border-white/5 rounded-xl space-y-2">
                       <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">Production Endpoint</label>
                       <div className="flex items-center justify-between gap-2 overflow-hidden">
                          <code className="text-xs text-[#D4AF37] font-mono truncate">bf_prod_38102984102984102</code>
                        <button className="text-[10px] font-bold px-2 py-1 bg-white/5 rounded-md hover:bg-white/10 text-white transition-all uppercase">Rotate</button>
                       </div>
                    </div>
                    <div className="flex items-center justify-between gap-3 text-xs">
                       <span className="text-muted-foreground flex items-center gap-1.5"><Activity className="w-3 h-3" /> Requests: 4.2k / month</span>
                       <span className="text-[#22C55E] flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3" /> Healthy</span>
                    </div>
                  </div>
               </motion.section>

               <motion.section variants={cardVariants} className="glass-panel p-6 rounded-2xl border border-white/10 bg-[#EF4444]/5 flex flex-col justify-between">
                  <h3 className="text-sm font-bold text-[#EF4444] mb-4 flex items-center gap-2 uppercase tracking-widest">
                    <Trash2 className="w-4 h-4" /> Danger Zone
                  </h3>
                  <div className="space-y-4">
                    <p className="text-xs text-[#EF4444] leading-relaxed opacity-80">
                      Actions here affect the entire organization. Deleting a workspace will permanently erase all analyzed proposals.
                    </p>
                    <button className="w-full py-2.5 bg-transparent border border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444]/10 rounded-xl text-xs font-bold transition-all">
                       Delete Current Workspace
                    </button>
                  </div>
               </motion.section>
            </div>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  )
}
