import pool from '../lib/db';
import type { BusyBlock, BusyBlockCreate, BusyBlockUpdate, CalendarSource } from '@lettuce/api-types';

export const getBusyBlocks = async(userId: string, from: string, to: string): Promise<BusyBlock[]> => {

    const result = await pool.query(
        `
        SELECT b.*
        FROM busy_blocks b
        JOIN calendars c ON b.calendar_id = c.id
        WHERE c.user_id = $1
            AND (
                (b.repeat_days IS NULL
                AND b.start_date BETWEEN $2 AND $3)
                    OR
                (b.repeat_days IS NOT NULL
                AND b.start_date <= $3
                AND (b.end_date IS NULL OR b.end_date >= $2))
            )
        ORDER BY b.start_date, b.start_time 
        `, [userId, from, to]
        // join the tables on calendar id and logic to select blocks 
    );  

    return result.rows;
}

export const postBusyBlock = async(calendarId: string, block: BusyBlockCreate): Promise<BusyBlock> => {
    // single query to add a row to the busy block table
    // return the row
    const result = await pool.query(
        `
        INSERT INTO busy_blocks (calendar_id, start_date, end_date, start_time, end_time, repeat_days, timezone)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
        `, [calendarId, block.start_date, block.end_date ?? null, block.start_time, block.end_time, block.repeat_days ?? null, block.timezone]
    );
    return result.rows[0];
}

// One of the user's blocks plus its calendar's source; null if it doesn't exist or belongs to someone else.
export const getOwnedBusyBlock = async(userId: string, blockId: string): Promise<(BusyBlock & { source: CalendarSource }) | null> => {
    const result = await pool.query(
        `SELECT b.*, c.source
         FROM busy_blocks b
         JOIN calendars c ON c.id = b.calendar_id
         WHERE b.id = $1 AND c.user_id = $2`,
        [blockId, userId]
    );
    return result.rows[0] ?? null;
}

export const patchBusyBlock = async(userId: string, blockId: string, changes: BusyBlockUpdate): Promise<BusyBlock | null> => {
    // Column names come from BusyBlockUpdate's keys, which the controller builds from an allow-list;
    // values are always placeholders. $1 and $2 are the block and the caller, so fields start at $3.
    const fields = Object.entries(changes).filter(([, value]) => value !== undefined);
    const setClause = fields.map(([key], index) => `${key} = $${index + 3}`).join(', ');

    // UPDATE ... FROM joins calendars so only the caller's block can match; zero rows means none did.
    const result = await pool.query(
        `UPDATE busy_blocks b
         SET ${setClause}
         FROM calendars c
         WHERE c.id = b.calendar_id AND b.id = $1 AND c.user_id = $2
         RETURNING b.*`,
        [blockId, userId, ...fields.map(([, value]) => value)]
    );
    return result.rows[0] ?? null;
}

export const deleteBusyBlock = async(userId: string, blockId: string): Promise<boolean> => {
    // DELETE ... USING is DELETE's form of a join: the same ownership scoping as the update.
    const result = await pool.query(
        `DELETE FROM busy_blocks b
         USING calendars c
         WHERE c.id = b.calendar_id AND b.id = $1 AND c.user_id = $2`,
        [blockId, userId]
    );
    return (result.rowCount ?? 0) > 0;
}
