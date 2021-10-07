import { IRoute } from './models';

const PUBLIC_ROUTES: IRoute[] = [
  {
    path: '/petitions',
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

const NO_RECAPTCHA: IRoute[] = [
  {
    path: '/auth/refresh-token',
    method: 'POST',
  },
];

export { PUBLIC_ROUTES, NO_RECAPTCHA };
