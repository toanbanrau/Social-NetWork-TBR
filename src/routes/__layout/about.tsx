import { createFileRoute } from "@tanstack/react-router";
import {  useId } from "react";
import { useFormStatus } from "react-dom";

export const Route = createFileRoute("/__layout/about")({
  component: RouteComponent,

});

function RouteComponent() {
    const firstId = useId();
    console.log(firstId);
    return (
    <form action="/about" method="post">
      <label htmlFor={firstId}>Name</label>
      <input className="border-2" type="text" name="name" id={firstId} />
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button type="submit" disabled={pending}>
      {pending ? "Đang xử lý..." : "Đăng ký"}
    </button>
  )
}
