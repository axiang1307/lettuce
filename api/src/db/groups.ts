import pool from '../lib/db';
import type { Group, GroupCreate } from '@lettuce/api-types';

export const getGroups = async(userId: string): Promise<Group[]> => {
    // groups the caller is a member of; no matches gives rows = []
    const result = await pool.query(
        `SELECT g.*
         FROM groups g
         JOIN group_memberships gm ON gm.group_id = g.id
         WHERE gm.user_id = $1
         ORDER BY g.created_at DESC`,
        [userId]
    );
    return result.rows;
}

export const postGroup = async(userId: string, group: GroupCreate): Promise<Group> => {
    // The group and the creator's owner membership are saved together or not at all.
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // id, created_at and archived_at are filled by column defaults
        const groupResult = await client.query(
            `INSERT INTO groups (created_by, name, description)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [userId, group.name, group.description ?? null]
        );
        const created: Group = groupResult.rows[0];

        await client.query(
            `INSERT INTO group_memberships (group_id, user_id, role)
             VALUES ($1, $2, 'owner')`,
            [created.id, userId]
        );

        await client.query('COMMIT');
        return created;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

export const isMember = async(groupId: string, userId: string): Promise<boolean> => {
    // only existence matters, so SELECT 1 rather than the row's columns
    const result = await pool.query(
        'SELECT 1 FROM group_memberships WHERE group_id = $1 AND user_id = $2',
        [groupId, userId]
    );
    return result.rows.length > 0;
}
