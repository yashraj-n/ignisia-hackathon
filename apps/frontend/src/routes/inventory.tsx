import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Package, Swords, Plus, FileText, ExternalLink, Calendar, Loader2, PackageOpen } from 'lucide-react'
import { clsx } from 'clsx'

import { inventoryQueries } from '../store/queries'
import type { InventoryItem, CompetitorItem } from '../lib/types'
import { publicFileUrl } from '../lib/s3'
import AppLayout from '../layout/AppLayout'
import { BGPattern } from '../components/ui/bg-pattern'
import InventoryUploadModal from '@/components/inventory/InventoryUploadModal'

export const Route = createFileRoute('/inventory')({
  component: InventoryComponent,
})

function InventoryComponent() {
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [uploadTarget, setUploadTarget] = useState<'inventory' | 'competitor'>('inventory')

  const { data: inventory = [], isLoading: isInventoryLoading } = useQuery(inventoryQueries.list())
  const { data: competitors = [], isLoading: isCompetitorsLoading } = useQuery(inventoryQueries.competitors())

  const handleUpload = (target: 'inventory' | 'competitor') => {
    setUploadTarget(target)
    setIsUploadOpen(true)
  }

  return (
    <AppLayout>
      <div className="p-8 pb-32 min-h-full relative">
        <BGPattern variant="dots" mask="fade-edges" size={28} fill="rgba(234, 179, 8, 0.03)" />

        <div className="max-w-7xl mx-auto space-y-10 relative z-10">
          {/* Header */}
          <header>
            <h1 className="text-4xl font-bold tracking-tight text-white mb-1">Inventory Intel</h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Track your assets and monitor competitor intelligence side by side.
            </p>
          </header>

          {/* Two-section grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Our Inventory */}
            <InventorySection
              title="Our Inventory"
              subtitle="Your company's uploaded assets and documents"
              icon={Package}
              items={inventory}
              isLoading={isInventoryLoading}
              accentColor="primary"
              onUpload={() => handleUpload('inventory')}
            />

            {/* Competitor Intelligence */}
            <InventorySection
              title="Competitor Intel"
              subtitle="Competitor documents and analysis"
              icon={Swords}
              items={competitors}
              isLoading={isCompetitorsLoading}
              accentColor="accent"
              onUpload={() => handleUpload('competitor')}
            />
          </div>
        </div>

        <InventoryUploadModal
          isOpen={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
          target={uploadTarget}
        />
      </div>
    </AppLayout>
  )
}

/* ──────────────────────────────────────────────────────── */

interface InventorySectionProps {
  title: string
  subtitle: string
  icon: typeof Package
  items: (InventoryItem | CompetitorItem)[]
  isLoading: boolean
  accentColor: 'primary' | 'accent'
  onUpload: () => void
}

function InventorySection({ title, subtitle, icon: Icon, items, isLoading, accentColor, onUpload }: InventorySectionProps) {
  const colors = {
    primary: {
      iconBg: 'bg-primary/10 text-primary',
      border: 'border-primary/20',
      glow: 'shadow-[0_0_15px_rgba(234,179,8,0.1)]',
      badge: 'bg-primary/10 text-primary border-primary/20',
    },
    accent: {
      iconBg: 'bg-accent/10 text-accent',
      border: 'border-accent/20',
      glow: 'shadow-[0_0_15px_rgba(232,133,74,0.1)]',
      badge: 'bg-accent/10 text-accent border-accent/20',
    },
  }
  const c = colors[accentColor]

  return (
    <div className="space-y-4">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={clsx('p-2.5 rounded-lg', c.iconBg)}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{title}</h2>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onUpload}
          className={clsx(
            'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300',
            accentColor === 'primary'
              ? 'bg-primary/15 text-primary border border-primary/30 hover:bg-primary/25 hover:shadow-[0_0_20px_rgba(234,179,8,0.15)]'
              : 'bg-accent/15 text-accent border border-accent/30 hover:bg-accent/25 hover:shadow-[0_0_20px_rgba(232,133,74,0.15)]'
          )}
        >
          <Plus className="w-4 h-4" />
          Add New
        </motion.button>
      </div>

      {/* Items list */}
      <div className="glass-panel rounded-xl border border-white/[0.08] overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center text-muted-foreground gap-3">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="text-sm">Loading...</span>
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-center gap-4">
            <div className={clsx('p-4 rounded-full', c.iconBg, 'opacity-50')}>
              <PackageOpen className="w-8 h-8" />
            </div>
            <div>
              <p className="text-white font-medium mb-1">No items yet</p>
              <p className="text-muted-foreground text-sm max-w-[200px]">
                Upload a PDF or CSV to get started
              </p>
            </div>
            <button
              onClick={onUpload}
              className={clsx(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border transition-colors',
                accentColor === 'primary'
                  ? 'border-primary/30 text-primary hover:bg-primary/10'
                  : 'border-accent/30 text-accent hover:bg-accent/10'
              )}
            >
              <Plus className="w-3.5 h-3.5" />
              Add First Item
            </button>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {items.map((item, idx) => {
              const fileHref = item.s3_url ? publicFileUrl(item.s3_url) : null
              return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-4 hover:bg-white/[0.02] transition-colors group cursor-default"
              >
                <div className="flex items-start gap-3">
                  {fileHref ? (
                    <a
                      href={fileHref}
                      target="_blank"
                      rel="noreferrer"
                      title="Open file"
                      className={clsx(
                        'p-2 rounded-lg shrink-0 mt-0.5 transition-colors hover:opacity-90',
                        c.iconBg
                      )}
                    >
                      <FileText className="w-4 h-4" />
                    </a>
                  ) : (
                    <div className={clsx('p-2 rounded-lg shrink-0 mt-0.5', c.iconBg)}>
                      <FileText className="w-4 h-4" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-white font-medium text-sm truncate">{item.name}</h3>
                      {fileHref && (
                        <a
                          href={fileHref}
                          target="_blank"
                          rel="noreferrer"
                          title="Open in new tab"
                          className="text-muted-foreground hover:text-primary transition-colors shrink-0"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                    <p className="text-muted-foreground text-xs line-clamp-2 mb-2">{item.information}</p>
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground/60">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
