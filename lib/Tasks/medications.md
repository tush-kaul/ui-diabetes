# Medications — Implementation Plan

_Date: 2025-08-26_

## Scope

Revise **Management** subtab to support recommendation popups, richer dosing frequency notation, status colors, and stop semantics. Remove (comment out) the **Infection & Antibiotics** subtab/component.

## Changes

-   **Management**
    -   **Add Medication**: surface guideline-based or rule-based **recommendations** as non-blocking popups (e.g., A1c > target → add GLP-1/SGLT2 suggestions).
    -   **Post-Consultation Changes**: persist dosing deltas; render frequency like `1-0-1↑`, `1-0-½ ↓`.
    -   **Insulin Units**: support explicit times e.g., `22-0-18` (Morning–Noon–Evening), not ranges like `20–22 / 16–18`.
    -   **Status** badges: **Active** = green; **Stopped** = red; **On-hold** = slate/amber.
    -   **Stop** action renders red with confirmation.
-   **Infection & Antibiotics**
    -   **Delete/Comment out** the entire subtab/component and its routes from nav and registry (keep code commented for potential future use).

## UI/UX

-   Use shadcn **Dialog** for recommendations; **Badge** for status; **Table** for regimen history.
-   Validate frequency strings; provide helper pickers for `1-0-1`, `0-1-1`, etc.

## Data/Logic

-   Store structured `doseTimes: {morning,noon,evening,bedtime}` and derive shorthand `1-0-1` for display, with `trend: up/down/none` to show ↑/↓.
-   Migrations: add columns `dose_times JSONB`, `freq_notation TEXT`, `status ENUM`.

## Acceptance Criteria

-   Adding/changing meds shows frequency using arrows/symbols.
-   Active meds are green-tagged; stopped meds red-tagged.
-   Infection & Antibiotics tab removed from UI and routing.
