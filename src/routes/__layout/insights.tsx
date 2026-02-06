import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/__layout/insights")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="max-w-2xl w-full">
      {/* <h1 className="font-medium text-xl">Insight</h1> */}
      <div className="flex flex-col gap-2 border p-4 rounded-xl">
        <p className="font-medium">Your weekly recap is ready!</p>
        <p className="text-[#999999]">See how things went last week.</p>
      </div>
    </div>
  );
}
