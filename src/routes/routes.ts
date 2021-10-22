import { Express } from 'express';
import IndexRouter from './indexRoute';
import DataRouter from './dataRoute';
import PetitionsRouter from './petitionsRoute';
import VolunteersRouter from './volunteersRoute';
import VotesRouter from './votesRoute';
import TestimoniesRouter from './testimoniesRoute';
import MessagesRouter from './messagesRoute';
import TraineesRouter from './traineesRoute';
import GoogleRouter from '@routes/auth/googleRoute';
import TokenRouter from '@routes/auth/tokenRoute';

const Routes = (app: Express): void => {
  app.use('/', IndexRouter);
  app.use('/data', DataRouter);
  app.use('/petitions', PetitionsRouter);
  app.use('/volunteers', VolunteersRouter);
  app.use('/votes', VotesRouter);
  app.use('/messages', MessagesRouter);
  app.use('/testimonies', TestimoniesRouter);
  app.use('/trainees', TraineesRouter);
  app.use('/auth/google', GoogleRouter);
  app.use('/auth/refresh-token', TokenRouter);
};

export default Routes;
