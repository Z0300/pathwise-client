import { useForm } from "@tanstack/react-form";
import { useCreateFlowNode, useFlowNodes } from "../../api/queries";
import type { NodeType } from "../../types/flow";

interface Props {
  flowId: number;
  onNext?: () => void;
}

const NODE_TYPE_BADGE: Record<NodeType, string> = {
  start: "badge-success",
  end: "badge-neutral",
  action: "badge-info",
  decision: "badge-warning",
};

export default function AddNodesStep({ flowId, onNext }: Props) {
  const { data: nodes = [], isLoading } = useFlowNodes(flowId);
  const createNode = useCreateFlowNode(flowId);

  const form = useForm({
    defaultValues: { nodeKey: "", nodeType: "action" as NodeType, label: "" },
    onSubmit: async ({ value, formApi }) => {
      await createNode.mutateAsync({ flowId, ...value });
      formApi.reset();
    },
  });

  const hasStart = nodes.some((n) => n.nodeType === "start");
  const hasEnd = nodes.some((n) => n.nodeType === "end");

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <h2 className="card-title">Add nodes</h2>
          <p className="text-sm text-base-content/60">
            Each node is one step in the flow — a start, an end, an action, or a
            decision point.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2 items-end"
          >
            <form.Field
              name="nodeKey"
              validators={{
                onChange: ({ value }) =>
                  !value.trim() ? "Required" : undefined,
              }}
            >
              {(field) => (
                <label className="form-control">
                  <span className="label-text mb-1">Node key</span>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="check_credit_score"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <span className="text-error text-xs mt-1">
                      {field.state.meta.errors.join(", ")}
                    </span>
                  )}
                </label>
              )}
            </form.Field>

            <form.Field name="nodeType">
              {(field) => (
                <label className="form-control">
                  <span className="label-text mb-1">Type</span>
                  <select
                    className="select select-bordered w-full"
                    value={field.state.value}
                    onChange={(e) =>
                      field.handleChange(e.target.value as NodeType)
                    }
                  >
                    <option value="start">Start</option>
                    <option value="end">End</option>
                    <option value="action">Action</option>
                    <option value="decision">Decision</option>
                  </select>
                </label>
              )}
            </form.Field>

            <form.Field
              name="label"
              validators={{
                onChange: ({ value }) =>
                  !value.trim() ? "Required" : undefined,
              }}
            >
              {(field) => (
                <label className="form-control">
                  <span className="label-text mb-1">Label</span>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="Check Credit Score"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <span className="text-error text-xs mt-1">
                      {field.state.meta.errors.join(", ")}
                    </span>
                  )}
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
                    "Add node"
                  )}
                </button>
              )}
            </form.Subscribe>
          </form>
        </div>
      </div>

      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <h3 className="font-medium">Nodes in this flow</h3>
          {isLoading ? (
            <span className="loading loading-spinner loading-sm" />
          ) : nodes.length === 0 ? (
            <p className="text-sm text-base-content/50">
              No nodes yet — add a start node to begin.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Key</th>
                    <th>Type</th>
                    <th>Label</th>
                  </tr>
                </thead>
                <tbody>
                  {nodes.map((n) => (
                    <tr key={n.id}>
                      <td className="font-mono text-sm">{n.nodeKey}</td>
                      <td>
                        <span
                          className={`badge ${NODE_TYPE_BADGE[n.nodeType]}`}
                        >
                          {n.nodeType}
                        </span>
                      </td>
                      <td>{n.label}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {onNext && (
        <>
          <button
            className="btn btn-primary self-end"
            disabled={!hasStart || !hasEnd}
            onClick={onNext}
          >
            Next: Add edges
          </button>
          {(!hasStart || !hasEnd) && (
            <p className="text-xs text-base-content/50 text-right -mt-4">
              Add at least one Start and one End node to continue.
            </p>
          )}
        </>
      )}
    </div>
  );
}
