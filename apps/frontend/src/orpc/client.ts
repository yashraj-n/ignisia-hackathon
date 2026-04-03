import { createORPCClient } from '@orpc/client'
import { RPCLink } from '@orpc/client/fetch'
import { createTanstackQueryUtils } from '@orpc/tanstack-query'
import type { RouterClient } from '@orpc/server'
import type { AppRouter } from 'backend'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:9000'

const link = new RPCLink({
  url: `${BACKEND_URL}/rpc`,
})

export const client: RouterClient<AppRouter> = createORPCClient(link)

export const orpc = createTanstackQueryUtils(client)
