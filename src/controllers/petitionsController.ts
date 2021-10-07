import { Petition, PrismaClient } from '.prisma/client';
import petitionErrors from '@src/schemas/petition';
import { IsStaff } from '@src/tools/checks';
import { getS3Object, UploadFile } from '@src/tools/storage';
import { Response, Request } from 'express';
import sharp from 'sharp';

const prisma = new PrismaClient();

/**
 * Create a Petition
 * @param req
 * @param res
 * @returns
 */
const Create = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  const myFiles = req.files as unknown as Express.Multer.File[];
  const { errors, data } = await petitionErrors({
    ...req.body,
    identity_card: myFiles.filter((file) =>
      file.fieldname.includes('identity_card')
    ),
    signature: myFiles.find((file) => file.fieldname === 'signature'),
  });
  if (errors) return res.status(422).send(errors);
  if (!data) return res.status(400).send();
  const body = data as Petition;
  const createInput: { [key: string]: string | number } = {
    firstname: body.firstname,
    lastname: body.lastname,
    email: body.email,
    address: body.address,
    cin: body.cin,
    electoral_number: body.electoral_number,
  };
  if (req.user) {
    createInput['userId'] = req.user.id;
  }
  const createdPetition = await prisma.petition.create({
    data: createInput as unknown as Petition,
  });
  if (!createdPetition) return res.status(400).send('Unable to sign');
  const identity_card = myFiles.filter((file) =>
    file.fieldname.includes('identity_card')
  );
  if (identity_card.length !== 2)
    return res.status(403).send('Malicious attempt');
  const signature = myFiles.find((file) => file.fieldname === 'signature');
  if (!signature)
    return res.status(422).send({
      signature: 'Votre Signature manuscrite est requise',
    });
  for (const file of identity_card) {
    file.buffer = await sharp(file.buffer).webp({ quality: 20 }).toBuffer();
  }
  signature.buffer = await sharp(signature.buffer)
    .webp({ quality: 20 })
    .toBuffer();

  const uploadUrl = `petitions/${createdPetition.id}/`;
  for (const file of identity_card) {
    await UploadFile(file.buffer, uploadUrl + file.fieldname + '.webp');
  }
  await UploadFile(signature.buffer, uploadUrl + signature.fieldname + '.webp');

  res.status(200).send('Successfull signature');
};

/**
 * List all petitons
 * @param req
 * @param res
 * @returns
 */
const GetAll = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  if (!IsStaff(req)) return res.status(403).send('Access Denied');
  const petitons = await prisma.petition.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
  return res.status(200).send(petitons || []);
};

/**
 * Get a Petition's Files
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
  if (!uuid) return res.status(422).send('No petition selected');
  const petiton = await prisma.petition.findFirst({
    where: {
      id: uuid,
    },
  });
  if (!petiton) return res.status(422).send('Invalid Petition');
  const uri = `petitions/${uuid}/`;
  const Querys = [
    getS3Object(`${uri}identity_card_1.webp`),
    getS3Object(`${uri}identity_card_2.webp`),
    getS3Object(`${uri}signature.webp`),
  ];
  const files = await Promise.all(Querys).catch(() => {
    return res.status(400).send('Failed to get files');
  });
  return res.status(200).send(files || []);
};

/**
 * Set Petition's Validation
 * @param req
 * @param res
 * @returns
 */
const Validate = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  if (!IsStaff(req)) return res.status(403).send('Access Denied');
  const petitionId = req.body.id || null;
  if (!petitionId) return res.status(400).send('Missing petition ID');
  const validate: boolean = req.body.validate;
  const updated = await prisma.petition.update({
    where: {
      id: petitionId,
    },
    data: {
      valid: validate,
    },
  });
  if (!updated) return res.status(400).send('Failed query');
  return res.status(200).send('Validation changed');
};

export { Create, GetAll, GetFiles, Validate };
