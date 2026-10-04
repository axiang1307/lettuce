import { Router } from 'express';
import {getEvents, postEvent} from '../controllers/events';


// custom router for each thing
// each thing has its own ednpoints
// so each thing needs its own router to route to those endpoints
const eventsRouter = Router();

eventsRouter.get('/me', getEvents);

eventsRouter.post('/', postEvent);

export default eventsRouter;
