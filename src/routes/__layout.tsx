import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/__layout')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    <hr /><Outlet/></div>
}
