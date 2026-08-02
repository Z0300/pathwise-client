import { useFlow, useUpdateFlow } from "../../api/queries";
import { Spinner } from "../ui/Spinner";
import { FlowForm } from "./FlowForm";

interface Props {
  flowId: number;
  onCreated: (flowId: number) => void;
}

export function EditFlowRoute({ flowId, onCreated }: Props) {
  const flowQuery = useFlow(flowId);
  const updateFlow = useUpdateFlow(flowId);

  if (flowQuery.isLoading) {
    return <Spinner />;
  }

  if (flowQuery.isError || !flowQuery.data) {
    return (
      <div className="max-w-4xl mx-auto px-8 py-10">
        <p className="text-error text-sm">
          Couldn't load this flow. Check the backend is running and try again.
        </p>
      </div>
    );
  }

  return (
    <FlowForm
      defaultValues={flowQuery.data}
      actionTitle="Edit Flow Identity"
      actionDescription="Update the high-level identity of this process flow."
      submitLabel="Save Changes"
      isPending={updateFlow.isPending}
      onSubmit={async (payload) => {
        await updateFlow.mutateAsync({
          id: flowId,
          ...payload,
        });
        onCreated(flowId);
      }}
    />
  );
}
