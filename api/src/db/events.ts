import pool from '../lib/db';
import type { Event, EventCreate } from '@lettuce/api-types';

export const getEvents = async(userId: string): Promise<Event[]> => {
    // events the caller participates in; no matches gives rows = []
    const result = await pool.query(
        `SELECT e.*
         FROM events e
         JOIN event_participants ep ON ep.event_id = e.id
         WHERE ep.user_id = $1
         ORDER BY e.created_at DESC`,
        [userId]
    );
    return result.rows;
}

export const postEvent = async(userId: string, event: EventCreate): Promise<Event> => {
    // Both inserts run on one connection inside a transaction: either the event and the
    // creator's participant row are both saved, or neither is.
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // id, status, created_at and updated_at are filled by column defaults
        const eventResult = await client.query(
            `INSERT INTO events (created_by, group_id, title, description, final_location)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [userId, event.group_id, event.title, event.description ?? null, event.final_location ?? null]
        );
        const created: Event = eventResult.rows[0];

        // the creator is going to their own event, so RSVP 'yes' rather than the 'pending' default
        await client.query(
            `INSERT INTO event_participants (event_id, user_id, rsvp_status)
             VALUES ($1, $2, 'yes')`,
            [created.id, userId]
        );

        await client.query('COMMIT');
        return created;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}