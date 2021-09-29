import { Router } from 'express';
import { Get } from '@controllers/indexController';

const router = Router();

router.get('/', Get);

export default router;
