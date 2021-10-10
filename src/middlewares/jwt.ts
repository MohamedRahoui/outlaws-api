import { RouteIsWhiteListed, SkipRoute } from '@src/tools/checks';
import { ITokenUser } from '@src/tools/models';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

const JWTMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  const jwt: string = req.header('Authorization') || '';
  const whiteListed = RouteIsWhiteListed(req);
  if (!whiteListed && !jwt) return res.status(403).send('Access denied');
  if (whiteListed && !jwt) return next();
  if (whiteListed && SkipRoute(req)) return next();
  if (!jwt) return res.status(403).send('Access denied');
  const secret = process.env.AUTH_KEY || '';
  verify(jwt, secret, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError')
        return res.status(401).send('Token expired');
      return res.status(403).send('Access denied');
    }
    const user = decoded && (decoded.data as ITokenUser);
    req.user = user;
    return next();
  });
};

export default JWTMiddleware;
