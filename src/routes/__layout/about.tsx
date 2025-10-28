import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/__layout/about")({
  component: RouteComponent,

});

function RouteComponent() {

  return (
    <div>
      <div>Hello "/__layout/about"!</div>
      <button>click</button>
      <input type="text" />
    </div>
  );
}
