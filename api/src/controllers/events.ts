import { Request, Response } from "express";
import { getEvents as serviceGetEvents, postEvent as servicePostEvent } from '../services/events';
import type { Event, EventCreate } from '@lettuce/api-types';
import { ForbiddenError } from '../lib/errors';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// optional text fields: absent, null or blank all mean "no value"
const optionalText = (value: unknown) =>
    typeof value === 'string' && value.trim() !== '' ? value.trim() : null;

export const getEvents = async (req: Request, res: Response) => {//get function for events
    if (!req.user) {
        return res.status(401).json(
            {
                error: 'Unauthorized User'
            }
        );
    } // the middleware already handles authentication and runs on every request so mostly for type sanity for ts
    try{
        const data = await serviceGetEvents(req.user.id);
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

export const postEvent = async (req: Request, res: Response) => {
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

    const { group_id, title, description, final_location } = req.body;

    if (typeof group_id !== 'string' || !UUID.test(group_id)) {
        return res.status(400).json({ error: 'group_id is required and must be a UUID' });
    }
    if (typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({ error: 'title is required and must be a non-empty string' });
    }
    if (description !== undefined && description !== null && typeof description !== 'string') {
        return res.status(400).json({ error: 'description must be a string or null' });
    }
    if (final_location !== undefined && final_location !== null && typeof final_location !== 'string') {
        return res.status(400).json({ error: 'final_location must be a string or null' });
    }

    // Build the insert from known fields only; any other keys in the body are ignored.
    const event: EventCreate = {
        group_id,
        title: title.trim(),
        description: optionalText(description),
        final_location: optionalText(final_location),
    };

    try {
        const data = await servicePostEvent(req.user.id, event);
        return res.status(201).json(data);
    } catch (error: any) {
        if (error instanceof ForbiddenError) {
            return res.status(403).json({ error: error.message });
        }
        // foreign key violation on group_id: no group with that id exists
        if (error?.code === '23503' && error?.constraint === 'events_group_id_fkey') {
            return res.status(404).json({ error: 'Group not found' });
        }
        console.log(error);
        return res.status(500).json(
            {
                error: 'Internal Server Error'
            }
        );
    }
}