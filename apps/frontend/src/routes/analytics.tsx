import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/analytics')({
  component: AnalyticsComponent,
})

function AnalyticsComponent() {
  return (
    <div className="p-8 min-h-full">
      <h1 className="text-3xl font-bold text-white">Analytics</h1>
      <p className="text-muted-foreground mt-2 text-lg">Insights and performance metrics.</p>
    </div>
  )
}
