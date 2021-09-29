import { AuthGoogle } from '@src/controllers/auth/googleController';
import { Router } from 'express';
const router = Router();
router.post('/', AuthGoogle);

export default router;
