import { createFileRoute } from "@tanstack/react-router";
import AddNodesStep from "../../../components/flows/AddNodesStep";

export const Route = createFileRoute("/flows/$flowId/nodes")({
  component: () => {
    const { flowId } = Route.useParams();
    return <AddNodesStep flowId={Number(flowId)} />;
  },
});
