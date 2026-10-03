# Action items

The only place for in-progress work, to-dos and open questions. When an item is done, delete it, and record any lasting knowledge in the relevant `brain/` file (and in `decisions.md` if a decision was made).

## API

- [ ] **Confirm the `auth.users → profiles` signup trigger exists in Supabase** and backfill existing users.
  - There are no migrations in the repo to prove it.
  - If it's missing, an auth user with no profile row gets `404` on both GET and PATCH, with no way to recover, since the API never creates rows.
- [ ] **Build the `groups` resource** (plus `group_members`), the next resource.
  - First membership-based access check, i.e. "can this caller see this group?"
  - Likely the first `POST` and `DELETE` routes.
- [ ] **Build the `polls` resource** (time and activity voting per event).
- [ ] **Extend `events`:**
  - create an event
  - get a single event, with a participant check
  - possibly list events per group
- [ ] **Remove the dead `404` branch in `GET /events/me`.** The service returns `[]`, never `null`, so the branch never runs. Optionally collapse the two queries into one `JOIN`.
- [ ] **Switch validation to `zod`** once the hand-rolled patterns feel solid.
- [ ] **Consider a global Express error-handling middleware** so uncaught errors return `{ error }` JSON instead of an HTML stack trace.
- [ ] **Minor:** create the server-side supabase client with `persistSession: false, autoRefreshToken: false`.

## Frontend

- [ ] **Remove `console.log(session.access_token)` in `frontend/app/index.tsx:22`.** It was added for API testing and leaks the token to device logs.
- [ ] **Switch the home feed from `data/home-feed.ts` to `eventsRepo`.** Map the DB `Event` to whatever the UI needs; `HomeFeedEvent` currently carries extra mock fields.
- [ ] **Replace the groups and notifications mocks** with repositories once their API routes exist, and remove stale placeholder comments.

## Security posture

- [ ] **Decide and document RLS policy for each table.**
  - Tables the frontend still reads directly with the anon key need real RLS.
  - API-only tables could be default-deny for `anon` and `authenticated`.

## Open product questions

- Is the canonical MVP flow group-first or event-first?
- Which "AI-generated" features are in v1, and which come later?
- Are polls first-class in the v1 schema, or a follow-up?
- Are reminders in-app only, or are push notifications required in v1?
- Which Figma frames are canonical for Home, Event Detail, Groups, Notifications and Profile?
