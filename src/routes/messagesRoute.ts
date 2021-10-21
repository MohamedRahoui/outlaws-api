import { Router } from 'express';
import { Create, GetAll, Treated } from '@controllers/messagesController';

const router = Router();

router.post('/', Create);
router.get('/', GetAll);
router.post('/treated', Treated);

export default router;
