import { Member, PrismaClient } from '.prisma/client';
import memberErrors from '@src/schemas/member';
import { IsStaff } from '@src/tools/checks';
import { getS3Object, UploadFile } from '@src/tools/storage';
import { Response, Request } from 'express';
import sharp from 'sharp';

const prisma = new PrismaClient();

/**
 * Create a Member
 * @param req
 * @param res
 * @returns
 */
const Create = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  const myFiles = req.files as unknown as Express.Multer.File[];
  const user = req.user;
  if (!user) return res.status(403).send('Login required');
  const { errors, data } = await memberErrors({
    ...req.body,
    identity_card: myFiles.filter((file) =>
      file.fieldname.includes('identity_card')
    ),
    picture: myFiles.find((file) => file.fieldname === 'picture'),
  });
  if (errors) return res.status(422).send(errors);
  if (!data) return res.status(400).send();
  const { identity_card, picture, ...body } = data as any;
  body['userId'] = user.id;
  try {
    const hasMember = await prisma.member.findFirst({
      where: {
        userId: user.id,
      },
    });
    if (hasMember)
      return res.status(422).send({
        name: 'Vous avez déjà envoyé une demande',
      });
    const createdMember = await prisma.member.create({
      data: body as Member,
    });
    if (!createdMember) return res.status(400).send('Unable to create member');
    if (identity_card.length !== 2)
      return res.status(422).send({
        identity_card: "Votre carte d'identité est requise",
      });
    if (!picture)
      return res.status(422).send({
        picture: 'Votre photo est requise',
      });
    for (const file of identity_card) {
      file.buffer = await sharp(file.buffer).webp({ quality: 20 }).toBuffer();
    }
    picture.buffer = await sharp(picture.buffer)
      .webp({ quality: 50 })
      .toBuffer();

    const uploadUrl = `members/${createdMember.id}/`;
    for (const file of identity_card) {
      await UploadFile(file.buffer, uploadUrl + file.fieldname + '.webp');
    }
    await UploadFile(picture.buffer, uploadUrl + picture.fieldname + '.webp');

    return res.status(200).send('Successfull member creation');
  } catch (error) {
    console.log(error);
    return res.status(400).send('something went wrong');
  }
};

/**
 * List all members
 * @param req
 * @param res
 * @returns
 */
const GetAll = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  if (!IsStaff(req)) return res.status(403).send('Access Denied');
  const members = await prisma.member.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
  return res.status(200).send(members || []);
};

/**
 * Get a Member's Files
 * @param req
 * @param res
 * @returns
 */
const GetFiles = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  if (!IsStaff(req)) return res.status(403).send('Access Denied');
  const uuid: string = req.params.uuid || '';
  if (!uuid) return res.status(400).send('No member selected');
  const member = await prisma.member.findFirst({
    where: {
      id: uuid,
    },
  });
  if (!member) return res.status(400).send('Invalid Member');
  const uri = `members/${uuid}/`;
  const Querys = [
    getS3Object(`${uri}identity_card_1.webp`),
    getS3Object(`${uri}identity_card_2.webp`),
    getS3Object(`${uri}picture.webp`),
  ];
  const files = await Promise.all(Querys).catch(() => {
    return res.status(400).send('Failed to get files');
  });
  return res.status(200).send(files || []);
};

/**
 * Set Member's Validation
 * @param req
 * @param res
 * @returns
 */
const Validate = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  if (!IsStaff(req)) return res.status(403).send('Access Denied');
  const memberId = req.body.id || null;
  if (!memberId) return res.status(400).send('Missing member ID');
  const validate: boolean = req.body.validate;
  const updated = await prisma.member.update({
    where: {
      id: memberId,
    },
    data: {
      valid: validate,
    },
  });
  if (!updated) return res.status(400).send('Failed query');
  return res.status(200).send('Validation changed');
};

export { Create, GetAll, GetFiles, Validate };
