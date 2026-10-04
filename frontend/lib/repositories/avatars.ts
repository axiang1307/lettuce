import { supabase } from "../supabase";

// Image bytes go straight to Supabase Storage; profiles.avatar_url stores only the
// object path ("<user_id>/<file>"), saved afterwards with profilesRepo.patchMe.
const BUCKET = 'avatars';

const EXTENSIONS: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/heic': 'heic',
    'image/webp': 'webp',
};

const base64ToBytes = (base64: string) => {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
};

export const avatarsRepo = {
    // Returns the new object path. Each upload gets a fresh filename so cached old images don't stick.
    upload: async(base64: string, mimeType: string = 'image/jpeg'): Promise<string> => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            throw new Error('Unauthorized');
        }
        const ext = EXTENSIONS[mimeType] ?? 'jpg';
        const path = `${session.user.id}/${Date.now()}.${ext}`;
        const { error } = await supabase.storage
            .from(BUCKET)
            .upload(path, base64ToBytes(base64), { contentType: mimeType });
        if (error) {
            throw new Error(error.message);
        }
        return path;
    },
    remove: async(path: string): Promise<void> => {
        const { error } = await supabase.storage.from(BUCKET).remove([path]);
        if (error) {
            throw new Error(error.message);
        }
    },
    publicUrl: (path: string): string => {
        return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
    },
}
