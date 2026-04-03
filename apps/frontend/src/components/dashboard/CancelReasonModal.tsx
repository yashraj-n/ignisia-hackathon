import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { clsx } from 'clsx'

interface CancelReasonModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (reason: string) => void
}

const cancelReasons = [
  { id: 'missing-requirements', label: 'Missing Critical Requirements' },
  { id: 'wrong-file', label: 'Wrong File Uploaded' },
  { id: 'review-later', label: 'Want to Review and Try Again' },
  { id: 'other', label: 'Other Reason' },
]

export default function CancelReasonModal({
  isOpen,
  onClose,
  onConfirm,
}: CancelReasonModalProps) {
  const [selectedReason, setSelectedReason] = useState<string | null>(null)
  const [otherReason, setOtherReason] = useState('')

  const handleConfirm = () => {
    const reason = selectedReason === 'other' ? otherReason : selectedReason
    if (reason) {
      onConfirm(reason)
      // Reset state
      setSelectedReason(null)
      setOtherReason('')
    }
  }

  const isValid =
    selectedReason &&
    (selectedReason !== 'other' || otherReason.trim().length > 0)

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative w-full max-w-md glass-panel rounded-2xl border border-white/10 overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#111111]/95">
              <h2 className="text-xl font-bold text-white">Cancel RFP Processing?</h2>
              <button
                onClick={onClose}
                className="p-2 text-muted-foreground hover:text-white hover:bg-white/5 rounded-full transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <p className="text-sm text-muted-foreground mb-6">
                Before we cancel, could you tell us why? This helps us improve.
              </p>

              {/* Reason Options */}
              <div className="space-y-2">
                {cancelReasons.map((reason) => (
                  <motion.button
                    key={reason.id}
                    onClick={() => setSelectedReason(reason.id)}
                    className={clsx(
                      'w-full p-3 rounded-lg border text-left text-sm font-medium transition-all',
                      selectedReason === reason.id
                        ? 'bg-primary/10 border-primary/40 text-white shadow-[0_0_15px_rgba(234,179,8,0.2)]'
                        : 'bg-white/5 border-white/10 text-white/70 hover:border-white/20 hover:bg-white/[0.07]'
                    )}
                  >
                    {reason.label}
                  </motion.button>
                ))}
              </div>

              {/* Custom Reason Input */}
              {selectedReason === 'other' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4"
                >
                  <textarea
                    value={otherReason}
                    onChange={(e) => setOtherReason(e.target.value)}
                    placeholder="Please tell us your reason..."
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    {otherReason.length}/200 characters
                  </p>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 bg-[#0A0A0A] border-t border-white/10 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-2 px-4 rounded-lg border border-white/10 text-white hover:bg-white/5 transition-colors font-medium"
              >
                Keep Processing
              </button>
              <button
                onClick={handleConfirm}
                disabled={!isValid}
                className="flex-1 py-2 px-4 rounded-lg bg-red-500/80 text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Cancel RFP
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
