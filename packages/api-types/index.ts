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

export type Event = {
    id: string,
    created_by: string,
    title: string,
    description: string | null,
    status: string,
    final_starts_at: string | null,
    final_ends_at: string | null,
    final_location: string | null,
    created_at: string,
    updated_at: string
}