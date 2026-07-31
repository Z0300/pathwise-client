import { useForm } from "@tanstack/react-form";
import { useCreateFlowNode, useFlowNodes } from "../../api/queries";
import type { NodeType } from "../../types/flow";
import { WizardStepper } from "../ui/WizardStepper";
import { NodeTypeBadge } from "../ui/NodeTypeBadge";
import { Plus, ArrowRight, ArrowLeft, Lightbulb } from "lucide-react";

interface Props {
  flowId: number;
  onNext?: () => void;
}

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
    <div className="max-w-5xl mx-auto px-8 py-10 flex flex-col gap-6">
      {/* STEPPER CARD */}
      <div className="card bg-base-100 border border-[#D2531E]/20 shadow-sm rounded-lg overflow-hidden">
        <div className="px-8 py-8 pb-4">
          <WizardStepper currentStep={2} />
        </div>
      </div>

      {/* TWO-COLUMN CONTENT ROW */}
      <div className="flex flex-col md:flex-row gap-6">
        
        {/* LEFT — "Define Node" form card */}
        <div className="card bg-base-100 border border-[#D2531E]/20 shadow-sm rounded-lg md:w-[35%] shrink-0">
          <div className="card-body p-6">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-base-content tracking-tight">Define Node</h2>
              <p className="text-[13px] text-base-content/60 mt-1 leading-snug">
                Create the logic blocks for your process.
              </p>
            </div>
            
            <form
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
              className="flex flex-col gap-4 mt-2"
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
                    <span className="label-text mb-2 text-[11px] font-bold text-base-content/50 tracking-wider uppercase">
                      Node Key
                    </span>
                    <input
                      type="text"
                      className="input input-bordered w-full focus:outline-[#D2531E] rounded-lg"
                      placeholder="e.g. AUTH_01"
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
                    <span className="label-text mb-2 text-[11px] font-bold text-base-content/50 tracking-wider uppercase">
                      Node Type
                    </span>
                    <select
                      className="select select-bordered w-full focus:outline-[#D2531E] rounded-lg"
                      value={field.state.value}
                      onChange={(e) =>
                        field.handleChange(e.target.value as NodeType)
                      }
                    >
                      <option value="start">Start (Green)</option>
                      <option value="action">Action (Blue)</option>
                      <option value="decision">Decision (Yellow)</option>
                      <option value="end">End (Red)</option>
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
                    <span className="label-text mb-2 text-[11px] font-bold text-base-content/50 tracking-wider uppercase">
                      Label
                    </span>
                    <input
                      type="text"
                      className="input input-bordered w-full focus:outline-[#D2531E] rounded-lg"
                      placeholder="Human readable description"
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
                    className="btn bg-[#E6F0FD] hover:bg-[#D4E4FA] border-none text-[#D2531E] font-bold w-full rounded-lg mt-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="loading loading-spinner loading-sm text-[#D2531E]" />
                    ) : (
                      <>
                        <Plus className="w-[18px] h-[18px] mr-1 text-[#D2531E]" />
                        Add to Canvas
                      </>
                    )}
                  </button>
                )}
              </form.Subscribe>
            </form>
          </div>
        </div>

        {/* RIGHT — "Canvas Inventory" table card */}
        <div className="card bg-base-100 border border-[#D2531E]/20 shadow-sm rounded-lg md:w-[65%] shrink flex flex-col">
          <div className="px-6 py-5 border-b border-base-200 flex items-center justify-between">
            <h3 className="font-bold text-base-content tracking-tight">Canvas Inventory</h3>
            <div className="bg-[#F0F2F9] text-base-content/60 text-[11px] font-bold tracking-wider uppercase px-3 py-1 rounded-full">
              {nodes.length} {nodes.length === 1 ? "NODE" : "NODES"}
            </div>
          </div>
          
          <div className="flex-1 overflow-x-auto p-0">
            {isLoading ? (
              <div className="p-8 flex justify-center">
                <span className="loading loading-spinner text-[#D2531E]" />
              </div>
            ) : nodes.length === 0 ? (
              <div className="p-8 text-center text-sm text-base-content/50">
                No nodes on the canvas. Use the form to add a Start node.
              </div>
            ) : (
              <table className="table w-full">
                <thead>
                  <tr className="border-b border-base-200 text-[11px] font-bold text-base-content/50 tracking-wider uppercase">
                    <th className="px-6 py-4 font-bold bg-transparent">Key</th>
                    <th className="px-6 py-4 font-bold bg-transparent">Type</th>
                    <th className="px-6 py-4 font-bold bg-transparent">Label</th>
                  </tr>
                </thead>
                <tbody>
                  {nodes.map((n) => (
                    <tr key={n.id} className="border-b border-base-200 last:border-b-0 hover:bg-base-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-[13px] text-[#D2531E] font-medium">{n.nodeKey}</td>
                      <td className="px-6 py-4">
                        <NodeTypeBadge type={n.nodeType} />
                      </td>
                      <td className="px-6 py-4 text-[14px] text-base-content/80">{n.label}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>

      {/* FOOTER ROW */}
      <div className="flex items-center justify-between mt-2 px-2">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="btn btn-ghost hover:bg-transparent hover:text-base-content text-base-content/50 font-medium px-2 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        
        {onNext && (
          <div className="flex flex-col items-end gap-1">
            <button
              className="btn btn-primary bg-[#D2531E] hover:bg-[#B34517] border-none text-white font-semibold pr-4 rounded-lg flex items-center gap-1"
              disabled={!hasStart || !hasEnd}
              onClick={onNext}
            >
              Next: Add Edges
              <ArrowRight className="w-[18px] h-[18px] ml-1" />
            </button>
            {(!hasStart || !hasEnd) && (
              <span className="text-[11px] text-error font-medium">
                Requires Start & End nodes
              </span>
            )}
          </div>
        )}
      </div>

      {/* INFO BANNER */}
      <div className="bg-[#E6F6F6] border border-[#009688]/20 rounded-lg p-5 flex items-start gap-4 mt-2">
        <div className="mt-0.5">
          <Lightbulb className="w-5 h-5 text-[#009688]" />
        </div>
        <p className="text-[14px] text-base-content/70 leading-relaxed">
          <strong className="text-base-content font-bold">Pro Tip:</strong> Use the "Node Key" to uniquely identify logic blocks. These keys will be used in the next step to define transitions between states.
        </p>
      </div>
    </div>
  );
}
