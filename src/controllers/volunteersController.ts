import { PrismaClient, Volunteer } from '.prisma/client';
import volunteerErrors from '@src/schemas/volunteer';
import { IsStaff } from '@src/tools/checks';
import { Response, Request } from 'express';

const prisma = new PrismaClient();

/**
 * Create a Volunteer
 * @param req
 * @param res
 * @returns
 */
const Create = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  const { errors, data } = await volunteerErrors({
    ...req.body,
  });
  if (errors) return res.status(422).send(errors);
  if (!data) return res.status(400).send();
  const body = data as Volunteer;
  if (req.user) {
    const userHasVolunteer = await prisma.volunteer.findFirst({
      where: {
        userId: req.user.id,
      },
    });
    if (userHasVolunteer)
      return res.status(422).send({
        name: 'Votre avez déjà une demande en cours',
      });
    body.userId = req.user.id;
  }
  const createdVolunteer = await prisma.volunteer.create({
    data: body,
  });
  if (!createdVolunteer) return res.status(400).send('Unable to register');
  return res.status(200).send('Successful Volunteer');
};

/**
 * List all volunteers
 * @param req
 * @param res
 * @returns
 */
const GetAll = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  if (!IsStaff(req)) return res.status(403).send('Access Denied');
  const volunteers = await prisma.volunteer.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
  return res.status(200).send(volunteers || []);
};

export { Create, GetAll };
