export type IconColor = "orange" | "neutral" | "teal" | "red";

const COLOR_STYLES: Record<
  IconColor,
  { bg: string; border: string; stroke: string }
> = {
  orange: {
    bg: "bg-base-200/50",
    border: "border-transparent",
    stroke: "stroke-base-content/60",
  },
  neutral: {
    bg: "bg-base-200/50",
    border: "border-transparent",
    stroke: "stroke-base-content/60",
  },
  teal: {
    bg: "bg-base-200/50",
    border: "border-transparent",
    stroke: "stroke-base-content/60",
  },
  red: { 
    bg: "bg-base-200/50", 
    border: "border-transparent", 
    stroke: "stroke-base-content/60" 
  },
};

interface IconBadgeProps {
  color: IconColor;
  path: string; // svg "d" attribute
}

export function IconBadge({ color, path }: IconBadgeProps) {
  const { bg, border, stroke } = COLOR_STYLES[color];
  return (
    <div
      className={`p-3 ${bg} border ${border} rounded-lg flex items-center justify-center shrink-0`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`h-5 w-5 ${stroke}`}
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d={path} />
      </svg>
    </div>
  );
}
