import { Router } from 'express';
import { GetRewards, GetUserPoints } from '@src/controllers/dataController';

const router = Router();

router.get('/rewards', GetRewards);
router.get('/points', GetUserPoints);

export default router;
