import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { FileStack, CheckCircle, XCircle, Clock, Plus } from 'lucide-react'

import { rfpQueries } from '../store/queries'
import type { RFP } from '../lib/types'

import StatCard from '../components/dashboard/StatCard'
import RecentRFPs from '../components/dashboard/RecentRFPs'
import UploadModal from '../components/dashboard/UploadModal'
import RFPDetailsPanel from '../components/dashboard/RFPDetailsPanel'
import AppLayout from '../layout/AppLayout'

export const Route = createFileRoute('/dashboard')({
  component: DashboardComponent,
})

function DashboardComponent() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [selectedRFP, setSelectedRFP] = useState<RFP | null>(null)

  const { data: stats, isLoading: isStatsLoading } = useQuery(rfpQueries.stats())
  const { data: rfps = [], isLoading: isRFPsLoading } = useQuery(rfpQueries.list())

  const isLoading = isStatsLoading || isRFPsLoading;

  return (
    <AppLayout>
      <div className="p-8 pb-32 min-h-full">
        <div className="max-w-7xl mx-auto space-y-12">
          <header className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tight text-white mb-2">BidForge Command Center</h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Precision proposal forging powered by AI. Manage your sales pipeline with authority.
            </p>
          </header>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <motion.button
               whileHover={{ scale: 1.1, boxShadow: "0 0 30px rgba(212, 175, 55, 0.4)" }}
               whileTap={{ scale: 0.95 }}
               transition={{ duration: 0.2 }}
               onClick={() => setIsUploadModalOpen(true)}
               className="glass-panel flex flex-col items-center justify-center rounded-xl p-6 text-muted-foreground hover:text-[#D4AF37] hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/5 transition-all duration-300 group cursor-pointer h-full border-dashed border-white/20 relative overflow-hidden"
            >
               <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
               <div className="w-12 h-12 rounded-full border border-dashed border-muted-foreground/30 flex items-center justify-center mb-4 group-hover:border-[#D4AF37]/50 group-hover:bg-[#D4AF37]/20 group-hover:shadow-[0_0_15px_rgba(212,175,55,0.5)] transition-all duration-300 relative z-10">
                  <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
               </div>
               <span className="font-bold text-xs uppercase tracking-widest transition-colors duration-300 relative z-10">New Bid</span>
            </motion.button>

            {isLoading ? (
              <>
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="glass-panel rounded-xl p-6 h-[128px] animate-shimmer relative">
                    <div className="flex justify-between mb-4">
                      <div className="h-4 w-24 bg-white/5 rounded" />
                      <div className="h-8 w-8 bg-white/5 rounded-lg" />
                    </div>
                    <div className="h-8 w-16 bg-white/5 rounded mb-2" />
                  </div>
                ))}
              </>
            ) : stats ? (
              <>
                <StatCard
                  title="Total Proposals"
                  value={stats.total}
                  change={stats.totalChange ?? 0}
                  icon={FileStack}
                  variant="total"
                />
                <StatCard
                  title="Accepted"
                  value={stats.accepted}
                  change={stats.acceptedChange ?? 0}
                  icon={CheckCircle}
                  variant="accepted"
                />
                <StatCard
                  title="Rejected"
                  value={stats.rejected}
                  change={stats.rejectedChange ?? 0}
                  icon={XCircle}
                  variant="rejected"
                />
                <StatCard
                  title="Pending"
                  value={stats.pending}
                  change={stats.pendingChange ?? 0}
                  icon={Clock}
                  variant="pending"
                />
              </>
            ) : null}
          </div>

          {/* Recent RFPs Section */}
          {isLoading ? (
            <div className="space-y-4">
              <div className="h-8 w-48 glass-panel rounded animate-shimmer" />
              <div className="grid grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="glass-panel rounded-xl h-[180px] p-5 animate-shimmer relative">
                    <div className="flex justify-between items-start mb-4">
                      <div className="space-y-2 flex-1">
                        <div className="h-5 w-3/4 bg-white/5 rounded" />
                        <div className="h-4 w-1/2 bg-white/5 rounded" />
                      </div>
                      <div className="h-6 w-16 bg-white/5 rounded-md" />
                    </div>
                    <div className="mt-auto pt-4 border-t border-white/5 flex gap-4">
                      <div className="h-3 w-20 bg-white/5 rounded" />
                      <div className="h-3 w-16 bg-white/5 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <RecentRFPs rfps={rfps} onSelectRFP={setSelectedRFP} />
          )}
        </div>

        <UploadModal 
          isOpen={isUploadModalOpen} 
          onClose={() => setIsUploadModalOpen(false)} 
        />
        
        <RFPDetailsPanel 
          rfp={selectedRFP} 
          onClose={() => setSelectedRFP(null)} 
        />
      </div>
    </AppLayout>
  )
}
