# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **diabetes and hypertension patient dashboard** built with Next.js 15, React 19, and TypeScript. The application provides comprehensive patient management tools including medication tracking, lab monitoring, lifestyle assessments, and treatment adherence communication.

## Tech Stack Architecture

- **Framework**: Next.js 15 with App Router
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Typography**: Geist Sans and Geist Mono fonts
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for data visualization

## Development Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## Project Structure

### Main Application Files
- `app/layout.tsx` - Root layout with responsive container
- `app/page.tsx` - Main entry point (likely imports patient dashboard)
- `patient-dashboard-main.tsx` - Primary dashboard with tab navigation

### Feature Components (Root Level)
Patient management components are located in the root directory:
- `patient-overview-enhanced.tsx` - Patient information and vitals
- `medications-management-complete.tsx` - Medication tracking and scheduling
- `lab-monitoring-enhanced.tsx` - Laboratory results and monitoring
- `comprehensive-assessment-functional.tsx` - Patient assessments
- `lifestyle-enhanced.tsx` - Lifestyle and dietary management
- `adherence-communication.tsx` - Treatment adherence tracking
- `advice-printable-fixed.tsx` - Printable medical advice

### UI Components
- `components/ui/` - Reusable shadcn/ui components
- `components/theme-provider.tsx` - Theme management
- `hooks/` - Custom React hooks
- `lib/utils.ts` - Utility functions

## Key Architectural Patterns

### Component Organization
- Main feature components are stored at root level (unusual pattern)
- UI components follow shadcn/ui conventions in `components/ui/`
- Components use TypeScript with proper type definitions

### Navigation & State
- Tab-based navigation using URL search parameters
- `patient-dashboard-main.tsx` manages routing between sections
- Client-side navigation with Next.js router

### Styling System
- Tailwind CSS with custom design tokens via CSS variables
- Responsive design with mobile-first approach
- Dark mode support configured via `tailwind.config.ts`

### Build Configuration
- ESLint and TypeScript errors ignored during builds (`next.config.mjs`)
- Image optimization disabled for static exports
- Tailwind configured for component paths including root-level files

## shadcn/ui Configuration

The project uses shadcn/ui with these settings:
- Style: default
- TypeScript: enabled
- Tailwind config: `tailwind.config.ts`
- Components path: `@/components`
- Utils path: `@/lib/utils`

## Development Notes

- This appears to be a v0.dev generated project based on README
- Components are primarily functional with React hooks
- Mobile responsiveness is built into the layout system
- Patient data likely flows through props (examine component interfaces)