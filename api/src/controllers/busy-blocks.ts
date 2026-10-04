import { Request, Response } from "express";
import {
    getBusyBlocks as serviceGetBusyBlocks,
    postBusyBlock as servicePostBusyBlock,
    patchBusyBlock as servicePatchBusyBlock,
    deleteBusyBlock as serviceDeleteBusyBlock,
} from '../services/busy-blocks';
import type { BusyBlockCreate, BusyBlockUpdate } from '@lettuce/api-types';
import { ForbiddenError, NotFoundError, ValidationError } from '../lib/errors';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Maps what a PATCH or DELETE can throw to a response. CHECK violations (23514) mean the merged block broke
// a rule the service missed, so they're the client's fault (400), not the server's.
const sendBlockError = (res: Response, error: any) => {
    if (error instanceof NotFoundError) {
        return res.status(404).json({ error: error.message });
    }
    if (error instanceof ForbiddenError) {
        return res.status(403).json({ error: error.message });
    }
    if (error instanceof ValidationError || error?.code === '23514') {
        return res.status(400).json({ error: error instanceof ValidationError ? error.message : 'Busy block breaks a time or date rule' });
    }
    console.log(error);
    return res.status(500).json({ error: 'Internal Server Error' });
};

// A real calendar date written as YYYY-MM-DD. The shape check alone would let 2026-02-30 through;
// JS Date rolls that over to March 2, so converting back and comparing catches dates that don't exist.
const isDate = (value: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

// A 24-hour clock time, HH:MM or HH:MM:SS. Returned as HH:MM:SS so two times compare correctly as
// strings ("10:00" vs "10:00:00" would otherwise compare as different).
const toTime = (value: unknown): string | null => {
    if (typeof value !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(value)) return null;
    return value.length === 5 ? `${value}:00` : value;
};

// An IANA time zone name like America/New_York. Intl throws a RangeError for names it doesn't know.
const isTimeZone = (value: string) => {
    try {
        new Intl.DateTimeFormat('en-US', { timeZone: value });
        return true;
    } catch {
        return false;
    }
};

// GET /busy-blocks/me?from=YYYY-MM-DD&to=YYYY-MM-DD
// The caller's blocks across all their calendars that touch the date range.
export const getBusyBlocks = async (req: Request, res: Response) => {
    
    // sanity check
    if (!req.user) {
        return res.status(401).json(
            {
                error: 'Unauthorized User'
            }
        );
    }
    const {from,to} = req.query;
    if (typeof from !== 'string' || typeof to !== 'string'){
        return res.status(400).json({ error: 'from and to are required (YYYY-MM-DD)'})
    }
    if (!isDate(from) || !isDate(to)) {
        return res.status(400).json({ error: 'from and to must be real dates in YYYY-MM-DD format' });
    }
    if (from > to){
        return res.status(400).json({ error: 'from cannot be greater than to' });
    }
    try{
        const data = await serviceGetBusyBlocks(req.user.id, from, to);
        return res.status(200).json(data);
    } catch(error) {
        console.log(error);
        return res.status(500).json(
            {
                error: 'Internal Server Error'
            }
        );
    }
    
}

// POST /busy-blocks  body: BusyBlockCreate
// Adds a block to the caller's manual calendar (created on first use). 201 with the new block.
export const postBusyBlock = async (req: Request, res: Response) => {
    // sanity check
    if (!req.user) {
        return res.status(401).json(
            {
                error: 'Unauthorized User'
            }
        );
    }
    // validate the body input
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'Request body cannot be empty' });
    }

    const { start_date, end_date, start_time, end_time, repeat_days, timezone } = req.body;

    if (typeof start_date !== 'string' || !isDate(start_date)) {
        return res.status(400).json({ error: 'start_date is required and must be a real date in YYYY-MM-DD format' });
    }

    const startTime = toTime(start_time);
    const endTime = toTime(end_time);
    if (!startTime || !endTime) {
        return res.status(400).json({ error: 'start_time and end_time are required as 24-hour HH:MM' });
    }
    // No overnight blocks (matches busy_blocks_time_order_check)
    if (endTime <= startTime) {
        return res.status(400).json({ error: 'end_time must be after start_time' });
    }

    // Absent or null means a one-off block. Otherwise a non-empty list of weekdays, 0 = Sunday ... 6 = Saturday.
    let days: number[] | null = null;
    if (repeat_days !== undefined && repeat_days !== null) {
        if (!Array.isArray(repeat_days) || repeat_days.length === 0
            || !repeat_days.every((d) => Number.isInteger(d) && d >= 0 && d <= 6)) {
            return res.status(400).json({ error: 'repeat_days must be null or a non-empty array of weekdays 0-6' });
        }
        // Drop duplicates and sort so [3, 1, 3] is stored as {1,3}
        days = [...new Set<number>(repeat_days)].sort((a, b) => a - b);
    }

    // Absent or null means a weekly block repeats forever; one-off blocks can't have one.
    let endDate: string | null = null;
    if (end_date !== undefined && end_date !== null) {
        if (days === null) {
            return res.status(400).json({ error: 'end_date is only allowed on weekly blocks (with repeat_days)' });
        }
        if (typeof end_date !== 'string' || !isDate(end_date)) {
            return res.status(400).json({ error: 'end_date must be a real date in YYYY-MM-DD format' });
        }
        if (end_date < start_date) {
            return res.status(400).json({ error: 'end_date cannot be before start_date' });
        }
        endDate = end_date;
    }

    if (typeof timezone !== 'string' || !isTimeZone(timezone)) {
        return res.status(400).json({ error: 'timezone is required and must be an IANA time zone like America/New_York' });
    }

    // Build the insert from known fields only; any other keys in the body (calendar_id, id, ...) are ignored.
    const block: BusyBlockCreate = {
        start_date,
        end_date: endDate,
        start_time: startTime,
        end_time: endTime,
        repeat_days: days,
        timezone,
    };

    try{
        const result = await servicePostBusyBlock(req.user.id, block);
        return res.status(201).json(result);
    }catch(error){
        // no custom errs
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error'});
    }
}

// PATCH /busy-blocks/:id  body: BusyBlockUpdate
// Edits one of the caller's manual blocks. 200 with the updated block.
// This checks each sent field on its own; rules that compare two fields (end after start, end_date only on
// weekly blocks) need the stored row when only one side is sent, so the service checks those.
export const patchBusyBlock = async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized User' });
    }
    const { id } = req.params;
    if (typeof id !== 'string' || !UUID.test(id)) {
        return res.status(400).json({ error: 'id must be a UUID' });
    }
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'Request body cannot be empty' });
    }

    // Build the update from known fields that are present; any other keys are ignored.
    const changes: BusyBlockUpdate = {};

    if ('start_date' in req.body) {
        const { start_date } = req.body;
        if (typeof start_date !== 'string' || !isDate(start_date)) {
            return res.status(400).json({ error: 'start_date must be a real date in YYYY-MM-DD format' });
        }
        changes.start_date = start_date;
    }

    if ('end_date' in req.body) {
        const { end_date } = req.body;
        if (end_date !== null && (typeof end_date !== 'string' || !isDate(end_date))) {
            return res.status(400).json({ error: 'end_date must be null or a real date in YYYY-MM-DD format' });
        }
        changes.end_date = end_date;
    }

    for (const key of ['start_time', 'end_time'] as const) {
        if (key in req.body) {
            const time = toTime(req.body[key]);
            if (!time) {
                return res.status(400).json({ error: `${key} must be a 24-hour HH:MM time` });
            }
            changes[key] = time;
        }
    }

    if ('repeat_days' in req.body) {
        const { repeat_days } = req.body;
        if (repeat_days === null) {
            changes.repeat_days = null;
        } else if (!Array.isArray(repeat_days) || repeat_days.length === 0
            || !repeat_days.every((d) => Number.isInteger(d) && d >= 0 && d <= 6)) {
            return res.status(400).json({ error: 'repeat_days must be null or a non-empty array of weekdays 0-6' });
        } else {
            changes.repeat_days = [...new Set<number>(repeat_days)].sort((a, b) => a - b);
        }
    }

    if ('timezone' in req.body) {
        const { timezone } = req.body;
        if (typeof timezone !== 'string' || !isTimeZone(timezone)) {
            return res.status(400).json({ error: 'timezone must be an IANA time zone like America/New_York' });
        }
        changes.timezone = timezone;
    }

    if (Object.keys(changes).length === 0) {
        return res.status(400).json({ error: 'No valid fields to update' });
    }

    try {
        const data = await servicePatchBusyBlock(req.user.id, id, changes);
        return res.status(200).json(data);
    } catch (error) {
        return sendBlockError(res, error);
    }
}

// DELETE /busy-blocks/:id
// Removes one of the caller's manual blocks. 204 with no body.
export const deleteBusyBlock = async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized User' });
    }
    const { id } = req.params;
    if (typeof id !== 'string' || !UUID.test(id)) {
        return res.status(400).json({ error: 'id must be a UUID' });
    }

    try {
        await serviceDeleteBusyBlock(req.user.id, id);
        return res.status(204).end();
    } catch (error) {
        return sendBlockError(res, error);
    }
}
