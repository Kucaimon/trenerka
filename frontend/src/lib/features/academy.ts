/**
 * Academy / online coaching module — feature flags & future routes.
 * Stage 1: CRM fields + invites; Stage 2: marketplace, payments, Telegram.
 */

export const ACADEMY_FEATURE_FLAGS = {
  /** CRM lifecycle, invites, attachments */
  crmAcademyFlow: true,
  /** Public course catalog & checkout */
  courseMarketplace: false,
  /** Self-serve registration without invite */
  publicRegistrationFunnel: false,
  /** Manager role, trainer directory */
  multiTrainerOrg: false,
} as const

/** Planned routes (not registered until Stage 2) */
export const ACADEMY_ROUTE_PREFIX = '/trainer/academy' as const

export const PLANNED_ACADEMY_ROUTES = {
  courses: `${ACADEMY_ROUTE_PREFIX}/courses`,
  cohorts: `${ACADEMY_ROUTE_PREFIX}/cohorts`,
  certificates: `${ACADEMY_ROUTE_PREFIX}/certificates`,
} as const
