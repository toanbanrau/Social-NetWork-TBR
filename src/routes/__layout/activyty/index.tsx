import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/__layout/activyty/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/__layout/activyty/"!</div>
}
