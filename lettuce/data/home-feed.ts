/**
 * Home feed + event detail source for the Home tab.
 * PLACEHOLDER: replace with API / repository when backend exists.
 */

import type { EventId } from '@/domain/entities';
import type { ImageSourcePropType } from 'react-native';

const imgProfile2 = require('@/assets/images/figma-home/home-avatar-3.png');
const imgProfile4 = require('@/assets/images/figma-home/home-avatar-5.png');
const imgProfile = require('@/assets/images/figma-home/home-avatar-default.png');
const imgProfile1 = require('@/assets/images/figma-home/home-avatar-1.png');
const imgProfile3 = require('@/assets/images/figma-home/home-avatar-2.png');
const imgProfile5 = require('@/assets/images/figma-home/home-avatar-6.png');

const imgCardImage = require('@/assets/images/figma-home/home-card-1.png');
const imgCardImage1 = require('@/assets/images/figma-home/home-card-2.png');
const imgCardImage2 = require('@/assets/images/figma-home/home-card-3.png');
const imgCardImage3 = require('@/assets/images/figma-home/home-card-4.png');
const imgCardImage4 = require('@/assets/images/figma-home/home-card-5.png');
const imgActivity1 = require('@/assets/images/figma-home/home-card-1.png');
const imgActivity2 = require('@/assets/images/figma-home/home-card-2.png');
const imgActivity3 = require('@/assets/images/figma-home/home-card-3.png');
const imgActivity4 = require('@/assets/images/figma-profile/profile-event-1.png');
const imgActivity5 = require('@/assets/images/figma-profile/profile-event-2.png');
const imgActivity6 = require('@/assets/images/figma-home/home-card-5.png');

export type EventFlowMode = 'detail' | 'calendar' | 'poll' | 'activity';
export type CalendarVisualState = 'base' | 'overlay' | 'selected';
export type PollVisualState = 'pending' | 'results' | 'calendarReady';

export type CalendarOption = {
  id: string;
  label: string;
  timeRange: string;
};

export type PollOption = {
  id: string;
  label: string;
  votes: number;
  isWinning?: boolean;
};

export type ActivityCard = {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: ImageSourcePropType;
};

export type HomeFeedEvent = {
  id: EventId;
  section: 'upcoming' | 'catchup';
  imageUrl: ImageSourcePropType;
  title: string;
  details: string[];
  statusLabel?: string;
  ctaLabel: string;
  participants: { avatars: ImageSourcePropType[]; moreCount?: number };
  /** PLACEHOLDER: extra copy on the event detail screen */
  groupName: string;
  description: string;
  /** PLACEHOLDER: bullet points / metadata rows */
  detailBullets: string[];
  calendar: {
    monthLabel: string;
    weekLabel: string;
    visualState: CalendarVisualState;
    options: CalendarOption[];
    selectedOptionId?: string;
  };
  poll: {
    title: string;
    visualState: PollVisualState;
    pendingQuestion: string;
    pendingOptions: PollOption[];
    completedQuestion: string;
    completedOptions: PollOption[];
  };
  activity: {
    popular: ActivityCard[];
    previous: ActivityCard[];
    saved: ActivityCard[];
  };
};

export const HOME_FEED_EVENTS: HomeFeedEvent[] = [
  {
    id: 'evt-1',
    section: 'upcoming',
    imageUrl: imgCardImage,
    title: "Lana's Birthday Party",
    details: ['Texas Roadhouse', 'Sunday, 12/07 - 1pm', 'PARTY!!'],
    ctaLabel: 'Remind',
    participants: { avatars: [imgProfile, imgProfile2, imgProfile4], moreCount: 2 },
    groupName: 'Weekend Crew',
    description:
      'Birthday dinner and celebration. Meet at Texas Roadhouse; cake and gifts after. PLACEHOLDER: RSVPs tracked in app later.',
    detailBullets: [
      'Location: Texas Roadhouse (Ann Arbor)',
      'Time: Sunday, Dec 7 · 1:00 PM',
      'Theme: PARTY!!',
      'PLACEHOLDER: 5 people going',
    ],
    calendar: {
      monthLabel: 'December 2025',
      weekLabel: 'Week of 11/30/25',
      visualState: 'base',
      options: [
        { id: 'c1', label: 'Tuesday, 12/02', timeRange: '10AM-12PM' },
        { id: 'c2', label: 'Thursday, 12/04', timeRange: '1-3PM' },
      ],
    },
    poll: {
      title: 'When is Birthday Party Happening?',
      visualState: 'pending',
      pendingQuestion: 'When is Birthday Party Happening?',
      pendingOptions: [
        { id: 'p1', label: 'Tuesday, 12/02 - 10AM', votes: 0 },
        { id: 'p2', label: 'Tuesday, 12/02 - 11:30AM', votes: 0 },
        { id: 'p3', label: 'Thursday, 12/04 - 1PM', votes: 0 },
      ],
      completedQuestion: 'Where should we celebrate?',
      completedOptions: [
        { id: 'cp1', label: 'Movie Night', votes: 1 },
        { id: 'cp2', label: 'Texas Roadhouse', votes: 2, isWinning: true },
        { id: 'cp3', label: 'Fancy Dinner', votes: 0 },
      ],
    },
    activity: {
      popular: [
        { id: 'a1', title: 'Bowling', subtitle: 'Revel + Roll', imageUrl: imgActivity1 },
        { id: 'a2', title: 'The Arb', subtitle: "Nichol's Arb", imageUrl: imgActivity2 },
      ],
      previous: [
        { id: 'a3', title: 'Sharetea Boba', subtitle: 'Sharetea', imageUrl: imgActivity4 },
        { id: 'a4', title: 'Bowling', subtitle: 'Revel + Roll', imageUrl: imgActivity1 },
      ],
      saved: [
        { id: 'a5', title: 'Afternoon Tea', subtitle: 'Tea Haus', imageUrl: imgActivity5 },
        { id: 'a6', title: 'Detroit Zoo', subtitle: 'Detroit Zoo', imageUrl: imgActivity6 },
      ],
    },
  },
  {
    id: 'evt-2',
    section: 'upcoming',
    imageUrl: imgCardImage1,
    title: 'Picnic at the Arb',
    details: ['Nichols Arboretum', 'TBD', 'Picnicking'],
    statusLabel: 'Planning',
    ctaLabel: 'Vote',
    participants: { avatars: [imgProfile2, imgProfile4], moreCount: 0 },
    groupName: 'Weekend Crew',
    description:
      'Casual picnic when the weather holds. Vote on a time slot in Polls (placeholder). PLACEHOLDER: poll integration later.',
    detailBullets: [
      'Location: Nichols Arboretum',
      'Time: TBD (vote open)',
      'Activity: Picnicking',
      'PLACEHOLDER: Active poll — Picnic at the Arb',
    ],
    calendar: {
      monthLabel: 'December 2025',
      weekLabel: 'Week of 11/30/25',
      visualState: 'overlay',
      options: [
        { id: 'c1', label: 'Tuesday, 12/02', timeRange: '10AM-12PM' },
        { id: 'c2', label: 'Thursday, 12/04', timeRange: '1-3PM' },
        { id: 'c3', label: 'Tuesday, 12/02', timeRange: '11:30AM-1PM' },
      ],
      selectedOptionId: 'c3',
    },
    poll: {
      title: 'When is Picnic Happening?',
      visualState: 'calendarReady',
      pendingQuestion: 'When is Picnic Happening?',
      pendingOptions: [
        { id: 'p1', label: 'Tuesday, 12/02 - 10AM', votes: 0 },
        { id: 'p2', label: 'Tuesday, 12/02 - 11:30AM', votes: 0 },
        { id: 'p3', label: 'Thursday, 12/04 - 1PM', votes: 0 },
      ],
      completedQuestion: 'What to do??',
      completedOptions: [
        { id: 'cp1', label: 'Movie Night', votes: 1 },
        { id: 'cp2', label: 'Picnic at the Arb', votes: 2, isWinning: true },
        { id: 'cp3', label: 'Fancy Dinner', votes: 0 },
      ],
    },
    activity: {
      popular: [
        { id: 'a1', title: 'Bowling', subtitle: 'Revel + Roll', imageUrl: imgActivity1 },
        { id: 'a2', title: 'The Arb', subtitle: "Nichol's Arb", imageUrl: imgActivity2 },
      ],
      previous: [
        { id: 'a3', title: 'Sharetea Boba', subtitle: 'Sharetea', imageUrl: imgActivity4 },
        { id: 'a4', title: 'Bowling', subtitle: 'Revel + Roll', imageUrl: imgActivity3 },
      ],
      saved: [
        { id: 'a5', title: 'Afternoon Tea', subtitle: 'Tea Haus', imageUrl: imgActivity5 },
        { id: 'a6', title: 'Detroit Zoo', subtitle: 'Detroit Zoo', imageUrl: imgActivity6 },
      ],
    },
  },
  {
    id: 'evt-3',
    section: 'catchup',
    imageUrl: imgCardImage2,
    title: 'The 3 Goons',
    details: ['Sunday, 11/01', 'With @Sydney @Will'],
    statusLabel: '1 mo. ago',
    ctaLabel: 'Schedule Meetup',
    participants: { avatars: [imgProfile2, imgProfile4], moreCount: 0 },
    groupName: 'The 3 Goons',
    description:
      'Last hangout was a month ago. PLACEHOLDER: tap Schedule Meetup to start a new plan from this thread.',
    detailBullets: ['Last met: Sunday, Nov 1', 'PLACEHOLDER: Sydney, Will, you'],
    calendar: {
      monthLabel: 'December 2025',
      weekLabel: 'Week of 11/30/25',
      visualState: 'base',
      options: [
        { id: 'c1', label: 'Tuesday, 12/02', timeRange: '10AM-12PM' },
        { id: 'c2', label: 'Thursday, 12/04', timeRange: '1-3PM' },
      ],
    },
    poll: {
      title: 'When should we meet?',
      visualState: 'pending',
      pendingQuestion: 'When should we meet?',
      pendingOptions: [
        { id: 'p1', label: 'Tuesday, 12/02 - 10AM', votes: 0 },
        { id: 'p2', label: 'Tuesday, 12/02 - 11:30AM', votes: 0 },
        { id: 'p3', label: 'Thursday, 12/04 - 1PM', votes: 0 },
      ],
      completedQuestion: 'What to do??',
      completedOptions: [
        { id: 'cp1', label: 'Movie Night', votes: 1 },
        { id: 'cp2', label: 'Picnic at the Arb', votes: 2, isWinning: true },
        { id: 'cp3', label: 'Fancy Dinner', votes: 0 },
      ],
    },
    activity: {
      popular: [
        { id: 'a1', title: 'Bowling', subtitle: 'Revel + Roll', imageUrl: imgActivity1 },
        { id: 'a2', title: 'The Arb', subtitle: "Nichol's Arb", imageUrl: imgActivity2 },
      ],
      previous: [
        { id: 'a3', title: 'Sharetea Boba', subtitle: 'Sharetea', imageUrl: imgActivity4 },
        { id: 'a4', title: 'Bowling', subtitle: 'Revel + Roll', imageUrl: imgActivity3 },
      ],
      saved: [
        { id: 'a5', title: 'Afternoon Tea', subtitle: 'Tea Haus', imageUrl: imgActivity5 },
        { id: 'a6', title: 'Detroit Zoo', subtitle: 'Detroit Zoo', imageUrl: imgActivity6 },
      ],
    },
  },
  {
    id: 'evt-4',
    section: 'catchup',
    imageUrl: imgCardImage3,
    title: 'Boba Date',
    details: ['Friday, 10/17', 'With @Angie'],
    statusLabel: '1.5 mo. ago',
    ctaLabel: 'Schedule Meetup',
    participants: { avatars: [imgProfile, imgProfile1], moreCount: 0 },
    groupName: 'Duo',
    description: 'Boba run downtown. PLACEHOLDER: suggest a new time from Activity ideas.',
    detailBullets: ['Last met: Friday, Oct 17', 'With: @Angie'],
    calendar: {
      monthLabel: 'December 2025',
      weekLabel: 'Week of 11/30/25',
      visualState: 'base',
      options: [
        { id: 'c1', label: 'Tuesday, 12/02', timeRange: '10AM-12PM' },
        { id: 'c2', label: 'Thursday, 12/04', timeRange: '1-3PM' },
      ],
    },
    poll: {
      title: 'When should we meet?',
      visualState: 'pending',
      pendingQuestion: 'When should we meet?',
      pendingOptions: [
        { id: 'p1', label: 'Tuesday, 12/02 - 10AM', votes: 0 },
        { id: 'p2', label: 'Tuesday, 12/02 - 11:30AM', votes: 0 },
        { id: 'p3', label: 'Thursday, 12/04 - 1PM', votes: 0 },
      ],
      completedQuestion: 'Where should we go?',
      completedOptions: [
        { id: 'cp1', label: 'Movie Night', votes: 1 },
        { id: 'cp2', label: 'Picnic at the Arb', votes: 2, isWinning: true },
        { id: 'cp3', label: 'Fancy Dinner', votes: 0 },
      ],
    },
    activity: {
      popular: [
        { id: 'a1', title: 'Bowling', subtitle: 'Revel + Roll', imageUrl: imgActivity1 },
        { id: 'a2', title: 'The Arb', subtitle: "Nichol's Arb", imageUrl: imgActivity2 },
      ],
      previous: [
        { id: 'a3', title: 'Sharetea Boba', subtitle: 'Sharetea', imageUrl: imgActivity4 },
        { id: 'a4', title: 'Bowling', subtitle: 'Revel + Roll', imageUrl: imgActivity3 },
      ],
      saved: [
        { id: 'a5', title: 'Afternoon Tea', subtitle: 'Tea Haus', imageUrl: imgActivity5 },
        { id: 'a6', title: 'Detroit Zoo', subtitle: 'Detroit Zoo', imageUrl: imgActivity6 },
      ],
    },
  },
  {
    id: 'evt-5',
    section: 'catchup',
    imageUrl: imgCardImage4,
    title: 'Tea Time',
    details: ['Sunday, 10/05', 'With @Emily @Jane'],
    statusLabel: '2 mo. ago',
    ctaLabel: 'Schedule Meetup',
    participants: { avatars: [imgProfile5, imgProfile1, imgProfile3], moreCount: 0 },
    groupName: 'Tea crew',
    description: 'Afternoon tea and catch-up. PLACEHOLDER: recurring series later.',
    detailBullets: ['Last met: Sunday, Oct 5', 'With: @Emily @Jane'],
    calendar: {
      monthLabel: 'December 2025',
      weekLabel: 'Week of 11/30/25',
      visualState: 'base',
      options: [
        { id: 'c1', label: 'Tuesday, 12/02', timeRange: '10AM-12PM' },
        { id: 'c2', label: 'Thursday, 12/04', timeRange: '1-3PM' },
      ],
    },
    poll: {
      title: 'When should we meet?',
      visualState: 'pending',
      pendingQuestion: 'When should we meet?',
      pendingOptions: [
        { id: 'p1', label: 'Tuesday, 12/02 - 10AM', votes: 0 },
        { id: 'p2', label: 'Tuesday, 12/02 - 11:30AM', votes: 0 },
        { id: 'p3', label: 'Thursday, 12/04 - 1PM', votes: 0 },
      ],
      completedQuestion: 'Where should we go?',
      completedOptions: [
        { id: 'cp1', label: 'Movie Night', votes: 1 },
        { id: 'cp2', label: 'Picnic at the Arb', votes: 2, isWinning: true },
        { id: 'cp3', label: 'Fancy Dinner', votes: 0 },
      ],
    },
    activity: {
      popular: [
        { id: 'a1', title: 'Bowling', subtitle: 'Revel + Roll', imageUrl: imgActivity1 },
        { id: 'a2', title: 'The Arb', subtitle: "Nichol's Arb", imageUrl: imgActivity2 },
      ],
      previous: [
        { id: 'a3', title: 'Sharetea Boba', subtitle: 'Sharetea', imageUrl: imgActivity4 },
        { id: 'a4', title: 'Bowling', subtitle: 'Revel + Roll', imageUrl: imgActivity3 },
      ],
      saved: [
        { id: 'a5', title: 'Afternoon Tea', subtitle: 'Tea Haus', imageUrl: imgActivity5 },
        { id: 'a6', title: 'Detroit Zoo', subtitle: 'Detroit Zoo', imageUrl: imgActivity6 },
      ],
    },
  },
];

export function getHomeEventById(id: string): HomeFeedEvent | undefined {
  return HOME_FEED_EVENTS.find((e) => e.id === id);
}

/** Case-insensitive search across title, details, status, group, description, bullets */
export function filterHomeEventsByQuery(events: HomeFeedEvent[], query: string): HomeFeedEvent[] {
  const q = query.trim().toLowerCase();
  if (!q) return events;
  return events.filter((e) => {
    const hay = [
      e.title,
      e.groupName,
      e.description,
      e.statusLabel ?? '',
      ...e.details,
      ...e.detailBullets,
    ]
      .join(' ')
      .toLowerCase();
    return hay.includes(q);
  });
}
