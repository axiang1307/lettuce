import type { Group, GroupCreate } from "@lettuce/api-types";
import { authendFetch } from "../api";

export type { Group, GroupCreate };

export const groupsRepo = {
    getGroups: async(): Promise<Group[]> => {
        const groups = await authendFetch(`/groups/me`);
        return groups as Group[];
    },
    create: async(group: GroupCreate): Promise<Group> => {
        const created = await authendFetch(`/groups`, {
            method: 'POST',
            body: JSON.stringify(group),
        });
        return created as Group;
    },
}
