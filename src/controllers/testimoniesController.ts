import { PrismaClient, Testimony } from '.prisma/client';
import testimonyErrors from '@src/schemas/testimony';
import { IsStaff } from '@src/tools/checks';
import { Response, Request } from 'express';

const prisma = new PrismaClient();

/**
 * Create a Testimony
 * @param req
 * @param res
 * @returns
 */
const Create = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  const { errors, data } = await testimonyErrors({
    ...req.body,
  });
  if (errors) return res.status(422).send(errors);
  if (!data) return res.status(400).send();
  const body = data as Testimony;
  if (req.user) {
    body.userId = req.user.id;
  }
  const createdTestimony = await prisma.testimony.create({
    data: body,
  });
  if (!createdTestimony)
    return res.status(400).send('Unable to create testimony');
  return res.status(200).send('Successfull Testimony');
};

/**
 * List all testimonies 'PUBLIC'
 * @param req
 * @param res
 * @returns
 */
const GetAll = async (_: Request, res: Response): Promise<void | Response> => {
  const testimonies = await prisma.testimony.findMany({
    where: {
      valid: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      age: true,
      name: true,
      city: true,
      text: true,
    },
  });
  return res.status(200).send(testimonies || []);
};

/**
 * List all testimonies 'STAFF'
 * @param req
 * @param res
 * @returns
 */
const GetAllStaff = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  if (!IsStaff(req)) return res.status(403).send('Access Denied');
  const testimonies = await prisma.testimony.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
  return res.status(200).send(testimonies || []);
};

/**
 * Validate a testimony
 * @param req
 * @param res
 * @returns
 */
const Valid = async (req: Request, res: Response): Promise<void | Response> => {
  if (!IsStaff(req)) return res.status(403).send('Access Denied');
  const testimonyId = req.body.id || null;
  if (!testimonyId) return res.status(400).send('Missing testimony ID');
  const valid: boolean = req.body.valid;
  const updated = await prisma.testimony.update({
    where: {
      id: testimonyId,
    },
    data: {
      valid,
    },
  });
  if (!updated) return res.status(400).send('Failed query');
  return res.status(200).send('Validation changed');
};

/**
 * Update a testimony's text
 * @param req
 * @param res
 * @returns
 */
const Update = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  if (!IsStaff(req)) return res.status(403).send('Access Denied');
  const testimonyId = req.body.id || null;
  const text = req.body.text || '';
  if (!testimonyId || !text)
    return res.status(400).send('Missing testimony ID, and text');
  const updated = await prisma.testimony.update({
    where: {
      id: testimonyId,
    },
    data: {
      text,
    },
  });
  if (!updated) return res.status(400).send('Failed query');
  return res.status(200).send(updated);
};

export { Create, GetAll, GetAllStaff, Valid, Update };
