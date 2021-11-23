import { Request } from 'express';
import { PUBLIC_ROUTES, NO_RECAPTCHA } from './vars';

const RouteIsWhiteListed = (req: Request): boolean => {
  const isWhiteListed = PUBLIC_ROUTES.some((route) => {
    const path = req.url.split('?')[0];
    return route.path === path && route.method === req.method;
  });
  return isWhiteListed;
};
const SkipRoute = (req: Request): boolean => {
  const isSkip = PUBLIC_ROUTES.some((route) => {
    const path = req.url.split('?')[0];
    return route.path === path && route.method === req.method && route.skip;
  });
  return isSkip;
};
const RouteIsNoRecapthca = (req: Request): boolean => {
  const isNoRecaptcha = NO_RECAPTCHA.some((route) => {
    const path = req.url.split('?')[0];
    return route.path === path && route.method === req.method;
  });
  return isNoRecaptcha;
};

const IsStaff = (req: Request): boolean => {
  if (!req.user || req.user.role !== 'STAFF') return false;
  return true;
};

export { RouteIsWhiteListed, RouteIsNoRecapthca, SkipRoute, IsStaff };
