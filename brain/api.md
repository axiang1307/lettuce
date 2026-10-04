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

## Data notes

- `profiles.id` equals `auth.users.id`. Rows are created by the `on_auth_user_created` trigger at signup; the API never creates profiles.
- `profiles.avatar_url` is a Storage object path, not a URL (see `brain/frontend.md`).
- Creating a row plus its owner/participant link (`POST /groups`, `POST /events`) runs in one transaction on a dedicated client: `pool.connect()` → `BEGIN` → inserts → `COMMIT`, `ROLLBACK` + rethrow on error, `release()` in `finally`.

## Errors and status codes

- **Body shape:** always `{ error: string }`, the same as `authMiddleware`.
- **Status codes:**

  | Code | Meaning |
  |---|---|
  | `200` | success |
  | `400` | bad input |
  | `401` | auth failure (middleware or controller guard) |
  | `403` | signed in, but not allowed (`ForbiddenError`, e.g. not a group member) |
  | `404` | defensive missing row |
  | `409` | unique-constraint conflict |
  | `500` | unexpected database or server error |

- **How `pg` reports errors:** it **throws** on query errors, with the Postgres code on `error.code` (and the constraint name on `error.constraint`). Matching nothing isn't an error: single-row reads return `rows[0] ?? null` (→ `404`); lists return `[]` (→ `200`, never `404`); inserts with `RETURNING *` always return a row or throw, so they're typed without `| null`.
- **Domain errors from services:** a service that refuses a request throws a class from `src/lib/errors.ts` (currently `ForbiddenError`). The service says *what* went wrong; the controller checks `instanceof` in its `catch` and picks the status code (`ForbiddenError` → `403`). Services never set HTTP statuses themselves.
- **Shared access checks** live in the db layer of the resource they're about, e.g. `isMember(groupId, userId)` in `src/db/groups.ts`, used by the events service.
- **Catching errors:** controllers wrap service calls in `try/catch`; there's no error-handling middleware.

## Environment (`api/.env`)

| Variable | Used for |
|---|---|
| `SUPABASE_URL` | auth verification client |
| `SUPABASE_SERVICE_ROLE_KEY` | auth verification client |
| `DATABASE_URL` | pg pool |
| `PORT` | optional listen port, default `3000` (the local test runner sets it) |
