import { createFileRoute } from '@tanstack/react-router'
import { AuthPage } from '../components/auth/AuthPage'

export const Route = createFileRoute('/signup')({
  component: SignupRoute,
})

function SignupRoute() {
  return <AuthPage mode="signup" />
}
