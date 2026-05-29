import pool from '../lib/db';
import { Profile } from '../types/index';
export const getMe = async(userId: string): Promise<Profile | null> => {
    const result = await pool.query(
        'SELECT * FROM profiles WHERE id = $1', [userId]
    );
    return result.rows[0] ?? null;
}