import { HeaderHome } from '@/components/home/header-home'
import NavHome from '@/components/home/nav-home'
import { atomAuth } from '@/stores/auth';
import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router'
import { useAtom } from 'jotai';

export const Route = createFileRoute('/__layout')({
  component: RouteComponent,
})

function RouteComponent() {
  const [auth] = useAtom(atomAuth);
  const nav = useNavigate()
  if (!auth?.user) {
     nav({to:'/auth'})
  }
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