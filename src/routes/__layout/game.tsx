import { createFileRoute, useSearch } from "@tanstack/react-router";
import { z } from "zod";
import { zodValidator } from "@tanstack/zod-adapter";

const productSearchSchema = z.object({
  page: z.number().default(1),
  filter: z.string().default(""),
  sort: z.enum(["newest", "oldest", "price"]).default("newest"),
});

export const Route = createFileRoute("/__layout/game")({
  component: RouteComponent,
  validateSearch: zodValidator(productSearchSchema),
});

function RouteComponent() {
  const { page } = useSearch({
    from: "/__layout/game",
  });
  console.log(page);
  return <div>Hello</div>;
}
