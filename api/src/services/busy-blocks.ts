import type { BusyBlock, BusyBlockCreate, BusyBlockUpdate } from '@lettuce/api-types';
import {
    getBusyBlocks as dbGetBusyBlocks,
    postBusyBlock as dbPostBusyBlock,
    patchBusyBlock as dbPatchBusyBlock,
    deleteBusyBlock as dbDeleteBusyBlock,
} from '../db/busy-blocks';
import { getOrCreateCalendar } from '../db/calendars';

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
    throw new Error('Not implemented');
}

export const deleteBusyBlock = async(userId: string, blockId: string): Promise<void> => {
    throw new Error('Not implemented');
}
