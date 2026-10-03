# Architecture

## Repo layout

npm-workspaces monorepo (`axiang1307/lettuce`). Two apps and one shared package all use a single Supabase project.

| Path | What it is |
|---|---|
| `frontend/` | Expo / React Native mobile app (see `brain/frontend.md`) |
| `api/` | Express / TypeScript REST API that replaces part of Supabase's PostgREST layer (see `brain/api.md`) |
| `packages/api-types/` | `@lettuce/api-types`: request/response types shared by both apps |
| `supabase/` | Supabase CLI link metadata (`.temp/`, gitignored) |
| `brain/` | Knowledge that persists across sessions (this folder) |

The repo was formed by merging two separate repos, with histories rewritten into subdirectories: `eugenexu0/lettuce` became `frontend/` and `axiang1307/lettuce_api` became `api/`. `git log --follow` on either subtree reaches each app's original commits.

## How the pieces connect

```
frontend ──(anon key)──────────────▶ Supabase Auth      sign-in, session stored client-side
frontend ──Bearer <access_token>──▶ api ──getUser(jwt)──▶ Supabase Auth   verify caller
                                     api ──pg / DATABASE_URL──▶ Postgres  app data
frontend ──(anon key) supabase.from──▶ PostgREST         resources not yet moved to the API
```

- **Auth** stays on Supabase. The frontend signs in with `frontend/lib/supabase.ts` (anon key) and persists the session in AsyncStorage.
- **Calls to the API:** `frontend/lib/api.ts` (`authendFetch`) reads the current session and attaches `access_token` as `Authorization: Bearer …`. It calls `EXPO_PUBLIC_API_URL`; in dev it rewrites `localhost` to Metro's host so phones and emulators can reach the dev machine. `frontend/lib/repositories/*` wrap one resource each on top of it.
- **Verification:** the API's `authMiddleware` passes the token to `supabase.auth.getUser(jwt)` (service-role client). Supabase returns the authoritative user, which becomes `req.user`. The JWT's contents are never trusted directly.
- **Data:** the API talks to Postgres **directly through `pg`**, not supabase-js or PostgREST. The supabase client in the API exists only for token verification.
- **Access control:** this connection bypasses RLS, so ownership and access checks for API-served data live in application code (queries keyed off `req.user.id`). RLS still matters for any table the frontend reads directly with the anon key.

## Shared types (`@lettuce/api-types`)

- Contains `Profile`, `ProfileUpdate`, `Event` (`index.ts`) and the Supabase-generated `Database` type (`database.ts`).
- **Type-only:** no build step and no runtime code. Both apps depend on it as `"@lettuce/api-types": "*"` and must use `import type`, so nothing ever `require()`s it.
- Edit the `.ts` files directly; both apps see changes immediately. `database.ts` is regenerated with the Supabase CLI and never hand-edited.
- The frontend never redefines these types locally. Repositories re-export them for convenience.

## Resource status

| Resource | API | Frontend |
|---|---|---|
| `profiles` | `GET /profiles/me`, `PATCH /profiles/me` | `profilesRepo.getMe` / `patchMe` (wired) |
| `events` | `GET /events/me` (events the caller participates in) | `eventsRepo.getEvents` (wired); home feed still reads mock `data/home-feed.ts` |
| `groups` | none (Supabase table only) | mock (`data/placeholders.ts`) |
| `polls` | none (Supabase table only) | mock |
| notifications | none, no table yet | mock |
