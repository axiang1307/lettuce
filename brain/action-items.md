# Action items

The only place for in-progress work, to-dos and open questions. When an item is done, delete it, and record any lasting knowledge in the relevant `brain/` file (and in `decisions.md` if a decision was made).

## API

- [ ] **Backfill `profiles` rows for existing auth users.** The `on_auth_user_created` trigger (calls `public.handle_new_user()`) exists and is enabled, but as of 2026-10-03, 12 `auth.users` rows have no profile. Those users get `404` from `GET`/`PATCH /profiles/me` (so the edit-profile screen can't load) with no way to recover, since the API never creates rows.
- [ ] **Lock down `public.handle_new_user()`.** The Supabase security advisor flags that `anon` and `authenticated` can call this `SECURITY DEFINER` function via `/rest/v1/rpc/handle_new_user`. Revoke `EXECUTE` from both; the trigger still works without it.
- [ ] **Finish the `groups` resource.** `GET /groups/me` and `POST /groups` exist. Still to build:
  - `POST /groups/:id/members`: first `:id` route and first role check (only `owner` / `admin` may add); decide how users find each other (username lookup?)
  - decide whether `GET /groups/me` hides archived groups and returns the caller's `role`
- [ ] **Build the `polls` resource** (time and activity voting per event).
- [ ] **Extend `events`:**
  - decide whether creating an event (`POST /events`) also adds every group member as a `pending` participant; today only the creator is added
  - get a single event, with a participant check
  - list events per group (`WHERE group_id = $1`, with a membership check)
- [ ] **Decide `ON DELETE` for `events.group_id`:** `CASCADE` (deleting a group deletes its events) or `RESTRICT`. It's currently the default `NO ACTION`, which behaves like `RESTRICT`. `groups.archived_at` suggests groups get archived rather than deleted.
- [ ] **Decide what moves an event's `status` over time.** `upcoming → in_progress → done` depends on `final_starts_at` / `final_ends_at`, but nothing updates `status` when those times pass. Options: a scheduled job (e.g. `pg_cron`), updating on read in the API, or storing only `planning` vs scheduled and deriving the rest from the times.
- [ ] **Switch validation to `zod`** once the hand-rolled patterns feel solid.
- [ ] **Consider a global Express error-handling middleware** so uncaught errors return `{ error }` JSON instead of an HTML stack trace.
- [ ] **Minor:** create the server-side supabase client with `persistSession: false, autoRefreshToken: false`.

## Frontend

- [ ] **Remove `console.log(session.access_token)` in `frontend/app/index.tsx:22`.** It was added for API testing and leaks the token to device logs.
- [ ] **Give real events a real detail screen.** Real events open the detail screen, but it finds them by filtering `GET /events/me` on the device, and their calendar, poll, activity panels and participant avatars are copied from mock event `evt-1` (`toDetailEvent`). Needs `GET /events/:id` (with a participant check), participants, and polls. The profile tab's calendar and previous-event cards also still use `data/home-feed.ts`.
- [ ] **Show participants on event cards** once there's an endpoint for an event's participants (avatars from `profiles.avatar_url`).
- [ ] **Replace the notifications mock** once a notifications table and API route exist.
- [ ] **Rebuild the iOS dev client** (`npm run ios`) to pick up `expo-image-picker`, then test on a device:
  - edit profile: names, username conflict (`409`), photo upload, photo removal
  - create group → appears on the groups tab; Plan Event → create-event with the group preselected → event appears under Upcoming on home
  - create-event empty state → create group → back

## Security posture

- [ ] **Decide and document RLS policy for each table.**
  - Tables the frontend still reads directly with the anon key need real RLS.
  - API-only tables could be default-deny for `anon` and `authenticated`.

## Open product questions

- Which "AI-generated" features are in v1, and which come later?
- Are polls first-class in the v1 schema, or a follow-up?
- Are reminders in-app only, or are push notifications required in v1?
- Which Figma frames are canonical for Home, Event Detail, Groups, Notifications and Profile?
