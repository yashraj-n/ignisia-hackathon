import { createFileRoute } from '@tanstack/react-router'
import MainLayout from '../components/layout/MainLayout'

export const Route = createFileRoute('/workspace')({
  component: WorkspaceComponent,
})

function WorkspaceComponent() {
  return (
    <MainLayout>
      <div className="p-8 min-h-full">
        <h1 className="text-3xl font-bold text-white">RFP Workspace</h1>
        <p className="text-muted-foreground mt-2 text-lg">Manage your active RFPs and drafts.</p>
      </div>
    </MainLayout>
  )
}
