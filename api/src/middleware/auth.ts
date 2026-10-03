import { supabase } from '../lib/supabase';//import supabase client
import { Response, Request, NextFunction } from 'express';

//arrow function verson, remember everything is handed to express, it fills the params in
export const authMiddleware = async(req: Request, res: Response, next: NextFunction) => {
    //express has now called this function and filled in the request, we need to fill in the response that it has passed to us now
    //the request will come in with a jwt from getsession
    const header = req.headers.authorization;//get the bearer header
    if(!header || !header.startsWith("Bearer ")){
        return res.status(401).json(//401 code for failed auth
            {
                error: "Bad Authorization Header"
            }
        )
    }

    const jwt = header.split(' ')[1];//split on the space, get the second jwt half
    const { data, error } = await supabase.auth.getUser(jwt);//call supabase on this jwt
    if (error || !data.user){//verify
        return res.status(401).json(//401 code for failed auth
            {
                error: "Bad Authorization Token"
            }
        )
    }
    //at this point jwt has been verified
    req.user = data.user;//data.user is from supabase.getuser with the jwt, not from the getsession call in frontend
    next();

} 