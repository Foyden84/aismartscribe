"use client";

import type { PlayerStatus } from "./EncounterPlayer";

export interface SoapValues {
  chiefComplaint: string;
  hpi: string;
  objective: string;
  assessment: string;
  plan: string;
}

export type SoapKey = keyof SoapValues;

const SECTION_ORDER: {
  key: SoapKey;
  letter: string;
  label: string;
  cssClass: string;
}[] = [
  { key: "chiefComplaint", letter: "S", label: "Subjective — Chief Complaint", cssClass: "s-label" },
  { key: "hpi", letter: "S", label: "Subjective — HPI", cssClass: "s-label" },
  { key: "objective", letter: "O", label: "Objective", cssClass: "o-label" },
  { key: "assessment", letter: "A", label: "Assessment", cssClass: "a-label" },
  { key: "plan", letter: "P", label: "Plan", cssClass: "p-label" },
];

interface SOAPNotePanelProps {
  values: SoapValues;
  visibleKeys: Set<SoapKey>;
  status: PlayerStatus;
  editMode: boolean;
  onChange: (key: SoapKey, value: string) => void;
  onApprove: () => void;
  onEdit: () => void;
  onCancelEdit: () => void;
  generationLabel: string; // e.g. "Note generated in 2m 15s"
}

export function SOAPNotePanel({
  values,
  visibleKeys,
  status,
  editMode,
  onChange,
  onApprove,
  onEdit,
  onCancelEdit,
  generationLabel,
}: SOAPNotePanelProps) {
  const isComplete = status === "complete" || status === "saving";
  const isApproved = status === "approved";

  return (
    <div className="soap-panel">
      <div className="soap-panel-head">
        <div>
          <h2>Structured Documentation</h2>
          <p>SOAP note is assembled live as the encounter unfolds.</p>
        </div>
        <span
          className={`soap-status-badge${status === "playing" ? " active" : ""}${isComplete ? " ready" : ""}${isApproved ? " approved" : ""}`}
        >
          {status === "idle" && "IDLE"}
          {status === "playing" && "GENERATING"}
          {status === "complete" && "READY"}
          {status === "saving" && "SAVING…"}
          {status === "approved" && "APPROVED"}
        </span>
      </div>

      <div className="soap-panel-body">
        {SECTION_ORDER.map((section) => {
          const visible = visibleKeys.has(section.key);
          const value = values[section.key];
          return (
            <div
              key={section.key}
              className={`soap-field${visible ? " visible" : ""}${editMode ? " editing" : ""}`}
            >
              <div className={`soap-field-label ${section.cssClass}`}>
                <strong>{section.letter}</strong> — {section.label}
              </div>
              {editMode ? (
                <textarea
                  className="soap-field-textarea"
                  value={value}
                  onChange={(e) => onChange(section.key, e.target.value)}
                  rows={section.key === "plan" ? 6 : 3}
                />
              ) : (
                <div className="soap-field-text">{value || "—"}</div>
              )}
            </div>
          );
        })}
      </div>

      {isComplete && (
        <div className="soap-panel-actions">
          <div className="soap-generated">{generationLabel}</div>
          <div className="soap-panel-buttons">
            {editMode ? (
              <>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={onCancelEdit}
                  disabled={status === "saving"}
                >
                  Cancel edits
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={onApprove}
                  disabled={status === "saving"}
                >
                  {status === "saving" ? "Saving…" : "✓ Approve & Save"}
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={onEdit}
                  disabled={status === "saving"}
                >
                  ✎ Edit Note
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={onApprove}
                  disabled={status === "saving"}
                >
                  {status === "saving" ? "Saving…" : "✓ Approve & Save"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
