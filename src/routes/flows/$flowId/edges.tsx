import { createFileRoute } from "@tanstack/react-router";
import AddEdgesStep from "../../../components/flows/AddEdgesStep";

export const Route = createFileRoute("/flows/$flowId/edges")({
  component: () => {
    const { flowId } = Route.useParams();
    return <AddEdgesStep flowId={Number(flowId)} />;
  },
});
