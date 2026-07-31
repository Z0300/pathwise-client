import { createFileRoute } from "@tanstack/react-router";
import EnumerateStep from "../../../components/flows/EnumerateStep";
import { useFlowNodes } from "../../../api/queries";

export const Route = createFileRoute("/flows/$flowId/enumerate")({
  component: RouteComponent,
});

function RouteComponent() {
  const { flowId } = Route.useParams();
  const id = Number(flowId);
  const nodesQuery = useFlowNodes(id);

  if (nodesQuery.isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg text-[#D2531E]" />
      </div>
    );
  }

  if (nodesQuery.isError) {
    return (
      <div className="max-w-5xl mx-auto px-8 py-10">
        <div className="alert alert-error">
          Failed to load flow nodes. Try refreshing.
        </div>
      </div>
    );
  }

  return <EnumerateStep flowId={id} nodes={nodesQuery.data ?? []} />;
}
