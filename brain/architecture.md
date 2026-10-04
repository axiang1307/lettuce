# Architecture

## Repo layout

npm-workspaces monorepo (`axiang1307/lettuce`); everything uses one Supabase project.

| Path | What it is |
|---|---|
| `frontend/` | Expo / React Native app (`brain/frontend.md`) |
| `api/` | Express / TypeScript REST API replacing part of PostgREST (`brain/api.md`) |
| `packages/api-types/` | `@lettuce/api-types`: type-only contract shared by both apps (`brain/dev-workflow.md`) |
| `supabase/` | `migrations/` (named by the version Supabase recorded) rebuild the whole schema from a baseline; `config.toml` configures the local stack (`brain/dev-workflow.md`); `.temp/` is gitignored CLI link data |
| `.github/workflows/ci.yml` | CI: typecheck both apps; API tests against a local Supabase (`brain/dev-workflow.md`) |
| `brain/` | persistent project knowledge |

## How the pieces connect

```
frontend ──(anon key)──────────────▶ Supabase Auth      sign-in, session in AsyncStorage
frontend ──Bearer <access_token>──▶ api ──getUser(jwt)──▶ Supabase Auth   verify caller
                                     api ──pg / DATABASE_URL──▶ Postgres  app data
frontend ──(user session) storage──▶ Supabase Storage   avatar uploads
frontend ──(anon key) supabase.from──▶ PostgREST         onboarding name upsert (not yet moved)
```

- `frontend/lib/api.ts` (`authendFetch`) attaches the session's `access_token`; `frontend/lib/repositories/*` wrap one resource each.
- The API verifies every token with `supabase.auth.getUser(jwt)` and never trusts JWT contents. It reads and writes Postgres through `pg` only, which **bypasses RLS**: access checks for API-served data live in application code. RLS still matters for anything the frontend reads directly.
- Image bytes go straight to Storage; Postgres stores only the object path.

## Resource status

Route details: `brain/endpoints.md`.

| Resource | API | Frontend |
|---|---|---|
| `profiles` | `GET`, `PATCH /profiles/me` | `profilesRepo` (profile tab, edit-profile); avatars via `avatarsRepo` (Storage) |
| `events` | `GET /events/me`, `POST /events` | `eventsRepo` (home feed, create-event); detail screen partly mock |
| `groups` | `GET /groups/me`, `POST /groups` | `groupsRepo` (groups tab, home group names, create-event picker, create-group) |
| `polls` | none (tables only) | mock |
| `calendars`, `busy_blocks` | `GET /busy-blocks/me`, `POST /busy-blocks`; `PATCH`, `DELETE` are skeletons (`501`) | `my-calendar` screen with nothing saved yet |
| notifications | none, no table | mock |
