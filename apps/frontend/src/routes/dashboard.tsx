import React, { useState, useEffect, useRef } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { FileStack, CheckCircle, XCircle, Clock, Plus, Package, FileText, Edit, Loader2 } from 'lucide-react'
import { cn } from '../lib/utils'

import { rfpQueries, computeRFPStats } from '../store/queries'
import type { RFPItem } from '../lib/types'

import UploadModal from '../components/dashboard/UploadModal'
import AppLayout from '../layout/AppLayout'
import { BGPattern } from '../components/ui/bg-pattern'

const statusLabelMap: Record<string, string> = {
  parsed: 'Awaiting Review',
  exploring: 'Exploring',
  explored: 'Explored',
  summarising: 'Summarising',
  summarised: 'Summarised',
  generating_document: 'Generating',
  completed: 'Completed',
  parse_rejected: 'Rejected (Parse)',
  explore_rejected: 'Rejected (Explore)',
  summarise_rejected: 'Rejected (Summarise)',
  failed: 'Failed',
  processing: 'Processing',
};

function truncateInfo(info: string, max = 40): string {
  const firstLine = info.split('\n')[0] ?? '';
  return firstLine.length > max ? firstLine.slice(0, max - 1) + '…' : firstLine;
}

const BarChart = () => {
    const data = [
        { label: 'Mon', value: 65 },
        { label: 'Tue', value: 45 },
        { label: 'Wed', value: 85 },
        { label: 'Thu', value: 30 },
        { label: 'Fri', value: 95 },
        { label: 'Sat', value: 55 },
        { label: 'Sun', value: 75 },
    ];

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

const PROCESSING_STATUSES = ['exploring', 'summarising', 'generating_document'];

export const CyberneticBentoGrid = ({ stats, rfps, isLoading, onNewBid, onSelectRFP, onEditInventory }: any) => {
    return (
        <div className="w-full z-10 max-w-7xl mx-auto mt-4">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-8">Welcome, <span className="text-[#D4AF37]">Acme Corp</span></h1>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[160px]">
                
                {/* Performance Metrics Block - large */}
                <BentoItem className="col-span-1 md:col-span-2 row-span-2">
                    <div className="flex items-center gap-3 mb-4">
                        <Package className="w-8 h-8 text-[#D4AF37]" />
                        <h2 className="text-2xl font-bold text-white">Performance Metrics</h2>
                    </div>
                    <p className="text-gray-400 mb-6 text-sm">Weekly proposal generation and success rates.</p>
                    <div className="flex-1 min-h-0">
                        <BarChart />
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
                        <h2 className="text-xl font-bold text-white">Completed</h2>
                        <CheckCircle className="w-6 h-6 text-green-400" />
                    </div>
                    <div className="text-5xl font-bold text-white mt-auto">{isLoading ? '-' : stats?.completed || 0}</div>
                    <p className="text-sm text-gray-500 mt-2">Finished proposals</p>
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

                {/* Ingestion Pipeline Block - left half */}
                <BentoItem className="col-span-1 md:col-span-2 row-span-2 overflow-y-auto">
                    <div className="flex items-center gap-3 mb-6">
                        <Loader2 className={cn("w-8 h-8", rfps?.some((r: RFPItem) => PROCESSING_STATUSES.includes(r.status)) ? "text-[#D4AF37] animate-spin" : "text-gray-500")} />
                        <h2 className="text-2xl font-bold text-white">Ingestion Pipeline</h2>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-xl bg-black/20 p-6 text-center">
                        {rfps?.some((r: RFPItem) => PROCESSING_STATUSES.includes(r.status)) ? (
                            <div className="space-y-4 w-full">
                                {rfps.filter((r: RFPItem) => PROCESSING_STATUSES.includes(r.status)).map((rfp: RFPItem) => (
                                    <div key={rfp.id} className="flex flex-col gap-2 p-4 bg-black/40 border border-[#D4AF37]/30 rounded-lg text-left">
                                        <div className="flex justify-between items-center">
                                            <span className="font-semibold text-white truncate">{truncateInfo(rfp.information)}</span>
                                            <span className="text-[10px] bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-0.5 rounded font-bold uppercase tracking-widest">{statusLabelMap[rfp.status] ?? rfp.status}</span>
                                        </div>
                                        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                            <motion.div 
                                                initial={{ width: "0%" }}
                                                animate={{ width: "100%" }}
                                                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                                className="bg-[#D4AF37] h-full"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <CheckCircle className="w-12 h-12 text-green-500/50 mx-auto mb-2" />
                                <p className="text-xl font-medium text-gray-400">Ingestion pipeline currently free</p>
                                <p className="text-sm text-gray-600">Ready for next data injection</p>
                            </div>
                        )}
                    </div>
                </BentoItem>

                {/* RFPs Block - right half */}
                <BentoItem className="col-span-1 md:col-span-2 row-span-2 overflow-y-auto">
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
                           {isLoading ? (
                                [...Array(2)].map((_, i) => (
                                    <div key={i} className="bg-black/30 border border-white/5 rounded-xl h-[160px] animate-pulse" />
                                ))
                           ) : rfps?.slice(0, 2).map((rfp: RFPItem) => {
                                const dateStr = new Date(rfp.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });
                                return (
                                    <div 
                                        key={rfp.id} 
                                        onClick={() => onSelectRFP(rfp)}
                                        className="bg-black/40 border border-white/5 hover:border-[#D4AF37]/50 cursor-pointer rounded-xl p-5 flex flex-col justify-between transition-colors"
                                    >
                                       <div>
                                         <div className="font-semibold text-white truncate text-lg mb-1">{truncateInfo(rfp.information, 50)}</div>
                                         <div className="text-sm text-gray-400 line-clamp-2">{rfp.source_email ?? "Unknown source"}</div>
                                       </div>
                                       <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                                         <span className="text-xs uppercase tracking-wider text-gray-500 font-medium">{statusLabelMap[rfp.status] ?? rfp.status}</span>
                                         <span className="text-xs text-gray-600">{dateStr}</span>
                                       </div>
                                    </div>
                                );
                           })}
                           {(!isLoading && (!rfps || rfps.length === 0)) && (
                                <div className="text-gray-500 col-span-2 h-full flex items-center justify-center border border-dashed border-white/10 rounded-xl py-12">No RFPs found</div>
                           )}
                        </div>
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

  const { data: rfps = [], isLoading: isRFPsLoading } = useQuery(rfpQueries.list())

  const stats = computeRFPStats(rfps)
  const isLoading = isRFPsLoading;

  return (
    <AppLayout>
      <div className="p-8 pb-32 min-h-screen relative bg-black">
        {/* Grid background pattern */}
        <BGPattern variant="grid" mask="fade-edges" size={32} fill="rgba(255, 255, 255, 0.02)" />
        
        <div className="max-w-7xl mx-auto relative z-10 space-y-2">
          <CyberneticBentoGrid 
            stats={stats} 
            rfps={rfps} 
            isLoading={isLoading} 
            onNewBid={() => setIsUploadModalOpen(true)}
            onEditInventory={() => navigate({ to: '/inventory' })}
            onSelectRFP={(rfp: RFPItem) => navigate({ to: '/rfp/$id', params: { id: rfp.id } })}
          />

        </div>

        <UploadModal 
          isOpen={isUploadModalOpen} 
          onClose={() => setIsUploadModalOpen(false)} 
        />
      </div>
    </AppLayout>
  )
}
