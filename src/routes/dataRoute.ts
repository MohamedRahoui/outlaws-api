import { Router } from 'express';
import {
  GetRewards,
  GetUserPoints,
  GetUserSubscription,
} from '@src/controllers/dataController';

const router = Router();

router.get('/rewards', GetRewards);
router.get('/points', GetUserPoints);
router.get('/subscription', GetUserSubscription);

export default router;
