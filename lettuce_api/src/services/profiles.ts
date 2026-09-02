import { Profile, ProfileUpdate } from '../types/index';
import { getMe as dbGetMe, patchMe as dbPatchMe } from '../db/profiles';

export const getMe = async (userId : string): Promise<Profile | null> => {
    //rls enforced by calling dbGetMe with only userId
    const data = await dbGetMe(userId);
    return data;
}

export const patchMe = async (userId: string, profile: ProfileUpdate): Promise<Profile | null> => {
    //rls enforced by calling dbPatchMe with only userId
    const data = await dbPatchMe(userId, profile);
    return data;
}