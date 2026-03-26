import { Allergen, ExposureLog } from "@/lib/types";
import ReactionBadge from "./ReactionBadge";
import Modal from "./Modal";

interface Props {
  allergen: Allergen;
  logs: ExposureLog[];
  onDelete: (id: string) => void;
  onLogNew: () => void;
  onClose: () => void;
}

export default function AllergenDetail({
  allergen,
  logs,
  onDelete,
  onLogNew,
  onClose,
}: Props) {
  const sorted = [...logs].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <Modal onClose={onClose}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: "1.8rem" }}>{allergen.emoji}</span>
          <h2
            style={{
              fontFamily: "var(--font-lora)",
              fontSize: "1.3rem",
              fontWeight: 700,
              color: "var(--color-text-primary)",
            }}
          >
            {allergen.label}
          </h2>
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            width: 36,
            height: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            background: "var(--color-surface)",
            color: "var(--color-text-muted)",
            fontSize: "1.1rem",
          }}
        >
          ×
        </button>
      </div>

      <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", marginBottom: 20 }}>
        {logs.length === 0
          ? "No exposures recorded yet."
          : `${logs.length} exposure${logs.length !== 1 ? "s" : ""} recorded`}
      </p>

      <button
        onClick={onLogNew}
        style={{
          width: "100%",
          padding: "12px",
          background: "var(--color-accent-gradient)",
          color: "#fff",
          fontWeight: 700,
          borderRadius: "var(--radius-button)",
          fontSize: "0.95rem",
          marginBottom: 24,
        }}
      >
        + Log new exposure
      </button>

      {sorted.length === 0 ? (
        <p
          style={{
            textAlign: "center",
            color: "var(--color-text-muted)",
            padding: "24px 0",
            fontSize: "0.9rem",
          }}
        >
          Tap the button above to log the first exposure.
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {sorted.map((log) => (
            <div
              key={log.id}
              style={{
                background: "var(--color-surface)",
                border: "1.5px solid var(--color-border)",
                borderRadius: "var(--radius-card)",
                padding: "14px 14px",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: "var(--color-text-primary)",
                    }}
                  >
                    {log.date}
                  </span>
                  {log.amount && (
                    <span
                      style={{
                        fontSize: "0.78rem",
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
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <ReactionBadge reaction={log.reaction} />
                  <button
                    onClick={() => onDelete(log.id)}
                    aria-label={`Delete log from ${log.date}`}
                    style={{
                      width: 28,
                      height: 28,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "50%",
                      background: "#fee2e2",
                      color: "#b91c1c",
                      fontSize: "0.9rem",
                      fontWeight: 700,
                      minHeight: 44,
                      minWidth: 44,
                    }}
                  >
                    ×
                  </button>
                </div>
              </div>
              {log.notes && (
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--color-text-secondary)",
                    lineHeight: 1.5,
                  }}
                >
                  {log.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}
