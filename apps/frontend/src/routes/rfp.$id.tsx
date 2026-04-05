import { useState, useEffect, useMemo } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  Loader2,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Download,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react'
import { clsx } from 'clsx'

import { rfpQueries, exploreRfp, summariseRfp, generateDocument, rejectRfp, resetRfp } from '../store/queries'
import type { RFPItem, RFPStatus, SummariserItem } from '../lib/types'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '../components/ui/table'
import CancelReasonModal from '../components/dashboard/CancelReasonModal'
import AppLayout from '../layout/AppLayout'
import { BGPattern } from '../components/ui/bg-pattern'

// ---------------------------------------------------------------------------
// Route definition
// ---------------------------------------------------------------------------

export const Route = createFileRoute('/rfp/$id')({
  component: RFPDetailPage,
})

// ---------------------------------------------------------------------------
// Constants & helpers
// ---------------------------------------------------------------------------

const STEPS = ['Parse', 'Explore', 'Summarise', 'Generate Document'] as const

const POLLING_STATUSES: RFPStatus[] = ['processing', 'exploring', 'summarising', 'generating_document']
const TERMINAL_STATUSES: RFPStatus[] = [
  'parse_rejected',
  'explore_rejected',
  'summarise_rejected',
  'failed',
]

function statusToStep(status: RFPStatus): number {
  switch (status) {
    case 'processing':
    case 'parsed':
    case 'exploring':
      return 0
    case 'explored':
    case 'summarising':
      return 1
    case 'summarised':
    case 'generating_document':
      return 2
    case 'completed':
      return 3
    default:
      return -1 // terminal / rejected
  }
}

function isPolling(status: RFPStatus): boolean {
  return POLLING_STATUSES.includes(status)
}

function isTerminal(status: RFPStatus): boolean {
  return TERMINAL_STATUSES.includes(status)
}

/**
 * Lightweight markdown → HTML converter.
 * Handles headings, bold, italic, unordered lists, and newlines.
 * No library required.
 */
function simpleMarkdownToHtml(md: string): string {
  let html = md
    // Escape HTML entities first
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // Headings (must come before bold since ### contains no bold markers)
  html = html.replace(/^#### (.+)$/gm, '<h4>$1</h4>')
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>')
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>')

  // Bold & italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')

  // Unordered list items (- item)
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>')
  // Wrap consecutive <li> in <ul>
  html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>')

  // Line breaks (double newline → paragraph break, single → <br>)
  html = html.replace(/\n{2,}/g, '</p><p>')
  html = html.replace(/\n/g, '<br/>')

  // Wrap in paragraph
  html = `<p>${html}</p>`

  return html
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

function RFPDetailPage() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const {
    data: rfp,
    isLoading,
    isError,
    refetch,
  } = useQuery(rfpQueries.detail(id))

  const [showRejectModal, setShowRejectModal] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  // ---------------------------------------------------------------------------
  // Polling – re-fetch every 3 s while the RFP is in an async status
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!rfp || !isPolling(rfp.status)) return

    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ['rfps', id] })
    }, 3000)

    return () => clearInterval(interval)
  }, [rfp?.status, id, queryClient])

  // ---------------------------------------------------------------------------
  // Derived state
  // ---------------------------------------------------------------------------
  const activeStep = useMemo(() => (rfp ? statusToStep(rfp.status) : 0), [rfp?.status])
  const terminal = rfp ? isTerminal(rfp.status) : false

  // ---------------------------------------------------------------------------
  // Action handlers
  // ---------------------------------------------------------------------------
  async function handleExplore() {
    setActionLoading(true)
    try {
      await exploreRfp(id)
      await queryClient.invalidateQueries({ queryKey: ['rfps', id] })
    } catch (e) {
      console.error(e)
    } finally {
      setActionLoading(false)
    }
  }

  async function handleSummarise() {
    setActionLoading(true)
    try {
      await summariseRfp(id)
      await queryClient.invalidateQueries({ queryKey: ['rfps', id] })
    } catch (e) {
      console.error(e)
    } finally {
      setActionLoading(false)
    }
  }

  async function handleGenerate(choices: { itemIndex: number; selectedOptionIndex: number }[]) {
    setActionLoading(true)
    try {
      await generateDocument(id, choices)
      await queryClient.invalidateQueries({ queryKey: ['rfps', id] })
    } catch (e) {
      console.error(e)
    } finally {
      setActionLoading(false)
    }
  }

  async function handleReject(reason: string) {
    setShowRejectModal(false)
    setActionLoading(true)
    try {
      await rejectRfp(id, reason)
      await queryClient.invalidateQueries({ queryKey: ['rfps', id] })
      navigate({ to: '/dashboard' })
    } catch (e) {
      console.error(e)
    } finally {
      setActionLoading(false)
    }
  }

  async function handleReset() {
    setActionLoading(true)
    try {
      await resetRfp(id)
      await queryClient.invalidateQueries({ queryKey: ['rfps', id] })
    } catch (e) {
      console.error(e)
    } finally {
      setActionLoading(false)
    }
  }

  // ---------------------------------------------------------------------------
  // Loading / Error states
  // ---------------------------------------------------------------------------
  if (isLoading) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-black flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-[#D4AF37] animate-spin" />
        </div>
      </AppLayout>
    )
  }

  if (isError || !rfp) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="glass-panel rounded-2xl p-10 text-center max-w-md space-y-4">
            <XCircle className="w-12 h-12 text-destructive mx-auto" />
            <h2 className="text-xl font-bold text-white">Failed to load RFP</h2>
            <p className="text-muted-foreground text-sm">
              Something went wrong while fetching this RFP. Please try again.
            </p>
            <button
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#D4AF37] hover:bg-[#E5B80B] text-black font-semibold transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          </div>
        </div>
      </AppLayout>
    )
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <AppLayout>
      <div className="min-h-screen bg-black p-6 sm:p-8 pb-32 relative">
        <BGPattern variant="grid" mask="fade-edges" size={32} fill="rgba(255, 255, 255, 0.02)" />

        <div className="max-w-5xl mx-auto relative z-10 space-y-8">
          {/* Back link */}
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Dashboard
          </Link>

          {/* ---------------------------------------------------------------- */}
          {/* Progress stepper                                                 */}
          {/* ---------------------------------------------------------------- */}
          {!terminal && (
            <div className="glass-panel rounded-2xl p-6">
              <div className="flex items-center justify-between">
                {STEPS.map((label, i) => {
                  const completed = i < activeStep
                  const active = i === activeStep
                  const future = i > activeStep

                  return (
                    <div key={label} className="flex items-center flex-1 last:flex-initial">
                      {/* Step circle + label */}
                      <div className="flex flex-col items-center gap-2 relative">
                        <div
                          className={clsx(
                            'w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300',
                            completed && 'bg-[#D4AF37] text-black',
                            active &&
                            'border-2 border-[#D4AF37] text-[#D4AF37] shadow-[0_0_18px_rgba(234,179,8,0.35)]',
                            future && 'border border-white/15 text-white/30',
                          )}
                        >
                          {completed ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : (
                            i + 1
                          )}
                        </div>
                        <span
                          className={clsx(
                            'text-xs font-medium whitespace-nowrap',
                            completed && 'text-[#D4AF37]',
                            active && 'text-white',
                            future && 'text-white/30',
                          )}
                        >
                          {label}
                        </span>
                        {/* Active pulse ring */}
                        {active && (
                          <motion.div
                            layoutId="step-ring"
                            className="absolute -inset-1.5 rounded-full border-2 border-[#D4AF37]/40"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0.3, 0.7, 0.3] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        )}
                      </div>

                      {/* Connector line */}
                      {i < STEPS.length - 1 && (
                        <div className="flex-1 mx-3 h-px relative">
                          <div className="absolute inset-0 bg-white/10" />
                          {completed && (
                            <motion.div
                              className="absolute inset-0 bg-[#D4AF37]"
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: 1 }}
                              transition={{ duration: 0.5 }}
                              style={{ transformOrigin: 'left' }}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* ---------------------------------------------------------------- */}
          {/* Terminal state (rejected / failed)                               */}
          {/* ---------------------------------------------------------------- */}
          {terminal && <TerminalPanel rfp={rfp} navigate={navigate} onReset={handleReset} actionLoading={actionLoading} />}

          {/* ---------------------------------------------------------------- */}
          {/* Step panels                                                      */}
          {/* ---------------------------------------------------------------- */}
          {!terminal && activeStep === 0 && (
            <ParsePanel
              rfp={rfp}
              actionLoading={actionLoading}
              onExplore={handleExplore}
              onReject={() => setShowRejectModal(true)}
            />
          )}

          {!terminal && activeStep === 1 && (
            <ExplorePanel
              rfp={rfp}
              actionLoading={actionLoading}
              onSummarise={handleSummarise}
              onReject={() => setShowRejectModal(true)}
            />
          )}

          {!terminal && activeStep === 2 && (
            <SummarisePanel
              rfp={rfp}
              actionLoading={actionLoading}
              onGenerate={handleGenerate}
              onReject={() => setShowRejectModal(true)}
            />
          )}

          {!terminal && activeStep === 3 && (
            <DocumentPanel rfp={rfp} navigate={navigate} onReset={handleReset} actionLoading={actionLoading} />
          )}
        </div>

        {/* Reject modal */}
        <CancelReasonModal
          isOpen={showRejectModal}
          onClose={() => setShowRejectModal(false)}
          onConfirm={handleReject}
        />
      </div>
    </AppLayout>
  )
}

// ===========================================================================
// Step 0 — Parse Panel
// ===========================================================================

function ParsePanel({
  rfp,
  actionLoading,
  onExplore,
  onReject,
}: {
  rfp: RFPItem
  actionLoading: boolean
  onExplore: () => void
  onReject: () => void
}) {
  if (rfp.status === 'processing' || rfp.status === 'exploring') {
    const isParsing = rfp.status === 'processing'
    return <SpinnerCard message={isParsing ? "Refining parse results..." : "Triggering exploration..."} />
  }

  const parsed = rfp.parsed_output
  const missingFields = parsed?.missingFields ?? []

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Parsed content */}
      <div className="glass-panel rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-white">Parsed RFP Content</h2>
        <pre className="whitespace-pre-wrap text-sm text-white/80 leading-relaxed max-h-[400px] overflow-y-auto bg-black/30 rounded-xl p-5 border border-white/5">
          {parsed?.parsedContent ?? 'No parsed content available.'}
        </pre>
      </div>

      {/* Missing fields */}
      <div className="glass-panel rounded-2xl p-6 space-y-3">
        <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider">
          Missing Fields
        </h3>
        <div className="flex flex-wrap gap-2">
          {missingFields.length === 0 ? (
            <span className="inline-flex items-center gap-1.5 bg-green-500/10 border border-green-500/30 text-green-300 text-xs px-3 py-1.5 rounded-full font-medium">
              <CheckCircle2 className="w-3 h-3" />
              No missing fields
            </span>
          ) : (
            missingFields.map((field) => (
              <span
                key={field}
                className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs px-3 py-1.5 rounded-full font-medium"
              >
                <AlertTriangle className="w-3 h-3" />
                {field}
              </span>
            ))
          )}
        </div>
      </div>

      {/* Actions */}
      <ActionBar
        primaryLabel="Proceed to Explore"
        onPrimary={onExplore}
        onReject={onReject}
        loading={actionLoading}
      />
    </motion.div>
  )
}

// ===========================================================================
// Step 1 — Explore Panel
// ===========================================================================

function ExplorePanel({
  rfp,
  actionLoading,
  onSummarise,
  onReject,
}: {
  rfp: RFPItem
  actionLoading: boolean
  onSummarise: () => void
  onReject: () => void
}) {
  if (rfp.status === 'summarising') {
    return <SpinnerCard message="Running summariser…" />
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="glass-panel rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-white">Exploration Results</h2>
        <div
          className="prose prose-invert prose-sm max-w-none prose-headings:text-[#D4AF37] prose-strong:text-white prose-li:text-white/80 bg-black/30 rounded-xl p-5 border border-white/5 max-h-[500px] overflow-y-auto"
          dangerouslySetInnerHTML={{
            __html: simpleMarkdownToHtml(rfp.explore_output ?? ''),
          }}
        />
      </div>

      <ActionBar
        primaryLabel="Proceed to Summarise"
        onPrimary={onSummarise}
        onReject={onReject}
        loading={actionLoading}
      />
    </motion.div>
  )
}

// ===========================================================================
// Step 2 — Summarise Panel
// ===========================================================================

function SummarisePanel({
  rfp,
  actionLoading,
  onGenerate,
  onReject,
}: {
  rfp: RFPItem
  actionLoading: boolean
  onGenerate: (choices: { itemIndex: number; selectedOptionIndex: number }[]) => void
  onReject: () => void
}) {
  if (rfp.status === 'generating_document') {
    return <SpinnerCard message="Generating final document…" />
  }

  const items: SummariserItem[] = rfp.summarise_output?.items ?? []

  // Selection state: key = item index, value = selected option index
  const [selections, setSelections] = useState<Record<number, number>>(() => {
    const initial: Record<number, number> = {}
    items.forEach((item, i) => {
      initial[i] = item.recommended_option_index
    })
    return initial
  })

  // Re-sync when items change (e.g. after refetch)
  useEffect(() => {
    const initial: Record<number, number> = {}
    items.forEach((item, i) => {
      initial[i] = item.recommended_option_index
    })
    setSelections(initial)
  }, [rfp.summarise_output])

  const allSelected = Object.keys(selections).length === items.length

  function handleGenerateClick() {
    const choices = Object.entries(selections).map(([itemIndex, selectedOptionIndex]) => ({
      itemIndex: Number(itemIndex),
      selectedOptionIndex,
    }))
    onGenerate(choices)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="glass-panel rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Summarised Pricing Comparison</h2>
          <span className="text-xs text-white/40">Click an option to select it for each item</span>
        </div>

        <div className="rounded-xl border border-white/10 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 bg-white/[0.03]">
                <TableHead className="text-white/60">Item</TableHead>
                <TableHead className="text-white/60">Our Price</TableHead>
                <TableHead className="text-white/60">Avg Competitor Price</TableHead>
                <TableHead className="text-white/60">Options</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, idx) => {
                const selectedIdx = selections[idx] ?? item.recommended_option_index

                return (
                  <TableRow key={idx} className="border-white/5 hover:bg-white/[0.03]">
                    <TableCell className="font-medium text-white">{item.name}</TableCell>
                    <TableCell className="text-white/80">{item.current_price}</TableCell>
                    <TableCell className="text-white/80">
                      {item.avg_competitor_price ?? '—'}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1.5">
                        {item.options.map((opt, oi) => {
                          const isSelected = oi === selectedIdx
                          const isRecommended = oi === item.recommended_option_index

                          return (
                            <button
                              key={oi}
                              type="button"
                              onClick={() =>
                                setSelections((prev) => ({ ...prev, [idx]: oi }))
                              }
                              className={clsx(
                                'text-xs px-2.5 py-1 rounded-full border font-medium transition-all duration-200 cursor-pointer inline-flex items-center gap-1',
                                isSelected
                                  ? 'bg-[#D4AF37]/15 border-[#D4AF37]/40 text-[#D4AF37] shadow-[0_0_8px_rgba(212,175,55,0.15)]'
                                  : 'bg-white/5 border-white/10 text-white/50 hover:border-white/25 hover:text-white/70',
                              )}
                            >
                              {opt}
                              {isRecommended && (
                                <span className="text-[10px] opacity-70" title="AI Recommended">★</span>
                              )}
                            </button>
                          )
                        })}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
              {items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    No summarised items available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <ActionBar
        primaryLabel="Generate Final Document"
        onPrimary={handleGenerateClick}
        onReject={onReject}
        loading={actionLoading}
        disabled={!allSelected}
      />
    </motion.div>
  )
}

// ===========================================================================
// Step 3 — Document Panel
// ===========================================================================

function DocumentPanel({
  rfp,
  navigate,
  onReset,
  actionLoading,
}: {
  rfp: RFPItem
  navigate: ReturnType<typeof useNavigate>
  onReset: () => void
  actionLoading: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-panel rounded-2xl p-10 text-center space-y-6"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
      >
        <CheckCircle2 className="w-20 h-20 text-green-400 mx-auto drop-shadow-[0_0_24px_rgba(34,197,94,0.4)]" />
      </motion.div>
      <h2 className="text-2xl font-bold text-white">Document Ready!</h2>
      <p className="text-muted-foreground text-sm max-w-md mx-auto">
        Your final proposal document has been generated successfully and is ready for download.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <a
          href={rfp.final_document_url ?? '#'}
          target="_blank"
          rel="noopener noreferrer"
          download
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#E5B80B] text-black font-bold transition-colors shadow-[0_0_20px_rgba(234,179,8,0.3)]"
        >
          <Download className="w-5 h-5" />
          Download PDF
        </a>
        <button
          onClick={() => navigate({ to: '/dashboard' })}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        <button
          onClick={onReset}
          disabled={actionLoading}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-amber-500/20 text-amber-400 hover:bg-amber-500/10 font-medium transition-all"
        >
          {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          Re-process AI
        </button>
      </div>
    </motion.div>
  )
}

// ===========================================================================
// Terminal (rejected / failed) panel
// ===========================================================================

function TerminalPanel({
  rfp,
  navigate,
  onReset,
  actionLoading,
}: {
  rfp: RFPItem
  navigate: ReturnType<typeof useNavigate>
  onReset: () => void
  actionLoading: boolean
}) {
  const isFailed = rfp.status === 'failed'
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel rounded-2xl p-10 text-center space-y-6"
    >
      <XCircle
        className={clsx(
          'w-16 h-16 mx-auto',
          isFailed ? 'text-destructive' : 'text-amber-400',
        )}
      />
      <h2 className="text-2xl font-bold text-white">
        {isFailed ? 'Processing Failed' : 'RFP Rejected'}
      </h2>

      {rfp.rejection_reason && (
        <p className="text-muted-foreground text-sm max-w-md mx-auto bg-white/5 rounded-lg p-4 border border-white/10">
          {rfp.rejection_reason}
        </p>
      )}

      {rfp.rejected_at_step && (
        <p className="text-xs text-muted-foreground">
          Rejected at step: <span className="text-white/70 font-medium">{rfp.rejected_at_step}</span>
        </p>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <button
          onClick={() => navigate({ to: '/dashboard' })}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        <button
          onClick={onReset}
          disabled={actionLoading}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-amber-500/20 text-amber-400 hover:bg-amber-500/10 font-medium transition-all"
        >
          {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          Re-process AI
        </button>
      </div>
    </motion.div>
  )
}

// ===========================================================================
// Shared sub-components
// ===========================================================================

function SpinnerCard({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass-panel rounded-2xl p-16 flex flex-col items-center justify-center gap-4"
    >
      <Loader2 className="w-10 h-10 text-[#D4AF37] animate-spin" />
      <p className="text-white/70 text-sm font-medium">{message}</p>
      <p className="text-white/30 text-xs">This may take a moment — polling for updates…</p>
    </motion.div>
  )
}

function ActionBar({
  primaryLabel,
  onPrimary,
  onReject,
  loading,
  disabled,
}: {
  primaryLabel: string
  onPrimary: () => void
  onReject: () => void
  loading: boolean
  disabled?: boolean
}) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 sm:justify-end">
      <button
        onClick={onReject}
        disabled={loading}
        className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-destructive/40 text-destructive hover:bg-destructive/10 font-medium transition-colors disabled:opacity-50"
      >
        Reject
      </button>
      <button
        onClick={onPrimary}
        disabled={loading || disabled}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#E5B80B] text-black font-bold transition-colors disabled:opacity-50 shadow-[0_0_15px_rgba(234,179,8,0.2)]"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {primaryLabel}
      </button>
    </div>
  )
}
