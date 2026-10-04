# API endpoints

Every route the API serves. Pipeline, layering, access rules and the error contract: `brain/api.md`.

## Basics

- **Base URL:** `http://localhost:3000` in dev. The frontend reads it from `EXPO_PUBLIC_API_URL`.
- **Auth:** every route requires `Authorization: Bearer <supabase access_token>`. `authMiddleware` is global, so there are no public routes (not even a health check). A missing, malformed or invalid token → `401`.
- **Identity:** the caller is always `req.user.id`, taken from the verified token. No route takes a user id in the URL or body.
- **Bodies:** JSON in and out. Errors are always `{ "error": string }`.
- **Types:** request and response shapes are the shared types in `packages/api-types/index.ts`.
- **Every route** can also return `401` (bad or missing token) and `500` (database error); the tables below list only the rest.

## Summary

| Method | Path | Returns | Frontend caller |
|---|---|---|---|
| `GET` | `/profiles/me` | `Profile` | `profilesRepo.getMe` |
| `PATCH` | `/profiles/me` | `Profile` | `profilesRepo.patchMe` |
| `GET` | `/events/me` | `Event[]` | `eventsRepo.getEvents` (home feed) |
| `POST` | `/events` | `Event` (`201`) | `eventsRepo.create` (create-event screen) |
| `GET` | `/groups/me` | `Group[]` | `groupsRepo.getGroups` (groups tab, home feed, create-event picker) |
| `POST` | `/groups` | `Group` (`201`) | `groupsRepo.create` (create-group screen) |

Route files: `api/src/routes/profiles.ts`, `api/src/routes/events.ts`, `api/src/routes/groups.ts`, mounted in `api/src/index.ts`.

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

## Trying a route

Get an access token from a signed-in frontend session, then:

```bash
curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/profiles/me
```

```bash
curl -X PATCH -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"full_name":"Alex"}' http://localhost:3000/profiles/me
```

Without `Content-Type: application/json`, `express.json()` doesn't parse the body, so PATCH returns `400`.
