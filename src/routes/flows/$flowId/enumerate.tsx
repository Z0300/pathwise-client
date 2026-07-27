import { createFileRoute } from "@tanstack/react-router";
import EnumerateStep from "../../../components/flows/EnumerateStep";

export const Route = createFileRoute("/flows/$flowId/enumerate")({
  component: () => {
    const { flowId } = Route.useParams();
    return <EnumerateStep flowId={Number(flowId)} />;
  },
});
