import { NextFunction, Request, Response } from 'express';
import axios from 'axios';

const RecaptchaMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token = '';
  if (req.method === 'POST') {
    token = req.body.recaptcha;
  } else if (req.method === 'GET') {
    token = req.query.recaptcha as string;
  }
  if (!token) {
    res.status(403).send('Recaptcha is required');
  } else {
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
      if (success && score >= 0.5) {
        next();
      } else {
        res.status(422).send('Recaptcha error');
      }
    } catch (error) {
      console.error(error);
      res.status(422).send('Recaptcha error');
    }
  }
};

export default RecaptchaMiddleware;
