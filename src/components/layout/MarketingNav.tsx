"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";

export function MarketingNav() {
  const { isSignedIn, isLoaded } = useUser();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const mobileStyle: React.CSSProperties = mobileOpen
    ? {
        display: "flex",
        flexDirection: "column",
        position: "absolute",
        top: "100%",
        left: 0,
        right: 0,
        background: "rgba(246,250,253,0.95)",
        backdropFilter: "blur(20px)",
        padding: "16px 24px",
        gap: "16px",
        borderRadius: "0 0 16px 16px",
      }
    : {};

  return (
    <nav className={`nav${scrolled ? " scrolled" : ""}`} id="nav">
      <div className="container nav-inner">
        <a href="#" className="nav-logo">
          AI Smart Scribe
        </a>
        <ul className="nav-links" style={mobileStyle}>
          <li>
            <a href="#demo" onClick={() => setMobileOpen(false)}>
              Platform
            </a>
          </li>
          <li>
            <a href="#security" onClick={() => setMobileOpen(false)}>
              Security
            </a>
          </li>
          <li>
            <a href="#workflow" onClick={() => setMobileOpen(false)}>
              Evidence
            </a>
          </li>
          <li>
            <a href="#cta" onClick={() => setMobileOpen(false)}>
              Pricing
            </a>
          </li>
        </ul>
        <div className="nav-actions">
          {isLoaded && !isSignedIn && (
            <>
              <Link href="/sign-in" className="nav-login">
                Login
              </Link>
              <Link href="/sign-up" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </>
          )}
          {isLoaded && isSignedIn && (
            <>
              <Link href="/demo" className="nav-login">
                Demo
              </Link>
              <UserButton />
            </>
          )}
        </div>
        <button
          className="nav-toggle"
          type="button"
          aria-label="Toggle menu"
          onClick={() => setMobileOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
  );
}
