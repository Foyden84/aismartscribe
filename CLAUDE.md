# CLAUDE.md — AI Smart Scribe Landing Page

## Project Overview
AI Smart Scribe is an ambient AI clinical scribe product targeting independent 
optometry and medical practices in NE Louisiana and Mississippi. This landing 
page is a sales demo tool used to show prospective clients (starting with one 
specific optometrist) what AI-assisted documentation looks and feels like in 
practice. The page must feel premium, trustworthy, and medical-grade — not 
like a generic SaaS tool.

**Live domain:** aismartscribe.com (Cloudflare DNS → Vercel)
**Deployed via:** Vercel
**Built as:** Single self-contained index.html file — no frameworks, 
no build step, no dependencies except CDN-loaded fonts

---

## Existing Assets in This Folder
- `DESIGN.md` — Full design system from Stitch. Read this first and 
  follow it precisely for all colors, typography, spacing, and component rules
- `screen.png` — Full page visual reference. Match this layout exactly 
  as the foundation

---

## Branding Correction
Stitch generated this under "SmartScribe AI" — update ALL instances to 
**"AI Smart Scribe"** throughout the HTML. Nav logo, hero, footer, 
page title, meta tags — everywhere.

---

## Tech Stack
- Single `index.html` file with embedded `<style>` and `<script>`
- Google Fonts: Manrope + Inter (load via CDN link tag)
- No React, no Vue, no build tools
- All animations via vanilla CSS keyframes and JS
- Must deploy to Vercel with zero configuration

---

## Page Sections — Build in This Order

### 1. Nav
- Logo: "AI Smart Scribe" wordmark left-aligned
- Nav links: Platform · Security · Evidence · Pricing
- Right: Login (ghost) + Get Started (primary CTA button)
- Sticky on scroll, glassmorphism background when scrolled

### 2. Hero
- Headline: "The Clinical Scribe that Really Listens."
- Subheadline: "AI Smart Scribe ambiently captures patient visits and 
  generates precise SOAP notes in real-time — so you can focus on 
  your patient, not your keyboard."
- Badge: "HIPAA COMPLIANT AMBIENT AI" (teal pill, top of headline)
- Two CTA buttons: "Start Your Free Trial" (primary) + "Watch Demo" (ghost)
- Right side: animated demo preview card (see Demo Panel spec below)
- Stats row below hero: 
  85k+ Clinicians | 20M+ Encounters | 2.5hrs Saved Daily | 98% Accuracy

### 3. Real-Time Intelligence — THE DEMO (most important section)
This is the centerpiece of the entire page. Build this with care.

**Layout:** Full-width section, dark background surface. Two-panel split:
- LEFT PANEL: "Patient Dialogue" — live transcript feed
- RIGHT PANEL: "Structured Documentation" — SOAP note generating in sync

**The Animation Sequence:**
The demo auto-plays on scroll into view and can be manually replayed 
with a "Replay Demo" button.

Use this exact optometry patient dialogue and SOAP note output:

DIALOGUE SEQUENCE (appears line by line, ~1.5 seconds between lines):