import React, { useState, useEffect, useRef } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { FileStack, CheckCircle, XCircle, Clock, Plus, Package, FileText, Edit } from 'lucide-react'

import { rfpQueries } from '../store/queries'
import type { RFP } from '../lib/types'

import UploadModal from '../components/dashboard/UploadModal'
import RFPDetailsPanel from '../components/dashboard/RFPDetailsPanel'
import RecentRFPs from '../components/dashboard/RecentRFPs'
import AppLayout from '../layout/AppLayout'
import { BGPattern } from '../components/ui/bg-pattern'

const BarChart = ({ weekly }: { weekly?: Array<{ day: string; count: number }> }) => {
    const defaultData = [
        { label: 'Mon', value: 65 },
        { label: 'Tue', value: 45 },
        { label: 'Wed', value: 85 },
        { label: 'Thu', value: 30 },
        { label: 'Fri', value: 95 },
        { label: 'Sat', value: 55 },
        { label: 'Sun', value: 75 },
    ];

    const data = weekly && weekly.length > 0 ? weekly.map((d) => ({ label: d.day, value: d.count })) : defaultData;

    return (
        <div className="flex items-end justify-between h-full w-full gap-2 px-2 pb-2">
            {data.map((item, i) => (
                <div key={i} className="flex flex-col items-center flex-1 h-full group">
                    <div className="relative flex-1 w-full flex items-end">
                        <motion.div 
                            initial={{ height: 0 }}
                            animate={{ height: `${item.value}%` }}
                            transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                            className="w-full bg-[#D4AF37] rounded-t-sm relative"
                        >
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                {item.value}%
                            </div>
                        </motion.div>
                    </div>
                    <span className="text-[10px] text-gray-500 mt-2 font-medium uppercase tracking-tighter">{item.label}</span>
                </div>
            ))}
        </div>
    );
};

const BentoItem = ({ className, children }: { className?: string, children: React.ReactNode }) => {
    const itemRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const item = itemRef.current;
        if (!item) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            item.style.setProperty('--mouse-x', `${x}px`);
            item.style.setProperty('--mouse-y', `${y}px`);
        };

        item.addEventListener('mousemove', handleMouseMove);

        return () => {
            item.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <div ref={itemRef} className={`relative group bg-[#111111] border border-white/10 rounded-2xl p-6 overflow-hidden ${className || ''}`}>
            {/* Cybernetic mouse-follow glow effect */}
            <div 
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100" 
                style={{
                    background: `radial-gradient(600px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(212,175,55,0.08), transparent 40%)`
                }} 
            />
            <div className="relative z-10 h-full flex flex-col">
                {children}
            </div>
        </div>
    );
};

export const CyberneticBentoGrid = ({ stats, weekly, rfps, isLoading, onNewBid, onSelectRFP, onEditInventory, onAnalytics }: any) => {
    return (
        <div className="w-full z-10 max-w-7xl mx-auto mt-4">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-8">Welcome, <span className="text-[#D4AF37]">Acme Corp</span></h1>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[160px]">
                
                {/* Performance Metrics Block - large */}
                <BentoItem className="col-span-1 md:col-span-2 row-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <Package className="w-8 h-8 text-[#D4AF37]" />
                            <h2 className="text-2xl font-bold text-white">Performance Metrics</h2>
                        </div>
                        <button
                            onClick={onAnalytics}
                            className="rounded-lg bg-[#D4AF37] hover:bg-[#e2b60f] text-black font-semibold py-2 px-3 transition-all text-xs"
                        >
                            Detailed Analytics
                        </button>
                    </div>
                    <p className="text-gray-400 mb-6 text-sm">Weekly proposal generation and success rates.</p>
                    <div className="flex-1 min-h-0">
                        <BarChart weekly={weekly} />
                    </div>
                </BentoItem>

                {/* Stat Blocks */}
                <BentoItem>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-white">Total Proposals</h2>
                        <FileStack className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="text-5xl font-bold text-white mt-auto">{isLoading ? '-' : stats?.total || 0}</div>
                    <p className="text-sm text-gray-500 mt-2">Active bids processed</p>
                </BentoItem>

                <BentoItem>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-white">Accepted</h2>
                        <CheckCircle className="w-6 h-6 text-green-400" />
                    </div>
                    <div className="text-5xl font-bold text-white mt-auto">{isLoading ? '-' : stats?.accepted || 0}</div>
                    <p className="text-sm text-gray-500 mt-2">Won proposals</p>
                </BentoItem>

                <BentoItem>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-white">Rejected</h2>
                        <XCircle className="w-6 h-6 text-red-500" />
                    </div>
                    <div className="text-5xl font-bold text-white mt-auto">{isLoading ? '-' : stats?.rejected || 0}</div>
                    <p className="text-sm text-gray-500 mt-2">Missed proposals</p>
                </BentoItem>

                <BentoItem>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-white">Pending</h2>
                        <Clock className="w-6 h-6 text-[#C0C0C0]" />
                    </div>
                    <div className="text-5xl font-bold text-white mt-auto">{isLoading ? '-' : stats?.pending || 0}</div>
                    <p className="text-sm text-gray-500 mt-2">Awaiting decision</p>
                </BentoItem>


                {/* RFPs Block - full width */}
                <BentoItem className="col-span-1 md:col-span-4 row-span-2 overflow-y-auto">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <FileText className="w-8 h-8 text-[#C0C0C0]" />
                            <h2 className="text-2xl font-bold text-white">Recent RFPs</h2>
                        </div>
                        <div className="flex gap-3">
                            <button 
                                onClick={onEditInventory}
                                className="bg-white/5 hover:bg-white/10 text-white border border-white/10 font-semibold py-2 px-4 rounded-lg flex items-center justify-center transition-colors text-sm"
                            >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Inventory
                            </button>
                            <button 
                                onClick={onNewBid}
                                className="bg-[#D4AF37] hover:bg-[#E5B80B] text-black font-semibold py-2 px-4 rounded-lg flex items-center justify-center transition-colors text-sm"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                New Bid
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        {isLoading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="bg-black/30 border border-white/5 rounded-xl h-40 animate-pulse" />
                                ))}
                            </div>
                        ) : (
                            <RecentRFPs rfps={rfps ?? []} onSelectRFP={onSelectRFP} />
                        )}
                    </div>
                </BentoItem>
            </div>
        </div>
    );
};

export const Route = createFileRoute('/dashboard')({
  component: DashboardComponent,
})

function DashboardComponent() {
  const navigate = useNavigate()
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [selectedRFP, setSelectedRFP] = useState<RFP | null>(null)

  const { data: analytics, isLoading: isStatsLoading } = useQuery(rfpQueries.stats())
  const { data: rfps = [], isLoading: isRFPsLoading } = useQuery(rfpQueries.list())

  const isLoading = isStatsLoading || isRFPsLoading;
  const stats = analytics?.stats;

  return (
    <AppLayout>
      <div className="p-8 pb-32 min-h-screen relative bg-black">
        {/* Grid background pattern */}
        <BGPattern variant="grid" mask="fade-edges" size={32} fill="rgba(255, 255, 255, 0.02)" />
        
        <div className="max-w-7xl mx-auto relative z-10 space-y-2">
          <CyberneticBentoGrid 
            stats={stats} 
            weekly={analytics?.weekly}
            rfps={rfps} 
            isLoading={isLoading} 
            onNewBid={() => setIsUploadModalOpen(true)}
            onEditInventory={() => navigate({ to: '/inventory' })}
            onSelectRFP={setSelectedRFP}
            onAnalytics={() => navigate({ to: '/analytics' })}
          />

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
