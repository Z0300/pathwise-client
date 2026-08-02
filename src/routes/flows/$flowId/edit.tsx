import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { EditFlowRoute } from "../../../components/flows/UpdateFlowPage";

export const Route = createFileRoute("/flows/$flowId/edit")({
  component: RouteComponent,
});

function RouteComponent() {
  const { flowId } = Route.useParams();
  const navigate = useNavigate();

  return (
    <EditFlowRoute
      flowId={Number(flowId)}
      onCreated={() => navigate({ to: "/" })}
    />
  );
}
