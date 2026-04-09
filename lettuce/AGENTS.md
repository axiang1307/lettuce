# AGENTS.md

This file defines the working product context and implementation guardrails for AI/code agents in this repository.

## Product intent (current)

Lettuce is a mobile app focused on making social scheduling easier by reducing coordination overhead between friends.

Based on the linked Figma deck and current app code, the core product themes are:
- synced calendars with friends
- AI-generated availability/time slot suggestions
- voting polls for deciding times
- reminders for upcoming plans
- lightweight activity suggestions

Problem framing from design deck:
- users are busy and have trouble maintaining friendships due to scheduling friction
- the app should reduce effort needed to coordinate hangouts

## Current codebase reality

This project is currently a mostly static Expo Router app.

- Stack: Expo + React Native + TypeScript
- Routes: onboarding -> login -> tab shell
- Home tab has concrete UI and event detail flow
- Many views are placeholder/static and should be wired to backend later
- Domain and placeholder data exist as scaffolding for eventual repositories/APIs

Reference paths:
- `app/index.tsx`
- `app/onboarding/*`
- `app/login.tsx`
- `app/(tabs)/*`
- `app/event/[eventId].tsx`
- `data/home-feed.ts`
- `data/placeholders.ts`
- `domain/entities.ts`

## Source of truth hierarchy

When there is conflict, use this priority order:
1. Explicit product decisions recorded in this file
2. Approved Figma screens/flows
3. Existing code behavior
4. Placeholder copy/data in mock files

Do not treat placeholder text as final product requirements.

## Implementation goals (near-term)

1. Preserve and polish current UX while replacing mock data with backend-driven data.
2. Keep feature scope tight around scheduling value:
   - event creation and discovery
   - RSVP/attendance intent
   - group coordination
   - reminders/notifications
3. Implement backend and schema incrementally in vertical slices, not as a large rewrite.

## Suggested backend shape (Supabase-first)

Use Supabase as the primary backend platform.

Core components:
- Supabase Auth for identity
- Postgres for primary app data
- Storage for avatars/event media
- Realtime for notification/read-state updates where useful
- Edge Functions for privileged workflows (fanout notifications, reminders, webhook-like automation)

## Recommended v1 entities

- `profiles`
- `groups`
- `group_members`
- `events`
- `event_attendees`
- `notifications`

Optional after v1:
- `polls`
- `poll_options`
- `poll_votes`
- `activity_suggestions`

## Security and data access rules

Treat Row Level Security (RLS) as mandatory and default-deny.

Minimum policy expectations:
- users can update only their own profile
- private group/event data readable only by relevant members
- attendance rows writable only by the owning user (or privileged function)
- notification rows readable/updatable only by the target user

Any operation requiring service-role permissions must be moved to an Edge Function.

## Product-level non-goals (for now)

- broad social network mechanics (public feeds, follower graph)
- heavy recommendation systems beyond simple activity suggestions
- multi-platform backend abstractions before shipping core flows

## Delivery strategy

Build in end-to-end slices:
1. schema + RLS for one flow
2. repository/client integration
3. UI wiring + error/empty/loading states
4. instrumentation and basic test coverage

Preferred first slice:
- create/view event -> RSVP -> reminder notification state

## Coding guardrails for agents

- Reuse existing design language/components before introducing new UI primitives.
- Keep route structure consistent with Expo Router conventions already used in `app/`.
- Avoid large refactors unless required by the current feature.
- When replacing placeholders, remove stale comments/copy that can confuse future work.
- Add small, composable modules for backend access (query/repository layer) rather than calling SDK directly from many UI files.

## Open questions needing product confirmation

These items are currently ambiguous and should be confirmed before major backend work:
- Is the canonical MVP flow group-first or event-first?
- Which "AI-generated" features are in scope for v1 vs later?
- Should polls be first-class in v1 schema or a follow-up phase?
- Are reminders in-app only, or should push notifications be required in v1?
- Which exact Figma frames are canonical for Home, Event Detail, Groups, Notifications, and Profile?

