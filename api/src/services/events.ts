import type { Event } from '@lettuce/api-types';
import { getEvents as dbGetEvents } from '../db/events';

export const getEvents = async(userId: string): Promise<Event[] | null> => {
    const data = await dbGetEvents(userId);
    return data;
}