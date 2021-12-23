import { Order } from '.prisma/client';
import orderErrors from '@src/schemas/order';
import { IsStaff } from '@src/tools/checks';
import { Response, Request } from 'express';
import prisma from '@src/tools/dbClient';

/**
 * Create an Order
 * @param req
 * @param res
 * @returns
 */
const Create = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  const { errors, data } = await orderErrors({
    ...req.body,
  });
  if (errors) return res.status(422).send(errors);
  if (!data) return res.status(400).send();
  const body = data as Order;
  if (req.user) {
    body.userId = req.user.id;
  }
  if (!body.rewardId) return res.status(400).send('No reward');
  const reward = await prisma.reward.findFirst({
    where: {
      id: parseInt(body.rewardId as any),
    },
  });
  // Get reward
  if (!reward || !reward.price)
    return res.status(400).send('Reward not found!');

  // Get user's current Score
  // FIXME:: Refactor this ugly bit
  const validatedPetitions = await prisma.petition.count({
    where: {
      userId: req?.user?.id,
      valid: true,
    },
  });
  const orderedPoints = await prisma.order.aggregate({
    _sum: {
      price: true,
    },
    where: {
      userId: req?.user?.id,
    },
  });
  const total = validatedPetitions || 0;
  const used = orderedPoints?._sum?.price || 0;
  const current = total - used || 0;
  if (current < reward.price) return res.status(400).send('Not enough points!');
  const createdOrder = await prisma.order.create({
    data: {
      ...body,
      rewardId: reward.id,
      price: reward.price,
    },
  });
  if (!createdOrder) return res.status(400).send('Unable to order');
  return res.status(200).send('Successful Order');
};

/**
 * List all Orders
 * @param req
 * @param res
 * @returns
 */
const GetAll = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  if (!IsStaff(req)) return res.status(403).send('Access Denied');
  const orders = await prisma.order.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      reward: true,
    },
  });
  return res.status(200).send(orders || []);
};

const Status = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  if (!IsStaff(req)) return res.status(403).send('Access Denied');
  const orderId = req.body.id || null;
  if (!orderId) return res.status(400).send('Missing order ID');
  const keys = ['accepted', 'sent', 'canceled'];
  const statuses: { [key: string]: boolean | Date | null } = {};
  for (const key of keys) {
    if (key in req.body) {
      statuses[key] = req.body[key];
      if (key !== 'canceled') {
        req.body[key]
          ? (statuses[`${key}At`] = new Date())
          : (statuses[`${key}At`] = null);
      }
    }
  }
  if (!Object.keys(statuses).length)
    return res.status(400).send('Missing order status');
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
    },
    include: {
      reward: true,
    },
  });
  if (order?.reward?.code === 'SUBSCRIPTION') {
    const updateMemberSubscription = async (date: Date | null) => {
      try {
        await prisma.member.update({
          where: {
            userId: order.userId,
          },
          data: {
            subscription: date,
          },
        });
      } catch (error) {
        console.log(error);
      }
    };
    const currentDate = new Date();
    if (
      ('accepted' in statuses && statuses.accepted) ||
      ('canceled' in statuses && !statuses.canceled && order.accepted)
    ) {
      await updateMemberSubscription(currentDate);
    } else if (
      ('accepted' in statuses && !statuses.accepted) ||
      ('canceled' in statuses && statuses.canceled)
    ) {
      await updateMemberSubscription(null);
    }
  }
  const updated = await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      ...statuses,
    },
  });
  if (!updated) return res.status(400).send('Failed query');
  return res.status(200).send(updated);
};

export { Create, GetAll, Status };
