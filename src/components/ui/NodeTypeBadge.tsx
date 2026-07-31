import { CheckCircle2, Square, GitBranch, Circle } from "lucide-react";
import type { NodeType } from "../../types/flow";

const BADGE_CONFIG: Record<
  NodeType,
  { bg: string; text: string; icon: any; label: string }
> = {
  start: {
    bg: "bg-success/20",
    text: "text-success",
    icon: CheckCircle2,
    label: "START",
  },
  action: {
    bg: "bg-info/20",
    text: "text-info",
    icon: Square,
    label: "ACTION",
  },
  decision: {
    bg: "bg-warning/30",
    text: "text-warning",
    icon: GitBranch,
    label: "DECISION",
  },
  end: {
    bg: "bg-error/20",
    text: "text-error",
    icon: Circle,
    label: "END",
  },
};

export function NodeTypeBadge({ type }: { type: NodeType }) {
  const config = BADGE_CONFIG[type];
  const Icon = config.icon;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase ${config.bg} ${config.text}`}
    >
      <Icon className="w-3 h-3" />
      {config.label}
    </div>
  );
}
