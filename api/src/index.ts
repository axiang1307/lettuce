 // src/index.ts
 import express from 'express';
 import 'dotenv/config';
 import profilesRouter from './routes/profiles';
 import eventsRouter from './routes/events';
 import groupsRouter from './routes/groups';
 import busyBlocksRouter from './routes/busy-blocks';
 import { authMiddleware } from './middleware/auth';

 // 1. Create the Express instance
 const app = express();
 const PORT = 3000;

 // 2. Register a route
 app.use(express.json());
 app.use(authMiddleware);
 app.use('/profiles', profilesRouter);
 app.use('/events', eventsRouter);
 app.use('/groups', groupsRouter);
 app.use('/busy-blocks', busyBlocksRouter);

 // 3. Start listening
 app.listen(PORT, () => {
   console.log(`Server running on http://localhost:${PORT}`);
 });