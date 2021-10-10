import { Express } from 'express';
import IndexRouter from './indexRoute';
import PetitionsRouter from './petitionsRoute';
import GoogleRouter from '@routes/auth/googleRoute';
import TokenRouter from '@routes/auth/tokenRoute';

const Routes = (app: Express): void => {
  app.use('/', IndexRouter);
  app.use('/petitions', PetitionsRouter);
  app.use('/auth/google', GoogleRouter);
  app.use('/auth/refresh-token', TokenRouter);
};

export default Routes;
