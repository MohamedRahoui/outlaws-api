import { IRoute } from './models';

const PUBLIC_ROUTES: IRoute[] = [
  {
    path: '/petitions',
    method: 'POST',
  },
  {
    path: '/volunteers',
    method: 'POST',
  },
  {
    path: '/votes',
    method: 'POST',
  },
  {
    path: '/testimonies/public',
    method: 'GET',
  },
  {
    path: '/testimonies',
    method: 'POST',
  },
  {
    path: '/trainees',
    method: 'POST',
  },
  {
    path: '/messages',
    method: 'POST',
  },
  {
    path: '/auth/google',
    method: 'POST',
    skip: true,
  },
  {
    path: '/auth/refresh-token',
    method: 'POST',
    skip: true,
  },
];

//
const NO_RECAPTCHA: IRoute[] = [
  {
    path: '/auth/refresh-token',
    method: 'POST',
  },
  {
    path: '/data/rewards',
    method: 'GET',
  },
  {
    path: '/data/points',
    method: 'GET',
  },
  {
    path: '/data/subscription',
    method: 'GET',
  },
];

export { PUBLIC_ROUTES, NO_RECAPTCHA };
