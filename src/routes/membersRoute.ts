import { Router } from 'express';
import {
  Create,
  GetAll,
  GetFiles,
  Validate,
} from '@controllers/membersController';
import Upload from '@src/middlewares/upload';

const router = Router();

router.post('/', Upload, Create);
router.get('/', GetAll);
router.get('/files/:uuid', GetFiles);
router.post('/validate', Validate);

export default router;
