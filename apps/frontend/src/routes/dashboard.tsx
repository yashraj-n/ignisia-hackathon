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
import MainLayout from '../components/layout/MainLayout'

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
    <MainLayout>
      <div className="p-8 pb-32 min-h-full">
        <div className="max-w-7xl mx-auto space-y-12">
          <header className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tight text-white mb-2">RFP Command Center</h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Streamline your procurement process with AI-powered analysis and response management.
            </p>
          </header>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <motion.button
               whileHover={{ y: -2, boxShadow: "0 10px 30px -15px rgba(212, 175, 55, 0.3)" }}
               whileTap={{ scale: 0.98 }}
               onClick={() => setIsUploadModalOpen(true)}
               className="glass-panel flex flex-col items-center justify-center rounded-xl p-6 text-muted-foreground hover:text-[#D4AF37] hover:border-[#D4AF37]/40 transition-all duration-300 group cursor-pointer h-full border-dashed border-white/10"
            >
               <div className="w-12 h-12 rounded-full border border-dashed border-muted-foreground/30 flex items-center justify-center mb-4 group-hover:border-[#D4AF37]/50 group-hover:bg-[#D4AF37]/10 transition-all duration-300">
                  <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
               </div>
               <span className="font-bold text-xs uppercase tracking-widest transition-colors duration-300">New RFP</span>
            </motion.button>

            {isLoading ? (
              <>
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="glass-panel rounded-xl p-6 h-[128px] animate-shimmer" />
                ))}
              </>
            ) : stats ? (
              <>
                <StatCard
                  title="Total RFPs"
                  value={stats.total}
                  change={stats.totalChange}
                  icon={FileStack}
                  variant="total"
                />
                <StatCard
                  title="Accepted"
                  value={stats.accepted}
                  change={stats.acceptedChange}
                  icon={CheckCircle}
                  variant="accepted"
                />
                <StatCard
                  title="Rejected"
                  value={stats.rejected}
                  change={stats.rejectedChange}
                  icon={XCircle}
                  variant="rejected"
                />
                <StatCard
                  title="Pending"
                  value={stats.pending}
                  change={stats.pendingChange}
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
                  <div key={i} className="glass-panel rounded-xl h-[160px] animate-shimmer" />
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
    </MainLayout>
  )
}
