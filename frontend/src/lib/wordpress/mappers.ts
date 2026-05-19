import type { Client, Exercise } from '@/types'
import type { WpPost } from './types'

export function mapWpClient(post: WpPost): Client {
  const meta = post.meta ?? {}
  return {
    id: String(post.id),
    name: post.title.rendered,
    email: String(meta.email ?? ''),
    phone: String(meta.phone ?? ''),
    status: (meta.status as Client['status']) ?? 'active',
    joinedAt: post.date,
    packageBalance: Number(meta.package_balance ?? 0),
    lastSession: meta.last_session ? String(meta.last_session) : undefined,
    goal: meta.goal ? String(meta.goal) : undefined,
    notes: meta.notes ? String(meta.notes) : undefined,
  }
}

export function mapWpExercise(post: WpPost): Exercise {
  const meta = post.meta ?? {}
  return {
    id: String(post.id),
    name: post.title.rendered,
    muscleGroup: String(meta.muscle_group ?? ''),
    equipment: String(meta.equipment ?? ''),
    difficulty: (meta.difficulty as Exercise['difficulty']) ?? 'intermediate',
  }
}
