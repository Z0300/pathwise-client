import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CreateFlowRoute } from "../../components/flows/CreateFlowPage";

export const Route = createFileRoute("/flows/new")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  return (
    <CreateFlowRoute
      onCreated={(flowId) =>
        navigate({
          to: "/flows/$flowId/nodes",
          params: { flowId: String(flowId) },
        })
      }
    />
  );
}
