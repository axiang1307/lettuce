import { supabase } from "./supabase";

//attatches auth token to every request so we dont have to pass it manually each time
export const authendFetch = async (url: string, init: RequestInit = {}) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        throw new Error('Unauthorized');
    }
    const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}${url}`, {
        ...init,
        headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
            ...init.headers,
        }
    });
    if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? `Request failed (${res.status})`);
    }
    return res.status === 204 ? null : res.json();
}