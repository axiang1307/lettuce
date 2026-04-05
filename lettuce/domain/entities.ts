/**
 * Core domain entities for Lettuce (scheduling / hangouts).
 *
 * PLACEHOLDER / PHASE 1: These types describe the intended product model.
 * No persistence, API, or validation is wired yet — use static mock data only.
 */

/** PLACEHOLDER: real users will come from auth + profile service later */
export type UserId = string;

/** PLACEHOLDER: group membership / roles TBD */
export type GroupId = string;

/** PLACEHOLDER: event lifecycle will be enforced by app logic later */
export type EventId = string;

/** PLACEHOLDER: poll attached to planning/voting flow */
export type PollId = string;

/** PLACEHOLDER: notification kinds for inbox + push later */
export type NotificationId = string;

export type EventLifecycle =
  | 'planning'
  | 'voting'
  | 'scheduled'
  | 'completed'
  | 'cancelled';

/**
 * PLACEHOLDER: minimal user shape for UI lists and headers.
 */
export type User = {
  id: UserId;
  displayName: string;
  /** PLACEHOLDER: e.g. @handle */
  handle: string;
  /** PLACEHOLDER: avatar URL or local asset key */
  avatarUrl?: string;
};

/**
 * PLACEHOLDER: a circle of people planning together.
 */
export type Group = {
  id: GroupId;
  name: string;
  memberIds: UserId[];
};

/**
 * PLACEHOLDER: a hangout / meetup instance.
 */
export type Event = {
  id: EventId;
  groupId: GroupId;
  title: string;
  /** PLACEHOLDER: venue or area */
  locationLabel: string;
  /** PLACEHOLDER: ISO string or human "TBD" */
  timeLabel: string;
  /** PLACEHOLDER: short activity tag */
  activityLabel: string;
  lifecycle: EventLifecycle;
  /** PLACEHOLDER: link to active poll when voting */
  activePollId?: PollId;
};

/**
 * PLACEHOLDER: voting options are usually time slots; kept generic for static UI.
 */
export type PollOption = {
  id: string;
  label: string;
  /** PLACEHOLDER: vote count for results UI */
  voteCount?: number;
};

export type PollStatus = 'pending' | 'completed';

/**
 * PLACEHOLDER: poll for a single event (time, place, etc.).
 */
export type Poll = {
  id: PollId;
  eventId: EventId;
  title: string;
  status: PollStatus;
  options: PollOption[];
};

/**
 * PLACEHOLDER: inbox row / push payload sketch.
 */
export type Notification = {
  id: NotificationId;
  title: string;
  body: string;
  /** PLACEHOLDER: ISO or display string */
  createdAtLabel: string;
  read: boolean;
};

/**
 * PLACEHOLDER: discover / saved rails on Activity tab.
 */
export type ActivityCategory = 'popular' | 'previously' | 'saved';

export type ActivityCard = {
  id: string;
  title: string;
  subtitle: string;
  /** PLACEHOLDER: image URL for Event Card style */
  imageUrl?: string;
};
