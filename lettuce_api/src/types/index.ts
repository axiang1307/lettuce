export type Profile = {
    username: string | null,
    full_name: string | null,
    avatar_url: string | null,
    id: string,
    created_at: Date
}

export type ProfileUpdate = {
    username: string | null,
    full_name: string | null,
    avatar_url: string | null
}