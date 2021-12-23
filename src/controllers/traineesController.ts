import { Trainee } from '.prisma/client';
import { captureException } from '@sentry/minimal';
import traineeErrors from '@src/schemas/trainee';
import { IsStaff } from '@src/tools/checks';
import { getS3Object, UploadFile } from '@src/tools/storage';
import { Response, Request } from 'express';
import prisma from '@src/tools/dbClient';

/**
 * Create a Trainee
 * @param req
 * @param res
 * @returns
 */
const Create = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  const myFiles = req.files as unknown as Express.Multer.File[];
  const { errors, data } = await traineeErrors({
    ...req.body,
    cv: myFiles.filter((file) => file.fieldname === 'cv'),
  });
  if (errors) return res.status(422).send(errors);
  if (!data) return res.status(400).send();
  const body = Object.assign({} as any, data);
  delete body.cv;
  if (req.user) {
    const userHasTrainee = await prisma.trainee.findFirst({
      where: {
        userId: req.user.id,
      },
    });
    if (userHasTrainee)
      return res.status(422).send({
        name: 'Votre avez déjà une demande en cours',
      });
    body.userId = req.user.id;
  }
  const createdTrainee = await prisma.trainee.create({
    data: body as Trainee,
  });
  if (!createdTrainee) return res.status(400).send('Unable to create');
  const cv = myFiles.find((file) => file.fieldname === 'cv');
  if (!cv)
    return res.status(422).send({
      signature: 'Votre CV est requis',
    });
  const uploadUrl = `trainees/${createdTrainee.id}/`;
  try {
    await UploadFile(cv.buffer, uploadUrl + 'cv.pdf');
  } catch (error) {
    captureException(error);
  }

  return res.status(200).send('Sent Successfully');
};

/**
 * List all trainees
 * @param req
 * @param res
 * @returns
 */
const GetAll = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  if (!IsStaff(req)) return res.status(403).send('Access Denied');
  const trainees = await prisma.trainee.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
  return res.status(200).send(trainees || []);
};

/**
 * Get a Trainee's CV
 * @param req
 * @param res
 * @returns
 */
const GetCV = async (req: Request, res: Response): Promise<void | Response> => {
  if (!IsStaff(req)) return res.status(403).send('Access Denied');
  const uuid: string = req.params.uuid || '';
  if (!uuid) return res.status(400).send('No petition selected');
  const trainee = await prisma.trainee.findFirst({
    where: {
      id: uuid,
    },
  });
  if (!trainee) return res.status(400).send('Invalid Trainee');
  const uri = `trainees/${uuid}/`;
  const cv = await getS3Object(`${uri}cv.pdf`, true).catch(() => {
    return res.status(400).send('Failed to get files');
  });
  return res.status(200).send(cv);
};

export { Create, GetAll, GetCV };
