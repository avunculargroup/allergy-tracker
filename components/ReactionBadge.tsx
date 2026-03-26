import { ReactionLevel } from "@/lib/types";
import { REACTIONS } from "@/lib/constants";

interface Props {
  reaction: ReactionLevel;
}

export default function ReactionBadge({ reaction }: Props) {
  const r = REACTIONS.find((rx) => rx.level === reaction)!;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "2px 10px",
        borderRadius: "var(--radius-badge)",
        background: r.color + "33",
        color: reaction === "none" ? "#166534" : reaction === "mild" ? "#92400e" : reaction === "moderate" ? "#9a3412" : "#991b1b",
        fontSize: "0.75rem",
        fontWeight: 600,
        letterSpacing: "0.02em",
        border: `1px solid ${r.color}66`,
      }}
    >
      {r.label}
    </span>
  );
}
