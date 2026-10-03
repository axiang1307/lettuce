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
- Top-level routes also include `login`, `settings`, password reset (`password_reset`, `reset_email`, `verify_pass_reset`), `logging-out` and `modal`.
- The tab shell (`app/(tabs)/_layout.tsx`) has Home, Groups, Notifications and Profile.
- Event detail lives at `app/(tabs)/event/[eventId].tsx` and is hidden from the tab bar with `href: null`.

## Event detail flow

`[eventId].tsx` holds a `flowMode` state (`detail` | `calendar` | `poll` | `activity`) and renders the matching panel from `components/event/`. Every panel receives the full `HomeFeedEvent` object.

## Data layer

- Components never call `supabase.from(...)` or `fetch` directly. Backend access goes through small composable repository modules in `lib/repositories/*`, built on `authendFetch` (`lib/api.ts`). `lib/repositories/profiles.ts` is the reference pattern.
- Types come from `@lettuce/api-types` via `import type`. They are never redefined locally.
- `authendFetch` throws on a missing session (`'Unauthorized'`) and on non-2xx responses, using the API's `{ error }` message when present. It returns `null` for `204`.
- Mock data still used:
  - `data/home-feed.ts`: event data for the home feed and detail
  - `data/placeholders.ts`: groups and notifications
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
