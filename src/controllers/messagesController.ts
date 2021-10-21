import { Message, PrismaClient } from '.prisma/client';
import messageErrors from '@src/schemas/message';
import { IsStaff } from '@src/tools/checks';
import { Response, Request } from 'express';

const prisma = new PrismaClient();

/**
 * Create a Message
 * @param req
 * @param res
 * @returns
 */
const Create = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  const { errors, data } = await messageErrors({
    ...req.body,
  });
  if (errors) return res.status(422).send(errors);
  if (!data) return res.status(400).send();
  const body = data as Message;
  if (req.user) {
    body.userId = req.user.id;
  }
  const createdMessage = await prisma.message.create({
    data: body,
  });
  if (!createdMessage) return res.status(400).send('Unable to register');
  return res.status(200).send('Successfull Message');
};

/**
 * List all Messages
 * @param req
 * @param res
 * @returns
 */
const GetAll = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  if (!IsStaff(req)) return res.status(403).send('Access Denied');
  const messages = await prisma.message.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
  return res.status(200).send(messages || []);
};

const Treated = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  if (!IsStaff(req)) return res.status(403).send('Access Denied');
  const messageId = req.body.id || null;
  if (!messageId) return res.status(400).send('Missing message ID');
  const treated: boolean = req.body.treated;
  const updated = await prisma.message.update({
    where: {
      id: messageId,
    },
    data: {
      treated,
    },
  });
  if (!updated) return res.status(400).send('Failed query');
  return res.status(200).send('Validation changed');
};

export { Create, GetAll, Treated };
