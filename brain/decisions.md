# Decisions

A log of settled decisions and why they were made. When a decision changes, edit or replace its entry rather than appending a contradiction.

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

**PATCH semantics (resolved 2026-05/09):**
- Build the update only from allow-listed keys and silently ignore everything else.
- `null` clears a field; empty strings are rejected for `full_name` and `username`.
- `username` is trimmed.
- A missing body or `{}` → `400`.
- A unique-constraint violation (`23505`) → `409`.

**Profile pictures live in a public Storage bucket, and `avatar_url` stores the object path (2026-10-03).**
- Image bytes never go in Postgres or through the API; the frontend uploads straight to Storage.
- Storing `<user_id>/<file>` instead of a full URL survives bucket or domain changes and lets the API check ownership by prefix.
- A public bucket keeps reads simple (no signed URLs). Avatars aren't sensitive.

**Edit profile keeps a single `full_name` column (2026-10-03).** The form shows first and last name but splits and rejoins `full_name` rather than adding columns, matching how onboarding already writes it.

**Error contract:** every non-2xx response is `{ error: string }`, using the status codes listed in `brain/api.md`.

**Hand-rolled validation for now.** Switching to `zod` is planned once the patterns are understood.

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
- `events.group_id` is `NOT NULL` and references `groups(id)`; the many-to-many `event_groups` table was dropped (migration `20261004013405_events_group_id.sql`).
- One-to-many is modeled as a foreign key on the "many" side. `NOT NULL` lets the database enforce the product rule, and "events in a group" needs no join.
- `event_participants` stays: group membership is who *could* attend, participants (with `rsvp_status`) are who's on the event.
- What happens to events when a group is deleted is not decided yet. The foreign key has no `ON DELETE` clause, so Postgres defaults to `NO ACTION`: a group that has events can't be deleted.

**Event status is a Postgres enum: `planning` → `upcoming` → `in_progress` → `done` (2026-10-03).**
- Replaced the original `draft / planning / confirmed / cancelled` CHECK list (migration `20261004010729_event_status_enum.sql`); new events default to `planning`.
- An enum rather than a CHECK constraint so generated types give `EventStatus` as a union. Adding a value is a one-line `alter type … add value`; removing or renaming one needs a migration that rebuilds the type.
- There is no `cancelled` state for now.

**One root lockfile; install only from the root.**

**No `metro.config.js`.** Expo SDK 52+ handles monorepo Metro config.

**`frontend/ios` is CNG output, gitignored, and regenerated rather than patched.**

**Navigation imports go through `expo-router`, not `@react-navigation/*`** (part of the Expo SDK 57 upgrade).

## Docs

**Persistent project knowledge lives in `brain/`; in-progress and to-do items live only in `brain/action-items.md`.**
- The per-app `CLAUDE.md` files were removed. The root `CLAUDE.md` holds goals and working norms and points into `brain/`.
- `frontend/AGENTS.md` was removed; its product content now lives in `brain/product.md`. The root `AGENTS.md` only points to `CLAUDE.md`, so non-Claude agents find the same instructions.
