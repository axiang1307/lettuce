# Decisions

Settled decisions and why. When one changes, replace its entry.

## Backend

**Build a custom REST API that replaces part of PostgREST (2026-05).**
- The goal is to learn REST API design by building it, not to migrate everything.
- Supabase Auth stays.
- Resources move over one at a time, as needed.

**The API queries Postgres directly through `pg`, not supabase-js.**
- Raw SQL keeps the learning close to the database and to HTTP.
- Consequence: RLS is bypassed, and access control is enforced in application code.

**Verify tokens with `supabase.auth.getUser(jwt)` instead of decoding JWTs locally.**
- Supabase returns the authoritative user.
- Token contents are never trusted directly.

**Four-layer split per resource: route → controller → service → db.**
- Keeps HTTP concerns, business logic and SQL separate.
- New resources copy the `profiles` structure.

**Own-data endpoints are `/me`; identity comes only from `req.user.id`.**
- No `/:id` route for your own data, and no identity from the URL or body.
- This fixed a trust flaw in the old frontend `upsert`, which took `id` from the client.

**Profile rows are created by a DB trigger on `auth.users`, never by the API.**
- This is the common production pattern of letting the database guarantee the row.
- `GET` and `PATCH` can assume the row exists, so `404` is only a defensive case.

**Request bodies are allow-listed (2026-05/09).** Controllers build the insert/update from known keys only and silently ignore the rest, so clients can't set `id`, `created_by` and the like. `null` clears a field; blank required strings are `400`. (Per-route rules: `brain/endpoints.md`.)

**Profile pictures live in a public Storage bucket, and `avatar_url` stores the object path (2026-10-03).**
- Image bytes never go in Postgres or through the API; the frontend uploads straight to Storage.
- Storing `<user_id>/<file>` instead of a full URL survives bucket or domain changes and lets the API check ownership by prefix.
- A public bucket keeps reads simple (no signed URLs). Avatars aren't sensitive.

**Edit profile keeps a single `full_name` column (2026-10-03).** The form shows first and last name but splits and rejoins `full_name` rather than adding columns, matching how onboarding already writes it.

**Services throw typed errors; controllers map them to statuses (2026-10-03).** e.g. `ForbiddenError` → `403`. Keeps HTTP out of business logic, mirroring how Postgres codes (`23505` → `409`) are mapped in controllers.

**Host the API on Render, defined as a Blueprint (2026-10-05).**
- A long-running server fits Express plus a `pg` connection pool; serverless functions would open connections per invocation.
- `render.yaml` keeps the hosting config in git, reviewed with the code; secrets stay out of it (`sync: false`).
- Deploys `main` only after CI passes, so a broken merge never ships. Region `virginia` sits next to the database in `us-east-1`.
- Free plan for now; it spins down when idle. Upgrade when real users notice cold starts.

**`GET /health` is public and shallow (2026-10-05).** Registered before `authMiddleware` so the host's checker gets `200`, not `401`. It doesn't query the database: a failing health check makes Render restart the service, which can't fix a database outage, and database failures already surface as `500`s.

**Database connections use TLS verified against Supabase's root CA (2026-10-05).**
- Without it, the API's database password and data crossed the internet unencrypted (the URL had no `sslmode`, and pg defaults to no TLS).
- Supabase signs its certificates with its own CA, so verification needs that CA. `api/certs/supabase-root-2021-ca.crt` is the copy in the official `supabase/cli` repo; its SHA-256 fingerprint (`80:70:25:AD…CA:FA`) matched the root the pooler sends. It expires 2031-04-26.
- The rule lives in code (`src/lib/db.ts`: TLS for any non-local host) rather than as `sslmode` in each environment's URL, so a missing URL parameter can't silently fall back to plaintext. Local databases skip TLS because the local stack doesn't serve it.
- `rejectUnauthorized: false` was rejected: it encrypts but accepts any certificate, which doesn't stop an impersonating server.

## Calendar

**Manual calendars store busy blocks, not free slots (2026-10-04).**
- Users enter times they're busy, and free time is whatever isn't busy. Imported calendars also produce busy events, so manual and imported entries can share one table and the same overlap logic. The alternative was when2meet-style free slots.
- A block is either one-off (a date and time range) or weekly (weekdays, local start and end time, optional end date). Full iCal RRULE was too much work for now. Without weekly repeats, entering a class schedule by hand is tedious.
- Entry is a form plus a week view, not when2meet-style painting:
  - The `+` button opens a bottom-sheet form with native time pickers (`@react-native-community/datetimepicker`, a native module).
  - Long-press then drag on the grid draws a block and opens the same form pre-filled. A plain swipe still scrolls.
  - Both stay touch-friendly and handle recurrence, unlike painting cells.

**Blocks belong to a calendar; one shared `busy_blocks` table (2026-10-04).**
- Tables:
  - `calendars`: `id`, `user_id` → `profiles` (cascade), `source` enum `calendar_source` (`manual` / `google` / `outlook`), unique `(user_id, source)`.
  - `busy_blocks`: `calendar_id` → `calendars` (cascade).
- Why not a table per user: "unique to the user" is a `WHERE` clause plus an index. Per-user tables would need dynamic SQL to compute group overlap across members, and every schema change would become N migrations.
- Why a separate `calendars` table: per-connection data (sync tokens, last sync time, connection status) needs a home. Re-syncing or disconnecting one source touches only its own blocks. Adding the table later would have needed a data migration. `user_id` isn't the primary key because a user can have one calendar per source.
- Block shape: one row covers both kinds.
  - `start_date`, `end_date` (weekly "until"; null = forever), local `start_time` / `end_time`, IANA `timezone`.
  - `repeat_days smallint[]`: null = one-off, otherwise 0 = Sunday to 6 = Saturday. It replaces a `recurring` flag, which could contradict the days.
  - CHECKs: `end_time > start_time` (no overnight blocks), valid non-empty days, end date only on weekly blocks, `end_date >= start_date`.
  - The timezone name is validated by the API, since a CHECK can't look up zone names.
- RLS is on with no policies (API-only, like the other tables).

**Busy blocks: someone else's id is `404`, synced blocks are `403`, `DELETE` is `204` (2026-10-04).**
- `404` for both "doesn't exist" and "not yours", so probing ids reveals nothing (the usual REST practice, e.g. GitHub's).
- `403` is kept for "yours, but not allowed": only manual blocks can be edited or deleted, because the next sync would undo changes to synced ones.
- `DELETE` returns `204` with no body (`authendFetch` already returns `null` for it).

**Weekly busy blocks are expanded on the client (2026-10-04).** `GET /busy-blocks/me` returns weekly blocks as rules (`repeat_days` plus date bounds), and the app places them on the visible week (`blocksForWeek`). This keeps the API a plain range query, and the grid needs per-day positions anyway. Group overlap will do its own expansion on the server, where it needs instants across time zones.

**MVP calendar sources: manual and Google Calendar only (2026-10-04).** Outlook comes after the MVP. The `calendar_source` enum already includes `outlook`, so adding it later needs no migration for the source itself.

**Google / Outlook import plan (2026-10-04, not built).**
- Routes:
  - `POST /calendars { source, code }` connects: the app runs the OAuth consent and sends the auth code; the API exchanges it and stores the refresh token server-side.
  - `POST /calendars/:id/sync` re-fetches.
  - `DELETE /calendars/:id` disconnects; the cascade removes its blocks.
- Sync stores already-expanded occurrences over a rolling window (e.g. 8 weeks) as one-off blocks rather than translating RRULEs. It replaces a calendar's blocks in one transaction (delete, then insert) through the service and db layers, not by calling the block controller.
- Token columns come in a later migration.

## Monorepo / tooling

**Merge the frontend and API repos into one npm-workspaces monorepo (2026-09-02).**
- Lets both apps share types and use one install.
- Histories were rewritten into subdirectories so `git log --follow` still works.

**Shared types live in a type-only workspace package (`@lettuce/api-types`).**
- One source of truth with no build step.
- `import type` everywhere so nothing is required at runtime.

**API contract types are derived from the generated schema (2026-10-03).**
- `index.ts` aliases or `Pick`s from `database.ts` instead of retyping fields, so regenerating the schema updates the types and flags any code that no longer matches.
- Contract types stay separate from table types because the API's shapes differ from the tables' (system-set columns, server-filled `created_by`, future joined responses).

**Group-first: every event belongs to exactly one group (2026-10-03).**
- `events.group_id` is `NOT NULL` and references `groups(id)`; the many-to-many `event_groups` table was dropped.
- One-to-many is modeled as a foreign key on the "many" side. `NOT NULL` lets the database enforce the product rule, and "events in a group" needs no join.
- `event_participants` stays: group membership is who *could* attend, participants (with `rsvp_status`) are who's on the event.

**Event status is a Postgres enum: `planning` → `upcoming` → `in_progress` → `done` (2026-10-03).**
- Replaced the original `draft / planning / confirmed / cancelled` CHECK list; new events default to `planning`.
- An enum rather than a CHECK constraint so generated types give `EventStatus` as a union. Adding a value is a one-line `alter type … add value`; removing or renaming one needs a migration that rebuilds the type.
- There is no `cancelled` state for now.

**A baseline migration replaces the untracked early schema (2026-10-04).**
- `20261004000000_baseline.sql` is `supabase db dump --linked` plus the `on_auth_user_created` trigger, added by hand because it lives on `auth.users` and the dump covers only our own schemas.
- It absorbed `event_status_enum`, `events_group_id` and `calendars_busy_blocks`, whose end state was already in the dump. Rebuilding the pre-`avatars_bucket` schema by subtracting them by hand was error-prone and bought nothing; their notes are in git history.
- `avatars_bucket` stays a separate migration because Storage buckets and policies aren't in the dump.
- The baseline reproduces production as-is, including grants the security advisor flags; fixes go in new migrations. The hosted history was aligned with `supabase migration repair`.

**`date` columns are parsed by one global pg type parser, not per-query casts (2026-10-04).** `types.setTypeParser` in `api/src/lib/db.ts` covers every query and any future `date` column; `::text` casts would have to be remembered in each query.

**API tests are a Postman collection run by Newman (2026-10-04).**
- Black-box HTTP tests of the real API with real Auth tokens; the status tables in `brain/endpoints.md` are the cases.
- The repo copy (`api/postman/lettuce-api.postman_collection.json`) is the source of truth, so tests change, branch and get reviewed with the code, and Newman can read it. Postman's cloud copy is a convenience; export edits made in the app back over the file.
- Newman rather than the Postman CLI: open source, no account, runs the file from the repo.

**CI tests against a throwaway local Supabase, never the hosted project (2026-10-04).** It builds the stack from `supabase/migrations` on the runner. No rows are left in production, CI needs no secrets (local demo keys, a per-run user and password), and the free tier's pausing can't fail builds.

**`main` requires a PR with passing CI; admins may bypass (2026-10-05).**
- Code reaches `main`, and through Render's `checksPass` production, only after `Typecheck` and `API tests` pass.
- "Require branches to be up to date" is off: brain commits land on `main` constantly and would leave every open PR behind.
- The Repository admin bypass exists for `/update-brain`'s direct pushes, since a new commit can't already have passing checks. Bypassing for a PR merge is possible but not used.

## Docs

**Project knowledge lives in `brain/`; to-dos only in `brain/action-items.md`.** The root `CLAUDE.md` holds goals and norms and auto-loads only `architecture.md` and `action-items.md` to keep per-session input small; other files are read on demand. `AGENTS.md` points non-Claude agents to `CLAUDE.md`.

**Brain updates go straight to `main`, never onto feature branches (2026-10-03; tightened 2026-10-04).** `/update-brain` (`.claude/skills/update-brain/`) applies the session's uncommitted `brain/` and `CLAUDE.md` edits to a temporary worktree on `origin/main`, commits and pushes there (no PR, never force), then discards them from the current branch. Feature commits never include `brain/` or `CLAUDE.md`; a branch gets brain changes by merging `main`. Why: knowledge isn't stuck on unmerged branches, and feature branches carry no brain commits. The first version committed on the branch and cherry-picked, which left brain commits on feature branches and conflicted whenever the branch's brain was ahead of `main`. Trade-off: `main`'s brain can describe code that's still on a feature branch.
