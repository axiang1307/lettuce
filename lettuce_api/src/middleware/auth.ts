import { supabase } from '../lib/supabase';
import { NextFunction, Request, Response } from 'express';


export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;//the header with bearer jwt
    if(!authHeader || !authHeader.startsWith('Bearer ')){//verifies the header is good, do this before to not waste network call
        return res.status(401).json(//bad auth header
            {
                error: 'Missing or malformed Authorization header'
            }
        );
    }

    const token = authHeader.split(' ')[1];//splits the header at the space, [1] returns the second half

    const { data, error} = await supabase.auth.getUser(token);

    if(error || !data.user){//if an error was thrown or this user does not exist
        return res.status(401).json(
            {
                error: 'Invalid or expired token'
            }
        );

    }

    req.user = data.user;
    next();

}