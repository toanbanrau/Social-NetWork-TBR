import { HeaderHome } from '@/components/home/header-home'
import NavHome from '@/components/home/nav-home'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/__layout')({
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