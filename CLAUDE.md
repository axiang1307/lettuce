# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repo layout

npm-workspaces monorepo (`axiang1307/lettuce`) holding two apps and one shared package, all against a single Supabase project. It was formed by merging two formerly separate repos (`eugenexu0/lettuce` → `frontend/`, `axiang1307/lettuce_api` → `api/`) with their histories rewritten into subdirectories, so `git log --follow` on either subtree goes back to each app's original commits.

- `frontend/` — the Expo/React Native mobile app. Has its own `CLAUDE.md`, `package.json`, `.gitignore`, and `eas.json`.
- `api/` — Express/TypeScript API replacing Supabase's auto-generated PostgREST layer. Has its own `CLAUDE.md` (gitignored, local-only), `package.json`, and `.gitignore`.
- `packages/api-types/` — `@lettuce/api-types`, the request/response types shared by both apps (`Profile`, `ProfileUpdate`, `Event`, plus the Supabase-generated `Database` type in `database.ts`). **Type-only: no build step, no runtime code.** Both apps depend on it via `"@lettuce/api-types": "*"` and must use `import type` so nothing tries to `require()` it at runtime. Edit the `.ts` files directly — changes are visible to both apps immediately. Regenerate `database.ts` with the Supabase CLI when the schema changes; never hand-edit it.
- `supabase/` — local Supabase CLI link metadata (`.temp/`, gitignored).

**Always read the CLAUDE.md inside `frontend/` or `api/` before working in that subtree** — it has the authoritative detail for that codebase. This file only covers how the pieces fit together.

## Workspaces / install

One root `package-lock.json`; the per-app lockfiles were removed. Always `npm install` from the **root**, never inside an app. Expo SDK 52+ configures Metro for monorepos automatically, so there is deliberately no `metro.config.js`. npm currently keeps each app's dependencies nested in its own `node_modules` (not hoisted to root) — leave it that way unless you also re-run `pod install` in `frontend/ios`, since the Pods were installed against `frontend/node_modules` paths.

EAS Build needs no monorepo-specific config: run `eas build` from `frontend/` (where `eas.json` lives); EAS CLI detects the workspace root and uploads the whole repo.

## How the pieces connect

- `frontend` authenticates directly against Supabase Auth (`frontend/lib/supabase.ts`, anon key) and stores the session client-side.
- For app data, the frontend is being migrated off direct `supabase.from(...)` calls and onto `api`: `frontend/lib/api.ts` (`authendFetch`) attaches the Supabase session's `access_token` as a `Bearer` header and calls `EXPO_PUBLIC_API_URL`; `frontend/lib/repositories/*` wrap individual resources (e.g. `profilesRepo.getMe()`) on top of that fetch helper and re-export the shared types for convenience.
- `api` verifies that bearer token against Supabase (`supabase.auth.getUser(jwt)` in `src/middleware/auth.ts`) to get the authoritative user, then talks to Postgres **directly via `pg`** (`src/lib/db.ts`, `DATABASE_URL`) rather than through supabase-js/PostgREST — ownership/access checks are therefore enforced in application code (e.g. `WHERE id = $1` keyed off `req.user.id`), not RLS, for anything the API touches.
- Migration is resource-by-resource: `profiles` (`GET`/`PATCH /profiles/me`) and `events` (`GET /events/me`) are wired end-to-end (repo → API → db). `groups` and `polls` still exist only as Supabase tables.

## Running locally

```bash
npm install                        # from the root, once
cd api && npm run dev              # Express API on :3000
cd frontend && npm start           # Expo dev server
```

`frontend/.env` needs `EXPO_PUBLIC_API_URL` pointed at the running API (e.g. `http://localhost:3000`) for repository-backed calls to work.

## Typechecking

`npx tsc --noEmit` inside `frontend/` and `api/` should both pass clean; Metro doesn't typecheck, so run it explicitly after changes.

If the frontend suddenly reports hundreds of errors like `'View' cannot be used as a JSX component` or `Module "expo-router" has no exported member 'useRouter'`, the cause is almost certainly a damaged `frontend/node_modules`, not the code: an editor's "update imports on file move" refactor (triggered by renaming/moving the app folder while it's open in VS Code/Cursor) can rewrite the relative imports inside `node_modules/**/*.d.ts` to nonexistent paths like `expo-router/src/...`. Fix: `rm -rf frontend/node_modules && npm install` from the root. Rename folders with the editor closed, or decline the "update imports" prompt.
