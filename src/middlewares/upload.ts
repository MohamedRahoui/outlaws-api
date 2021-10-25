import multer from 'multer';
import { Request, Response, NextFunction } from 'express';

const Upload = (
  req: Request,
  res: Response,
  next: NextFunction
): void | Response => {
  const upload = multer({
    limits: {
      fieldSize: 20 * 1024 * 1024,
      fileSize: 20 * 1024 * 1024,
      files: 5,
    },
  }).any();

  upload(req, res, (err): void | Response => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE')
        return res.status(422).send({
          [err.field || '']: 'La taille du fichier ne doit pas depasser 20MB',
        });
      return res.status(422).send({
        [err.field || '']: 'Veuillez choisir un autre fichier',
      });
    }
    if (err) return res.status(400).send();
    next();
  });
};

export default Upload;
