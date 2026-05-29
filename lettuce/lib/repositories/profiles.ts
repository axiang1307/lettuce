import { authendFetch } from "../api";
export type Profile = {
    username: string | null,
    full_name: string | null,
    avatar_url: string | null,
    id: string,
    created_at: string
}

export const profilesRepo = {
    getMe: async(): Promise<Profile> => {
        const profile = await authendFetch(`/profiles/me`);
        return profile as Profile;
    }
}


