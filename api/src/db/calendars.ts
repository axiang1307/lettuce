import pool from '../lib/db';
import type { Calendar, CalendarSource } from '@lettuce/api-types';

// Shared by the busy-blocks service: the caller's calendar for a source, created on first use.
export const getOrCreateCalendar = async(userId: string, source: CalendarSource): Promise<Calendar> => {
    // check if its there, if not insert a new row, cant do this because of race conditions

    // so instead insert first then select

    await pool.query(
        `
        INSERT INTO calendars (user_id, source)
        VALUES ($1, $2)
        ON CONFLICT (user_id, source) DO NOTHING
        `, [userId, source]
    );
    // need to specify conflict specifically on those two, a calendar of this source for this user
    // otherwise its ambiguous what the conflict is checking for and could do nothing on other unique keys

    // either creates a new calendar for this user of this source or leaves nothing
    // can now access it safely whether it was created or not

    const cal = await pool.query(
        `
        SELECT * 
        FROM calendars
        WHERE user_id = $1
        AND source = $2
        `, [userId, source]
    );
    
    return cal.rows[0];
}
