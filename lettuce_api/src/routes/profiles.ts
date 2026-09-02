import { Router } from 'express';
import {getMe, patchMe} from '../controllers/profiles';

const profilesRouter = Router();

profilesRouter.get('/me', getMe);

profilesRouter.patch('/me', patchMe);

export default profilesRouter;