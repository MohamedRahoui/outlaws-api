import { Express } from 'express';
import IndexRouter from './indexRoute';
import GoogleRouter from '@routes/auth/googleRoute';

const Routes = (app: Express): void => {
  app.use('/', IndexRouter);
  app.use('/auth/google', GoogleRouter);
};

export default Routes;
