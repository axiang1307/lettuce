/**
 * Home feed + event detail source for the Home tab.
 * PLACEHOLDER: replace with API / repository when backend exists.
 */

import type { EventId } from '@/domain/entities';

const imgProfile2 = 'https://www.figma.com/api/mcp/asset/294a0030-7ae0-4bdd-ad95-c18f46b6134d';
const imgProfile4 = 'https://www.figma.com/api/mcp/asset/760d2f16-ead7-4e62-8017-273cf0eb4bf1';
const imgProfile = 'https://www.figma.com/api/mcp/asset/01b3f278-3258-4e2e-8892-7bb473cee84b';
const imgProfile1 = 'https://www.figma.com/api/mcp/asset/294a0030-7ae0-4bdd-ad95-c18f46b6134d';
const imgProfile3 = 'https://www.figma.com/api/mcp/asset/c69a1979-3217-43b3-869b-e4009cdb6e01';
const imgProfile5 = 'https://www.figma.com/api/mcp/asset/b9a95cba-39be-43ce-bad6-86f3cd9c6c11';

const imgCardImage = 'https://www.figma.com/api/mcp/asset/f938f660-0338-4841-a352-35c99be2b4ff';
const imgCardImage1 = 'https://www.figma.com/api/mcp/asset/6df2dfd0-9302-4a59-960e-f18d4f797e45';
const imgCardImage2 = 'https://www.figma.com/api/mcp/asset/80a5723a-b863-4676-9b39-fca1a9167dd5';
const imgCardImage3 = 'https://www.figma.com/api/mcp/asset/d8b0be7e-8ed8-4d01-9b17-a098e033ca72';
const imgCardImage4 = 'https://www.figma.com/api/mcp/asset/ec69c636-25ce-474e-b5fa-4041c93c88b3';

export type HomeFeedEvent = {
  id: EventId;
  section: 'upcoming' | 'catchup';
  imageUrl: string;
  title: string;
  details: string[];
  statusLabel?: string;
  ctaLabel: string;
  participants: { avatars: string[]; moreCount?: number };
  /** PLACEHOLDER: extra copy on the event detail screen */
  groupName: string;
  description: string;
  /** PLACEHOLDER: bullet points / metadata rows */
  detailBullets: string[];
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
