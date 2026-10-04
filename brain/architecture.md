# Architecture

## Repo layout

npm-workspaces monorepo (`axiang1307/lettuce`). Two apps and one shared package all use a single Supabase project.

| Path | What it is |
|---|---|
| `frontend/` | Expo / React Native mobile app (see `brain/frontend.md`) |
| `api/` | Express / TypeScript REST API that replaces part of Supabase's PostgREST layer (see `brain/api.md`) |
| `packages/api-types/` | `@lettuce/api-types`: request/response types shared by both apps |
| `supabase/` | `migrations/`: SQL migrations, named by the version Supabase recorded; `.temp/`: CLI link metadata (gitignored) |
| `brain/` | Knowledge that persists across sessions (this folder) |

The repo was formed by merging two separate repos, with histories rewritten into subdirectories: `eugenexu0/lettuce` became `frontend/` and `axiang1307/lettuce_api` became `api/`. `git log --follow` on either subtree reaches each app's original commits.

## How the pieces connect

```
frontend ──(anon key)──────────────▶ Supabase Auth      sign-in, session stored client-side
frontend ──Bearer <access_token>──▶ api ──getUser(jwt)──▶ Supabase Auth   verify caller
                                     api ──pg / DATABASE_URL──▶ Postgres  app data
frontend ──(anon key) supabase.from──▶ PostgREST         resources not yet moved to the API
frontend ──(user session) storage──▶ Supabase Storage   avatar uploads (public `avatars` bucket)
```

- **Auth** stays on Supabase. The frontend signs in with `frontend/lib/supabase.ts` (anon key) and persists the session in AsyncStorage.
- **Calls to the API:** `frontend/lib/api.ts` (`authendFetch`) reads the current session and attaches `access_token` as `Authorization: Bearer …`. It calls `EXPO_PUBLIC_API_URL`; in dev it rewrites `localhost` to Metro's host so phones and emulators can reach the dev machine. `frontend/lib/repositories/*` wrap one resource each on top of it.
- **Verification:** the API's `authMiddleware` passes the token to `supabase.auth.getUser(jwt)` (service-role client). Supabase returns the authoritative user, which becomes `req.user`. The JWT's contents are never trusted directly.
- **Data:** the API talks to Postgres **directly through `pg`**, not supabase-js or PostgREST. The supabase client in the API exists only for token verification.
- **Files:** image bytes never go through the API or Postgres. The frontend uploads to Supabase Storage with the user's session, then saves only the object path through the API (see "Profile pictures" below).
- **Access control:** this connection bypasses RLS, so ownership and access checks for API-served data live in application code (queries keyed off `req.user.id`). RLS still matters for any table the frontend reads directly with the anon key.

## Profile pictures

- Bucket `avatars` is **public** (reads go through the public URL), limited to 5 MB and `image/jpeg|png|heic|webp`. Defined in `supabase/migrations/20261004002011_avatars_bucket.sql`.
- Storage policies let an `authenticated` user select, insert and delete only under their own `<user_id>/` prefix. There is no update policy: every upload gets a new filename (`<user_id>/<timestamp>.<ext>`), which also defeats image caching.
- `profiles.avatar_url` stores the object path, not a full URL. The frontend turns it into a URL with `avatarsRepo.publicUrl`. `PATCH /profiles/me` rejects paths outside the caller's folder.
- Save order on the edit screen: upload → `PATCH` → best-effort delete of the old file. If the `PATCH` fails, the new upload is deleted.

## Shared types (`@lettuce/api-types`)

- `database.ts` is the Supabase-generated schema (`Database`, plus the `Tables` / `TablesInsert` / `TablesUpdate` helpers). It's regenerated with `npm run gen:types` from the repo root and never hand-edited.
- `index.ts` holds the API contract types, derived from `database.ts` rather than retyped:
  - row aliases (`Profile = Tables<'profiles'>`, `Event = Tables<'events'>`, `Group = Tables<'groups'>`) follow the schema automatically
  - enum aliases (`EventStatus = Enums<'event_status'>`) do too. Postgres enums become TypeScript unions; `CHECK` constraints don't, which is why constrained value sets use enums.
  - request bodies `Pick` only the fields clients may send (`ProfileUpdate`, `EventCreate`, `GroupCreate`). A new column joins a request body only when someone adds it to the `Pick`.
- The `Row` types say timestamps are `string` (the JSON shape), but inside the API `pg` returns `timestamptz` as `Date` until `res.json()` serializes it.
- **Type-only:** no build step and no runtime code. Both apps depend on it as `"@lettuce/api-types": "*"` and must use `import type`, so nothing ever `require()`s it.
- Both apps see edits immediately (npm workspaces symlink `node_modules/@lettuce/api-types` → `packages/api-types`). After a schema change, run `npm run gen:types` and typecheck both apps; anything that no longer matches the schema shows up as a type error.
- The frontend never redefines these types locally. Repositories re-export them for convenience.

## Resource status

Full route details are in `brain/endpoints.md`.

| Resource | API | Frontend |
|---|---|---|
| `profiles` | `GET /profiles/me`, `PATCH /profiles/me` | `profilesRepo.getMe` / `patchMe` (wired: profile tab, edit-profile screen); avatars via `avatarsRepo` (Storage) |
| `events` | `GET /events/me` (events the caller participates in), `POST /events` (in a group the caller belongs to) | `eventsRepo.getEvents` (home feed) / `create` (create-event screen); event detail still reads mock `data/home-feed.ts` |
| `groups` | `GET /groups/me` (groups the caller is a member of), `POST /groups` (creator becomes `owner`) | `groupsRepo.getGroups` (groups tab, home feed group names, create-event picker) / `create` (create-group screen) |
| `polls` | none (Supabase table only) | mock |
| notifications | none, no table yet | mock |
