import { Router } from 'express';
import {
  Create,
  Download,
  GetAll,
  GetFiles,
  Validate,
} from '@controllers/petitionsController';
import Upload from '@src/middlewares/upload';

const router = Router();

router.post('/', Upload, Create);
router.get('/', GetAll);
router.get('/download', Download);
router.get('/files/:uuid', GetFiles);
router.post('/validate', Validate);

export default router;
