import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, Loader2 } from 'lucide-react'
import { API_BASE_URL } from '../../lib/utils'

interface RFPLoadingPageProps {
  rfpId: string
  companyId: string
  companyName: string
  onComplete: (summary: { missingRequirements: string[]; companyName: string; companyId: string; rfpId: string }) => void
  onCancel: () => void
}

export default function RFPLoadingPage({
  rfpId,
  companyId,
  companyName,
  onComplete,
  onCancel,
}: RFPLoadingPageProps) {
  const [isProcessing, setIsProcessing] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const processRFP = async () => {
      try {
        // Simulate processing time (8-10 seconds total)
        await new Promise((resolve) => setTimeout(resolve, 8000 + Math.random() * 2000))

        setIsProcessing(false)

        // Fetch missing requirements and summary
        const response = await fetch(`${API_BASE_URL}/api/rfp/${rfpId}/summary`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch RFP summary')
        }

        const data = await response.json()

        onComplete({
          missingRequirements: data.missingRequirements || [],
          companyName,
          companyId,
          rfpId,
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to process RFP')
        setIsProcessing(false)
      }
    }

    processRFP()
  }, [rfpId, companyId, companyName, onComplete])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex items-center justify-center min-h-full p-4"
    >
      <div className="w-full max-w-2xl">
        <div className="glass-panel rounded-2xl p-8 border border-white/10">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Processing Your RFP
            </h1>
            <p className="text-muted-foreground">
              {companyName} • Analyzing document with AI pipeline
            </p>
          </div>

          {/* Error state */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-400">Processing Error</p>
                <p className="text-xs text-red-300/80 mt-1">{error}</p>
              </div>
            </motion.div>
          )}

          {/* Loading indicator */}
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="mb-8 h-12 w-12 text-primary animate-spin" aria-hidden />
            <p className="text-sm text-muted-foreground text-center max-w-md">
              Our AI is analyzing your RFP document and extracting key requirements.
              This may take a few moments...
            </p>
          </div>


          {/* Processing stats */}
          <div className="bg-white/5 rounded-lg border border-white/10 p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Processing Status
                </p>
                <p className="text-lg font-semibold text-white">
                  {isProcessing ? 'Analyzing Document' : 'Analysis Complete'}
                </p>
              </div>
              <div className="w-16 h-16 rounded-full bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/30">
                <span className="text-2xl font-bold text-primary">
                  {isProcessing ? '...' : '✓'}
                </span>
              </div>
            </div>
          </div>

          {/* Cancel button */}
          {isProcessing && (
            <motion.button
              onClick={onCancel}
              disabled={!isProcessing}
              className="w-full py-3 px-4 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
            >
              Cancel Processing
            </motion.button>
          )}

          {!isProcessing && !error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <p className="text-sm text-muted-foreground">
                Generating summary...
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
