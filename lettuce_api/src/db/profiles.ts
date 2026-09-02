import pool from '../lib/db';
import { Profile, ProfileUpdate } from '../types/index';
export const getMe = async(userId: string): Promise<Profile | null> => {
    const result = await pool.query(
        'SELECT * FROM profiles WHERE id = $1', [userId]
    );
    return result.rows[0] ?? null;
}

export const patchMe = async(userId: string, profile: ProfileUpdate): Promise<Profile | null> => {
    const fields = Object.entries(profile).filter(([, value]) => value !== undefined);

    const setClause = fields
        .map(([key], index) => `${key} = $${index + 2}`)
        .join(', ');
    const values = fields.map(([, value]) => value);

    const result = await pool.query(
        `UPDATE profiles SET ${setClause} WHERE id = $1 RETURNING *`,
        [userId, ...values]
    );
    return result.rows[0] ?? null;
}

