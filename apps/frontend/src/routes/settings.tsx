import { createFileRoute } from '@tanstack/react-router'
import AppLayout from '../layout/AppLayout'
import { 
  Settings, 
  Bell, 
  Lock, 
  Users, 
  CreditCard, 
  Key, 
  Eye, 
  EyeOff,
  Copy,
  RotateCcw,
  ChevronRight
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

export const Route = createFileRoute('/settings')({
  component: SettingsComponent,
})

interface SettingsTab {
  id: string
  label: string
  icon: React.ReactNode
}

const settingsTabs: SettingsTab[] = [
  { id: 'general', label: 'General', icon: <Settings className="w-4 h-4" /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
  { id: 'security', label: 'Security', icon: <Lock className="w-4 h-4" /> },
  { id: 'api', label: 'API Keys', icon: <Key className="w-4 h-4" /> },
  { id: 'team', label: 'Team', icon: <Users className="w-4 h-4" /> },
  { id: 'billing', label: 'Billing', icon: <CreditCard className="w-4 h-4" /> },
]

function SettingsComponent() {
  const [activeTab, setActiveTab] = useState('general')
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [apiKeyVisible, setApiKeyVisible] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    fetch('http://localhost:9000/api/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.company) setProfile(data.company)
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.05
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  }

  const renderGeneralSettings = () => (
    <motion.div variants={itemVariants} className="space-y-6">
      <div className="glass-panel p-6 rounded-2xl border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-6">Company Information</h3>
        <div className="space-y-4">
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-2 block">Company Name</label>
            <input
              type="text"
              placeholder="Enter company name"
              defaultValue={loading ? 'Loading...' : profile?.name || ''}
              className="w-full px-4 py-2 bg-[#0A0A0A] border border-white/10 rounded-lg text-white placeholder-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-2 block">Email Address</label>
            <input
              type="email"
              placeholder="Enter email"
              defaultValue={loading ? '' : profile?.login_email || ''}
              className="w-full px-4 py-2 bg-[#0A0A0A] border border-white/10 rounded-lg text-white placeholder-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-2 block">Company Size</label>
            <select className="w-full px-4 py-2 bg-[#0A0A0A] border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all">
              <option value="">Select company size</option>
              <option value="1-10">1-10 employees</option>
              <option value="11-50">11-50 employees</option>
              <option value="51-200">51-200 employees</option>
              <option value="201-500">201-500 employees</option>
              <option value="500+">500+ employees</option>
            </select>
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-2 block">Industry</label>
            <input
              type="text"
              placeholder="e.g., Manufacturing, Retail, Services"
              className="w-full px-4 py-2 bg-[#0A0A0A] border border-white/10 rounded-lg text-white placeholder-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
            />
          </div>
          <button className="mt-6 px-6 py-2 bg-primary text-black font-semibold rounded-lg hover:bg-primary/90 transition-colors shadow-[0_0_15px_rgba(234,179,8,0.25)]">
            Save Changes
          </button>
        </div>
      </div>
    </motion.div>
  )

  const renderNotificationSettings = () => (
    <motion.div variants={itemVariants} className="space-y-6">
      <div className="glass-panel p-6 rounded-2xl border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-6">Email Notifications</h3>
        <div className="space-y-4">
          {[
            { label: "New Proposals", description: "Get notified about new proposal requests", active: true },
            { label: "Competitor Updates", description: "Updates when new competitors are added", active: true },
            { label: "Inventory Changes", description: "Notifications for inventory modifications", active: false },
            { label: "Weekly Digest", description: "Receive weekly summary and analytics", active: true },
            { label: "Security Alerts", description: "Important security-related notifications", active: true },
            { label: "System Updates", description: "Platform maintenance and feature announcements", active: false }
          ].map((notif, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-[#0A0A0A]/50 rounded-xl border border-white/5 hover:border-primary/30 transition-colors">
              <div>
                <p className="text-sm font-semibold text-white">{notif.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{notif.description}</p>
              </div>
              <div className={`w-10 h-5 rounded-full relative cursor-pointer overflow-hidden p-0.5 shadow-inner transition-colors duration-300 ${notif.active ? 'bg-primary/30' : 'bg-white/10'}`}>
                <div className={`w-4 h-4 rounded-full transition-transform duration-300 ${notif.active ? 'translate-x-5 bg-primary' : 'translate-x-0 bg-white/40'}`}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )

  const renderSecuritySettings = () => (
    <motion.div variants={itemVariants} className="space-y-6">
      <div className="glass-panel p-6 rounded-2xl border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-6">Password & Authentication</h3>
        <div className="space-y-4">
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-2 block">Current Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter current password"
                className="w-full px-4 py-2 bg-[#0A0A0A] border border-white/10 rounded-lg text-white placeholder-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-2 block">New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              className="w-full px-4 py-2 bg-[#0A0A0A] border border-white/10 rounded-lg text-white placeholder-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-2 block">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm new password"
              className="w-full px-4 py-2 bg-[#0A0A0A] border border-white/10 rounded-lg text-white placeholder-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
            />
          </div>
          <button className="mt-6 px-6 py-2 bg-primary text-black font-semibold rounded-lg hover:bg-primary/90 transition-colors shadow-[0_0_15px_rgba(234,179,8,0.25)]">
            Update Password
          </button>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-white/10 border-orange-500/30">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <Lock className="w-5 h-5 text-orange-400" /> Two-Factor Authentication
        </h3>
        <p className="text-sm text-muted-foreground mb-4">Enhanced security for your account</p>
        <button className="px-6 py-2 bg-orange-500/20 border border-orange-500/50 text-orange-100 font-semibold rounded-lg hover:bg-orange-500/30 transition-colors">
          Enable 2FA
        </button>
      </div>
    </motion.div>
  )

  const renderAPISettings = () => (
    <motion.div variants={itemVariants} className="space-y-6">
      <div className="glass-panel p-6 rounded-2xl border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-6">API Keys</h3>
        <p className="text-sm text-muted-foreground mb-6">Manage API keys for integrations and automations</p>
        <div className="space-y-4">
          <div className="p-4 bg-[#0A0A0A]/50 rounded-xl border border-white/5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-semibold text-white">Production API Key</p>
                <p className="text-xs text-muted-foreground mt-1">Created on March 15, 2024</p>
              </div>
              <span className="px-3 py-1 bg-green-500/20 border border-green-500/50 text-green-100 text-xs font-semibold rounded-full">Active</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-[#0A0A0A] rounded-lg border border-white/5">
              <input
                type={apiKeyVisible ? "text" : "password"}
                value="sk_live_98765432109876543210"
                readOnly
                className="flex-1 bg-transparent text-white text-sm outline-none"
              />
              <button
                onClick={() => setApiKeyVisible(!apiKeyVisible)}
                className="p-1 text-muted-foreground hover:text-white transition-colors"
              >
                {apiKeyVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button className="p-1 text-muted-foreground hover:text-white transition-colors">
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <div className="flex gap-2 mt-3">
              <button className="flex-1 px-3 py-1.5 border border-white/10 text-white text-xs font-semibold rounded-lg hover:bg-white/5 transition-colors flex items-center justify-center gap-1">
                <RotateCcw className="w-3 h-3" /> Regenerate
              </button>
              <button className="flex-1 px-3 py-1.5 border border-red-500/30 text-red-100 text-xs font-semibold rounded-lg hover:bg-red-500/10 transition-colors">
                Delete
              </button>
            </div>
          </div>
          <button className="w-full mt-4 px-6 py-2 bg-primary text-black font-semibold rounded-lg hover:bg-primary/90 transition-colors shadow-[0_0_15px_rgba(234,179,8,0.25)]">
            Generate New API Key
          </button>
        </div>
      </div>
    </motion.div>
  )

  const renderTeamSettings = () => (
    <motion.div variants={itemVariants} className="space-y-6">
      <div className="glass-panel p-6 rounded-2xl border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Team Members</h3>
          <button className="px-4 py-2 bg-primary text-black font-semibold rounded-lg hover:bg-primary/90 transition-colors text-sm shadow-[0_0_15px_rgba(234,179,8,0.25)]">
            Invite Member
          </button>
        </div>
        <div className="space-y-3">
          {[
            { name: "You", email: "admin@company.com", role: "Owner", joined: "March 1, 2024" },
            { name: "John Doe", email: "john@company.com", role: "Editor", joined: "March 10, 2024" },
            { name: "Jane Smith", email: "jane@company.com", role: "Viewer", joined: "March 15, 2024" }
          ].map((member, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-[#0A0A0A]/50 rounded-xl border border-white/5 hover:border-primary/30 transition-colors">
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">{member.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{member.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 bg-primary/20 border border-primary/50 text-primary text-xs font-semibold rounded-full">{member.role}</span>
                <button className="text-muted-foreground hover:text-white transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )

  const renderBillingSettings = () => (
    <motion.div variants={itemVariants} className="space-y-6">
      <div className="glass-panel p-6 rounded-2xl border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-6">Current Plan</h3>
        <div className="p-4 bg-gradient-to-r from-primary/10 to-transparent rounded-xl border border-primary/30 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">Professional Plan</p>
              <p className="text-xs text-muted-foreground mt-1">$99/month • Renews on April 15, 2024</p>
            </div>
            <button className="px-4 py-2 bg-white/10 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors text-sm">
              Upgrade Plan
            </button>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-white mb-4">Billing History</h3>
        <div className="space-y-3">
          {[
            { date: "March 15, 2024", amount: "$99.00", status: "Paid" },
            { date: "February 15, 2024", amount: "$99.00", status: "Paid" },
            { date: "January 15, 2024", amount: "$99.00", status: "Paid" }
          ].map((invoice, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-[#0A0A0A]/50 rounded-xl border border-white/5">
              <div>
                <p className="text-sm font-semibold text-white">{invoice.date}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-white">{invoice.amount}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${invoice.status === 'Paid' ? 'bg-green-500/20 text-green-100 border border-green-500/50' : 'bg-yellow-500/20 text-yellow-100 border border-yellow-500/50'}`}>
                  {invoice.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">Payment Method</h3>
        <div className="p-4 bg-[#0A0A0A]/50 rounded-xl border border-white/5 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-white">Visa ending in 4242</p>
            <p className="text-xs text-muted-foreground mt-1">Expires 12/25</p>
          </div>
          <button className="px-4 py-2 border border-white/10 text-white font-semibold rounded-lg hover:bg-white/5 transition-colors text-sm">
            Update
          </button>
        </div>
      </div>
    </motion.div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings()
      case 'notifications':
        return renderNotificationSettings()
      case 'security':
        return renderSecuritySettings()
      case 'api':
        return renderAPISettings()
      case 'team':
        return renderTeamSettings()
      case 'billing':
        return renderBillingSettings()
      default:
        return null
    }
  }

  return (
    <AppLayout>
      <div className="p-8 min-h-full">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-8"
        >
          {/* Header */}
          <header>
            <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
            <p className="text-muted-foreground text-lg">Manage your account, security, and platform configurations.</p>
          </header>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4 -mb-4">
            {settingsTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-t-lg font-medium transition-all duration-300 border-b-2 ${
                  activeTab === tab.id
                    ? 'border-primary text-primary bg-primary/5'
                    : 'border-transparent text-muted-foreground hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </motion.div>
      </div>
    </AppLayout>
  )
}
