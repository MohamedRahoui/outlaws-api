import { Router } from 'express';
import {
  Create,
  GetAll,
  Valid,
  GetAllStaff,
  Update,
} from '@controllers/testimoniesController';

const router = Router();

router.post('/', Create);
router.get('/public', GetAll);
router.get('/', GetAllStaff);
router.post('/valid', Valid);
router.post('/update', Update);

export default router;
