import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { WizardStepper } from "../ui/WizardStepper";
import { Pencil, Info, ArrowRight, Network } from "lucide-react";
import type { Flow, FlowCreate } from "../../types/flow";

const formSchema = z.object({
  name: z.string().nonempty("Flow name is required"),
  description: z.string(),
});

type FlowFormProps = {
  defaultValues?: Flow;
  onSubmit: (payload: FlowCreate) => Promise<void>;
  isPending?: boolean;
  actionTitle?: string;
  actionDescription: string;
  submitLabel?: string;
};

export function FlowForm({
  defaultValues,
  onSubmit,
  isPending,
  actionTitle,
  actionDescription,
  submitLabel = "Create Flow",
}: FlowFormProps) {
  const form = useForm({
    defaultValues: defaultValues
      ? {
          name: defaultValues.name,
          description: defaultValues.description ?? "",
        }
      : { name: "", description: "" },
    validators: {
      onChange: formSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="max-w-4xl mx-auto px-8 py-10 flex flex-col gap-6"
    >
      {/* STEPPER CARD */}
      <div className="card bg-base-100 border border-[#D2531E]/20 shadow-sm rounded-lg overflow-hidden">
        <div className="px-8 py-8 pb-4">
          <WizardStepper currentStep={1} />
        </div>
      </div>

      {/* MAIN FORM CARD */}
      <div className="card bg-base-100 border border-[#D2531E]/20 shadow-sm rounded-lg">
        <div className="card-body p-8">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-base-content tracking-tight">
              {actionTitle}
            </h2>
            <p className="text-[14.5px] text-base-content/60 mt-1">
              {actionDescription}
            </p>
          </div>

          <div className="border-b border-base-200 mb-5"></div>

          <div className="flex flex-col gap-5 mt-2">
            <form.Field
              name="name"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <label className="form-control">
                    <span className="label-text mb-2 text-[11px] font-bold text-base-content/50 tracking-wider uppercase">
                      Flow Name
                    </span>
                    <div className="relative">
                      <input
                        type="text"
                        className="input input-bordered w-full pr-10 rounded-lg"
                        placeholder="e.g., User Authentication Workflow"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                      />
                      <Pencil className="w-4.5 h-4.5 text-base-content/30 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                    {isInvalid && (
                      <span className="text-error text-xs mt-1">
                        {field.state.meta.errors
                          .map((err) => err?.message)
                          .join(", ")}
                      </span>
                    )}
                  </label>
                );
              }}
            />

            <form.Field
              name="description"
              children={(field) => (
                <label className="form-control">
                  <span className="label-text mb-2 text-[11px] font-bold text-base-content/50 tracking-wider uppercase">
                    Description
                  </span>
                  <textarea
                    className="textarea textarea-bordered w-full text-base leading-relaxed rounded-lg"
                    placeholder="Briefly describe the purpose and scope of this flow..."
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    rows={4}
                  />
                </label>
              )}
            />

            <div className="bg-[#F0F2F9] rounded-lg p-4 flex items-start gap-3 mt-2">
              <Info className="w-4.5 h-4.5 text-[#D2531E] shrink-0 mt-0.5" />
              <p className="text-[14px] text-base-content/70 leading-snug">
                Your flow will be saved as a draft. You can always edit these
                details later from the settings module.
              </p>
            </div>

            <div className="flex items-center justify-between mt-4">
              <button
                type="button"
                className="btn btn-ghost hover:bg-transparent hover:text-base-content text-base-content/60 font-medium px-2"
              >
                Save for later
              </button>

              <button
                type="submit"
                className="btn btn-primary bg-[#D2531E] hover:bg-[#B34517] border-none text-white font-semibold pr-4 rounded-lg"
                disabled={isPending}
              >
                {isPending ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : (
                  <>
                    {submitLabel}
                    <ArrowRight className="w-4.5 h-4.5 ml-1" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* INFO CARDS */}
      <div className="grid grid-cols-2 gap-6 mt-2">
        <div className="card bg-[#F4F5F9] rounded-lg border border-transparent shadow-sm">
          <div className="card-body p-6 gap-3">
            <div className="flex items-center gap-2">
              <Network className="w-4.5 h-4.5 text-[#D2531E]" />
              <h3 className="font-bold text-base-content text-sm">
                Automation Logic
              </h3>
            </div>
            <p className="text-[13.5px] text-base-content/60 leading-relaxed">
              PathWise uses graph-based algorithms to automatically identify
              critical paths and potential dead-locks within your defined flows.
            </p>
          </div>
        </div>

        <div className="card bg-[#F4F5F9] rounded-lg border border-transparent shadow-sm flex items-center justify-center">
          <div className="card-body p-6 items-center text-center justify-center gap-1">
            <span className="text-[42px] font-bold text-[#D2531E] leading-none">
              99%
            </span>
            <span className="text-[11px] font-bold text-base-content/40 tracking-widest uppercase mt-1">
              Logic Accuracy
            </span>
          </div>
        </div>
      </div>
    </form>
  );
}
