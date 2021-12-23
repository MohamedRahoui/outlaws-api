import prisma from '@src/tools/dbClient';
import { IUserPoints } from '@src/tools/models';
import { getS3Object } from '@src/tools/storage';
import { Response, Request } from 'express';

const GetUserSubscription = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  const userId = req.user?.id;
  const member = await prisma.member.findFirst({
    where: {
      userId,
    },
  });
  if (member && member.subscription) {
    const expiry = new Date(member.subscription);
    expiry.setFullYear(expiry.getFullYear() + 1);
    const expired =
      expiry.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);
    const active = member.valid && !expired;
    if (active) {
      const uri = `members/${member.id}/`;
      const picture = await getS3Object(`${uri}picture.webp`);
      return res.status(200).send({ expiry, picture });
    } else {
      return res.status(200).send(null);
    }
  } else {
    return res.status(200).send(null);
  }
};
const GetRewards = async (_: Request, res: Response): Promise<void> => {
  const rewards = await prisma.reward.findMany({
    where: {
      archived: false,
    },
    orderBy: {
      price: 'asc',
    },
  });
  res.status(200).send(rewards || []);
};
const GetUserPoints = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;
  const validatedPetitions = await prisma.petition.count({
    where: {
      userId,
      valid: true,
    },
  });
  const petitionsInProgress = await prisma.petition.count({
    where: {
      userId,
      valid: false,
    },
  });
  const orderedPoints = await prisma.order.aggregate({
    _sum: {
      price: true,
    },
    where: {
      userId,
    },
  });
  const orders = await prisma.order.findMany({
    where: {
      userId,
    },
  });
  const member = await prisma.member.findFirst({
    where: {
      userId,
    },
  });
  const data: IUserPoints = {
    validatedPetitions: validatedPetitions || 0,
    petitionsInProgress: petitionsInProgress || 0,
    orders: orders || [],
    isMember: !!member,
  };

  const orderedPointsSum = orderedPoints?._sum?.price || 0;
  data.currentPoints = data.validatedPetitions - orderedPointsSum || 0;
  res.status(200).send(data);
};
export { GetRewards, GetUserPoints, GetUserSubscription };
