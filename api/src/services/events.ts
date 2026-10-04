import type { Event, EventCreate } from '@lettuce/api-types';
import { getEvents as dbGetEvents, postEvent as dbPostEvent } from '../db/events';
import { isMember } from '../db/groups';
import { ForbiddenError } from '../lib/errors';

export const getEvents = async(userId: string): Promise<Event[]> => {
    const data = await dbGetEvents(userId);
    return data;
}

export const postEvent = async(userId: string, event: EventCreate): Promise<Event> => {
    // only members of the group may create events in it
    if (!(await isMember(event.group_id, userId))) {
        throw new ForbiddenError('You are not a member of this group');
    }
    const data = await dbPostEvent(userId, event);
    return data;
}
