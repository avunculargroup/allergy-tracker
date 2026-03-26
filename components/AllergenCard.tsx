import { Allergen, ExposureLog } from "@/lib/types";
import ReactionBadge from "./ReactionBadge";

interface Props {
  allergen: Allergen;
  logs: ExposureLog[];
  onClick: () => void;
}

export default function AllergenCard({ allergen, logs, onClick }: Props) {
  const tried = logs.length > 0;
  const lastLog = tried ? logs[logs.length - 1] : null;
  const hasReaction = logs.some((l) => l.reaction !== "none");

  if (!tried) {
    return (
      <button
        onClick={onClick}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 6,
          padding: "14px 14px",
          background: "var(--color-surface)",
          border: "2px dashed var(--color-border)",
          borderRadius: "var(--radius-card)",
          cursor: "pointer",
          textAlign: "left",
          width: "100%",
          minHeight: 44,
          transition: "border-color 0.15s",
        }}
        aria-label={`${allergen.label}: not yet introduced`}
      >
        <span style={{ fontSize: "1.5rem" }}>{allergen.emoji}</span>
        <span
          style={{
            fontSize: "0.875rem",
            fontWeight: 600,
            color: "var(--color-text-primary)",
          }}
        >
          {allergen.label}
        </span>
        <span
          style={{
            fontSize: "0.72rem",
            color: "var(--color-text-muted)",
          }}
        >
          Not yet introduced
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 6,
        padding: "14px 14px",
        background: allergen.color,
        border: "1.5px solid var(--color-border)",
        borderRadius: "var(--radius-card)",
        cursor: "pointer",
        textAlign: "left",
        width: "100%",
        minHeight: 44,
        transition: "opacity 0.15s",
      }}
      aria-label={`${allergen.label}: ${logs.length} exposure${logs.length !== 1 ? "s" : ""}`}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <span style={{ fontSize: "1.5rem" }}>{allergen.emoji}</span>
        {hasReaction && <span title="Reaction recorded">⚠️</span>}
      </div>
      <span
        style={{
          fontSize: "0.875rem",
          fontWeight: 600,
          color: "var(--color-text-primary)",
        }}
      >
        {allergen.label}
      </span>
      {lastLog && (
        <>
          <ReactionBadge reaction={lastLog.reaction} />
          <span style={{ fontSize: "0.72rem", color: "var(--color-text-secondary)" }}>
            {logs.length} exposure{logs.length !== 1 ? "s" : ""} · {lastLog.date}
          </span>
        </>
      )}
    </button>
  );
}
