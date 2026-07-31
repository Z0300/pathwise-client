interface WizardStepperProps {
  currentStep: number;
}

const STEPS = [
  { label: "Create Flow" },
  { label: "Add Nodes" },
  { label: "Add Edges" },
  { label: "Enumerate" },
];

export function WizardStepper({ currentStep }: WizardStepperProps) {
  return (
    <div className="w-full mb-8">
      <ul className="steps w-full">
        {STEPS.map((step, idx) => {
          const stepNum = idx + 1;
          const isActiveOrPast = stepNum <= currentStep;
          const isCurrent = stepNum === currentStep;
          const isPast = stepNum < currentStep;

          let labelClass = "text-base-content/50";
          if (isCurrent) labelClass = "font-bold text-[#D2531E]";
          if (isPast) labelClass = "font-bold text-base-content";

          return (
            <li
              key={step.label}
              data-content={isPast ? "✓" : stepNum}
              className={`step ${isActiveOrPast ? "step-primary" : ""} ${labelClass}`}
            >
              {step.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
