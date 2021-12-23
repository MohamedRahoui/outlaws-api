import { Vote } from '.prisma/client';
import voteErrors from '@src/schemas/vote';
import { IsStaff } from '@src/tools/checks';
import { Response, Request } from 'express';
import prisma from '@src/tools/dbClient';

/**
 * Create a Vote
 * @param req
 * @param res
 * @returns
 */
const Create = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  const { errors, data } = await voteErrors({
    ...req.body,
  });
  if (errors) return res.status(422).send(errors);
  if (!data) return res.status(400).send();
  const body = data as Vote;
  if (req.user) {
    const userHasVote = await prisma.vote.findFirst({
      where: {
        userId: req.user.id,
      },
    });
    if (userHasVote)
      return res.status(422).send({
        name: 'Votre avez déjà voté, Merci!',
      });
    body.userId = req.user.id;
  }
  const createdVote = await prisma.vote.create({
    data: body,
  });
  if (!createdVote) return res.status(400).send('Unable to vote');
  return res.status(200).send('Successfull Vote');
};

/**
 * List all votes
 * @param req
 * @param res
 * @returns
 */
const GetAll = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  if (!IsStaff(req)) return res.status(403).send('Access Denied');
  const votes = await prisma.vote.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
  return res.status(200).send(votes || []);
};

export { Create, GetAll };
