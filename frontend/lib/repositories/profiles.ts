import type { Profile, ProfileUpdate } from "@lettuce/api-types";
import { authendFetch } from "../api";

export type { Profile, ProfileUpdate };

export const profilesRepo = {
    getMe: async(): Promise<Profile> => {
        const profile = await authendFetch(`/profiles/me`);
        return profile as Profile;
    },
    patchMe: async(update: ProfileUpdate): Promise<Profile> => {
        const profile = await authendFetch(`/profiles/me`, {
            method: 'PATCH',
            body: JSON.stringify(update),
        });
        return profile as Profile;
    },
}
