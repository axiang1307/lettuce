import { Request, Response } from "express";
import { getGroups as serviceGetGroups, postGroup as servicePostGroup } from '../services/groups';
import type { GroupCreate } from '@lettuce/api-types';

export const getGroups = async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json(
            {
                error: 'Unauthorized User'
            }
        );
    }
    try {
        // always an array; [] when the caller is in no groups, so no 404 case
        const data = await serviceGetGroups(req.user.id);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(500).json(
            {
                error: 'Internal Server Error'
            }
        );
    }
}


export const postGroup = async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json(
            {
                error: 'Unauthorized User'
            }
        );
    }

    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'Request body cannot be empty' });
    }

    const { name, description } = req.body;

    if (typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({ error: 'name is required and must be a non-empty string' });
    }
    if (description !== undefined && description !== null && typeof description !== 'string') {
        return res.status(400).json({ error: 'description must be a string or null' });
    }

    // Build the insert from known fields only; any other keys in the body are ignored.
    // A blank description is stored as null rather than "".
    const group: GroupCreate = {
        name: name.trim(),
        description: typeof description === 'string' && description.trim() !== '' ? description.trim() : null,
    };

    try {
        const data = await servicePostGroup(req.user.id, group);
        return res.status(201).json(data);
    } catch (error) {
        console.log(error);
        return res.status(500).json(
            {
                error: 'Internal Server Error'
            }
        );
    }
}
