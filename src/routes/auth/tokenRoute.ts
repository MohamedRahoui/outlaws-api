import { Refresh } from '@src/controllers/auth/tokenController';
import { Router } from 'express';
const router = Router();

router.post('/', Refresh);

export default router;
