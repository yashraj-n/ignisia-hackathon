import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/settings')({
  component: SettingsComponent,
})

function SettingsComponent() {
  return (
    <div className="p-8 min-h-full">
      <h1 className="text-3xl font-bold text-white">Settings</h1>
      <p className="text-muted-foreground mt-2 text-lg">Manage your account and platform configurations.</p>
    </div>
  )
}
