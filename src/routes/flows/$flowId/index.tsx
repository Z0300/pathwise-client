import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/flows/$flowId/")({
  beforeLoad: ({ params }) => {
    throw redirect({ to: "/flows/$flowId/nodes", params });
  },
});
