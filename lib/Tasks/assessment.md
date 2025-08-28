# Assessment — Implementation Plan

## Scope

Restructure multiple assessment subtabs (Liver, Cardiac, Nephropathy, CVA/Stroke, Diabetic Foot) with medication optimization additions, ordering flow, heatmap for renal markers, and subtab relocations/renames.

## Changes

-   **Liver Assessment (MASLD)**
    -   Add **Pioglitazone** to **Medication Optimization & Action Plan** (post-score calculation).
    -   Move **Order Tests** section to the **top**.
    -   Remove **Clinical Symptoms & Features** section.
    -   MASLD: **Autopopulate** values from patient info; then **ORDER TESTS**; then inputs for **FIB-4** calculation.
-   **Cardiac (IHD/HF)**
    -   Add **Bempedoic Acid** and **Ezetimibe** to Medication Optimization when LDL above goal or statin-intolerant.
-   **Nephropathy**
    -   Provide a **heat map** for **eGFR, Urine ACR, Serum Creatinine** alongside current visuals.
    -   **Move** the **Diabetic Nephropathy Assessment** section from **Diabetic Foot** subtab into **Nephropathy**.
-   **Neurological → CVA/Stroke (rename)**
    -   **Rename** subtab to **CVA/Stroke**.
    -   **Move** the **Neuropathic Assessment** section to **Diabetic Foot** subtab.
    -   CVA/Stroke specifics:
        -   History & Symptoms point 7 → **(Current symptoms / TIA Symptoms / Stroke)**.
        -   After **BEFAST** symptoms, add **Personal Notes**.
        -   **Order Tests**: include **Holter** and **Carotid/Transcranial Doppler**.
-   **Diabetic Foot**
    -   **PVD Assessment**:
        -   Remove **Physical Examination** section.
        -   In **Screening Symptoms**, remove: Rest pain, Cold feet, Absent pedal pulses.

## UI/UX

-   Use shadcn **Tabs**, **Card**, **Separator**; heatmap via small matrix (Recharts/Cell) with legend (green→red).
-   Keep **Order Tests** primary actions prominent at section top.

## Data/Logic

-   Heatmap bins for eGFR/ACR per KDIGO categories.
-   Trigger med optimization suggestions after score or risk calculation events.

## Acceptance Criteria

-   Subtabs renamed/moved as specified, no orphan links.
-   Liver/Cardiac optimizations show new drugs when criteria met.
-   Nephropathy heatmap renders with correct bins.
-   CVA/Stroke shows updated fields and tests; Neuropathic Assessment lives under Diabetic Foot.
