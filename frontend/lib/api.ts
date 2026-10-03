import Constants from "expo-constants";
import { supabase } from "./supabase";

// "localhost" on a phone / Android emulator is the device itself, not the dev machine.
// In dev, swap it for the host Metro is served from so requests reach the local API.
const resolveApiUrl = () => {
    const url = process.env.EXPO_PUBLIC_API_URL ?? '';
    const devHost = Constants.expoConfig?.hostUri?.split(':')[0];
    if (__DEV__ && devHost) {
        return url.replace(/\/\/(localhost|127\.0\.0\.1)(?=[:/]|$)/, `//${devHost}`);
    }
    return url;
};
const API_URL = resolveApiUrl();

//attatches auth token to every request so we dont have to pass it manually each time
export const authendFetch = async (url: string, init: RequestInit = {}) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        throw new Error('Unauthorized');
    }
    const res = await fetch(`${API_URL}${url}`, {
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