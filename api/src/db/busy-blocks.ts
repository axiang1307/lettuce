import pool from '../lib/db';
import type { BusyBlock, BusyBlockCreate, BusyBlockUpdate } from '@lettuce/api-types';

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

export const patchBusyBlock = async(userId: string, blockId: string, changes: BusyBlockUpdate): Promise<BusyBlock | null> => {
    throw new Error('Not implemented');
}

export const deleteBusyBlock = async(userId: string, blockId: string): Promise<boolean> => {
    throw new Error('Not implemented');
}
