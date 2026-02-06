import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/__layout/$userName/post/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/__layout/$userName/post"!</div>
}
