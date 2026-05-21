/**
 * Trenerka Fit — extended member model (client, student, academy).
 * Stage 2: full course marketplace, public funnel — see lib/features/academy.ts
 */

/** Who the person is in the coaching/academy ecosystem */
export type MemberType =
  | 'client'
  | 'student'
  | 'academy_member'
  | 'course_buyer'
  | 'online_trainee'
  | 'prospect_trainer'

/** CRM pipeline stage (NASM Edge–style lifecycle) */
export type LifecycleStatus =
  | 'lead'
  | 'active_client'
  | 'student'
  | 'academy_member'
  | 'alumni'
  | 'paused'
  | 'churned'

/** Post-registration / CRM onboarding steps */
export type OnboardingState =
  | 'invited'
  | 'registered'
  | 'profile_pending'
  | 'program_pending'
  | 'active'
  | 'completed'

/** Shared material categories for CRM attachments & chat */
export type MaterialCategory =
  | 'program'
  | 'presentation'
  | 'meal_plan'
  | 'certificate'
  | 'document'
  | 'other'

export interface ClientAttachment {
  id: string
  clientId: string
  name: string
  url: string
  category: MaterialCategory
  mimeType?: string
  sizeBytes?: number
  createdAt: string
}

export interface InviteLink {
  token: string
  url: string
  memberType: MemberType
  expiresAt: string
}

/** Stage 2 (out of scope): program/cohort threads — not group course chat MVP */
export type CommunicationThreadKind = 'direct' | 'program' | 'course' | 'academy_cohort'

export interface CommunicationThreadRef {
  kind: CommunicationThreadKind
  clientId: string
  programId?: string
  courseId?: string
  cohortId?: string
}
