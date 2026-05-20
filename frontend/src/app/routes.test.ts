import { describe, expect, it } from 'vitest'
import { router } from '@/app/routes'

describe('app routes', () => {
  it('includes client payments route', () => {
    const clientBranch = router.routes.find((r) => r.path === '/client')
    const childPaths =
      clientBranch && 'children' in clientBranch
        ? (clientBranch.children as { path?: string }[]).map((c) => c.path)
        : []
    expect(childPaths).toContain('payments')
  })
})
