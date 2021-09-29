import { Response, Request } from 'express';
const Get = (_: Request, res: Response): void => {
  res.status(200).send({
    stuff: 'Yup',
  });
};
export { Get };
