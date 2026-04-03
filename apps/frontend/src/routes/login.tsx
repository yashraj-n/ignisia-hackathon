import { createFileRoute } from '@tanstack/react-router'
import { AuthPage } from '../components/auth/AuthPage'

export const Route = createFileRoute('/login')({
  component: LoginRoute,
})

function LoginRoute() {
  return <AuthPage mode="login" />
}
