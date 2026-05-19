export interface WpPost {
  id: number
  title: { rendered: string }
  content?: { rendered: string }
  meta?: Record<string, unknown>
  date: string
}

export interface WpUser {
  id: number
  email: string
  name: string
  roles: string[]
}

export interface WpAuthResponse {
  token: string
  user_email: string
  user_display_name: string
  user_nicename: string
}
