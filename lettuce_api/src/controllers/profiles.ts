import { Request, Response } from "express";
import { getMe as serviceGetMe, patchMe as servicePatchMe } from '../services/profiles';
import { ProfileUpdate } from '../types/index';

export const getMe = async (req: Request, res: Response) => {//get function for profile
    if (!req.user) {
        return res.status(401).json(
            {
                error: 'Unauthorized User'
            }
        );
    }
    try{
        const data = await serviceGetMe(req.user.id);
        if (!data) {
            return res.status(404).json(
                {
                    error: 'User Not Found'
                }
            );
        }
        return res.status(200).json(data);
    }catch(error){
        console.log(error);
        return res.status(500).json(
            {
                error: 'Internal Server Error'
            }
        );
    }
}

export const patchMe = async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json(
            {
                error: 'Unauthorized User'
            }
        );
    }

    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json(
            {
                error: 'Request body cannot be empty'
            }
        );
    }

    const update: ProfileUpdate = {};

    if ('full_name' in req.body) {
        const { full_name } = req.body;
        if (full_name !== null && typeof full_name !== 'string') {
            return res.status(400).json({ error: 'full_name must be a string or null' });
        }
        if (full_name === '') {
            return res.status(400).json({ error: 'full_name cannot be empty' });
        }
        update.full_name = full_name;
    }

    if ('username' in req.body) {
        const { username } = req.body;
        if (username !== null && typeof username !== 'string') {
            return res.status(400).json({ error: 'username must be a string or null' });
        }
        const trimmed = typeof username === 'string' ? username.trim() : username;
        if (trimmed === '') {
            return res.status(400).json({ error: 'username cannot be empty' });
        }
        update.username = trimmed;
    }

    if ('avatar_url' in req.body) {
        const { avatar_url } = req.body;
        if (avatar_url !== null && typeof avatar_url !== 'string') {
            return res.status(400).json({ error: 'avatar_url must be a string or null' });
        }
        update.avatar_url = avatar_url;
    }

    if (Object.keys(update).length === 0) {
        return res.status(400).json({ error: 'No valid fields to update' });
    }

    try {
        const data = await servicePatchMe(req.user.id, update);
        if (!data) {
            return res.status(404).json(
                {
                    error: 'User Not Found'
                }
            );
        }
        return res.status(200).json(data);
    } catch (error: any) {
        if (error?.code === '23505') {
            return res.status(409).json({ error: 'Username already taken' });
        }
        console.log(error);
        return res.status(500).json(
            {
                error: 'Internal Server Error'
            }
        );
    }
}