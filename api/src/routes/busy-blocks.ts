import { Router } from 'express';
import { getBusyBlocks, postBusyBlock, patchBusyBlock, deleteBusyBlock } from '../controllers/busy-blocks';

const busyBlocksRouter = Router();

busyBlocksRouter.get('/me', getBusyBlocks);

busyBlocksRouter.post('/', postBusyBlock);

busyBlocksRouter.patch('/:id', patchBusyBlock);

busyBlocksRouter.delete('/:id', deleteBusyBlock);

export default busyBlocksRouter;
