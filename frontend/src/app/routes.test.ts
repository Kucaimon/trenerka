import { describe, expect, it } from 'vitest'
import type { RouteObject } from 'react-router-dom'
import { router } from '@/app/routes'

function collectPaths(routes: RouteObject[]): string[] {
  return routes.flatMap((route) => {
    const own = route.path ? [route.path] : []
    const nested = route.children ? collectPaths(route.children) : []
    return [...own, ...nested]
  })
}

describe('app routes', () => {
  it('exposes role-specific login entry points', () => {
    const paths = collectPaths(router.routes)
    expect(paths).toContain('/login')
    expect(paths).toContain('/login/trainer')
    expect(paths).toContain('/login/smart-fitness')
    expect(paths).toContain('/login/client')
    expect(paths).toContain('/login/admin')
  })

  it('includes client payments route', () => {
    const clientBranch = router.routes.find((r) => r.path === '/client')
    const childPaths =
      clientBranch && 'children' in clientBranch
        ? (clientBranch.children as { path?: string }[]).map((c) => c.path)
        : []
    expect(childPaths).toContain('payments')
    expect(childPaths).toContain('nutrition')
  })
})
