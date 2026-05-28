import { Router } from 'express';

const profilesRouter = Router();

profilesRouter.get('/', (req, res) => {
  res.send('Hello World');
});

export default profilesRouter;