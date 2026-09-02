 // src/index.ts
 import express from 'express';
 import 'dotenv/config';
 import profilesRouter from './routes/profiles';
 import eventsRouter from './routes/events';
 import { authMiddleware } from './middleware/auth';

 // 1. Create the Express instance
 const app = express();
 const PORT = 3000;

 // 2. Register a route
 app.use(express.json());
 app.use(authMiddleware);
 app.use('/profiles', profilesRouter);
 app.use('/events', eventsRouter);

 // 3. Start listening
 app.listen(PORT, () => {
   console.log(`Server running on http://localhost:${PORT}`);
 });