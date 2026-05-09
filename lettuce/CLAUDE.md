# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository. when talking to coder do not suggest edits just help them with what they ask, give code if needed but in the chat not in files

## Commands

```bash
npm start          # Start Expo dev server
npm run ios        # Run on iOS simulator
npm run android    # Run on Android emulator
npm run lint       # Run ESLint
```

Set `SKIP_ONBOARDING_AND_LOGIN=true` in `.env` to bypass auth and go straight to the app during development.

## Architecture

**Stack:** Expo + React Native + TypeScript + Supabase. File-based routing via Expo Router.

**Auth:** `lib/auth-context.tsx` provides `useAuth()` and `AuthProvider`. Supabase client is in `lib/supabase.ts`. Session persisted via AsyncStorage.

**Routing flow:** `app/index.tsx` checks auth → redirects to `/onboarding` (new users) or `/(tabs)` (authenticated). The tab shell (`app/(tabs)/_layout.tsx`) shows Home, Groups, Notifications, Profile. Event detail lives at `app/(tabs)/event/[eventId].tsx` — `sandbox.tsx` and `event/` are hidden from the tab bar via `href: null`.

**Event detail flow:** `[eventId].tsx` manages a `flowMode` state (`detail` | `calendar` | `poll` | `activity`) and renders the matching panel component from `components/event/`. All panels receive the full `HomeFeedEvent` object.

**Data:** Currently all static. `data/home-feed.ts` is the source for all event data used in the UI. `data/placeholders.ts` has stub data for groups/notifications/profile. `domain/entities.ts` defines the intended TypeScript types. Real Supabase queries are not yet wired — auth flows work but data screens are still mock.

**Theme:** Colors and fonts in `constants/theme.ts`. Fonts are Montserrat (headings) and DM Sans (body), loaded via `@expo-google-fonts`.

**Bottom sheets:** `@gorhom/bottom-sheet` is installed. Any screen using it needs `GestureHandlerRootView` as the outermost wrapper with `style={{ flex: 1 }}`.

## Key guardrails (from AGENTS.md)

- Reuse existing design components before adding new UI primitives.
- Backend access should go through small composable repository modules, not SDK calls scattered across UI files.
- RLS is mandatory and default-deny on all Supabase tables.
- Build backend in end-to-end vertical slices: schema + RLS → repository → UI wiring → error/loading states.
- When replacing mock data with real data, remove stale placeholder comments.

## Current state

- Home tab and event detail flow are fully built with static data.
- Groups, Notifications, Profile tabs are `PlaceholderScreen` stubs.
- `app/(tabs)/sandbox.tsx` is a dev prototype for the calendar UI — it represents the target design for `components/event/calendar-panel.tsx` and for `components/event/event-flow-header.tsx`.
- The Supabase schema is live (profiles, groups, group_memberships, events, event_groups, event_participants, polls, poll_options, poll_votes) but not yet connected to the UI.
- Known mismatch: DB event status is `draft/planning/confirmed/cancelled`; domain types use different values — needs reconciliation before wiring.
