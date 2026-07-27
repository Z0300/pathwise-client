import { createFileRoute, useNavigate } from "@tanstack/react-router";
import CreateFlowStep from "../../components/flows/CreateFlowStep";

export const Route = createFileRoute("/flows/new")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  return (
    <CreateFlowStep
      onCreated={(flowId) =>
        navigate({
          to: "/flows/$flowId/nodes",
          params: { flowId: String(flowId) },
        })
      }
    />
  );
}
