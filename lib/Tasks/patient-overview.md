# Patient Overview — Implementation Plan

## Scope

Implement **Compact** and **Detailed** views with reordered sections, new metrics, computed eGFR, hyperlinking across tabs/subtabs, and medication-frequency notation in the Integrated Prescription.

## Changes

-   **Compact View**
    -   Place **Complaints & Vitals** before **Critical Alerts**.
    -   Show **Treatment Education** sections sourced from **Active Medications** tab.
    -   Hyperlink **Metrics** and **Organ Assessments** to corresponding **Assessment** subtabs.
    -   Display all **Provisional Diagnoses** (complications & comorbidities), each hyperlinked (e.g., Diabetes → Assessment/Overview, Nephropathy → Assessment/Nephropathy, Retinopathy → Assessment/Retinopathy).
    -   Make **Critical Alerts** clickable, routing to relevant section/subtab.
-   **Detailed View**
    -   Show **Last-Visit** values inside Metrics (persist latest encounter snapshot).
    -   Add **Potassium (K⁺)** to “Other Key Metrics”.
    -   Compute **eGFR** from **Serum Creatinine** (CKD-EPI 2021, race-free; requires age & sex).
    -   Critical Alerts: add severity chips: **Critical / High / Moderate / Low**; each hyperlinked.
    -   Move **Drug Allergies / Intolerance** next to **Critical Alerts**.
    -   **Diagnosis Summary**: add inline **Add/Edit**; link each to relevant tab/subtab/medication; include comorbidity entries.
    -   **Current Medications (Integrated Prescription)**: display dosing frequency using patterns like `1-0-1↑`, `1-0-½ ↓`.
-   **Navigation**
    -   Ensure all new hyperlinks resolve to `app/patients/[id]/dashboard?tab=...&subtab=...`.

## UI/UX

-   Use shadcn **Tabs**, **Badge** (severity colors), **Alert**, **Card**.
-   Risk colors: Critical=red, High=amber, Moderate=yellow, Low=green (WCAG AA contrast).
-   Compact cards with quick actions; Detailed view with expandable sections.

## Data/Logic

-   **eGFR** (CKD-EPI 2021, race-free):
    -   If sex=female: κ=0.7, α=-0.241; if male: κ=0.9, α=-0.302.
    -   eGFR = 142 × min(SCr/κ, 1)^α × max(SCr/κ, 1)^(-1.200) × 0.9938^age × (1.012 if female else 1).
-   Store **last-visit** metrics on encounter finalization; expose via `/api/patients/[id]/metrics?scope=last-visit`.

## Acceptance Criteria

-   All metrics/alerts/diagnoses link to correct **Assessment** subtab.
-   eGFR displays alongside S. Creatinine with unit and date; updates on new labs.
-   Drug allergies panel sits adjacent to Critical Alerts in Detailed view.
-   Integrated Prescription shows frequency symbols accurately.
