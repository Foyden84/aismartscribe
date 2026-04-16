"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { MarketingNav } from "@/components/layout/MarketingNav";
import { ChatBubble } from "@/components/assistant/ChatBubble";

type Speaker = "doctor" | "patient";

interface DialogueLine {
  speaker: Speaker;
  text: string;
}

interface SoapSection {
  key: "S" | "O" | "A" | "P";
  label: string;
  cssClass: "s-label" | "o-label" | "a-label" | "p-label";
  html: string;
  appearsAfter: number;
}

const DIALOGUE_DATA: DialogueLine[] = [
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

const SOAP_DATA: SoapSection[] = [
  {
    key: "S",
    label: "Subjective",
    cssClass: "s-label",
    html: "Patient reports 3-week history of dryness and irritation OD, worse in AM. Currently using OTC artificial tears with temporary relief. Denies pain or vision changes.",
    appearsAfter: 2,
  },
  {
    key: "O",
    label: "Objective",
    cssClass: "o-label",
    html: 'VA: OD 20/25, OS 20/20. Slit lamp: Reduced tear film quality OD. <span class="medical-term">TBUT</span>: OD 4 sec, OS 9 sec. Cornea clear bilaterally. No staining with <span class="medical-term">fluorescein</span>.',
    appearsAfter: 6,
  },
  {
    key: "A",
    label: "Assessment",
    cssClass: "a-label",
    html: '<span class="medical-term">Dry eye syndrome</span> (keratoconjunctivitis sicca), right eye. Mild severity.',
    appearsAfter: 8,
  },
  {
    key: "P",
    label: "Plan",
    cssClass: "p-label",
    html: "1. Preservative-free artificial tears QID OD<br>2. Warm compresses BID<br>3. Follow-up in 4 weeks to reassess<br>4. Patient educated on environmental modifications",
    appearsAfter: 9,
  },
];

type DemoStatus = "Ready" | "Recording" | "Complete";

export default function Home() {
  // Auth state (used by hero + CTA to switch copy/links for signed-in users)
  const { isSignedIn, isLoaded: authLoaded } = useUser();

  // Demo
  const [shownDialogue, setShownDialogue] = useState<number[]>([]);
  const [visibleSoap, setVisibleSoap] = useState<Set<string>>(new Set());
  const [demoStatus, setDemoStatus] = useState<DemoStatus>("Ready");
  const [dotActive, setDotActive] = useState(false);
  const [pulseActive, setPulseActive] = useState(false);
  const [typingVisible, setTypingVisible] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [liveBadge, setLiveBadge] = useState("Live");
  const [genBadge, setGenBadge] = useState("Generating");
  const demoRunningRef = useRef(false);
  const demoTimeoutsRef = useRef<number[]>([]);
  const timerIntervalRef = useRef<number | null>(null);
  const demoContainerRef = useRef<HTMLDivElement>(null);
  const dialogueFeedRef = useRef<HTMLDivElement>(null);

  /* ========= Fade-up observer ========= */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    document.querySelectorAll(".fade-up").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  /* ========= Demo engine ========= */
  const clearDemo = useCallback(() => {
    demoTimeoutsRef.current.forEach((t) => window.clearTimeout(t));
    demoTimeoutsRef.current = [];
    if (timerIntervalRef.current) {
      window.clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setShownDialogue([]);
    setVisibleSoap(new Set());
    setTypingVisible(false);
    setPulseActive(false);
    setDotActive(false);
    setDemoStatus("Ready");
    setTimerSeconds(0);
    setLiveBadge("Live");
    setGenBadge("Generating");
    demoRunningRef.current = false;
  }, []);

  const runDemo = useCallback(() => {
    if (demoRunningRef.current) return;
    clearDemo();
    demoRunningRef.current = true;
    setDotActive(true);
    setDemoStatus("Recording");
    setPulseActive(true);

    timerIntervalRef.current = window.setInterval(() => {
      setTimerSeconds((s) => s + 1);
    }, 1000);

    DIALOGUE_DATA.forEach((_, i) => {
      const delay = (i + 1) * 1500;

      demoTimeoutsRef.current.push(
        window.setTimeout(() => setTypingVisible(true), delay - 400),
      );

      demoTimeoutsRef.current.push(
        window.setTimeout(() => {
          setTypingVisible(false);
          setShownDialogue((prev) => [...prev, i]);

          window.requestAnimationFrame(() => {
            const feed = dialogueFeedRef.current;
            if (feed) feed.scrollTop = feed.scrollHeight;
          });

          SOAP_DATA.forEach((section) => {
            if (section.appearsAfter === i) {
              demoTimeoutsRef.current.push(
                window.setTimeout(() => {
                  setVisibleSoap((prev) => {
                    const next = new Set(prev);
                    next.add(section.key);
                    return next;
                  });
                }, 600),
              );
            }
          });

          if (i === DIALOGUE_DATA.length - 1) {
            demoTimeoutsRef.current.push(
              window.setTimeout(() => {
                setDotActive(false);
                setDemoStatus("Complete");
                setPulseActive(false);
                setLiveBadge("Done");
                setGenBadge("Complete");
                if (timerIntervalRef.current) {
                  window.clearInterval(timerIntervalRef.current);
                  timerIntervalRef.current = null;
                }
                demoRunningRef.current = false;
              }, 1200),
            );
          }
        }, delay),
      );
    });
  }, [clearDemo]);

  useEffect(() => {
    const el = demoContainerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !demoRunningRef.current) {
            runDemo();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [runDemo]);

  useEffect(() => {
    const timeouts = demoTimeoutsRef;
    const interval = timerIntervalRef;
    return () => {
      timeouts.current.forEach((t) => window.clearTimeout(t));
      if (interval.current) window.clearInterval(interval.current);
    };
  }, []);

  const timerDisplay = `${String(Math.floor(timerSeconds / 60)).padStart(2, "0")}:${String(timerSeconds % 60).padStart(2, "0")}`;

  return (
    <>
      <MarketingNav />

      {/* ====== HERO ====== */}
      <section className="hero">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-content">
              <div className="hero-badge">HIPAA Compliant Ambient AI</div>
              <h1>
                The Clinical Scribe that <em>Really Listens.</em>
              </h1>
              <p className="hero-sub">
                AI Smart Scribe ambiently captures patient visits and generates
                precise SOAP notes in real-time — so you can focus on your
                patient, not your keyboard.
              </p>
              <div className="hero-ctas">
                {authLoaded && isSignedIn ? (
                  <Link href="/demo" className="btn btn-primary">
                    Open Demo Room
                  </Link>
                ) : (
                  <Link href="/sign-up" className="btn btn-primary">
                    Start Your Free Trial
                  </Link>
                )}
                <a href="#demo" className="btn btn-ghost">
                  Watch Demo
                </a>
              </div>
            </div>
            <div style={{ position: "relative" }}>
              <div className="hero-demo-card">
                <div className="hero-demo-header">
                  <div className="hero-demo-dot" />
                  <span className="hero-demo-label">Live Session</span>
                </div>
                <div className="hero-demo-lines">
                  <div className="hero-demo-line" />
                  <div className="hero-demo-line" />
                  <div className="hero-demo-line" />
                  <div className="hero-demo-line" />
                  <div className="hero-demo-line" />
                  <div className="hero-demo-line" />
                </div>
                <div className="hero-demo-badge">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="23" />
                  </svg>
                  Ambient Capture Active
                </div>
              </div>
              <div className="hero-float hero-float-top">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                98% Accuracy
              </div>
              <div className="hero-float hero-float-bottom">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                2.5hrs Saved
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="stats">
          <div className="container">
            <div className="stats-grid">
              <div className="stat fade-up">
                <div className="stat-value">85k+</div>
                <div className="stat-label">Clinicians</div>
              </div>
              <div className="stat fade-up" style={{ animationDelay: "0.1s" }}>
                <div className="stat-value">20M+</div>
                <div className="stat-label">Encounters</div>
              </div>
              <div className="stat fade-up" style={{ animationDelay: "0.2s" }}>
                <div className="stat-value">2.5hrs</div>
                <div className="stat-label">Saved Daily</div>
              </div>
              <div className="stat fade-up" style={{ animationDelay: "0.3s" }}>
                <div className="stat-value">98%</div>
                <div className="stat-label">Accuracy</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== DEMO ====== */}
      <section className="demo-section" id="demo">
        <div className="container">
          <div className="demo-header fade-up">
            <h2>Real-time Intelligence</h2>
            <p>
              See how AI Smart Scribe transforms dialogue into structured
              clinical data.
            </p>
          </div>

          <div className="demo-container" ref={demoContainerRef}>
            <div className="demo-toolbar">
              <div className="demo-status">
                <div
                  className={`demo-status-dot${dotActive ? " active" : ""}`}
                />
                <span className="demo-status-label">{demoStatus}</span>
              </div>
              <span className="demo-timer">{timerDisplay}</span>
              <button
                className="demo-replay"
                type="button"
                title="Replay Demo"
                onClick={() => {
                  clearDemo();
                  window.setTimeout(runDemo, 200);
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="1 4 1 10 7 10" />
                  <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                </svg>
                Replay
              </button>
            </div>

            <div className="demo-panels">
              {/* LEFT: Dialogue */}
              <div className="demo-panel">
                <div className="demo-panel-header">
                  <span className="demo-panel-title">Patient Dialogue</span>
                  <span className="demo-panel-badge badge-live">
                    {liveBadge}
                  </span>
                </div>
                <div className="dialogue-feed" ref={dialogueFeedRef}>
                  {shownDialogue.map((idx) => {
                    const line = DIALOGUE_DATA[idx];
                    return (
                      <div
                        key={idx}
                        className={`dialogue-line ${line.speaker} visible`}
                      >
                        <div className={`dialogue-speaker ${line.speaker}`}>
                          {line.speaker === "doctor"
                            ? "Dr. Nguyen"
                            : "Mrs. Johnson"}
                        </div>
                        <div className="dialogue-text">{line.text}</div>
                      </div>
                    );
                  })}
                </div>
                <div
                  className={`dialogue-typing${typingVisible ? " visible" : ""}`}
                >
                  <span />
                  <span />
                  <span />
                </div>
              </div>

              {/* RIGHT: SOAP */}
              <div className="demo-panel">
                <div className="demo-panel-header">
                  <span className="demo-panel-title">
                    Structured Documentation
                  </span>
                  <span className="demo-panel-badge badge-generating">
                    {genBadge}
                  </span>
                </div>
                <div className="soap-content">
                  {SOAP_DATA.map((section) => (
                    <div
                      key={section.key}
                      className={`soap-section${visibleSoap.has(section.key) ? " visible" : ""}`}
                    >
                      <div className={`soap-label ${section.cssClass}`}>
                        <strong>{section.key}</strong> — {section.label}
                      </div>
                      <div
                        className="soap-text"
                        dangerouslySetInnerHTML={{ __html: section.html }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={`scribe-pulse${pulseActive ? " active" : ""}`}>
              <div className="scribe-pulse-rings">
                <div className="scribe-pulse-ring" />
                <div className="scribe-pulse-ring" />
                <div className="scribe-pulse-ring" />
                <div className="scribe-pulse-ring" />
                <div className="scribe-pulse-ring" />
              </div>
              <span className="scribe-pulse-text">AI Scribe Listening</span>
            </div>
          </div>
        </div>
      </section>

      {/* ====== WORKFLOW ====== */}
      <section className="workflow" id="workflow">
        <div className="container">
          <div className="workflow-header fade-up">
            <h2>Effortless Workflow</h2>
            <p>
              From patient conversation to complete documentation in three
              simple steps.
            </p>
          </div>
          <div className="workflow-grid">
            <div className="workflow-card fade-up">
              <div className="workflow-icon workflow-icon-1">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                </svg>
              </div>
              <div className="workflow-step">1. Record</div>
              <h3>Just Talk</h3>
              <p>
                Place your device in the room. AI Smart Scribe ambiently
                captures the natural conversation without requiring any manual
                input.
              </p>
            </div>
            <div
              className="workflow-card fade-up"
              style={{ animationDelay: "0.15s" }}
            >
              <div className="workflow-icon workflow-icon-2">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              </div>
              <div className="workflow-step">2. AI Processes</div>
              <h3>Instant Notes</h3>
              <p>
                Our clinical-grade AI fills out each section of your structured
                documentation following a clinical note standard.
              </p>
            </div>
            <div
              className="workflow-card fade-up"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="workflow-icon workflow-icon-3">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <div className="workflow-step">3. Review &amp; Sync</div>
              <h3>Sign &amp; Submit</h3>
              <p>
                Review the note on your tablet or desktop, make any edits, then
                push documentation directly to your existing EHR.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ====== SECURITY ====== */}
      <section className="security" id="security">
        <div className="container">
          <div className="security-grid">
            <div>
              <h2>Medical-Grade Privacy. No Compromises.</h2>
              <div className="security-features">
                <div className="security-feature">
                  <div className="security-feature-icon">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <div>
                    <h4>HIPAA &amp; SOC2 Compliant</h4>
                    <p>
                      Every byte is encrypted. We exceed industry standards for
                      health care data security and privacy protection.
                    </p>
                  </div>
                </div>
                <div className="security-feature">
                  <div className="security-feature-icon">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <div>
                    <h4>Local Processing Option</h4>
                    <p>
                      Audio can be transcribed locally on your device. No PHI
                      needs to leave your premises if you prefer on-site
                      control.
                    </p>
                  </div>
                </div>
                <div className="security-feature">
                  <div className="security-feature-icon">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="22 12 16 12 14 15 10 9 8 12 2 12" />
                    </svg>
                  </div>
                  <div>
                    <h4>No Audio Retention</h4>
                    <p>
                      Audio is processed in real-time and immediately
                      discarded. Your conversations are never stored after the
                      visit ends.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="security-card">
              <div className="shield-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h3>Your Patient Data Stays Yours</h3>
              <p>
                We do not sell, share, or train AI models on your patient data.
                Your practice&apos;s information is used only to serve you.
              </p>
              <button className="btn" type="button">
                Download Security Whitepaper
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ====== CTA ====== */}
      <section className="cta-section" id="cta">
        <div className="container">
          <h2 className="fade-up">Ready to recapture your time?</h2>
          <p className="fade-up">
            Join thousands of practitioners who have eliminated charting
            after-hours. Experience the intelligent future of documentation
            today.
          </p>
          <div className="cta-buttons fade-up">
            {authLoaded && isSignedIn ? (
              <Link href="/demo" className="btn btn-primary">
                Open Demo Room
              </Link>
            ) : (
              <Link href="/sign-up" className="btn btn-primary">
                Get Started Free
              </Link>
            )}
            <Link href="/sign-up" className="btn btn-ghost">
              Schedule a Demo
            </Link>
          </div>
          <p className="cta-note fade-up">
            No credit card required. HIPAA compliant setup in 5 minutes.
          </p>
        </div>
      </section>

      {/* ====== FOOTER ====== */}
      <footer className="footer">
        <div className="container footer-inner">
          <span className="footer-brand">AI Smart Scribe</span>
          <span className="footer-copy">
            © 2026 AI Smart Scribe · Powered by Integra Consulting
          </span>
          <ul className="footer-links">
            <li>
              <a href="#">Privacy</a>
            </li>
            <li>
              <a href="#">Terms</a>
            </li>
            <li>
              <a href="#">Contact</a>
            </li>
          </ul>
        </div>
      </footer>

      <ChatBubble />
    </>
  );
}
