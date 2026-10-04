import { Router } from 'express';
import { getGroups, postGroup } from '../controllers/groups';

const groupsRouter = Router();

groupsRouter.get('/me', getGroups);

groupsRouter.post('/', postGroup);

export default groupsRouter;
