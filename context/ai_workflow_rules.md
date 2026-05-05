# AI Workflow Rules — Fluentia 2026

> These rules govern how AI-assisted development is conducted in this project.
> They exist to keep work verifiable, reversible, and aligned with the project vision.
> All AI sessions should begin by reading this document.

---

## 1. Scoping Rules

- **Work one feature, unit, or subsystem at a time.** Never combine unrelated systems in one implementation step.
- **Prefer small, verifiable increments over large speculative changes.** Each step should produce something runnable or reviewable.
- **Do not cross system boundaries unnecessarily.** Backend, frontend, voice layer, and analytics are separate domains — treat them as such.
- **One file of truth per concern.** Avoid duplicating logic across files. If the same concept appears in two places, refactor before extending.
- **Resolve ambiguity before writing code.** If requirements are unclear, surface the question first — never guess and implement.

---

## 2. When to Split Work

Split an implementation task into separate steps when **any** of the following apply:

| Condition | Example |
|---|---|
| The task touches more than one system boundary | Adding a new API route AND updating the frontend simultaneously |
| The change requires a database migration | Adding a new column means migration → type update → UI update — three steps |
| There are dependencies between subtasks | Auth middleware must exist before protected routes are built |
| The feature has a non-trivial UI component | Design the UI state machine separately from the data-fetching logic |
| The change affects shared infrastructure | Modifying a utility, hook, or base component used project-wide |
| Verification is impossible without an intermediate state | Unit-test the business logic before wiring it to the UI |

**Do not split when:**
- The change is a single-concern edit (fix a typo, rename a variable, adjust a style)
- Both sides of a change are trivially small and naturally coupled (e.g., adding a prop and its corresponding consumer)

---

## 3. Context Loading Protocol

Before starting any session:

1. **Read `context/project_concept.md`** — understand the domain and user goals.
2. **Read `context/brand-guidelines.md`** — all UI work must conform to this.
3. **Read `context/ai_workflow_rules.md`** (this file) — confirm the rules are understood.
4. **Identify the active subsystem** — which layer are we working in? (auth / dashboard / voice / analytics / API)
5. **Check for open tasks or in-progress files** — never start new work if there is an incomplete prior step.

---

## 4. Code Quality Standards

### General
- Write code that is **readable first, clever never.**
- Every function should have a single, clearly named responsibility.
- Avoid commented-out code in commits — delete it or track it in a task note.
- Prefer explicit over implicit — no magic values, no unexplained conditionals.

### TypeScript
- Use strict TypeScript. No `any` unless absolutely required, and always with a comment explaining why.
- Define types and interfaces in co-located `.types.ts` files or at the top of the file if local-only.
- Use `zod` for runtime validation at all API and form boundaries.

### React / Next.js
- All pages and layouts must follow the App Router conventions.
- Use `'use client'` only when interactivity is required — default to server components.
- Never put business logic inside JSX. Extract to hooks or utility functions.
- Form state must be managed with `react-hook-form` + `zod` schema validation.
- Never use `useEffect` for data fetching — use server components or React Query.

### Styling
- All styles must conform to `context/brand-guidelines.md`.
- Use Tailwind utility classes. Do not write raw CSS unless building a complex animation.
- Use `cn()` (clsx + tailwind-merge) for conditional class composition.
- Never use inline styles.

---

## 5. Database & Backend Rules

- **Every schema change requires a migration file** — never alter tables manually in production.
- Write Supabase RLS policies for every table before the table goes live.
- All server actions must validate input with `zod` before touching the database.
- Sensitive operations (delete, update user data) require an auth check at the server action level, not just middleware.
- Queries should follow the patterns in the Supabase Postgres skill (`/.agents/skills/supabase-postgres-best-practices/`).

---

## 6. AI / Voice Layer Rules

- The voice session and the dashboard are **separate concerns.** Keep Vapi/Gemini SDK calls isolated in `/lib/voice/` — they must never appear in UI components.
- Real-time coaching hints must be debounced and never block the voice stream.
- Session feedback analysis is async — it runs after the session ends, not during.
- All AI prompts are stored in `/lib/prompts/` as typed constants — never inline prompt strings in component or API files.
- When modifying AI behavior, change the prompt file and document the reasoning inline.

---

## 7. Verification Gates

Every implementation step must pass its verification gate before the next step begins:

| Step Type | Verification Gate |
|---|---|
| UI component | Renders correctly, no console errors, matches brand guidelines |
| API / server action | Returns correct data shape, handles error cases, validated with Zod |
| Database migration | Applies cleanly, RLS policies in place, no data loss |
| Voice integration | Session starts and ends cleanly, no stream errors in console |
| Auth flow | Login, register, and protected route redirect all work end-to-end |
| Analytics / dashboard | Metrics display correctly with both empty and populated data states |

Do not mark a task complete until its gate is passed.

---

## 8. File & Folder Conventions

```
src/
  app/                   # Next.js App Router pages and layouts
  components/            # Reusable UI components (by feature)
    dashboard/
    session/
    ui/                  # shadcn/ui primitives
  lib/
    actions/             # Server actions (Next.js)
    voice/               # Vapi / voice SDK integration
    prompts/             # AI prompt constants
    supabase/            # Supabase client and helpers
    utils/               # Shared utility functions
  hooks/                 # Custom React hooks
  types/                 # Shared TypeScript types
context/                 # Project context documents (this folder)
```

- Files are named in `kebab-case`.
- Components are named in `PascalCase`.
- Server actions are prefixed with a verb: `createSession`, `deleteUser`, `fetchMetrics`.

---

## 9. Git & Commit Discipline

- **One logical change per commit.** Never bundle a feature with a bug fix.
- Commit message format: `type(scope): short description`
  - Types: `feat`, `fix`, `refactor`, `style`, `chore`, `docs`, `test`
  - Examples: `feat(dashboard): add session history table`, `fix(auth): resolve redirect loop on login`
- Never commit broken code to `main`. Use feature branches.
- Pull request description must include: what changed, why it changed, and how to verify it.

---

## 10. What AI Should Never Do

These actions require explicit human approval before proceeding:

- **Delete or truncate any database table or column**
- **Change authentication or session logic** (Supabase Auth config, middleware rules)
- **Modify RLS policies on production tables**
- **Change the AI prompt used in active sessions** without noting the before/after diff
- **Add a new third-party dependency** without checking for an existing alternative in the project
- **Refactor a shared utility, hook, or base component** without identifying all call sites first
- **Change environment variable names or `.env` structure**

---

## 11. Handling Blockers

If a step is blocked, do the following in order:

1. **State the blocker clearly** — describe exactly what is missing or uncertain.
2. **Do not work around it silently** — workarounds accumulate technical debt.
3. **Propose two or three concrete options** to resolve the blocker.
4. **Wait for user decision** before continuing.

Never invent mock data, stub APIs, or placeholder logic without explicitly flagging it as temporary.

---

## 12. Session Handoff Checklist

At the end of every AI session, confirm:

- [ ] All changed files are saved and consistent.
- [ ] No `console.log` debug statements left in production code paths.
- [ ] The next logical step is clearly identified and documented.
- [ ] Any deferred decisions or open questions are written in a comment or task note.
- [ ] The verification gate for this step has been passed.

---

*Last updated: 2026-05-05*
*Owner: Fluentia Project*
