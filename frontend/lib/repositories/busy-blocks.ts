import type { BusyBlock, BusyBlockCreate, BusyBlockUpdate } from "@lettuce/api-types";
import { authendFetch } from "../api";

export type { BusyBlock, BusyBlockCreate, BusyBlockUpdate };

export const busyBlocksRepo = {
    // from / to are YYYY-MM-DD, inclusive. Weekly blocks come back as rules, not dated occurrences.
    getMine: async(from: string, to: string): Promise<BusyBlock[]> => {
        const blocks = await authendFetch(`/busy-blocks/me?from=${from}&to=${to}`);
        return blocks as BusyBlock[];
    },
    create: async(block: BusyBlockCreate): Promise<BusyBlock> => {
        const created = await authendFetch(`/busy-blocks`, {
            method: 'POST',
            body: JSON.stringify(block),
        });
        return created as BusyBlock;
    },
    update: async(id: string, changes: BusyBlockUpdate): Promise<BusyBlock> => {
        const updated = await authendFetch(`/busy-blocks/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(changes),
        });
        return updated as BusyBlock;
    },
    // 204: nothing comes back
    remove: async(id: string): Promise<void> => {
        await authendFetch(`/busy-blocks/${id}`, { method: 'DELETE' });
    },
}
