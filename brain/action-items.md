# Action items

## Deploy

- [ ] **Create the Render service.** Merge `render.yaml` to `main`, then in Render: New → Blueprint → the `axiang1307/lettuce` repo. Enter `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` and `DATABASE_URL` (the session pooler URL from `api/.env`, no `sslmode`). Check `curl https://<service>.onrender.com/health`.
- [ ] **Point the app at the hosted API:** set `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY` and `EXPO_PUBLIC_API_URL` (the `https://` Render URL) as EAS environment variables, then build for TestFlight (needs an Apple Developer Program membership).
- [ ] **Add `android.package` to `frontend/app.json`** before an Android build.
- [ ] **Decide on a separate production Supabase project** before real users. Today local dev, `npm run test:api` (which leaves rows behind) and the hosted app all share one database.
- [ ] **`api/scripts/test-local.sh` waits for any HTTP answer on `/`** (its comment says there's no health route). Switch it to `GET /health`.
- [ ] Before a public App Store release: in-app account deletion and a privacy policy (Apple requires both for apps with sign-up), and no mock screens.

## API

- [ ] **Backfill `profiles` for existing auth users.** The `on_auth_user_created` trigger works, but 12 older `auth.users` rows (as of 2026-10-03) have no profile, so they get `404` from `/profiles/me` and `500` (FK `23503`) when creating groups or events.
- [ ] **Revoke `EXECUTE` on `public.handle_new_user()` from `anon` and `authenticated`.** The security advisor flags it as callable via `/rest/v1/rpc`; the trigger doesn't need the grant. The baseline migration reproduces the grant, so revoke it in a new migration.
- [ ] **`handle_new_user()` stores `full_name = ''`** when signup sends no name metadata (its fallback joins the `first_name` and `last_name` metadata and trims, giving `''`), but `PATCH /profiles/me` rejects `''`. Decide whether the trigger should store `NULL` instead.
- [ ] **Postman gaps:** no requests yet for `409` username taken or another user's busy block (`404`), which both need a second user in `api/scripts/test-local.sh`; the profile `404` (needs a user without a profile); or a synced busy block's `403` (needs a non-manual calendar, which comes with Google sync).
- [ ] **Groups:** `POST /groups/:id/members` (first `:id` route and role check: only `owner` / `admin` add; decide how users find each other, e.g. by username). Decide whether `GET /groups/me` hides archived groups and returns the caller's `role`.
- [ ] **Events:** `GET /events/:id` (participant check), list events per group (membership check). Decide whether `POST /events` adds every group member as a `pending` participant (today only the creator, as `yes`).
- [ ] **Decide `ON DELETE` for `events.group_id`** (`CASCADE` or `RESTRICT`; currently the default `NO ACTION`). `groups.archived_at` suggests archiving over deleting.
- [ ] **Decide what moves `events.status` over time.** Nothing updates `upcoming → in_progress → done` as times pass: a scheduled job (`pg_cron`), update-on-read, or derive from `final_starts_at` / `final_ends_at`.
- [ ] **Build the `polls` resource.**
- [ ] Later: `zod` validation; a global Express error middleware (uncaught errors currently return HTML); `persistSession: false, autoRefreshToken: false` on the server supabase client.

## Frontend

- [ ] **Move onboarding's name step to `profilesRepo.patchMe`.** `app/onboarding/name.tsx` still upserts `profiles` through PostgREST with a client-supplied `id`.
- [ ] **Real event detail.** Needs `GET /events/:id`, participants and polls; today it filters `GET /events/me` on the device and borrows mock panels and avatars (`toDetailEvent`). The profile tab's calendar and previous-event cards are still mock.
- [ ] **Participant avatars on event cards**, once an event-participants endpoint exists.
- [ ] **Notifications:** replace the mock once a table and route exist.
- [ ] **Device test:** edit profile (names, `409` username, photo upload/remove); create group → groups tab; Plan Event → create-event preselected → home Upcoming → detail.

## Calendar

- [ ] **Decide how overlapping busy blocks are handled.** Today `POST /busy-blocks` stores blocks exactly as entered, so they can overlap (e.g. 9–10 and 9:30–11, or a one-off on top of a weekly block).
  - **Storage:** keep blocks as entered, or merge on write? The suggestion is to keep them as entered: users edit and delete the blocks they made, and one-off and weekly blocks often can't merge into one row.
  - **Availability:** treat "busy" as the union of all blocks, computed on read.
  - **Display:** `WeekCalendar` currently draws overlapping blocks on top of each other; decide side-by-side columns or a stacked look.
- [ ] **Editing one occurrence of a weekly block.** Today editing or deleting a weekly block changes every week; "only this day" would need exception dates (a schema change).
- [ ] **Blocks in another time zone** display at their stored clock times (`blocksForWeek` assumes the device's zone). Convert them once imported or cross-device blocks exist.
- [ ] **Device test My Calendar** (adding and editing are confirmed): delete (one-off and weekly confirm messages); Today button on both calendars; long-press-drag drawing vs. plain scrolling.
- [ ] Later: the onboarding "Manually Add Calendar" button; computing group overlap; whether drawing should auto-scroll near the grid's edges; the Google Calendar import (MVP; Outlook after the MVP; plan in `decisions.md`).

## Security

- [ ] **Decide RLS per table.** Tables the frontend reads directly need real policies; API-only tables can deny `anon` / `authenticated`.
- [ ] **Turn on leaked-password protection** in Supabase Auth (security advisor WARN).

## Open product questions

- Which AI features are in v1?
- Are polls in v1?
- In-app reminders only, or push notifications in v1?
- Which Figma frames are canonical for each tab?
