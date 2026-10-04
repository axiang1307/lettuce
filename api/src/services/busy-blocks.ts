import type { BusyBlock, BusyBlockCreate, BusyBlockUpdate } from '@lettuce/api-types';
import {
    getBusyBlocks as dbGetBusyBlocks,
    postBusyBlock as dbPostBusyBlock,
    patchBusyBlock as dbPatchBusyBlock,
    deleteBusyBlock as dbDeleteBusyBlock,
    getOwnedBusyBlock,
} from '../db/busy-blocks';
import { getOrCreateCalendar } from '../db/calendars';
import { ForbiddenError, NotFoundError, ValidationError } from '../lib/errors';

// The caller's block, if they may change it: it must be theirs (otherwise 404, so other users' block ids
// reveal nothing) and on their manual calendar (synced blocks belong to Google; the next sync would undo edits).
const getEditableBlock = async(userId: string, blockId: string) => {
    const block = await getOwnedBusyBlock(userId, blockId);
    if (!block) {
        throw new NotFoundError('Busy block not found');
    }
    if (block.source !== 'manual') {
        throw new ForbiddenError('Synced blocks are managed by their calendar and cannot be changed here');
    }
    return block;
}

// Rules that span fields, checked on the block as it will be after a change. A PATCH may send only one
// side of a pair (just end_time), so these need the stored row; the CHECK constraints repeat them.
const checkBlockRules = (block: Pick<BusyBlock, 'start_date' | 'end_date' | 'start_time' | 'end_time' | 'repeat_days'>) => {
    if (block.end_time <= block.start_time) {
        throw new ValidationError('end_time must be after start_time');
    }
    if (block.repeat_days === null && block.end_date !== null) {
        throw new ValidationError('end_date is only allowed on weekly blocks (with repeat_days); send end_date: null too');
    }
    if (block.end_date !== null && block.end_date < block.start_date) {
        throw new ValidationError('end_date cannot be before start_date');
    }
}

export const getBusyBlocks = async(userId: string, from: string, to: string): Promise<BusyBlock[]> => {
    const result = await dbGetBusyBlocks(userId, from, to);
    return result;
}

export const postBusyBlock = async(userId: string, block: BusyBlockCreate): Promise<BusyBlock> => {
    const cal = await getOrCreateCalendar(userId, 'manual');
    const bb = await dbPostBusyBlock(cal.id, block);
    return bb;
}

export const patchBusyBlock = async(userId: string, blockId: string, changes: BusyBlockUpdate): Promise<BusyBlock> => {
    const current = await getEditableBlock(userId, blockId);
    checkBlockRules({ ...current, ...changes });
    const updated = await dbPatchBusyBlock(userId, blockId, changes);
    // Only null if the block was deleted between the check and the update
    if (!updated) {
        throw new NotFoundError('Busy block not found');
    }
    return updated;
}

export const deleteBusyBlock = async(userId: string, blockId: string): Promise<void> => {
    await getEditableBlock(userId, blockId);
    const deleted = await dbDeleteBusyBlock(userId, blockId);
    if (!deleted) {
        throw new NotFoundError('Busy block not found');
    }
}
