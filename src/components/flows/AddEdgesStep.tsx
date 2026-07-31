import { useForm } from "@tanstack/react-form";
import { Link } from "@tanstack/react-router";
import { Plus, ArrowLeft, ArrowRight, Network, Lightbulb } from "lucide-react";
import {
  useCreateFlowEdge,
  useFlowEdges,
  useFlowNodes,
} from "../../api/queries";
import { WizardStepper } from "../ui/WizardStepper";

interface Props {
  flowId: number;
}

export default function AddEdgesStep({ flowId }: Props) {
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
    <div className="max-w-5xl mx-auto px-8 py-10 flex flex-col gap-6">
      {/* Stepper Card */}
      <div className="card bg-base-100 border border-[#D2531E]/20 shadow-sm rounded-lg overflow-hidden">
        <div className="px-8 py-8 pb-4">
          <WizardStepper currentStep={3} />
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (Define Connection) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body p-6">
              <h2 className="card-title text-[17px] font-medium text-base-content mb-1">
                Define Connection
              </h2>
              <p className="text-[13px] text-base-content/70 leading-relaxed mb-4">
                Connect nodes to establish the logical progression of your
                process flow.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  form.handleSubmit();
                }}
                className="flex flex-col gap-4"
              >
                <form.Field
                  name="fromNodeId"
                  validators={{
                    onChange: ({ value }) => (!value ? "Required" : undefined),
                  }}
                >
                  {(field) => (
                    <label className="form-control w-full">
                      <span className="label-text text-[11px] font-bold text-base-content/50 tracking-wider uppercase mb-1.5">
                        From Node
                      </span>
                      <select
                        className="select select-bordered select-sm h-10 text-[14px]"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      >
                        <option value="" disabled>
                          Select starting node
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
                    <label className="form-control w-full">
                      <span className="label-text text-[11px] font-bold text-base-content/50 tracking-wider uppercase mb-1.5">
                        To Node
                      </span>
                      <select
                        className="select select-bordered select-sm h-10 text-[14px]"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      >
                        <option value="" disabled>
                          Select destination node
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
                    <label className="form-control w-full">
                      <span className="label-text text-[11px] font-bold text-base-content/50 tracking-wider uppercase mb-1.5">
                        Condition Label
                      </span>
                      <input
                        type="text"
                        className="input input-bordered input-sm h-10 text-[14px] placeholder:text-base-content/30"
                        placeholder="e.g. On Success, If status=404"
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
                      className="btn bg-[#E6F0FD] hover:bg-[#D5E6FC] text-[#1E5F99] border-none mt-2 font-medium"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="loading loading-spinner loading-sm" />
                      ) : (
                        <>
                          <Plus className="w-4 h-4 text-[#1E5F99]" /> Add Edge
                        </>
                      )}
                    </button>
                  )}
                </form.Subscribe>
              </form>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Existing Connections */}
          <div className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body p-0">
              <div className="flex items-center justify-between p-4 px-6 border-b border-base-200 bg-base-100/50">
                <h3 className="font-semibold text-[14px] text-base-content">
                  Existing Connections
                </h3>
                <div className="badge bg-[#E6F0FD] text-[#1E5F99] border-none font-bold text-[10px] tracking-wide px-2.5 py-2.5">
                  {edges.length} EDGES
                </div>
              </div>

              {isLoading ? (
                <div className="p-8 flex justify-center">
                  <span className="loading loading-spinner loading-sm text-base-content/40" />
                </div>
              ) : edges.length === 0 ? (
                <div className="p-8 text-center text-[13.5px] text-base-content/50">
                  No connections defined yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="table w-full">
                    <thead>
                      <tr className="text-[11px] font-bold text-base-content/50 tracking-wider uppercase border-b border-base-200">
                        <th className="py-3 px-6">From</th>
                        <th className="py-3 px-6">To</th>
                        <th className="py-3 px-6">Condition</th>
                      </tr>
                    </thead>
                    <tbody>
                      {edges.map((e) => (
                        <tr
                          key={e.id}
                          className="border-b border-base-200/60 last:border-b-0 hover:bg-base-200/20"
                        >
                          <td className="py-4 px-6 text-[14px]">
                            {nodeLabel(e.fromNodeId)}
                          </td>
                          <td className="py-4 px-6 text-[14px]">
                            {nodeLabel(e.toNodeId)}
                          </td>
                          <td className="py-4 px-6">
                            {e.conditionLabel ? (
                              <span className="badge bg-[#E6F0FD] text-[#1E5F99] border-none font-bold text-[10px] tracking-wide uppercase px-2.5 py-2.5">
                                {e.conditionLabel}
                              </span>
                            ) : (
                              <span className="text-base-content/30">—</span>
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

          {/* Visualizing topology placeholder */}
          <div className="card bg-base-100/30 border-2 border-dashed border-base-200/80 shadow-none min-h-[220px]">
            <div className="card-body items-center justify-center p-8 relative overflow-hidden">
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ zIndex: 0 }}
              >
                <line
                  x1="30%"
                  y1="35%"
                  x2="50%"
                  y2="55%"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-[#E0CFCA]"
                />
                <line
                  x1="50%"
                  y1="55%"
                  x2="70%"
                  y2="75%"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-[#E0CFCA]"
                />
              </svg>

              <div
                className="absolute border border-base-300 bg-base-100 px-5 py-2.5 text-[12px] font-medium text-base-content/70 shadow-sm rounded-sm"
                style={{ top: "25%", left: "20%" }}
              >
                Login
              </div>

              <div className="flex flex-col items-center gap-2 z-10 bg-base-100 p-2 rounded-full mt-4">
                <Network className="w-6 h-6 text-base-content/60" />
                <span className="text-[13px] font-medium text-base-content/70">
                  Visualizing topology...
                </span>
              </div>

              <div
                className="absolute border border-base-300 bg-base-100 px-5 py-2.5 text-[12px] font-medium text-base-content/70 shadow-sm rounded-sm"
                style={{ bottom: "15%", right: "15%" }}
              >
                Success
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between mt-2 px-1">
        <Link
          to="/flows/$flowId/nodes"
          params={{ flowId: String(flowId) }}
          className="btn btn-ghost text-base-content/60 hover:text-base-content hover:bg-base-200/50"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Link>
        <Link
          to="/flows/$flowId/enumerate"
          params={{ flowId: String(flowId) }}
          className="btn bg-[#B3411B] hover:bg-[#9C3615] text-white border-none px-6 shadow-sm"
        >
          Next: Enumerate <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>

      {/* Pro Tip */}
      <div className="alert bg-[#EAF5F8] border border-[#BDE3ED] text-[#2C6E80] rounded-lg shadow-sm py-4 px-5 items-start mt-2">
        <Lightbulb className="w-5 h-5 text-[#2C6E80] shrink-0 mt-0.5" />
        <span className="text-[13.5px] leading-relaxed">
          <strong className="font-semibold text-[#1C5060]">Pro Tip:</strong>{" "}
          Connect nodes to define the logical flow path. Conditions specified on
          edges will be used to generate logic tests during the enumeration
          step.
        </span>
      </div>
    </div>
  );
}
