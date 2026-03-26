"use client";

import { useState, useRef } from "react";
import { ExposureLog } from "@/lib/types";
import { ALLERGENS, ALLERGEN_GROUPS } from "@/lib/constants";
import {
  loadLogs,
  saveLogs,
  loadBabyName,
  saveBabyName,
} from "@/lib/storage";
import AllergenCard from "./AllergenCard";
import AllergenDetail from "./AllergenDetail";
import LogForm from "./LogForm";
import Timeline from "./Timeline";

type ModalState =
  | null
  | { type: "log"; allergenId?: string }
  | { type: "detail"; allergenId: string };

export default function AllergyTracker() {
  const [logs, setLogs] = useState<ExposureLog[]>(() => loadLogs());
  const [babyName, setBabyName] = useState<string>(() => loadBabyName() || "My Baby");
  const [activeTab, setActiveTab] = useState<"home" | "timeline">("home");
  const [modal, setModal] = useState<ModalState>(null);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(babyName);
  const nameInputRef = useRef<HTMLInputElement>(null);

  function handleSaveLog(log: ExposureLog) {
    const updated = [...logs, log];
    setLogs(updated);
    saveLogs(updated);
    // LogForm handles showing emergency banner, then calls its own onClose
    // Only close modal if reaction is not severe (LogForm handles the severe case internally)
    if (log.reaction !== "severe") {
      setModal(null);
    }
  }

  function handleDeleteLog(id: string) {
    const updated = logs.filter((l) => l.id !== id);
    setLogs(updated);
    saveLogs(updated);
  }

  function handleSaveName() {
    const trimmed = nameInput.trim() || "My Baby";
    setBabyName(trimmed);
    saveBabyName(trimmed);
    setEditingName(false);
  }

  function startEditName() {
    setNameInput(babyName);
    setEditingName(true);
    setTimeout(() => nameInputRef.current?.focus(), 50);
  }

  const triedCount = ALLERGENS.filter((a) =>
    logs.some((l) => l.allergenId === a.id)
  ).length;
  const reactionCount = logs.filter((l) => l.reaction !== "none").length;

  const activeAllergen =
    modal?.type === "detail" || modal?.type === "log"
      ? ALLERGENS.find(
          (a) =>
            a.id ===
            (modal.type === "detail"
              ? modal.allergenId
              : modal.allergenId)
        )
      : undefined;

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "var(--color-bg)",
        maxWidth: 480,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: "20px 20px 16px",
          borderBottom: "1px solid var(--color-border)",
          background: "var(--color-bg)",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 14,
          }}
        >
          <div>
            <p
              style={{
                fontSize: "0.75rem",
                color: "var(--color-text-muted)",
                marginBottom: 2,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Tracking for
            </p>
            {editingName ? (
              <input
                ref={nameInputRef}
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onBlur={handleSaveName}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveName();
                  if (e.key === "Escape") setEditingName(false);
                }}
                style={{
                  fontFamily: "var(--font-lora)",
                  fontSize: "1.4rem",
                  fontWeight: 700,
                  color: "var(--color-text-primary)",
                  background: "transparent",
                  border: "none",
                  borderBottom: "2px solid var(--color-accent)",
                  outline: "none",
                  width: "100%",
                  padding: "2px 0",
                }}
              />
            ) : (
              <button
                onClick={startEditName}
                aria-label="Edit baby name"
                style={{
                  fontFamily: "var(--font-lora)",
                  fontSize: "1.4rem",
                  fontWeight: 700,
                  color: "var(--color-text-primary)",
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                {babyName}
                <span style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
                  ✏️
                </span>
              </button>
            )}
          </div>
          <span style={{ fontSize: "2rem" }}>🌱</span>
        </div>

        {/* Stat row */}
        <div style={{ display: "flex", gap: 12 }}>
          <div
            style={{
              flex: 1,
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-card)",
              padding: "10px 12px",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontSize: "1.3rem",
                fontWeight: 700,
                color: "var(--color-accent)",
                fontFamily: "var(--font-lora)",
              }}
            >
              {triedCount}/{ALLERGENS.length}
            </p>
            <p style={{ fontSize: "0.72rem", color: "var(--color-text-muted)" }}>
              Introduced
            </p>
          </div>
          <div
            style={{
              flex: 1,
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-card)",
              padding: "10px 12px",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontSize: "1.3rem",
                fontWeight: 700,
                color: "var(--color-text-primary)",
                fontFamily: "var(--font-lora)",
              }}
            >
              {logs.length}
            </p>
            <p style={{ fontSize: "0.72rem", color: "var(--color-text-muted)" }}>
              Exposures
            </p>
          </div>
          <div
            style={{
              flex: 1,
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-card)",
              padding: "10px 12px",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontSize: "1.3rem",
                fontWeight: 700,
                color: reactionCount > 0 ? "#dc2626" : "var(--color-text-primary)",
                fontFamily: "var(--font-lora)",
              }}
            >
              {reactionCount}
            </p>
            <p style={{ fontSize: "0.72rem", color: "var(--color-text-muted)" }}>
              Reactions
            </p>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid var(--color-border)",
          background: "var(--color-bg)",
        }}
      >
        {(["home", "timeline"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1,
              padding: "12px",
              fontWeight: activeTab === tab ? 700 : 400,
              color:
                activeTab === tab
                  ? "var(--color-accent)"
                  : "var(--color-text-muted)",
              borderBottom:
                activeTab === tab
                  ? "2px solid var(--color-accent)"
                  : "2px solid transparent",
              background: "none",
              fontSize: "0.9rem",
              transition: "all 0.15s",
              textTransform: "capitalize",
            }}
          >
            {tab === "home" ? "🏠 Home" : "📋 Timeline"}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <main style={{ flex: 1, overflowY: "auto", paddingBottom: 100 }}>
        {activeTab === "home" ? (
          <div style={{ padding: "16px" }}>
            {ALLERGEN_GROUPS.map((group) => {
              const groupAllergens = ALLERGENS.filter(
                (a) => a.group === group.id
              );
              const groupTried = groupAllergens.filter((a) =>
                logs.some((l) => l.allergenId === a.id)
              ).length;
              return (
                <div key={group.id} style={{ marginBottom: 24 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      justifyContent: "space-between",
                      marginBottom: 10,
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: "var(--font-lora)",
                        fontSize: "1rem",
                        fontWeight: 700,
                        color: "var(--color-text-primary)",
                      }}
                    >
                      {group.label}
                    </h3>
                    <span
                      style={{
                        fontSize: "0.78rem",
                        color: "var(--color-text-muted)",
                      }}
                    >
                      {groupTried}/{groupAllergens.length} introduced
                    </span>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, 1fr)",
                      gap: 10,
                    }}
                  >
                    {groupAllergens.map((allergen) => (
                      <AllergenCard
                        key={allergen.id}
                        allergen={allergen}
                        logs={logs.filter((l) => l.allergenId === allergen.id)}
                        onClick={() =>
                          setModal({ type: "detail", allergenId: allergen.id })
                        }
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <Timeline logs={logs} allergens={ALLERGENS} />
        )}
      </main>

      {/* FAB */}
      <button
        onClick={() => setModal({ type: "log" })}
        style={{
          position: "fixed",
          bottom: 28,
          right: "50%",
          transform: "translateX(50%)",
          maxWidth: 440,
          width: "calc(100% - 32px)",
          padding: "16px",
          background: "var(--color-accent-gradient)",
          color: "#fff",
          fontWeight: 700,
          fontSize: "1rem",
          borderRadius: "var(--radius-button)",
          boxShadow: "0 4px 20px rgba(193,127,62,0.35)",
          zIndex: 20,
        }}
      >
        + Log Exposure
      </button>

      {/* Modals */}
      {modal?.type === "detail" && activeAllergen && (
        <AllergenDetail
          allergen={activeAllergen}
          logs={logs.filter((l) => l.allergenId === modal.allergenId)}
          onDelete={handleDeleteLog}
          onLogNew={() =>
            setModal({ type: "log", allergenId: modal.allergenId })
          }
          onClose={() => setModal(null)}
        />
      )}

      {modal?.type === "log" && (
        <LogForm
          allergenId={modal.allergenId}
          onSave={handleSaveLog}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
