import { Link, useMatchRoute } from "@tanstack/react-router";

const STEPS = [
  { path: "/flows/$flowId/nodes", label: "Add Nodes" },
  { path: "/flows/$flowId/edges", label: "Add Edges" },
  { path: "/flows/$flowId/enumerate", label: "Enumerate" },
] as const;

export default function FlowWizard({ flowId }: { flowId: string }) {
  const matchRoute = useMatchRoute();

  return (
    <ul className="steps w-full mb-8 max-w-2xl mx-auto">
      {STEPS.map((step) => {
        const isActive = !!matchRoute({ to: step.path, params: { flowId } });
        return (
          <li
            key={step.path}
            className={`step ${isActive ? "step-primary" : ""}`}
          >
            <Link to={step.path} params={{ flowId }} className="cursor-pointer">
              {step.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
