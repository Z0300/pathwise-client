import { useForm } from "@tanstack/react-form";
import {
  useCreateFlowEdge,
  useFlowEdges,
  useFlowNodes,
} from "../../api/queries";

interface Props {
  flowId: number;
  onNext?: () => void;
}

export default function AddEdgesStep({ flowId, onNext }: Props) {
  const { data: nodes = [] } = useFlowNodes(flowId);
  const { data: edges = [], isLoading } = useFlowEdges(flowId);
  const createEdge = useCreateFlowEdge(flowId);

  const nodeLabel = (id: number) => nodes.find((n) => n.id === id)?.label ?? id;

  const form = useForm({
    defaultValues: { fromNodeId: "", toNodeId: "", conditionLabel: "" },
    onSubmit: async ({ value, formApi }) => {
      await createEdge.mutateAsync({
        flowId,
        fromNodeId: Number(value.fromNodeId),
        toNodeId: Number(value.toNodeId),
        conditionLabel: value.conditionLabel.trim() || null,
      });
      formApi.reset();
    },
  });

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <h2 className="card-title">Add edges</h2>
          <p className="text-sm text-base-content/60">
            Connect nodes to define the routes through the flow. Add a condition
            when a node branches into more than one path.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2 items-end"
          >
            <form.Field
              name="fromNodeId"
              validators={{
                onChange: ({ value }) => (!value ? "Required" : undefined),
              }}
            >
              {(field) => (
                <label className="form-control">
                  <span className="label-text mb-1">From node</span>
                  <select
                    className="select select-bordered w-full"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  >
                    <option value="" disabled>
                      Select node
                    </option>
                    {nodes.map((n) => (
                      <option key={n.id} value={n.id}>
                        {n.label}
                      </option>
                    ))}
                  </select>
                </label>
              )}
            </form.Field>

            <form.Field
              name="toNodeId"
              validators={{
                onChange: ({ value }) => (!value ? "Required" : undefined),
              }}
            >
              {(field) => (
                <label className="form-control">
                  <span className="label-text mb-1">To node</span>
                  <select
                    className="select select-bordered w-full"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  >
                    <option value="" disabled>
                      Select node
                    </option>
                    {nodes.map((n) => (
                      <option key={n.id} value={n.id}>
                        {n.label}
                      </option>
                    ))}
                  </select>
                </label>
              )}
            </form.Field>

            <form.Field name="conditionLabel">
              {(field) => (
                <label className="form-control">
                  <span className="label-text mb-1">Condition (optional)</span>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="score >= 650"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </label>
              )}
            </form.Field>

            <form.Subscribe selector={(state) => state.isSubmitting}>
              {(isSubmitting) => (
                <button
                  type="submit"
                  className="btn btn-primary sm:col-span-3"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="loading loading-spinner loading-sm" />
                  ) : (
                    "Add edge"
                  )}
                </button>
              )}
            </form.Subscribe>
          </form>
        </div>
      </div>

      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <h3 className="font-medium">Edges in this flow</h3>
          {isLoading ? (
            <span className="loading loading-spinner loading-sm" />
          ) : edges.length === 0 ? (
            <p className="text-sm text-base-content/50">No edges yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>From</th>
                    <th>To</th>
                    <th>Condition</th>
                  </tr>
                </thead>
                <tbody>
                  {edges.map((e) => (
                    <tr key={e.id}>
                      <td>{nodeLabel(e.fromNodeId)}</td>
                      <td>{nodeLabel(e.toNodeId)}</td>
                      <td>
                        {e.conditionLabel ? (
                          <span className="badge badge-ghost font-mono text-xs">
                            {e.conditionLabel}
                          </span>
                        ) : (
                          <span className="text-base-content/40">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {onNext && (
        <button
          className="btn btn-primary self-end"
          disabled={edges.length === 0}
          onClick={onNext}
        >
          Next: Enumerate
        </button>
      )}
    </div>
  );
}
