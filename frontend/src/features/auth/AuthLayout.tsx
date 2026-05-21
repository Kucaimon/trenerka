import { Outlet } from 'react-router-dom'

/** Auth routes that bring their own layout (login shells, register cards). */
export function AuthLayout() {
  return <Outlet />
}
