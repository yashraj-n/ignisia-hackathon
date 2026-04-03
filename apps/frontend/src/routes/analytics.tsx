import { createFileRoute } from '@tanstack/react-router'
import MainLayout from '../components/layout/MainLayout'

export const Route = createFileRoute('/analytics')({
  component: AnalyticsComponent,
})

function AnalyticsComponent() {
  return (
    <MainLayout>
      <div className="p-8 min-h-full">
        <h1 className="text-3xl font-bold text-white">Analytics</h1>
        <p className="text-muted-foreground mt-2 text-lg">Insights and performance metrics.</p>
      </div>
    </MainLayout>
  )
}
