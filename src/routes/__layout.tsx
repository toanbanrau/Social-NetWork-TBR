import { HeaderHome } from '@/components/home/header-home'
import NavHome from '@/components/home/nav-home'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/__layout')({
  beforeLoad: () => {
    if (typeof localStorage === 'undefined') return

    const authData = localStorage.getItem('auth')
    if (!authData) {
      throw redirect({ to: '/auth' })
    }
    try {
      const auth = JSON.parse(authData)
      if (!auth.token) {
        throw redirect({ to: '/auth' })
      }
    } catch (e) {
      throw redirect({ to: '/auth' })
    }
  },
  component: RouteComponent,
})
function RouteComponent() {
  return (
    <main className="max-w-screen scroll-auto">
      <HeaderHome />
      <div className="flex flex-1 items-center">
        <NavHome/>
        <div className="flex flex-1 items-center justify-center">
          <Outlet />
        </div>
      </div>
    </main>
  )
}