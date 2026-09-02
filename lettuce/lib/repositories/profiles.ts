import { authendFetch } from "../api";

export type Profile = {
    id: string,
    username: string | null,
    full_name: string | null,
    avatar_url: string | null,
    created_at: string
}

export type ProfileUpdate = {
    username?: string | null,
    full_name?: string | null,
    avatar_url?: string | null
}

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


