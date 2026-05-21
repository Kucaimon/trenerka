#!/usr/bin/env node
/**
 * Smoke test Trenerka WP REST (public + optional JWT).
 * Usage:
 *   node scripts/smoke-api.mjs
 *   WP_API_URL=https://wp.trenerka-fit.ru/wp-json node scripts/smoke-api.mjs
 *   WP_API_URL=... WP_EMAIL=... WP_PASSWORD=... node scripts/smoke-api.mjs
 */

const base = (process.env.WP_API_URL || 'http://localhost/wp-json').replace(/\/$/, '')

const publicRoutes = [
  ['GET', '/'],
  ['GET', '/trenerka/v1/invites/validate?token=invalid'],
]

const authedRoutes = [
  ['GET', '/trenerka/v1/auth/me'],
  ['GET', '/trenerka/v1/clients'],
  ['GET', '/trenerka/v1/admin/stats'],
  ['GET', '/trenerka/v1/admin/platform-plans'],
  ['GET', '/trenerka/v1/analytics/summary-export'],
]

async function fetchJson(method, path, token) {
  const headers = { Accept: 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`
  const res = await fetch(`${base}${path}`, { method, headers })
  const text = await res.text()
  let body = text
  try {
    body = JSON.parse(text)
  } catch {
    /* plain */
  }
  return { status: res.status, body }
}

async function login() {
  const email = process.env.WP_EMAIL
  const password = process.env.WP_PASSWORD
  if (!email || !password) return null
  const res = await fetch(`${base}/jwt-auth/v1/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: email, password }),
  })
  const data = await res.json().catch(() => ({}))
  return data.token || null
}

function ok(status, path) {
  return status >= 200 && status < 500
}

let failed = 0

console.log(`Smoke: ${base}\n`)

for (const [method, path] of publicRoutes) {
  const { status } = await fetchJson(method, path)
  const pass = ok(status, path)
  console.log(`${pass ? '✓' : '✗'} ${method} ${path} → ${status}`)
  if (!pass) failed++
}

const token = await login()
if (token) {
  console.log('\nAuthenticated checks:')
  for (const [method, path] of authedRoutes) {
    const { status } = await fetchJson(method, path, token)
    const pass = status >= 200 && status < 400
    console.log(`${pass ? '✓' : '✗'} ${method} ${path} → ${status}`)
    if (!pass) failed++
  }
} else {
  console.log('\n(skip authed routes — set WP_EMAIL and WP_PASSWORD)')
}

console.log(failed ? `\n${failed} check(s) failed` : '\nAll checks passed')
process.exit(failed ? 1 : 0)
