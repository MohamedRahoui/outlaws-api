import { NextFunction, Request, Response } from 'express';
import axios from 'axios';
import { RouteIsNoRecapthca } from '@src/tools/checks';
import { captureException } from '@sentry/minimal';
const RecaptchaMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  const isNoRecaptcha = RouteIsNoRecapthca(req);
  if (isNoRecaptcha) return next();
  const token = req.header('X-RECAPTCHA');
  if (!token) {
    return res.status(403).send('Recaptcha is required');
  }
  if (token === process.env.RECAPTCHA_BYPASS) return next();
  const secret = process.env.RECAPTCHA_SECRETE_KEY;
  try {
    const results = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`,
      {},
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
      }
    );
    const { success, score } = results.data;
    if (success && score < 0.5) {
      captureException('Recaptcha score < 0,5', {
        extra: {
          req,
          score,
        },
      });
      return res.status(400).send('Recaptcha score error');
    }
    return next();
  } catch (error) {
    res.status(400).send('Recaptcha error');
  }
};

export default RecaptchaMiddleware;
