# API (`api/`)

Express 5 + TypeScript, run with `tsx` in dev. It replaces **part of** Supabase's auto-generated PostgREST layer for Lettuce's app data. Auth and anything not yet migrated stay on Supabase.

## Request pipeline

`src/index.ts` runs once at startup and registers middleware and routes; `app.listen` then hands control to Express. Registration order is pipeline order, and a request only advances when a middleware calls `next()`:

`express.json()` (parses the JSON body into `req.body`) → `authMiddleware` (global) → matching router.

`authMiddleware` (`src/middleware/auth.ts`):
- reads `Authorization: Bearer <jwt>`
- validates it with `supabase.auth.getUser(jwt)`
- sets `req.user`

If the header is missing or malformed, or the token is invalid, it responds `401 { error }` and never calls `next()`.

`req.user` is typed optional (`user?: User` in `src/types/express.d.ts`, which is server-only and stays in the API). Controllers therefore start with `if (!req.user) return 401`. The guard narrows the type and is honest defensive code, even though the middleware guarantees a user.

## Layering (every resource follows this)

| Layer | File | Responsibility |
|---|---|---|
| route | `src/routes/<resource>.ts` | `Router()`: maps paths and methods to controller functions; `export default` |
| controller | `src/controllers/<resource>.ts` | HTTP: auth guard, input validation, status codes, error-to-status mapping |
| service | `src/services/<resource>.ts` | business logic and access scoping (the RLS equivalent) |
| db | `src/db/<resource>.ts` | raw parameterized SQL through the `pg` pool (`src/lib/db.ts`, `DATABASE_URL`) |

Shared clients are created once at import time: `src/lib/db.ts` (pg `Pool`) and `src/lib/supabase.ts` (service-role supabase client, used only by auth).

## Identity and access rules

- Identity **always** comes from `req.user.id`, never from the URL or request body.
- Own-data endpoints use `/me`; there is no `/:id` route for profiles. Other users' info (group members, shared events) will be served through the `groups` and `events` routes.
- Every query that touches user data is scoped by the caller's id in SQL (e.g. `WHERE id = $1`). Without RLS, this is the security backbone.
- Always use `$n` placeholders. Dynamic SQL (e.g. a `SET` clause) may interpolate only column names that came from a server-side allow-list, never client input.

## Endpoints

### `GET /profiles/me`
Returns the caller's `profiles` row.

### `PATCH /profiles/me`
Updates the caller's profile.
- Editable fields (allow-list): `full_name`, `username`, `avatar_url`.
- The update object is built only from allow-listed keys. Unknown keys, including `id` and `created_at`, are silently ignored.
- A missing body (`undefined`, e.g. when the request isn't JSON) or `{}` → `400`.
- No allow-listed keys present → `400`.
- Each field must be a string or `null`. `null` clears the field.
- `full_name: ""` → `400`.
- `username` is trimmed; if it's empty after trimming → `400`.
- Username taken (Postgres `23505`) → `409`.
- Returns the updated row (`RETURNING *`).

### `GET /events/me`
Returns events the caller participates in. It looks up `event_participants.user_id = caller`, then fetches `events` with `id = ANY(ids)`. Returns `[]` if there are none.

## `profiles` table

| Column | Notes |
|---|---|
| `id` | equals `auth.users.id`; system-set |
| `full_name`, `username`, `avatar_url` | user-editable |
| `created_at` | system-set |

Rows are meant to be created by a trigger on `auth.users` at signup, so the API never creates profiles.

## Errors and status codes

- **Body shape:** always `{ error: string }`, the same as `authMiddleware`.
- **Status codes:**

  | Code | Meaning |
  |---|---|
  | `200` | success |
  | `400` | bad input |
  | `401` | auth failure (middleware or controller guard) |
  | `404` | defensive missing row |
  | `409` | unique-constraint conflict |
  | `500` | unexpected database or server error |

- **How `pg` reports errors:** it **throws** on query errors, and Postgres error codes such as `23505` are on `error.code`. A query that matches nothing is not an error; it returns empty `rows`. The db layer returns `rows[0] ?? null`, and the controller turns `null` into `404`.
- **Catching errors:** controllers wrap service calls in `try/catch`. There is no Express error-handling middleware, so an uncaught error would return an HTML stack trace instead of `{ error }`.

## Environment (`api/.env`)

| Variable | Used for |
|---|---|
| `SUPABASE_URL` | auth verification client |
| `SUPABASE_SERVICE_ROLE_KEY` | auth verification client |
| `DATABASE_URL` | pg pool |

## Manual testing

1. Run `npm run dev` (port 3000).
2. Get a real access token from a frontend session.
3. Call the endpoints with `Authorization: Bearer <token>` and check the results in the Supabase table editor.

Negative cases to check:
- no token or a bad token → `401`
- PATCH with `id` or unknown fields → those fields are ignored
- empty PATCH body → `400`
