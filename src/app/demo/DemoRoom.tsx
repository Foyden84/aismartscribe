"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  EncounterPlayer,
  type DialogueLine,
  type PlayerStatus,
} from "@/components/demo/EncounterPlayer";
import {
  SOAPNotePanel,
  type SoapKey,
  type SoapValues,
} from "@/components/demo/SOAPNotePanel";
import { approveNote } from "./actions";

const DIALOGUE: DialogueLine[] = [
  {
    speaker: "doctor",
    text: "Good morning, Mrs. Johnson. How have things been since your last visit?",
  },
  {
    speaker: "patient",
    text: "Hi Doctor. My right eye has been bothering me — it's been really dry and irritated, especially in the mornings.",
  },
  { speaker: "doctor", text: "How long has the dryness been going on?" },
  {
    speaker: "patient",
    text: "I'd say about three weeks now. I've been using over-the-counter drops but they only help for a little while.",
  },
  { speaker: "doctor", text: "Any changes in your vision or any pain?" },
  {
    speaker: "patient",
    text: "No pain, just that gritty, sandy feeling. My vision seems about the same.",
  },
  {
    speaker: "doctor",
    text: "Let me take a look. I'm going to start with the slit lamp exam.",
  },
  {
    speaker: "doctor",
    text: "I'm seeing reduced tear film quality in the right eye. Tear break-up time is about 4 seconds. Left eye looks better at 9 seconds.",
  },
  { speaker: "patient", text: "Is that something serious?" },
  {
    speaker: "doctor",
    text: "It's a very common condition — dry eye syndrome. I'd like to start you on preservative-free artificial tears four times daily and we'll reassess in four weeks.",
  },
];

const SCRIPTED_SOAP: SoapValues = {
  chiefComplaint: "Dryness and irritation, right eye, three weeks.",
  hpi: "68-year-old female presents with three-week history of dryness and irritation OD, worse in mornings. Using OTC artificial tears with temporary relief only. Denies pain, flashes, floaters, or change in vision.",
  objective:
    "VA (cc): OD 20/25, OS 20/20 distance. Slit lamp: Reduced tear film quality OD. Tear break-up time OD 4 sec, OS 9 sec. Cornea clear bilaterally with no fluorescein staining. IOP: OD 14 mmHg, OS 15 mmHg (Goldmann).",
  assessment:
    "1. Dry eye syndrome (keratoconjunctivitis sicca), right eye — mild severity\n2. Meibomian gland dysfunction, bilateral — early",
  plan: "1. Preservative-free artificial tears QID OD\n2. Warm compresses BID OU for 5 minutes\n3. Omega-3 supplementation 1000mg daily\n4. Follow-up in 4 weeks to reassess tear film quality\n5. Patient educated on environmental modifications",
};

// SOAP keys appear progressively at these dialogue indices.
const SOAP_TIMING: { key: SoapKey; appearsAfter: number }[] = [
  { key: "chiefComplaint", appearsAfter: 1 },
  { key: "hpi", appearsAfter: 2 },
  { key: "objective", appearsAfter: 6 },
  { key: "assessment", appearsAfter: 8 },
  { key: "plan", appearsAfter: 9 },
];

const LINE_INTERVAL_MS = 1500;
const SOAP_DELAY_MS = 600;

function buildTranscript(dialogue: DialogueLine[]): string {
  return dialogue
    .map((l) => `${l.speaker === "doctor" ? "Doctor" : "Patient"}: ${l.text}`)
    .join("\n");
}

function parseSoap(text: string): SoapValues {
  const out: SoapValues = {
    chiefComplaint: "",
    hpi: "",
    objective: "",
    assessment: "",
    plan: "",
  };
  const pattern =
    /^(CHIEF COMPLAINT|HPI|OBJECTIVE|ASSESSMENT|PLAN):\s*([\s\S]*?)(?=^(?:CHIEF COMPLAINT|HPI|OBJECTIVE|ASSESSMENT|PLAN):|$)/gim;
  let match;
  while ((match = pattern.exec(text)) !== null) {
    const [, label, content] = match;
    const trimmed = content.trim();
    switch (label.toUpperCase()) {
      case "CHIEF COMPLAINT":
        out.chiefComplaint = trimmed;
        break;
      case "HPI":
        out.hpi = trimmed;
        break;
      case "OBJECTIVE":
        out.objective = trimmed;
        break;
      case "ASSESSMENT":
        out.assessment = trimmed;
        break;
      case "PLAN":
        out.plan = trimmed;
        break;
    }
  }
  return out;
}

export function DemoRoom() {
  const [status, setStatus] = useState<PlayerStatus>("idle");
  const [shownIndices, setShownIndices] = useState<number[]>([]);
  const [visibleKeys, setVisibleKeys] = useState<Set<SoapKey>>(new Set());
  const [soap, setSoap] = useState<SoapValues>(SCRIPTED_SOAP);
  const [editMode, setEditMode] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [generationDuration, setGenerationDuration] = useState<string | null>(
    null,
  );
  const [savedNoteId, setSavedNoteId] = useState<string | null>(null);

  const timeoutsRef = useRef<number[]>([]);
  const intervalRef = useRef<number | null>(null);

  const cleanupTimers = useCallback(() => {
    timeoutsRef.current.forEach((t) => window.clearTimeout(t));
    timeoutsRef.current = [];
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => () => cleanupTimers(), [cleanupTimers]);

  const handlePlay = useCallback(() => {
    if (status !== "idle") return;
    cleanupTimers();
    setStatus("playing");
    setShownIndices([]);
    setVisibleKeys(new Set());
    setSoap(SCRIPTED_SOAP);
    setEditMode(false);
    setTimerSeconds(0);
    setGenerationDuration(null);
    setSavedNoteId(null);

    intervalRef.current = window.setInterval(() => {
      setTimerSeconds((s) => s + 1);
    }, 1000);

    DIALOGUE.forEach((_, i) => {
      const delay = (i + 1) * LINE_INTERVAL_MS;

      timeoutsRef.current.push(
        window.setTimeout(() => {
          setShownIndices((prev) => [...prev, i]);

          SOAP_TIMING.forEach((s) => {
            if (s.appearsAfter === i) {
              timeoutsRef.current.push(
                window.setTimeout(() => {
                  setVisibleKeys((prev) => {
                    const next = new Set(prev);
                    next.add(s.key);
                    return next;
                  });
                }, SOAP_DELAY_MS),
              );
            }
          });

          if (i === DIALOGUE.length - 1) {
            timeoutsRef.current.push(
              window.setTimeout(() => {
                if (intervalRef.current) {
                  window.clearInterval(intervalRef.current);
                  intervalRef.current = null;
                }
                setStatus("complete");
                setTimerSeconds((seconds) => {
                  const m = Math.floor(seconds / 60);
                  const s = seconds % 60;
                  setGenerationDuration(
                    `Note generated in ${m}m ${String(s).padStart(2, "0")}s · Ready for review`,
                  );
                  return seconds;
                });
              }, 1200),
            );
          }
        }, delay),
      );
    });
  }, [status, cleanupTimers]);

  const handleChange = useCallback((key: SoapKey, value: string) => {
    setSoap((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleApprove = useCallback(async () => {
    setStatus("saving");
    const transcript = buildTranscript(DIALOGUE);
    let finalSoap = soap;

    // If user hasn't edited, regenerate via /api/generate to get the LLM version
    // (or the canned fallback when ANTHROPIC_API_KEY isn't set).
    if (!editMode) {
      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transcript }),
        });
        if (res.ok) {
          const data = await res.json();
          if (typeof data.note === "string") {
            const parsed = parseSoap(data.note);
            // Only adopt parsed sections if they aren't all empty — defensive.
            const hasContent = Object.values(parsed).some((v) => v.length > 0);
            if (hasContent) finalSoap = parsed;
          }
        }
      } catch {
        // fall through — we save the scripted/displayed values
      }
    }

    try {
      const result = await approveNote({
        transcript,
        ...finalSoap,
        encounterType: "Annual Eye Exam",
      });
      setSoap(finalSoap);
      setSavedNoteId(result.noteId);
      setStatus("approved");
      toast.success("Note saved to your records");
    } catch (err) {
      console.error("approveNote failed", err);
      toast.error("Couldn't save the note. Please try again.");
      setStatus("complete");
    }
  }, [editMode, soap]);

  const handleEdit = useCallback(() => setEditMode(true), []);
  const handleCancelEdit = useCallback(() => {
    setSoap(SCRIPTED_SOAP);
    setEditMode(false);
  }, []);

  const timerDisplay = (() => {
    const m = Math.floor(timerSeconds / 60);
    const s = timerSeconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  })();

  const progressPct =
    status === "idle"
      ? 0
      : status === "approved" || status === "complete" || status === "saving"
        ? 100
        : Math.min(100, (shownIndices.length / DIALOGUE.length) * 100);

  if (status === "approved") {
    return (
      <div className="demo-approved">
        <div className="demo-approved-card">
          <div className="demo-approved-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              width="32"
              height="32"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2>Note saved successfully</h2>
          <p>
            The SOAP note is now in your secure records. You can review, copy,
            or export it from the dashboard anytime.
          </p>
          <div className="demo-approved-actions">
            <Link href="/dashboard" className="btn btn-primary">
              View in Dashboard →
            </Link>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                setStatus("idle");
                setShownIndices([]);
                setVisibleKeys(new Set());
                setSoap(SCRIPTED_SOAP);
                setEditMode(false);
                setTimerSeconds(0);
                setGenerationDuration(null);
                setSavedNoteId(null);
              }}
            >
              Run another encounter
            </button>
          </div>
          {savedNoteId && (
            <p className="demo-approved-meta">Note ID: {savedNoteId}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="demo-room-grid">
        <EncounterPlayer
          dialogue={DIALOGUE}
          shownIndices={shownIndices}
          status={status}
          timerDisplay={timerDisplay}
          progressPct={progressPct}
          doctorName="Dr. Nguyen"
          patientLabel="Mrs. Johnson"
          encounterLabel="Annual Eye Exam — Mrs. Johnson, 68F"
          onPlay={handlePlay}
        />
        <SOAPNotePanel
          values={soap}
          visibleKeys={visibleKeys}
          status={status}
          editMode={editMode}
          onChange={handleChange}
          onApprove={handleApprove}
          onEdit={handleEdit}
          onCancelEdit={handleCancelEdit}
          generationLabel={generationDuration ?? "Listening for encounter to complete…"}
        />
      </div>

      {(status === "complete" || status === "saving") && (
        <div className="demo-value-strip">
          <div className="demo-value-stat">
            <strong>~6 minutes</strong>
            <span>of documentation time you just reclaimed</span>
          </div>
          <div className="demo-value-stat">
            <strong>30+ hours</strong>
            <span>per year at your current patient volume</span>
          </div>
        </div>
      )}
    </>
  );
}
