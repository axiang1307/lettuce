import { Profile } from '../types/index';
import { getMe as dbGetMe } from '../db/profiles';

export const getMe = async (userId : string): Promise<Profile | null> => {
    //rls enforced by calling dbGetMe with only userId
    const data = await dbGetMe(userId);
    return data;
}