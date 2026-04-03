import { createFileRoute } from '@tanstack/react-router'
import DemoOne from '../components/demo-auth'

export const Route = createFileRoute('/auth')({
  component: AuthRoute,
})

function AuthRoute() {
  return <DemoOne />
}
