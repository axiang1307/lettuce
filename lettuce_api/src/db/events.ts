import pool from '../lib/db';
import { Event } from '../types/index';

export const getEvents = async(userId: string): Promise<Event[]> => {
    const participantResult = await pool.query(
        'SELECT event_id FROM event_participants WHERE user_id = $1', [userId]
    );

    const eventIds = participantResult.rows.map(row => row.event_id);
    if (eventIds.length === 0) {
        return [];
    }

    const eventsResult = await pool.query(
        'SELECT * FROM events WHERE id = ANY($1)', [eventIds]
    );

    return eventsResult.rows;
}