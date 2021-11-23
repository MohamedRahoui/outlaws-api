import { Router } from 'express';
import { Create, GetAll, Status } from '@controllers/ordersController';

const router = Router();

router.post('/', Create);
router.get('/', GetAll);
router.post('/status', Status);

export default router;
