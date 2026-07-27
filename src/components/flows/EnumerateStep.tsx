import { useEnumeratePaths } from "../../api/queries";

interface Props {
  flowId: number;
}

export default function EnumerateStep({ flowId }: Props) {
  const enumerate = useEnumeratePaths(flowId);
  const paths = enumerate.data ?? [];

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body items-center text-center">
          <h2 className="card-title">Run enumeration</h2>
          <p className="text-sm text-base-content/60 max-w-sm">
            Walks the flow graph and generates every distinct path from start to
            end.
          </p>
          <button
            className="btn btn-primary btn-lg mt-2"
            onClick={() => enumerate.mutate()}
            disabled={enumerate.isPending}
          >
            {enumerate.isPending ? (
              <span className="loading loading-spinner" />
            ) : (
              "Run enumeration"
            )}
          </button>
          {enumerate.isError && (
            <p className="text-error text-sm mt-2">
              Enumeration failed. Check the flow has a start and end node
              connected.
            </p>
          )}
        </div>
      </div>

      {enumerate.isSuccess && (
        <div>
          <p className="text-sm font-medium mb-3">
            {paths.length} {paths.length === 1 ? "path" : "paths"} found
          </p>
          <div className="flex flex-col gap-3">
            {paths.map((path, i) => (
              <div key={path.id} className="card bg-base-100 shadow-sm">
                <div className="card-body py-4">
                  <span className="text-xs text-base-content/40 mb-1">
                    Path {i + 1}
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    {path.pathSequence.map((step, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        {step.conditionTaken && (
                          <span className="badge badge-ghost font-mono text-xs">
                            {step.conditionTaken}
                          </span>
                        )}
                        <span className="badge badge-outline">
                          {step.nodeKey}
                        </span>
                        {idx < path.pathSequence.length - 1 && (
                          <span className="text-base-content/30">→</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
