import { Request, Response } from "express";
import { getEvents as serviceGetEvents} from '../services/events';
import { Event } from '../types/index';

export const getEvents = async (req: Request, res: Response) => {//get function for profile
    if (!req.user) {
        return res.status(401).json(
            {
                error: 'Unauthorized User'
            }
        );
    }
    try{
        const data = await serviceGetEvents(req.user.id);
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