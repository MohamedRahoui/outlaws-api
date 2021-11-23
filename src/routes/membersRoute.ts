import { Router } from 'express';
import {
  Create,
  GetAll,
  GetFiles,
  Validate,
  ActivateSubscription,
  CancelSubscription,
} from '@controllers/membersController';
import Upload from '@src/middlewares/upload';

const router = Router();

router.post('/', Upload, Create);
router.get('/', GetAll);
router.get('/files/:uuid', GetFiles);
router.post('/validate', Validate);
router.post('/activateSubscription', ActivateSubscription);
router.post('/cancelSubscription', CancelSubscription);

export default router;
