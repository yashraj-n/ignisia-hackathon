import { useState } from 'react'
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { AnimatePresence } from 'framer-motion'
import { z } from 'zod'
import AppLayout from '../layout/AppLayout'
import RFPLoadingPage from '../components/dashboard/RFPLoadingPage'
import RFPSummaryPage from '../components/dashboard/RFPSummaryPage'
import CancelReasonModal from '../components/dashboard/CancelReasonModal'

export interface ProcessingState {
  rfpId: string
  companyId: string
  companyName: string
}

export interface SummaryData {
  missingRequirements: string[]
  companyName: string
  companyId: string
  rfpId: string
}

const searchParamsSchema = z.object({
  rfpId: z.string(),
  companyId: z.string(),
  companyName: z.string(),
})

export const Route = createFileRoute('/rfp-processing')({
  component: RFPProcessingComponent,
  validateSearch: searchParamsSchema,
})

type ProcessingStep = 'loading' | 'summary' | 'completed'

function RFPProcessingComponent() {
  const navigate = useNavigate()
  const searchParams = useSearch({ from: '/rfp-processing' })
  const [currentStep, setCurrentStep] = useState<ProcessingStep>('loading')
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null)
  const [showCancelModal, setShowCancelModal] = useState(false)

  const state: ProcessingState = {
    rfpId: searchParams.rfpId,
    companyId: searchParams.companyId,
    companyName: searchParams.companyName,
  }

  const handleLoadingComplete = (summary: SummaryData) => {
    setSummaryData(summary)
    setCurrentStep('summary')
  }

  const handleProceed = () => {
    navigate({
      to: '/rfp/$id',
      params: { id: searchParams.rfpId }
    })
  }

  const handleCancel = () => {
    setShowCancelModal(true)
  }

  const handleCancelConfirm = (reason: string) => {
    console.log('RFP cancelled with reason:', reason)
    setShowCancelModal(false)
    navigate({ to: '/dashboard' })
  }

  return (
    <AppLayout>
      <AnimatePresence mode="wait">
        {currentStep === 'loading' && (
          <RFPLoadingPage
            rfpId={state.rfpId}
            companyId={state.companyId}
            companyName={state.companyName}
            onComplete={handleLoadingComplete}
            onCancel={handleCancel}
          />
        )}
        {currentStep === 'summary' && summaryData && (
          <RFPSummaryPage
            missingRequirements={summaryData.missingRequirements}
            companyName={summaryData.companyName}
            companyId={summaryData.companyId}
            rfpId={summaryData.rfpId}
            onProceed={handleProceed}
            onCancel={handleCancel}
          />
        )}
      </AnimatePresence>

      <CancelReasonModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelConfirm}
      />
    </AppLayout>
  )
}
