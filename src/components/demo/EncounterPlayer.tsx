"use client";

import { useEffect, useRef } from "react";

export type Speaker = "doctor" | "patient";

export interface DialogueLine {
  speaker: Speaker;
  text: string;
}

export type PlayerStatus =
  | "idle"
  | "playing"
  | "complete"
  | "saving"
  | "approved";

interface EncounterPlayerProps {
  dialogue: DialogueLine[];
  shownIndices: number[];
  status: PlayerStatus;
  timerDisplay: string;
  progressPct: number;
  doctorName: string;
  patientLabel: string;
  encounterLabel: string;
  onPlay: () => void;
}

export function EncounterPlayer({
  dialogue,
  shownIndices,
  status,
  timerDisplay,
  progressPct,
  doctorName,
  patientLabel,
  encounterLabel,
  onPlay,
}: EncounterPlayerProps) {
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = feedRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [shownIndices.length]);

  const isActive = status === "playing";

  return (
    <div className="encounter-player">
      <div className="encounter-player-head">
        <div>
          <h2>Patient Encounter Simulation</h2>
          <p>Watch how AI Smart Scribe documents in real time</p>
        </div>
        <div className="encounter-timer" aria-label="Elapsed time">
          {timerDisplay}
        </div>
      </div>

      <div className="encounter-meta">
        <span className={`listening-pulse${isActive ? " active" : ""}`}>
          <span />
          <span />
          <span />
          <span />
          <span />
        </span>
        <span className="encounter-meta-text">
          {isActive
            ? "AI Listening…"
            : `Currently simulating: ${encounterLabel}`}
        </span>
      </div>

      <div className="encounter-feed" ref={feedRef}>
        {status === "idle" && (
          <div className="encounter-idle">
            <button
              className="encounter-play"
              type="button"
              aria-label="Start simulation"
              onClick={onPlay}
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke="none"
                width="28"
                height="28"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
            <p className="encounter-idle-help">Press play to start the simulated patient encounter</p>
          </div>
        )}

        {status !== "idle" &&
          shownIndices.map((i) => {
            const line = dialogue[i];
            return (
              <div key={i} className={`enc-line enc-line-${line.speaker}`}>
                <div className="enc-speaker">
                  {line.speaker === "doctor" ? doctorName : patientLabel}
                </div>
                <div className="enc-bubble">{line.text}</div>
              </div>
            );
          })}
      </div>

      <div className="encounter-progress" aria-hidden>
        <div
          className="encounter-progress-bar"
          style={{ width: `${progressPct}%` }}
        />
      </div>
    </div>
  );
}
