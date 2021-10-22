import { PrismaClient } from '.prisma/client';
import { IUserPoints } from '@src/tools/models';
import { Response, Request } from 'express';
const prisma = new PrismaClient();
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
  const data: IUserPoints = {
    validatedPetitions: validatedPetitions || 0,
    petitionsInProgress: petitionsInProgress || 0,
  };

  const orderedPointsSum = orderedPoints?._sum?.price || 0;
  data.currentPoints = data.validatedPetitions - orderedPointsSum || 0;
  res.status(200).send(data);
};
export { GetRewards, GetUserPoints };
