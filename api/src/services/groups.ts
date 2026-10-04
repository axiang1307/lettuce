import type { Group, GroupCreate } from '@lettuce/api-types';
import { getGroups as dbGetGroups, postGroup as dbPostGroup } from '../db/groups';

export const getGroups = async(userId: string): Promise<Group[]> => {
    const data = await dbGetGroups(userId);
    return data;
}

export const postGroup = async(userId: string, group: GroupCreate): Promise<Group> => {
    const data = await dbPostGroup(userId, group);
    return data;
}
