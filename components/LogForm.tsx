"use client";

import { useState } from "react";
import { ExposureLog, ReactionLevel } from "@/lib/types";
import { ALLERGENS, ALLERGEN_GROUPS, REACTIONS } from "@/lib/constants";
import Modal from "./Modal";

interface Props {
  allergenId?: string;
  onSave: (log: ExposureLog) => void;
  onClose: () => void;
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function LogForm({ allergenId, onSave, onClose }: Props) {
  const [selectedAllergen, setSelectedAllergen] = useState(allergenId ?? "");
  const [date, setDate] = useState(today());
  const [amount, setAmount] = useState("");
  const [reaction, setReaction] = useState<ReactionLevel>("none");
  const [notes, setNotes] = useState("");
  const [showEmergency, setShowEmergency] = useState(false);

  const canSave = selectedAllergen !== "" && date !== "";

  function handleSave() {
    if (!canSave) return;
    const log: ExposureLog = {
      id: Date.now().toString(),
      allergenId: selectedAllergen,
      date,
      reaction,
      notes,
      amount: amount || undefined,
    };
    onSave(log);
    if (reaction === "severe") {
      setShowEmergency(true);
    }
  }

  if (showEmergency) {
    return (
      <Modal onClose={onClose}>
        <div
          style={{
            background: "#fee2e2",
            border: "2px solid #f87171",
            borderRadius: "var(--radius-card)",
            padding: "20px",
            marginBottom: 20,
          }}
        >
          <p
            style={{
              fontWeight: 700,
              color: "#991b1b",
              fontSize: "1.05rem",
              marginBottom: 8,
            }}
          >
            ⚠️ Severe Reaction Recorded
          </p>
          <p style={{ color: "#7f1d1d", lineHeight: 1.5 }}>
            Severe reactions require immediate medical attention. Call{" "}
            <strong>911</strong> or go to the nearest emergency room.
          </p>
        </div>
        <button
          onClick={onClose}
          style={{
            width: "100%",
            padding: "14px",
            background: "var(--color-accent-gradient)",
            color: "#fff",
            fontWeight: 700,
            borderRadius: "var(--radius-button)",
            fontSize: "1rem",
          }}
        >
          OK, I understand
        </button>
      </Modal>
    );
  }

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    background: "var(--color-surface)",
    border: "1.5px solid var(--color-border)",
    borderRadius: "var(--radius-input)",
    color: "var(--color-text-primary)",
    fontSize: "0.95rem",
    outline: "none",
  };

  const labelStyle = {
    display: "block",
    fontSize: "0.8rem",
    fontWeight: 600,
    color: "var(--color-text-secondary)",
    marginBottom: 6,
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
  };

  return (
    <Modal onClose={onClose}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-lora)",
            fontSize: "1.3rem",
            fontWeight: 700,
            color: "var(--color-text-primary)",
          }}
        >
          Log Exposure
        </h2>
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

      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div>
          <label style={labelStyle} htmlFor="allergen-select">
            Allergen
          </label>
          <select
            id="allergen-select"
            value={selectedAllergen}
            onChange={(e) => setSelectedAllergen(e.target.value)}
            style={inputStyle}
          >
            <option value="">Select allergen…</option>
            {ALLERGEN_GROUPS.map((group) => (
              <optgroup key={group.id} label={group.label}>
                {ALLERGENS.filter((a) => a.group === group.id).map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.emoji} {a.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <div>
          <label style={labelStyle} htmlFor="date-input">
            Date
          </label>
          <input
            id="date-input"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle} htmlFor="amount-input">
            Amount <span style={{ fontWeight: 400, textTransform: "none" }}>(optional)</span>
          </label>
          <input
            id="amount-input"
            type="text"
            placeholder="e.g. 1 tsp, 2 tbsp"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div>
          <span style={labelStyle}>Reaction</span>
          <div style={{ display: "flex", gap: 8 }}>
            {REACTIONS.map((r) => (
              <button
                key={r.level}
                onClick={() => setReaction(r.level)}
                style={{
                  flex: 1,
                  padding: "8px 4px",
                  borderRadius: "var(--radius-button)",
                  border: reaction === r.level ? `2px solid ${r.color}` : "2px solid var(--color-border)",
                  background: reaction === r.level ? r.color + "33" : "var(--color-surface)",
                  color: reaction === r.level ? "var(--color-text-primary)" : "var(--color-text-muted)",
                  fontWeight: reaction === r.level ? 700 : 400,
                  fontSize: "0.8rem",
                  transition: "all 0.15s",
                  minHeight: 44,
                }}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={labelStyle} htmlFor="notes-input">
            Notes <span style={{ fontWeight: 400, textTransform: "none" }}>(optional)</span>
          </label>
          <textarea
            id="notes-input"
            placeholder="Any observations…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            style={{
              ...inputStyle,
              resize: "vertical",
              lineHeight: 1.5,
            }}
          />
        </div>

        <button
          onClick={handleSave}
          disabled={!canSave}
          style={{
            width: "100%",
            padding: "14px",
            background: canSave ? "var(--color-accent-gradient)" : "var(--color-border)",
            color: canSave ? "#fff" : "var(--color-text-muted)",
            fontWeight: 700,
            borderRadius: "var(--radius-button)",
            fontSize: "1rem",
            cursor: canSave ? "pointer" : "not-allowed",
            transition: "background 0.15s",
          }}
        >
          Save Exposure
        </button>
      </div>
    </Modal>
  );
}
