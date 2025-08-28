# Lifestyle — Implementation Plan

_Date: 2025-08-26_

## Scope

Tighten Diet section naming and options, adding a new adherence checkbox for outside food frequency.

## Changes

-   Rename **“Diet Assessment & Issues”** to **“Diet Assessment”**.
-   Replace label **“Diet Issues Identified”** with **“Diet”**.
-   Add checkbox option: **“Eating/Ordering outside food more than once a week.”**

## UI/UX

-   Use shadcn **Checkbox** with succinct helper text and tooltip.

## Acceptance Criteria

-   Labels updated everywhere (UI + forms + validations).
-   New checkbox value is persisted and visible in summary cards.
