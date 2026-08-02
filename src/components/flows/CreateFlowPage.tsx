import { useCreateFlow } from "../../api/queries";
import { FlowForm } from "./FlowForm";

interface Props {
  onCreated: (flowId: number) => void;
}

export function CreateFlowRoute({ onCreated }: Props) {
  const createFlow = useCreateFlow();

  return (
    <FlowForm
      actionTitle="Flow Identity"
      actionDescription="Define the high-level identity of your process flow to get started."
      submitLabel="Create Flow"
      isPending={createFlow.isPending}
      onSubmit={async (payload) => {
        const flow = await createFlow.mutateAsync(payload);
        onCreated(flow.id);
      }}
    />
  );
}
