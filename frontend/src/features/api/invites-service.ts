import { config } from '@/lib/config'
import { apiDelay } from '@/lib/api/delay'
import { wpFetch } from '@/lib/wordpress/client'
import { wpEndpoints } from '@/lib/wordpress/endpoints'
import type { InviteLink, MemberType } from '@/types'

const MOCK_INVITES_KEY = 'trenerka_mock_invites_v1'

interface StoredInvite {
  token: string
  memberType: MemberType
  expiresAt: string
  used: boolean
}

function loadMockInvites(): StoredInvite[] {
  try {
    const raw = localStorage.getItem(MOCK_INVITES_KEY)
    if (raw) return JSON.parse(raw) as StoredInvite[]
  } catch {
    /* ignore */
  }
  return []
}

function saveMockInvites(list: StoredInvite[]): void {
  localStorage.setItem(MOCK_INVITES_KEY, JSON.stringify(list))
}

export async function createInviteLink(memberType: MemberType = 'client'): Promise<InviteLink> {
  await apiDelay(300)
  if (config.useMockData) {
    const token = `mock-${Date.now().toString(36)}`
    const expiresAt = new Date(Date.now() + 14 * 86400000).toISOString()
    const list = loadMockInvites()
    list.push({ token, memberType, expiresAt, used: false })
    saveMockInvites(list)
    const url = `${window.location.origin}/register/client?invite=${encodeURIComponent(token)}`
    return { token, url, memberType, expiresAt }
  }
  return wpFetch<InviteLink>(wpEndpoints.invites, {
    method: 'POST',
    body: JSON.stringify({ memberType }),
  })
}

export async function validateInviteToken(token: string): Promise<{ valid: boolean; memberType?: MemberType }> {
  await apiDelay(200)
  if (config.useMockData) {
    const invite = loadMockInvites().find((i) => i.token === token && !i.used && new Date(i.expiresAt) > new Date())
    return invite ? { valid: true, memberType: invite.memberType } : { valid: false }
  }
  try {
    const res = await wpFetch<{ valid: boolean; memberType?: MemberType }>(
      `${wpEndpoints.invitesValidate}?token=${encodeURIComponent(token)}`,
    )
    return res
  } catch {
    return { valid: false }
  }
}

export function consumeMockInvite(token: string): void {
  const list = loadMockInvites()
  const i = list.findIndex((inv) => inv.token === token)
  if (i >= 0) list[i]!.used = true
  saveMockInvites(list)
}
