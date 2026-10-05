# API endpoints

Every route the API serves. Pipeline, layering, access rules and the error contract: `brain/api.md`.

## Basics

- **Base URL:** `http://localhost:3000` in dev; the Render service's `onrender.com` URL when hosted. The frontend reads it from `EXPO_PUBLIC_API_URL`.
- **Auth:** every route except `GET /health` requires `Authorization: Bearer <supabase access_token>`. `authMiddleware` is global and registered after `/health`. A missing, malformed or invalid token → `401`.
- **Identity:** the caller is always `req.user.id`, taken from the verified token. No route takes a user id in the URL or body.
- **Bodies:** JSON in and out. Errors are always `{ "error": string }`.
- **Types:** request and response shapes are the shared types in `packages/api-types/index.ts`.
- **Every route except `/health`** can also return `401` (bad or missing token) and `500` (database error); the tables below list only the rest.

## Summary

| Method | Path | Returns | Frontend caller |
|---|---|---|---|
| `GET` | `/health` | `{ status: 'ok' }` (public, no database check) | none (Render's health check) |
| `GET` | `/profiles/me` | `Profile` | `profilesRepo.getMe` |
| `PATCH` | `/profiles/me` | `Profile` | `profilesRepo.patchMe` |
| `GET` | `/events/me` | `Event[]` | `eventsRepo.getEvents` (home feed) |
| `POST` | `/events` | `Event` (`201`) | `eventsRepo.create` (create-event screen) |
| `GET` | `/groups/me` | `Group[]` | `groupsRepo.getGroups` (groups tab, home feed, create-event picker) |
| `POST` | `/groups` | `Group` (`201`) | `groupsRepo.create` (create-group screen) |
| `GET` | `/busy-blocks/me?from&to` | `BusyBlock[]` | `busyBlocksRepo.getMine` (My Calendar's visible week) |
| `POST` | `/busy-blocks` | `BusyBlock` (`201`) | `busyBlocksRepo.create` (My Calendar's form sheet) |
| `PATCH` | `/busy-blocks/:id` | `BusyBlock` | `busyBlocksRepo.update` (My Calendar's edit sheet) |
| `DELETE` | `/busy-blocks/:id` | nothing (`204`) | `busyBlocksRepo.remove` (My Calendar's edit sheet) |

Route files: `api/src/routes/profiles.ts`, `api/src/routes/events.ts`, `api/src/routes/groups.ts`, `api/src/routes/busy-blocks.ts`, mounted in `api/src/index.ts`.

## Profiles

### `GET /profiles/me`

Returns the caller's row from `profiles`.

| Status | When |
|---|---|
| `200` | `Profile` |
| `404` | the caller has no `profiles` row |

### `PATCH /profiles/me`

Partially updates the caller's profile and returns the updated row. Body type: `ProfileUpdate`.

| Field | Type | Rules |
|---|---|---|
| `full_name` | `string \| null` | `""` → `400` |
| `username` | `string \| null` | trimmed; empty after trimming → `400`; must be unique |
| `avatar_url` | `string \| null` | object path in the `avatars` bucket; must be `<caller id>/<name>.<ext>` (one folder level, filename `[A-Za-z0-9_-]+` plus an extension) → otherwise `400`. The API doesn't check that the object exists. |

- Send only the fields to change. `null` clears a field.
- Any other key (including `id` and `created_at`) is silently ignored.

```json
{ "username": "alex", "avatar_url": null }
```

| Status | When |
|---|---|
| `200` | updated `Profile` |
| `400` | missing or empty body; no editable fields present; wrong type; empty `full_name` or `username`; `avatar_url` outside the caller's folder |
| `404` | the caller has no `profiles` row |
| `409` | `username` already taken (Postgres `23505`) |

## Events

### `GET /events/me`

Returns every event the caller participates in (one `JOIN` of `events` and `event_participants` on `user_id = caller`), newest first by `created_at`.

| Status | When |
|---|---|
| `200` | `Event[]`; `[]` if the caller has no events |

### `POST /events`

Creates an event in a group and adds the caller as a participant with `rsvp_status = 'yes'`, in one transaction. Returns the new event. Body type: `EventCreate`.

| Field | Type | Rules |
|---|---|---|
| `group_id` | `string` | required; must be a UUID → otherwise `400`; caller not a member (or no such group) → `403` |
| `title` | `string` | required; trimmed; empty after trimming → `400` |
| `description` | `string \| null` | optional; trimmed; blank is stored as `null` |
| `final_location` | `string \| null` | optional; trimmed; blank is stored as `null` |

- `created_by` is always the caller. `id`, `status` (`planning`), `created_at` and `updated_at` come from column defaults; `final_starts_at` / `final_ends_at` start `null`.
- Any other key is silently ignored.
- The caller must be a member of `group_id` (checked in the service with `isMember` before inserting) → otherwise `403`. A nonexistent group also fails this check, so it returns `403` too; the `404` below is only a backstop if the group is deleted between the check and the insert.

```json
{ "group_id": "uuid", "title": "Climbing night", "final_location": "Movement Gowanus" }
```

| Status | When |
|---|---|
| `201` | created `Event` |
| `400` | missing or empty body; `group_id` missing or not a UUID; `title` missing, not a string, or blank; `description` / `final_location` not a string or `null` |
| `403` | caller is not a member of `group_id` |
| `404` | backstop: foreign key `events_group_id_fkey` failed (`23503`) |
| `500` | database error (including a caller with no `profiles` row) |

## Groups

### `GET /groups/me`

Returns every group the caller is a member of (one `JOIN` of `groups` and `group_memberships` on `user_id = caller`), newest first by `created_at`. Archived groups (`archived_at` set) are included.

| Status | When |
|---|---|
| `200` | `Group[]`; `[]` if the caller is in no groups |

### `POST /groups`

Creates a group and makes the caller its `owner`, in one transaction (the `groups` row and the `group_memberships` row are saved together or not at all). Returns the new group. Body type: `GroupCreate`.

| Field | Type | Rules |
|---|---|---|
| `name` | `string` | required; trimmed; empty after trimming → `400` |
| `description` | `string \| null` | optional; trimmed; blank is stored as `null` |

- `created_by` is always the caller; `id`, `created_at` and `archived_at` come from column defaults.
- Any other key is silently ignored.

```json
{ "name": "Climbing crew", "description": "Tuesday sessions" }
```

| Status | When |
|---|---|
| `201` | created `Group` |
| `400` | missing or empty body; `name` missing, not a string, or blank; `description` not a string or `null` |
| `500` | database error (including a caller with no `profiles` row: foreign key `23503`) |

## Busy blocks

### `GET /busy-blocks/me?from=YYYY-MM-DD&to=YYYY-MM-DD`

Returns the caller's blocks, across all their calendars, that touch the inclusive date range. One `JOIN` of `busy_blocks` and `calendars` on `calendars.user_id = caller`, ordered by `start_date`, `start_time`.
- **One-off** blocks (`repeat_days` null) are returned when `start_date` is inside the range.
- **Weekly** blocks are returned when their active period overlaps the range: `start_date <= to`, and `end_date` is null or `>= from`.
- Weekly blocks come back as rules (`repeat_days`), not expanded into dated occurrences.

| Query param | Rules |
|---|---|
| `from`, `to` | both required; each a single real calendar date in `YYYY-MM-DD` form (e.g. `2026-02-30` is rejected); `from <= to` |

| Status | When |
|---|---|
| `200` | `BusyBlock[]`; `[]` if none in range |
| `400` | `from` or `to` missing, repeated, not a real `YYYY-MM-DD` date, or `from > to` |

### `POST /busy-blocks`

Adds a block to the caller's **manual** calendar and returns the new row. Body type: `BusyBlockCreate`.

The service gets or creates the manual calendar with `getOrCreateCalendar(userId, 'manual')` (`api/src/db/calendars.ts`), then inserts the block. That helper inserts first with `ON CONFLICT (user_id, source) DO NOTHING`, then selects. Doing it in that order means two concurrent first requests can't race into a unique-constraint error.

No transaction: if the block insert fails, an empty manual calendar is still valid state. Google-synced blocks never use this route; the sync service writes to the db layer with the Google calendar's id.

| Field | Type | Rules |
|---|---|---|
| `start_date` | `string` | required; a real `YYYY-MM-DD` date. One-off: the day. Weekly: the first day it applies |
| `start_time`, `end_time` | `string` | required; 24-hour `HH:MM` or `HH:MM:SS` (stored and returned as `HH:MM:SS`); `end_time > start_time` (no overnight blocks) |
| `repeat_days` | `number[] \| null` | absent or `null` = one-off; otherwise a non-empty array of integers `0` (Sunday) to `6`, deduplicated and sorted |
| `end_date` | `string \| null` | absent or `null` = forever; only on weekly blocks; a real date; `>= start_date` |
| `timezone` | `string` | required; an IANA name the server's `Intl` recognizes (e.g. `America/New_York`) |

- `calendar_id` comes from the caller's manual calendar. `id` and `created_at` come from column defaults.
- Any other key is silently ignored.
- The database CHECK constraints repeat these rules as a backstop.

```json
{ "start_date": "2026-10-05", "start_time": "09:00", "end_time": "10:30", "repeat_days": [1, 3], "timezone": "America/New_York" }
```

| Status | When |
|---|---|
| `201` | created `BusyBlock` |
| `400` | missing or empty body; any field rule above broken |
| `500` | database error (including a caller with no `profiles` row: foreign key `23503` when creating the calendar) |

### `PATCH /busy-blocks/:id` and `DELETE /busy-blocks/:id`

Change or remove one of the caller's blocks. `PATCH` returns the updated row; `DELETE` returns `204` with no body.

The service first loads the block with `getOwnedBusyBlock` (joined to `calendars` on `user_id = caller`), then:
- **No row** (no such block, or someone else's) → `NotFoundError` → `404`. The two cases are deliberately the same, so block ids reveal nothing about other users.
- **The block is on a synced (non-manual) calendar** → `ForbiddenError` → `403`. The next sync would undo the change.
- **`PATCH` only:** it merges the change onto the stored row and checks the cross-field rules. These are end after start, `end_date` only when `repeat_days` is set, and `end_date >= start_date`. A break is a `ValidationError` → `400`. A CHECK violation (`23514`) is also mapped to `400` as a backstop.

The `UPDATE … FROM calendars` / `DELETE … USING calendars` statements repeat the ownership scoping, and zero rows → `404`.

`PATCH` body: any subset of the `POST` fields, each validated on its own like `POST`. Send `null` to clear `end_date` or `repeat_days`. Making a weekly block one-off needs `"repeat_days": null, "end_date": null`. Other keys are ignored.

| Status | When |
|---|---|
| `200` / `204` | updated block / deleted |
| `400` | `:id` not a UUID; `PATCH`: empty body, no editable fields, a field's format, or a cross-field rule |
| `403` | the block is on a synced calendar |
| `404` | no such block, or not the caller's |

## Trying a route

The Postman collection exercises every route (`brain/dev-workflow.md`, API tests and CI); its "Sign in" request also gets you a token. With a token:

```bash
curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/profiles/me
```

```bash
curl -X PATCH -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"full_name":"Alex"}' http://localhost:3000/profiles/me
```

Without `Content-Type: application/json`, `express.json()` doesn't parse the body, so PATCH returns `400`.
