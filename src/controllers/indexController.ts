import { Response, Request } from 'express';
const Get = (_: Request, res: Response): void => {
  res.status(200).send({
    stuff: 'Moroccan outlaws API, LOVE IS NOT A CRIME',
  });
};
export { Get };
