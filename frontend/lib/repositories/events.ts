import type { Event, EventCreate, EventStatus } from "@lettuce/api-types";
import { authendFetch } from "../api";

export type { Event, EventCreate, EventStatus };

export const eventsRepo = {
    getEvents: async(): Promise<Event[]> => {
        const events = await authendFetch(`/events/me`);
        return events as Event[];
    },
    create: async(event: EventCreate): Promise<Event> => {
        const created = await authendFetch(`/events`, {
            method: 'POST',
            body: JSON.stringify(event),
        });
        return created as Event;
    },
}
