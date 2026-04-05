import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle2, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { clsx } from 'clsx'

interface RFPSummaryPageProps {
  missingRequirements: string[]
  companyName: string
  companyId: string
  rfpId: string
  onProceed: () => void
  onCancel: () => void
}

export default function RFPSummaryPage({
  missingRequirements,
  companyName,
  companyId,
  rfpId,
  onProceed,
  onCancel,
}: RFPSummaryPageProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopy = (text: string, type: 'company' | 'rfp') => {
    navigator.clipboard.writeText(text)
    setCopiedId(type)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex items-center justify-center min-h-full p-4"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-3xl"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">RFP Summary</h1>
          <p className="text-muted-foreground">
            Review the analysis results and missing requirements below
          </p>
        </motion.div>

        <div className="space-y-6">
          {/* Company Info Card */}
          <motion.div
            variants={itemVariants}
            className="glass-panel rounded-2xl p-6 border border-white/10"
          >
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              Company Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Company Name */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                  Company Name
                </label>
                <div className="flex items-center gap-2 bg-white/5 rounded-lg border border-white/10 px-4 py-3">
                  <span className="text-sm font-medium text-white flex-1">
                    {companyName}
                  </span>
                  <button
                    onClick={() => handleCopy(companyName, 'company')}
                    className="p-1 text-muted-foreground hover:text-white transition-colors"
                    title="Copy company name"
                  >
                    {copiedId === 'company' ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Company ID */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                  Company ID
                </label>
                <div className="flex items-center gap-2 bg-white/5 rounded-lg border border-white/10 px-4 py-3">
                  <span className="text-sm font-mono text-white/70 flex-1 truncate">
                    {companyId}
                  </span>
                  <button
                    onClick={() => handleCopy(companyId, 'rfp')}
                    className="p-1 text-muted-foreground hover:text-white transition-colors shrink-0"
                    title="Copy company ID"
                  >
                    {copiedId === 'rfp' ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* RFP ID */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                  RFP ID
                </label>
                <div className="flex items-center gap-2 bg-white/5 rounded-lg border border-white/10 px-4 py-3">
                  <span className="text-sm font-mono text-white/70 flex-1 truncate">
                    {rfpId}
                  </span>
                </div>
              </div>

              {/* Processing Status */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                  Status
                </label>
                <div className="flex items-center gap-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20 px-4 py-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-sm font-medium text-emerald-400">
                    Analysis Complete
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Missing Requirements Card */}
          <motion.div
            variants={itemVariants}
            className={clsx(
              'glass-panel rounded-2xl p-6 border border-white/10',
              missingRequirements.length > 0 && 'border-amber-500/30 bg-amber-500/5'
            )}
          >
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <AlertCircle
                className={clsx(
                  'w-5 h-5',
                  missingRequirements.length > 0
                    ? 'text-amber-500'
                    : 'text-emerald-500'
                )}
              />
              {missingRequirements.length > 0
                ? 'Missing Requirements'
                : 'No Missing Requirements'}
            </h2>

            {missingRequirements.length > 0 ? (
              <div className="space-y-2">
                {missingRequirements.map((requirement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-amber-500/20 hover:border-amber-500/40 transition-colors"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                    <p className="text-sm text-white/90 leading-relaxed">
                      {requirement}
                    </p>
                  </motion.div>
                ))}

                <div className="mt-4 p-4 bg-amber-500/5 rounded-lg border border-amber-500/20">
                  <p className="text-sm text-amber-200">
                    <span className="font-semibold">Note:</span> You can proceed
                    with these missing requirements, but they may affect proposal
                    quality.
                  </p>
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-6 text-center"
              >
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <p className="text-sm text-white/80">
                  All required information appears to be present in the RFP.
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex gap-3 pt-4"
          >
            <button
              onClick={onCancel}
              className="flex-1 py-3 px-4 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={onProceed}
              className="flex-1 py-3 px-4 rounded-lg bg-[#D4AF37] text-black hover:bg-[#E5B80B] transition-colors font-medium shadow-[0_0_20px_rgba(234,179,8,0.3)]"
            >
              Proceed to Workspace
            </button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}
