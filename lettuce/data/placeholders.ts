/**
 * STATIC PLACEHOLDER DATA — Phase 1 only.
 *
 * Replace with repositories + API responses when backend exists.
 * Do not treat these as source of truth for real accounts or events.
 */

import type { ActivityCard, Event, Group, Notification, Poll, User } from '@/domain/entities';

/** PLACEHOLDER: fake current user for profile / headers */
export const PLACEHOLDER_USER: User = {
  id: 'user-placeholder-1',
  displayName: 'Joy Huang',
  handle: '@joyash',
};

/** PLACEHOLDER: home / groups cards */
export const PLACEHOLDER_EVENTS: Event[] = [
  {
    id: 'evt-1',
    groupId: 'grp-1',
    title: "Lana's Birthday Party",
    locationLabel: 'Texas Roadhouse',
    timeLabel: 'Sunday, 12/07 - 1pm',
    activityLabel: 'PARTY!!',
    lifecycle: 'scheduled',
  },
  {
    id: 'evt-2',
    groupId: 'grp-1',
    title: 'Picnic at the Arb',
    locationLabel: 'Nichols Arboretum',
    timeLabel: 'TBD',
    activityLabel: 'Picnicking',
    lifecycle: 'planning',
    activePollId: 'poll-1',
  },
];

/** PLACEHOLDER: groups tab */
export const PLACEHOLDER_GROUPS: Group[] = [
  { id: 'grp-1', name: 'Weekend Crew', memberIds: ['u1', 'u2', 'u3'] },
  { id: 'grp-2', name: 'Study Squad', memberIds: ['u1', 'u4'] },
];

/** PLACEHOLDER: polls tab / detail later */
export const PLACEHOLDER_POLLS: Poll[] = [
  {
    id: 'poll-1',
    eventId: 'evt-2',
    title: 'Picnic at the Arb — time vote',
    status: 'pending',
    options: [
      { id: 'o1', label: 'Sat 12/14 · 2pm', voteCount: 2 },
      { id: 'o2', label: 'Sun 12/15 · 11am', voteCount: 1 },
    ],
  },
];

/** PLACEHOLDER: notifications screen */
export const PLACEHOLDER_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    title: 'Poll updated',
    body: 'Someone voted on Picnic at the Arb.',
    createdAtLabel: '2h ago',
    read: false,
  },
  {
    id: 'n2',
    title: 'Friend request',
    body: 'Alex wants to connect.',
    createdAtLabel: 'Yesterday',
    read: true,
  },
];

/** PLACEHOLDER: activity tab rails */
export const PLACEHOLDER_ACTIVITY_POPULAR: ActivityCard[] = [
  { id: 'a1', title: 'Coffee walk', subtitle: 'Downtown', imageUrl: undefined },
  { id: 'a2', title: 'Museum afternoon', subtitle: 'UMMA', imageUrl: undefined },
];
