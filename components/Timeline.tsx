import { Allergen, ExposureLog } from "@/lib/types";
import ReactionBadge from "./ReactionBadge";

interface Props {
  logs: ExposureLog[];
  allergens: Allergen[];
}

export default function Timeline({ logs, allergens }: Props) {
  const sorted = [...logs].sort((a, b) => {
    if (b.date !== a.date) return b.date.localeCompare(a.date);
    return Number(b.id) - Number(a.id);
  });

  if (sorted.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 20px",
          textAlign: "center",
          gap: 12,
        }}
      >
        <span style={{ fontSize: "3rem" }}>🌱</span>
        <p
          style={{
            fontFamily: "var(--font-lora)",
            fontSize: "1.1rem",
            fontWeight: 600,
            color: "var(--color-text-primary)",
          }}
        >
          No exposures yet
        </p>
        <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem", maxWidth: 260 }}>
          Tap <strong>+ Log Exposure</strong> to record your baby&apos;s first introduction.
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: "0 16px 24px" }}>
      {sorted.map((log, idx) => {
        const allergen = allergens.find((a) => a.id === log.allergenId);
        return (
          <div
            key={log.id}
            style={{ display: "flex", gap: 14, position: "relative" }}
          >
            {/* Thread line */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "var(--color-accent)",
                  flexShrink: 0,
                  marginTop: 16,
                }}
              />
              {idx < sorted.length - 1 && (
                <div
                  style={{
                    width: 2,
                    flex: 1,
                    background: "var(--color-border)",
                    minHeight: 20,
                  }}
                />
              )}
            </div>

            {/* Entry card */}
            <div
              style={{
                flex: 1,
                background: "var(--color-surface)",
                border: "1.5px solid var(--color-border)",
                borderRadius: "var(--radius-card)",
                padding: "12px 14px",
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 6,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: "1.1rem" }}>{allergen?.emoji ?? "?"}</span>
                  <span
                    style={{
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      color: "var(--color-text-primary)",
                    }}
                  >
                    {allergen?.label ?? log.allergenId}
                  </span>
                </div>
                <ReactionBadge reaction={log.reaction} />
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: log.notes ? 6 : 0,
                }}
              >
                <span style={{ fontSize: "0.78rem", color: "var(--color-text-muted)" }}>
                  {log.date}
                </span>
                {log.amount && (
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--color-text-muted)",
                      background: "var(--color-border)",
                      padding: "1px 8px",
                      borderRadius: "var(--radius-badge)",
                    }}
                  >
                    {log.amount}
                  </span>
                )}
              </div>

              {log.notes && (
                <p
                  style={{
                    fontSize: "0.83rem",
                    color: "var(--color-text-secondary)",
                    lineHeight: 1.5,
                  }}
                >
                  {log.notes}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
