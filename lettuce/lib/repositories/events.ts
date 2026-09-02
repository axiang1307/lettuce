import { authendFetch } from "../api";

export type Event = {
    id: string,
    created_by: string,
    title: string,
    description: string | null,
    status: string,
    final_starts_at: string | null,
    final_ends_at: string | null,
    final_location: string | null,
    created_at: string,
    updated_at: string
}

export const eventsRepo = {
    getEvents: async(): Promise<Event[]> => {
        const events = await authendFetch(`/events/me`);
        return events as Event[];
    }
}