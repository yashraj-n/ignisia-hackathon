import { createFileRoute } from '@tanstack/react-router'
import AppLayout from '../layout/AppLayout'

export const Route = createFileRoute('/workspace')({
  component: WorkspaceComponent,
})

function WorkspaceComponent() {
  return (
    <AppLayout>
      <div className="p-8 min-h-full">
        <h1 className="text-3xl font-bold text-white">RFP Workspace</h1>
        <p className="text-muted-foreground mt-2 text-lg">Manage your active RFPs and drafts.</p>
      </div>
    </AppLayout>
  )
}
