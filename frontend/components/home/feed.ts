import { HOME_FEED_EVENTS, type HomeFeedEvent } from '@/data/home-feed';
import type { Event, EventStatus } from '@/lib/repositories/events';
import type { ImageSourcePropType } from 'react-native';

import { cardImageFor } from './card-images';

// What an EventCard on the home feed needs, derived from a real Event.
export type FeedCard = {
  id: string;
  section: 'upcoming' | 'catchup';
  imageUrl: ImageSourcePropType;
  title: string;
  details: string[];
  statusLabel: string;
  ctaLabel: string;
  /** not shown on the card; only searched */
  description: string;
};

const STATUS_LABEL: Record<EventStatus, string> = {
  planning: 'Planning',
  upcoming: 'Upcoming',
  in_progress: 'Happening now',
  done: 'Done',
};

// CTAs are placeholders until polls and reminders exist.
const CTA_LABEL: Record<EventStatus, string> = {
  planning: 'Vote',
  upcoming: 'Remind',
  in_progress: 'Remind',
  done: 'Schedule Meetup',
};

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// "Sunday, 12/07 - 1pm", matching the card copy from the designs
export function formatEventTime(iso: string): string {
  const d = new Date(iso);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hour12 = d.getHours() % 12 || 12;
  const minutes = d.getMinutes() === 0 ? '' : `:${String(d.getMinutes()).padStart(2, '0')}`;
  const suffix = d.getHours() < 12 ? 'am' : 'pm';
  return `${WEEKDAYS[d.getDay()]}, ${month}/${day} - ${hour12}${minutes}${suffix}`;
}

export function toFeedCard(event: Event, groupName: string | undefined): FeedCard {
  return {
    id: event.id,
    section: event.status === 'done' ? 'catchup' : 'upcoming',
    imageUrl: cardImageFor(event.id),
    title: event.title,
    details: [
      groupName ?? 'Group',
      event.final_location ?? 'Location TBD',
      event.final_starts_at ? formatEventTime(event.final_starts_at) : 'Time TBD',
    ],
    statusLabel: STATUS_LABEL[event.status],
    ctaLabel: CTA_LABEL[event.status],
    description: event.description ?? '',
  };
}

// Scheduled events first, soonest first; events without a time keep the API's order after them.
export function sortBySoonest(events: Event[]): Event[] {
  const timed = events
    .filter((e) => e.final_starts_at)
    .sort((a, b) => Date.parse(a.final_starts_at!) - Date.parse(b.final_starts_at!));
  return [...timed, ...events.filter((e) => !e.final_starts_at)];
}

/** Case-insensitive search across title, details, status and description */
export function filterFeedCards(cards: FeedCard[], query: string): FeedCard[] {
  const q = query.trim().toLowerCase();
  if (!q) return cards;
  return cards.filter((c) =>
    [c.title, c.statusLabel, c.description, ...c.details].join(' ').toLowerCase().includes(q)
  );
}

// The event detail screen and its calendar / poll / activity panels only know the mock
// HomeFeedEvent shape. Until polls and GET /events/:id exist, a real event borrows the first
// mock event's panels, participants and activities, with its own title, group, place and time.
export function toDetailEvent(event: Event, groupName: string | undefined): HomeFeedEvent {
  const template = HOME_FEED_EVENTS[0];
  const card = toFeedCard(event, groupName);
  const question = `When is ${event.title} happening?`;
  return {
    ...template,
    id: event.id,
    section: card.section,
    imageUrl: card.imageUrl,
    title: event.title,
    details: card.details,
    statusLabel: card.statusLabel,
    ctaLabel: card.ctaLabel,
    groupName: groupName ?? 'Group',
    description: event.description ?? '',
    detailBullets: card.details,
    poll: { ...template.poll, title: question, pendingQuestion: question },
  };
}
