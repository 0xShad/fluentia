# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Fluentia is an AI-powered communication coaching platform. Users select scenario-based roleplay sessions and have live voice conversations with a Vapi AI agent. After sessions, they can review transcripts and track communication improvement metrics on a dashboard.

## Commands

```bash
npm run dev        # start Next.js development server (http://localhost:3000)
npm run build      # production build
npm run start      # start production server
npm run lint       # run ESLint
```

There is no test suite configured.

## Environment Variables

Three variables are required in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_VAPI_PUBLIC_KEY=
```

## Architecture

**Stack**: Next.js 16 App Router · React 19 · TypeScript · Tailwind CSS v4 · Supabase (auth + DB) · Vapi AI (voice) · shadcn/ui · Framer Motion · Recharts

**Path alias**: `@/*` → `./src/*`

### Route Structure

| Route | Purpose |
|---|---|
| `/` | Public landing page |
| `/authentication/login`, `/register`, `/forgot-password` | Auth pages |
| `/dashboard` | Progress/metrics home |
| `/dashboard/practice` | Scenario browser |
| `/dashboard/practice/[id]` | Live voice session |
| `/dashboard/sessions` | Session history |
| `/dashboard/feedback` | AI feedback detail |
| `/dashboard/reports` | Report cards |
| `/dashboard/profile`, `/dashboard/preferences` | User settings |

### Auth & Middleware

Supabase auth is handled via `@supabase/ssr`. The routing guard lives in [src/proxy.ts](src/proxy.ts) which is consumed by Next.js middleware:

- `/dashboard/*` → redirects unauthenticated users to `/authentication/login`
- `/` and `/authentication/*` → redirects authenticated users to `/dashboard`
- OAuth callback is handled at `src/app/auth/callback/route.ts`

Use `src/lib/client.ts` (`createClient`) for browser-side Supabase calls and `src/lib/server.ts` (`createClient`) for Server Components. Never store the server client in a global variable.

### Voice Session Flow

1. User selects a scenario (`src/data/scenarios.ts`) and navigates to `/dashboard/practice/[id]`
2. The page uses `useVapiSession` hook (`src/hooks/use-vapi-session.ts`)
3. On "Begin Session", `startCall(scenario)` builds the AI system prompt via `buildScenarioPrompt` (`src/lib/prompts/vapi-prompts.ts`) and initiates a Vapi call using `gpt-4o` + ElevenLabs voice
4. The Vapi client is a singleton (`src/lib/voice/vapi-client.ts`) initialized with `NEXT_PUBLIC_VAPI_PUBLIC_KEY`
5. Session states: `idle → connecting → active → ended | error`
6. Error state falls back to a text input mode that sends messages via `vapi.send()`

### Scenario Data Model

Scenarios are statically defined in `src/data/scenarios.ts` and typed in `src/types/scenario.types.ts`. Each `Scenario` has: `id`, `title`, `description`, `trains[]`, `aiRole`, `whatToExpect[]`, `sampleDialogue[]`, `category`, `duration`, `difficulty`, and optional `isFeatured`.

Categories: `Interview` · `Business` · `Social` · `Public Speaking` · `Everyday`

The featured scenario renders full-width at the top of the practice grid; all others render in a 2-column grid.

### Design System

The app is dark-only (never light mode). Core design tokens used throughout:

- Background: `#0A0A0A` (main), `#050505` (sidebar)
- Accent green: `#00F38D` (interactive elements, active states, AI indicators)
- Text: `text-white` at various opacities (`/60`, `/40`, `/30`, `/25`)
- Borders: `border-white/10`, `border-white/8`

All UI primitives are shadcn/ui components in `src/components/ui/`. Dashboard layout uses shadcn's `Sidebar` system with `SidebarProvider` wrapping the entire dashboard in `src/app/dashboard/layout.tsx`.

Skeleton loading screens exist for every dashboard page (pattern: `<PageName>Skeleton` component in a `components/` subfolder beside the page).
