# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repo layout

Monorepo (`axiang1307/lettuce`) holding two apps that share one Supabase project. It was formed by merging two formerly separate repos (`eugenexu0/lettuce` and `axiang1307/lettuce_api`) with their histories rewritten into subdirectories, so `git log` on either subtree goes back to each app's original commits.

- `lettuce/` — the Expo/React Native mobile app (frontend). Has its own `CLAUDE.md`, `package.json`, and `.gitignore`.
- `lettuce_api/` — an Express/TypeScript API being built to replace Supabase's auto-generated PostgREST layer. Has its own `CLAUDE.md`, `package.json`, and `.gitignore`.
- `supabase/` — local Supabase CLI link metadata (`.temp/`, gitignored) for the shared backend project (Postgres, Auth).

There is no root `package.json` / npm workspaces yet — each app installs and runs independently from its own directory. Types are still duplicated between `lettuce/lib/repositories/*` and `lettuce_api/src/types/index.ts`; sharing them via a workspace package is the intended follow-up now that they live in one repo.

**Always read the CLAUDE.md inside `lettuce/` or `lettuce_api/` before working in that subtree** — it has the authoritative, up-to-date detail for that codebase. This file only covers how the two pieces fit together.

## How the pieces connect

- `lettuce` (frontend) authenticates directly against Supabase Auth (`lettuce/lib/supabase.ts`, anon key) and stores the session client-side.
- For app data, the frontend is being migrated off direct `supabase.from(...)` calls and onto `lettuce_api`: `lettuce/lib/api.ts` (`authendFetch`) attaches the Supabase session's `access_token` as a `Bearer` header and calls `EXPO_PUBLIC_API_URL`; `lettuce/lib/repositories/*` wrap individual resources (e.g. `profilesRepo.getMe()`) on top of that fetch helper.
- `lettuce_api` verifies that bearer token against Supabase (`supabase.auth.getUser(jwt)` in `src/middleware/auth.ts`) to get the authoritative user, then talks to Postgres **directly via `pg`** (`src/lib/db.ts`, `DATABASE_URL`) rather than through supabase-js/PostgREST — ownership/access checks are therefore enforced in application code (e.g. `WHERE id = $1` keyed off `req.user.id`), not RLS, for anything the API touches.
- Migration is resource-by-resource: `profiles` is wired end-to-end (repo → API → db). Other resources (`events`, `groups`, `polls`) still exist only as Supabase tables the frontend would otherwise hit directly, and `lettuce_api`'s `events` route is an in-progress stub (see `lettuce_api/CLAUDE.md`).

## Running both sides locally

There's no root-level script — start each independently:

```bash
cd lettuce_api && npm run dev     # Express API on :3000
cd lettuce && npm start           # Expo dev server
```

`lettuce/.env` needs `EXPO_PUBLIC_API_URL` pointed at the running API (e.g. `http://localhost:3000`) for repository-backed calls to work.
