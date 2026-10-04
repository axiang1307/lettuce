# Action items

## API

- [ ] **Backfill `profiles` for existing auth users.** The `on_auth_user_created` trigger works, but 12 older `auth.users` rows (as of 2026-10-03) have no profile, so they get `404` from `/profiles/me` and `500` (FK `23503`) when creating groups or events.
- [ ] **Revoke `EXECUTE` on `public.handle_new_user()` from `anon` and `authenticated`.** The security advisor flags it as callable via `/rest/v1/rpc`; the trigger doesn't need the grant.
- [ ] **Groups:** `POST /groups/:id/members` (first `:id` route and role check: only `owner` / `admin` add; decide how users find each other, e.g. by username). Decide whether `GET /groups/me` hides archived groups and returns the caller's `role`.
- [ ] **Events:** `GET /events/:id` (participant check), list events per group (membership check). Decide whether `POST /events` adds every group member as a `pending` participant (today only the creator, as `yes`).
- [ ] **Decide `ON DELETE` for `events.group_id`** (`CASCADE` or `RESTRICT`; currently the default `NO ACTION`). `groups.archived_at` suggests archiving over deleting.
- [ ] **Decide what moves `events.status` over time.** Nothing updates `upcoming → in_progress → done` as times pass: a scheduled job (`pg_cron`), update-on-read, or derive from `final_starts_at` / `final_ends_at`.
- [ ] **Build the `polls` resource.**
- [ ] Later: `zod` validation; a global Express error middleware (uncaught errors currently return HTML); `persistSession: false, autoRefreshToken: false` on the server supabase client.

## Frontend

- [ ] **Remove `console.log(session.access_token)` in `frontend/app/index.tsx`.** It leaks the token to device logs.
- [ ] **Move onboarding's name step to `profilesRepo.patchMe`.** `app/onboarding/name.tsx` still upserts `profiles` through PostgREST with a client-supplied `id`.
- [ ] **Real event detail.** Needs `GET /events/:id`, participants and polls; today it filters `GET /events/me` on the device and borrows mock panels and avatars (`toDetailEvent`). The profile tab's calendar and previous-event cards are still mock.
- [ ] **Participant avatars on event cards**, once an event-participants endpoint exists.
- [ ] **Notifications:** replace the mock once a table and route exist.
- [ ] **Device test** (after `npm run ios` for `expo-image-picker`): edit profile (names, `409` username, photo upload/remove); create group → groups tab; Plan Event → create-event preselected → home Upcoming → detail.

## Security

- [ ] **Decide RLS per table.** Tables the frontend reads directly need real policies; API-only tables can deny `anon` / `authenticated`.

## Open product questions

- Which AI features are in v1?
- Are polls in v1?
- In-app reminders only, or push notifications in v1?
- Which Figma frames are canonical for each tab?
