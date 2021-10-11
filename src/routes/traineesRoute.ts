import { Router } from 'express';
import { Create, GetAll, GetCV } from '@controllers/traineesController';
import Upload from '@src/middlewares/upload';

const router = Router();

router.post('/', Upload, Create);
router.get('/', GetAll);
router.get('/files/:uuid', GetCV);

export default router;
