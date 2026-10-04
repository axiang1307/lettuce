# Frontend (`frontend/`)

## Stack

Expo, React Native, TypeScript, Supabase Auth. File-based routing with Expo Router. The `ios` and `android` npm scripts build natively (`expo run:*`); see `brain/dev-workflow.md`.

## Auth

- `lib/auth-context.tsx` provides `AuthProvider` and `useAuth()`.
- `lib/supabase.ts` is the Supabase client (anon key).
- The session is persisted in AsyncStorage.

## Routing

- `app/index.tsx` checks auth and redirects new users to `/onboarding` and authenticated users to `/(tabs)`.
- `SKIP_ONBOARDING_AND_LOGIN` is a hardcoded `const` in `app/index.tsx`, not an env var. Set it to `true` to bypass auth during development.
- Onboarding (`app/onboarding/*`) covers welcome, use-cases, name, phone, verify, credentials and calendar-sync.
- Top-level routes also include `login`, `settings`, `edit-profile`, `create-event` (opened by a group card's **Plan Event** button), `create-group` (opened by the `+` in the groups header and from create-event's empty state), password reset (`password_reset`, `reset_email`, `verify_pass_reset`), `logging-out` and `modal`.
- The tab shell (`app/(tabs)/_layout.tsx`) has Home, Groups, Notifications and Profile.
- Event detail lives at `app/(tabs)/event/[eventId].tsx` and is hidden from the tab bar with `href: null`.

## Profile editing

- The profile tab's **Edit Profile** button pushes `app/edit-profile.tsx`. Tab screens stay mounted, so every screen that shows profile data (the profile tab and the home greeting in `components/home/home-page.tsx`) refetches `getMe` with `useFocusEffect`, not a mount-only `useEffect`; otherwise saved changes wouldn't appear.
- The form edits first name, last name, username and photo. `profiles` has only `full_name`, so the form splits it at the first space and saves `"<first> <last>"` (the same format onboarding writes). First name is required; an empty username is saved as `null`.
- Only changed fields go in the `PATCH`. A `409` shows inline as "Username already taken".
- Photos come from `expo-image-picker` (library only, square crop, base64), then are uploaded by `avatarsRepo`. Tapping an existing photo offers "Choose from library" or "Remove photo" (`avatar_url: null`).

## Creating groups and events

- `app/create-group.tsx`: name (required) and description → `groupsRepo.create` (`POST /groups`, caller becomes owner) → back.
- `app/create-event.tsx`: loads the caller's groups with `groupsRepo.getGroups` on focus, then shows a group picker (preselected when there's only one group) plus title (required), description and location → `eventsRepo.create` (`POST /events`) → back.
  - No groups → an empty state explaining that events live in groups, with a link to create-group; returning refetches the list.
  - API errors (e.g. the `403` "not a member" message) show inline above the button.
- create-event accepts a `groupId` route param (from a group card's **Plan Event** button) and preselects that group.

## Home feed and groups tab

- **Home** (`components/home/home-page.tsx`): fetches `eventsRepo.getEvents` and `groupsRepo.getGroups` together on focus. Events carry only `group_id`, so group names are looked up from the groups list. `components/home/feed.ts` maps each `Event` to a card:
  - **Upcoming:** `planning`, `upcoming` and `in_progress` events, soonest `final_starts_at` first, then events with no time
  - **"It's been a while. Catch up?":** `done` events
  - details: group name, location (or "Location TBD"), time formatted like "Sunday, 12/07 - 1pm" (or "Time TBD"). Status label and CTA text come from `status`; the CTAs do nothing yet.
  - no participant avatars (no participants endpoint yet)
  - tapping a card opens the event detail screen (below)
  - search filters title, details, status and description on the device
- **Groups tab** (`app/(tabs)/groups.tsx`): lists `groupsRepo.getGroups` as cards (name, description, **Plan Event** → create-event with that group preselected), with on-device search and loading / empty / error states.
- Card images are bundled placeholders picked by id (`components/home/card-images.ts`), so each card's image stays stable.

## Event detail flow

- Mock ids (`evt-1`…`evt-4`, linked from the profile tab) load from `data/home-feed.ts`.
- Any other id is a real event. With no `GET /events/:id` yet, the screen fetches `GET /events/me` and `GET /groups/me` and finds the event by id on the device. It shows a spinner while loading, and "No event found" if the id isn't among the caller's events (which doubles as the access check).
- `toDetailEvent` (`components/home/feed.ts`) adapts a real event to the `HomeFeedEvent` shape: real title, group name, location, time, status and description; the calendar, poll options, activities and participant avatars are copied from the first mock event. The poll question uses the real title.

`[eventId].tsx` holds a `flowMode` state (`detail` | `calendar` | `poll` | `activity`) and renders the matching panel from `components/event/`. Every panel receives the full `HomeFeedEvent` object.

## Data layer

- Components never call `supabase.from(...)` or `fetch` directly. Backend access goes through small composable repository modules in `lib/repositories/*`, built on `authendFetch` (`lib/api.ts`). `lib/repositories/profiles.ts` is the reference pattern.
- The exception is `lib/repositories/avatars.ts`, which talks to Supabase Storage directly (`upload`, `remove`, `publicUrl`), since file bytes don't go through the API.
- Types come from `@lettuce/api-types` via `import type`. They are never redefined locally.
- `authendFetch` throws on a missing session (`'Unauthorized'`) and on non-2xx responses, using the API's `{ error }` message when present. It returns `null` for `204`.
- Rendering is client-side: screens fetch JSON from the API at runtime through the repositories and render on the device. Screens that show server data refetch with `useFocusEffect`, because tab screens stay mounted.
- Mock data still used:
  - `data/home-feed.ts`: the profile tab's mock calendar / previous-event cards (ids `evt-1`…`evt-4`), and the template for real events' calendar / poll / activity panels
  - `domain/entities.ts`: the intended domain types (placeholder scaffolding)

## Theme and UI

- Colors and fonts are in `constants/theme.ts`.
- Fonts are Montserrat (headings) and DM Sans (body), loaded through `@expo-google-fonts`.
- `hooks/use-color-scheme.ts` maps RN's color scheme to `'light' | 'dark'`, since RN 0.86 can report `'unspecified'`.
- Navigation primitives are imported from `expo-router` (`Stack`, `ThemeProvider`, `DarkTheme`/`DefaultTheme`, `expo-router/tabs`, `expo-router/react-navigation`), not from `@react-navigation/*` directly.
- Bottom sheets use `@gorhom/bottom-sheet`. Any screen that uses one needs `GestureHandlerRootView` with `style={{ flex: 1 }}` as its outermost wrapper.

## Guardrails

- Reuse existing design components and language before adding new UI primitives.
- Keep the route structure consistent with the Expo Router conventions already in `app/`.
- Avoid large refactors unless the current feature requires one.
- When replacing mock data with real data, remove the stale placeholder comments and copy.
- Build backend features as end-to-end vertical slices: schema → API/repository → UI wiring → error, empty and loading states.

## Environment (`frontend/.env`)

| Variable | Notes |
|---|---|
| `EXPO_PUBLIC_SUPABASE_URL` | |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | |
| `EXPO_PUBLIC_API_URL` | e.g. `http://localhost:3000`; required for repository-backed calls |
