# Design System Strategy: Ambient Precision

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Clinical Curator."** 

In the high-stakes environment of optometry and independent medical practices, software must move beyond being a "tool" to becoming an invisible, sophisticated partner. This system rejects the cluttered, legacy-industrial aesthetic of traditional medical software in favor of an high-end editorial experience. We achieve "Trustworthy" not through heavy borders and bold blues, but through **authoritative whitespace, intentional asymmetry, and tonal depth.**

By utilizing a "Glass-on-Cloud" layering technique, the UI feels lightweight and ambient—fitting for a scribe that listens without intruding. We prioritize a hierarchy that feels like a premium medical journal: spacious, high-contrast typography and subtle, layered surfaces that guide the practitioner’s eye naturally through clinical data.

---

## 2. Colors: Tonal Architecture
This system moves away from flat color fills to create a sense of medical-grade precision through atmospheric shifts.

### The Palette
*   **Primary (`#00342b`):** Deep, authoritative navy/teal. Used for high-impact grounding and primary actions.
*   **Secondary (`#5b3cdd`):** A sophisticated violet/teal accent for AI-specific features, signaling "intelligence" without being distracting.
*   **Surface System:** A range of cool-tinted whites (`#f6fafd`) and subtle greys that form the foundation of our "No-Line" philosophy.

### The "No-Line" Rule
**Explicit Instruction:** Traditional 1px solid borders (`#000000` or grey) are strictly prohibited for defining sections. 
*   **Boundaries** must be defined solely through background color shifts. Use `surface` as your base, and `surface-container-low` to define distinct content areas.
*   **Intentional Asymmetry:** Break the grid by allowing certain containers (like an AI summary) to overlap two different surface tiers, creating a sense of physical layering.

### The "Glass & Gradient" Rule
To elevate the "Ambient AI" experience, floating elements (modals, tooltips, or active mic indicators) must utilize **Glassmorphism**.
*   **Token:** `surface-container-lowest` with an 85% opacity and a `20px` backdrop-blur.
*   **Signature Textures:** Use a subtle radial gradient transitioning from `primary` to `primary-container` for Hero sections. This creates a "visual soul"—a depth that suggests the software is active and "listening."

---

## 3. Typography: Editorial Authority
We use a high-contrast pairing of **Manrope** for structural authority and **Inter** for clinical clarity.

*   **Display & Headlines (Manrope):** These are the "anchors." Set `display-lg` and `headline-md` with tighter letter-spacing (-2%) to mimic high-end editorial print. This conveys a sense of established medical expertise.
*   **Body & Labels (Inter):** These are for data density. The readability of Inter at `body-sm` (`0.75rem`) ensures that even complex medical notes remain legible under stress.
*   **Hierarchy Note:** Use `tertiary` (`#00333a`) for secondary headlines instead of grey. This maintains a "medical-grade" professional tone while differentiating from the primary content.

---

## 4. Elevation & Depth: Tonal Layering
Depth is achieved through "Tonal Stacking" rather than structural shadows.

*   **The Layering Principle:** 
    *   Level 0 (Base): `surface` (`#f6fafd`)
    *   Level 1 (Sections): `surface-container-low`
    *   Level 2 (Active Cards): `surface-container-lowest` (pure white)
    *   Place a Level 2 card atop a Level 1 section to create a soft, natural lift that mimics fine paper on a desk.
*   **Ambient Shadows:** For floating elements only (e.g., a "Start Scribing" button), use a `24px` blur at 6% opacity. The shadow color must be a tint of `on-surface` (a deep navy-grey) rather than black, to mimic natural clinical lighting.
*   **The "Ghost Border" Fallback:** If a container requires a border for accessibility, use `outline-variant` at **15% opacity**. It should be felt, not seen.

---

## 5. Components: Refined Interaction

### Buttons
*   **Primary:** High-contrast `on-primary` text on `primary` background. Use a `full` roundedness scale (pill shape) to differentiate from clinical data cards.
*   **Secondary:** `surface-container-highest` background with `primary` text. No border.
*   **AI State:** Use a gradient of `secondary` to `secondary-container` when the scribe is actively processing.

### Cards & Lists
*   **Rule:** **Forbid the use of divider lines.**
*   Separate list items using `8px` of vertical whitespace or a subtle toggle between `surface-container-low` and `surface-container-lowest`. 
*   **Cards:** Use `lg` (1rem) corner radius. Elements within cards should feel "nested"—using slightly different tonal shifts to separate headers from body text.

### Input Fields
*   **Default:** `surface-container-highest` background with a `Ghost Border`. 
*   **Active:** The border transitions to `primary` with a 2px width, but the background remains stable to prevent "jumping" layouts.
*   **Error:** Use `error` text with a `error_container` background—avoiding harsh red outlines that can cause unnecessary alarm in a medical context.

### Clinical Ambient Components
*   **The Scribe Pulse:** A custom component using a `backdrop-blur` and a breathing scale animation (1.0 to 1.05) using the `tertiary-fixed` color to indicate the AI is listening.
*   **Data Chips:** Use `secondary-fixed` for AI-extracted medical terms (e.g., "Glaucoma") to make them instantly scannable against the navy/white background.

---

## 6. Do's and Don'ts

### Do
*   **Do** use extreme whitespace (64px+) between major sections to emphasize the "clean" medical aesthetic.
*   **Do** use Manrope for all numerical data (e.g., "85,000+ clinicians") to give the data weight and importance.
*   **Do** align elements to a 4px soft grid but allow for "floating" AI elements to break the grid slightly for a modern feel.

### Don't
*   **Don't** use 100% black (`#000000`). Use `primary` or `on-surface` for text to maintain a sophisticated tonal range.
*   **Don't** use sharp 90-degree corners. Everything should have at least the `sm` (0.25rem) radius to feel approachable and "human-centric."
*   **Don't** use standard "drop shadows" on cards. Rely on background color shifts (`surface` vs `surface-container-low`) for 90% of your hierarchy needs.