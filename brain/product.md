# Product

Lettuce is a mobile social scheduling app. It aims to cut the back-and-forth of planning hangouts between friends who are busy and struggle to keep in touch.

## Core model

Users form **groups** with other users. Inside a group they create **events**. Each event can run **polls** to pick a time and an activity.

## Product themes (from the Figma deck)

- calendars synced with friends
- AI-suggested availability and time slots
- voting polls for deciding times
- reminders for upcoming plans
- lightweight activity suggestions

## Entities

- Tables today: `profiles`, `groups`, `group_memberships` (`role`: owner / admin / member), `events` (each in exactly one group), `event_participants` (`rsvp_status`), `polls`, `poll_options`, `poll_votes`.
- Not built yet: `notifications`, `activity_suggestions`.
- The MVP flow is **group-first**: events are only created inside a group.

## Non-goals (for now)

- broad social-network mechanics (public feeds, follower graph)
- heavy recommendation systems beyond simple activity suggestions
- multi-platform backend abstractions before the core flows ship

## Source-of-truth order for product questions

1. explicit product decisions recorded in `brain/decisions.md`
2. approved Figma screens and flows
3. existing code behavior
4. placeholder copy and data in mock files, which are never product requirements

## Near-term scope

Keep scope tight around scheduling value:
- creating and discovering events
- RSVP / attendance intent
- group coordination
- reminders and notifications

## Access rules (product-level)

These hold whether a table is served by the API, which enforces them in code, or read directly, which needs RLS:
- users can update only their own profile
- private group and event data is readable only by members
- attendance rows are writable only by the user they belong to
- notification rows are readable and updatable only by the target user
