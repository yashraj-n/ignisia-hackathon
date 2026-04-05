import { useEffect } from 'react'
import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
  Link,
  useRouter,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'
import { Button } from '../components/ui/button'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

const THEME_INIT_SCRIPT = `(function(){try{document.documentElement.classList.add('dark');document.documentElement.style.colorScheme='dark';}catch(e){}})();`

export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: () => {
    // Corrected: Handled in RootDocument to avoid hydration mismatch in beforeLoad logic
  },
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'BidForge — AI-Powered RFP Automation',
      },
    ],
    links: [
      {
        rel: 'icon',
        type: 'image/png',
        href: '/bidforge-icon.png?v=3',
      },
      {
        rel: 'shortcut icon',
        type: 'image/png',
        href: '/bidforge-icon.png?v=3',
      },
      {
        rel: 'stylesheet',
        href: '/src/styles.css',
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-background">
      <div className="size-20 rounded-2xl bg-destructive/10 flex items-center justify-center mb-6">
        <span className="text-4xl text-destructive">404</span>
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Page Not Found</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        The page you are looking for might have been moved or doesn't exist. Let's get you back on track.
      </p>
      <Link to="/dashboard">
        <Button variant="default" size="lg" className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-black">
          Back to Dashboard
        </Button>
      </Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-background">
      <div className="size-20 rounded-2xl bg-destructive/10 flex items-center justify-center mb-6">
        <span className="text-4xl text-destructive">⚠️</span>
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Something went wrong</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.
      </p>
      <div className="text-sm text-muted-foreground mb-6">
        <details>
          <summary className="cursor-pointer">Error details</summary>
          <pre className="mt-2 p-4 bg-muted rounded text-left overflow-auto max-w-2xl">
            {error.message}
          </pre>
        </details>
      </div>
      <Link to="/dashboard">
        <Button variant="default" size="lg" className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-black">
          Back to Dashboard
        </Button>
      </Link>
    </div>
  ),
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    const publicRoutes = ['/', '/signup', '/auth']
    if (!publicRoutes.includes(window.location.pathname)) {
      if (!localStorage.getItem('token')) {
        router.navigate({ to: '/auth', replace: true })
      }
    }
  }, [router])

  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body suppressHydrationWarning>
        {children}
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
