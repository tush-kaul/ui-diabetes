# Lab/Monitoring — Implementation Plan

## Scope

Add expand/collapse capability per chart, default expand **FBS**, **PPBS**, **HbA1c**, and include additional metric graphs referenced in Overview with hyperlink targets.

## Changes

-   **Chart Controls**
    -   Each graph gets an **Expand/Collapse** toggle; remember per-user setting.
    -   Default expanded: **FBS**, **PPBS**, **HbA1c**.
-   **Metrics**
    -   Add charts for: LDL, HDL, TG, ASCVD risk (yearly), Creatinine, Potassium, ACR, Microalbumin, BP (SYS/DIA), weight/BMI (if available).
    -   Provide **reference lines/areas** and **trend arrows** (↑/↓/–).
-   **Navigation**
    -   Ensure Overview metric cards link here via anchors: `.../dashboard?tab=labs&metric=A1C` (auto-scroll/open).

## UI/UX

-   Use Recharts **LineChart/ComposedChart** with responsive container; shadcn **Accordion** or inline toggle button per chart.
-   Avoid clutter by collapsing rarely used graphs by default.

## Data/Logic

-   Cache series with TanStack Query; unify units; show last-updated timestamp.

## Acceptance Criteria

-   Expand/collapse works per metric and persists.
-   New metric charts render with thresholds and trend icons.
-   Hyperlinks from Overview open the targeted graph.
