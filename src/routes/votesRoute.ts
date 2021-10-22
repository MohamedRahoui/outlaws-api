import { Router } from 'express';
import { Create, GetAll } from '@controllers/votesController';

const router = Router();

router.post('/', Create);
router.get('/', GetAll);

export default router;
