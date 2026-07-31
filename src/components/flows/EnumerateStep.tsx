import { useState } from "react";
import { useEnumeratePaths } from "../../api/queries";
import { WizardStepper } from "../ui/WizardStepper";
import {
  Play,
  ShoppingCart,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  LogIn,
  GitBranch,
} from "lucide-react";
import type { EnumeratedPath, FlowNode, NodeType } from "../../types/flow";

interface Props {
  flowId: number;
  nodes: FlowNode[]; // pass down from parent / a getFlowNodes query
}

const NODE_ICON: Record<NodeType, React.ComponentType<{ size?: number }>> = {
  start: LogIn,
  action: ShoppingCart,
  decision: CreditCard,
  end: CheckCircle2,
};

// Heuristic until/unless the backend adds a real terminalStatus field
function isErrorEnd(node: FlowNode) {
  if (node.nodeType !== "end") return false;
  const key = `${node.nodeKey} ${node.label}`.toUpperCase();
  return /ERR|ERROR|DECLINE|FAIL|REDIRECT/.test(key);
}

function NodeChip({ node }: { node: FlowNode }) {
  const isError = isErrorEnd(node);
  const isSuccess = node.nodeType === "end" && !isError;
  const Icon = isError ? AlertTriangle : NODE_ICON[node.nodeType];

  return (
    <div
      className={`badge badge-lg gap-2 h-10 px-4 rounded-md font-mono text-xs font-semibold border ${
        isSuccess
          ? "bg-[#D2531E] text-white border-[#D2531E]"
          : isError
            ? "bg-[#D2531E]/10 text-[#D2531E] border-[#D2531E]/20"
            : "bg-base-200 text-base-content border-base-300"
      }`}
    >
      <Icon size={14} />
      {node.label}
    </div>
  );
}

function EdgeLabel({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center px-2 min-w-16">
      <div className="h-0.5 w-full bg-[#D2531E]" />
      <span className="text-[10px] font-bold tracking-wide mt-1 text-[#D2531E]">
        {label}
      </span>
    </div>
  );
}

export default function EnumerateStep({ flowId, nodes }: Props) {
  const enumerate = useEnumeratePaths(flowId);
  const paths: EnumeratedPath[] = enumerate.data ?? [];
  const [hasRun, setHasRun] = useState(false);

  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  const handleRunEnumeration = () => {
    setHasRun(true);
    enumerate.mutate?.(flowId);
  };

  return (
    <div className="max-w-5xl mx-auto px-8 py-10 flex flex-col gap-6">
      {/* Stepper */}
      <div className="card bg-base-100 border border-[#D2531E]/20 shadow-sm rounded-lg overflow-hidden">
        <div className="px-8 py-8 pb-4">
          <WizardStepper currentStep={4} />
        </div>
      </div>

      {/* Compute panel */}
      <div className="card bg-base-100 border border-[#D2531E]/20 shadow-sm rounded-lg">
        <div className="card-body flex-row items-center justify-between px-8 py-8">
          <div>
            <h2 className="text-xl font-bold">Compute Logic Paths</h2>
            <p className="text-sm text-base-content/60 mt-1 max-w-xl">
              PathWise will analyze your node connections and edge conditions to
              identify every possible journey through the system.
            </p>
          </div>
          <button
            className="btn border-none text-white bg-[#D2531E] hover:bg-[#B8461A] gap-2 rounded-md px-6"
            onClick={handleRunEnumeration}
            disabled={enumerate.isPending}
          >
            {enumerate.isPending ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              <Play size={16} fill="currentColor" />
            )}
            Run Enumeration
          </button>
        </div>
      </div>

      {/* Empty state */}
      {hasRun && paths.length === 0 && !enumerate.isPending && (
        <div className="card bg-base-100 border border-base-300 rounded-lg">
          <div className="card-body items-center text-center py-12">
            <GitBranch className="text-base-content/30 mb-2" size={28} />
            <p className="text-base-content/60">
              No paths found. Check that your flow has connected edges from a
              start node to an end node.
            </p>
          </div>
        </div>
      )}

      {/* Results */}
      {paths.map((path, idx) => (
        <div
          key={path.id}
          className="card bg-base-200/40 border border-[#D2531E]/15 rounded-lg overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#D2531E]/10">
            <div className="flex items-center gap-3">
              <span className="badge bg-[#D2531E]/10 text-[#D2531E] border-none font-bold rounded-md px-3">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <h3 className="font-bold text-base">{path.label}</h3>
            </div>
            <div className="flex items-center gap-4">
              <span className="badge bg-base-100 border-base-300 text-base-content/70 font-medium rounded-md px-3 h-8">
                Probability: {path.probability}%
              </span>
              <button className="link link-hover text-[#D2531E] text-sm font-semibold no-underline hover:underline">
                Export Code
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1 px-6 py-6 overflow-x-auto">
            {path.pathSequence.map((step, sIdx) => {
              const node = nodeMap.get(step.nodeId);
              if (!node) return null;
              return (
                <div
                  key={`${path.id}-${step.nodeId}-${sIdx}`}
                  className="flex items-center"
                >
                  <NodeChip node={node} />
                  {step.conditionTaken && (
                    <EdgeLabel label={step.conditionTaken} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Footer */}
      <div className="card bg-base-200/40 border border-base-300 rounded-lg">
        <div className="card-body flex-row items-center justify-between px-6 py-5">
          <p className="text-sm text-base-content/60">
            Paths generated based on the latest JSON edge-case definitions.
          </p>
          <div className="flex gap-3">
            <button className="btn btn-outline border-base-300 rounded-md">
              Previous Step
            </button>
            <button className="btn border-none text-white bg-[#D2531E] hover:bg-[#B8461A] rounded-md">
              Complete &amp; Deploy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
