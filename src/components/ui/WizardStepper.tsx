import { Link } from "@tanstack/react-router";

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
          
          return (
            <li
              key={step.label}
              data-content={stepNum}
              className={`step ${isActiveOrPast ? "step-primary" : ""} ${isCurrent ? "font-bold text-[#D2531E]" : "text-base-content/50"}`}
            >
              {step.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
