import type { Event } from "@lettuce/api-types";
import { authendFetch } from "../api";

export type { Event };

export const eventsRepo = {
    getEvents: async(): Promise<Event[]> => {
        const events = await authendFetch(`/events/me`);
        return events as Event[];
    }
}
