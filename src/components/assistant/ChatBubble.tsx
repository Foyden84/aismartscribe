"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const CHAT_STARTERS = [
  "Generate me a sample SOAP note",
  "Is this HIPAA compliant?",
  "Can it run inside my practice?",
  "How much time could I save?",
  "Does this work with Optomate?",
];

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  html: string;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatReply(text: string): string {
  return text
    .split("\n\n")
    .map((para) => {
      const bolded = para.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      const withBreaks = bolded.replace(/\n/g, "<br>");
      return `<p>${withBreaks}</p>`;
    })
    .join("");
}

export function ChatBubble() {
  const [fabVisible, setFabVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [sending, setSending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);

  /* FAB visibility — show after 15s or when scrolled past the hero. */
  useEffect(() => {
    let shown = false;
    const show = () => {
      if (shown) return;
      shown = true;
      setFabVisible(true);
    };
    const timer = window.setTimeout(show, 15000);
    const heroEl = document.querySelector(".hero");
    const observer =
      heroEl &&
      new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) show();
          });
        },
        { threshold: 0 },
      );
    if (observer && heroEl) observer.observe(heroEl);
    return () => {
      window.clearTimeout(timer);
      if (observer) observer.disconnect();
    };
  }, []);

  /* Escape key closes the panel. */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  /* Keep scroll pinned to the latest message. */
  useEffect(() => {
    const el = messagesRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, sending]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (sending || !text.trim()) return;
      const trimmed = text.trim();
      setSending(true);

      const history: { role: "user" | "assistant"; content: string }[] = [
        ...messages.map((m) => ({ role: m.role, content: m.content })),
        { role: "user", content: trimmed },
      ];

      setMessages((prev) => [
        ...prev,
        { role: "user", content: trimmed, html: escapeHtml(trimmed) },
      ]);
      setInputValue("");

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history }),
        });
        if (!res.ok) throw new Error("API error");
        const data = await res.json();
        const reply: string = data.reply;
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: reply, html: formatReply(reply) },
        ]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "error",
            html: "<p>I apologize — I'm having trouble connecting right now. Please try again in a moment, or reach out to Dennis Foy at Integra Consulting directly.</p>",
          },
        ]);
      } finally {
        setSending(false);
        window.requestAnimationFrame(() => inputRef.current?.focus());
      }
    },
    [messages, sending],
  );

  return (
    <>
      <button
        className={`chat-fab${fabVisible ? " visible" : ""}${open ? " hidden" : ""}`}
        type="button"
        aria-label="Chat with AI Smart Scribe"
        onClick={() => {
          setOpen(true);
          window.requestAnimationFrame(() => inputRef.current?.focus());
        }}
      >
        <div className="chat-fab-pulse" />
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>

      <div className={`chat-panel${open ? " open" : ""}`}>
        <div className="chat-panel-header">
          <div className="chat-panel-title">
            <div className="chat-panel-dot" />
            <span>Ask AI Smart Scribe</span>
          </div>
          <button
            className="chat-close"
            type="button"
            aria-label="Close chat"
            onClick={() => setOpen(false)}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="chat-messages" ref={messagesRef}>
          {messages.length === 0 && (
            <div className="chat-starters">
              <div className="chat-starters-label">Try asking:</div>
              <div className="chat-starter-pills">
                {CHAT_STARTERS.map((q) => (
                  <button
                    key={q}
                    className="chat-starter"
                    type="button"
                    onClick={() => sendMessage(q)}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`chat-msg ${msg.role}`}>
              <div
                className="chat-msg-bubble"
                dangerouslySetInnerHTML={{ __html: msg.html }}
              />
            </div>
          ))}
          {sending && (
            <div className="chat-loading">
              <span />
              <span />
              <span />
            </div>
          )}
        </div>
        <div className="chat-input-bar">
          <input
            ref={inputRef}
            type="text"
            className="chat-input"
            placeholder="Ask about AI Smart Scribe..."
            autoComplete="off"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (inputValue.trim()) sendMessage(inputValue);
              }
            }}
          />
          <button
            className="chat-send"
            type="button"
            aria-label="Send message"
            disabled={sending || !inputValue.trim()}
            onClick={() => {
              if (inputValue.trim()) sendMessage(inputValue);
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
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
