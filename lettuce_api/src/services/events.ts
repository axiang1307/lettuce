import { Event } from '../types/index';
import { getEvents as dbGetEvents } from '../db/events';

export const getEvents = async(userId: string): Promise<Event[] | null> => {
    const data = await dbGetEvents(userId);
    return data;
}