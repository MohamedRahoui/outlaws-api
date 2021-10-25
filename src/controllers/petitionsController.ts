import { Petition, PrismaClient } from '.prisma/client';
import petitionErrors from '@src/schemas/petition';
import { IsStaff } from '@src/tools/checks';
import { getS3Object, UploadFile } from '@src/tools/storage';
import { Response, Request } from 'express';
import sharp from 'sharp';
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  VerticalAlign,
  WidthType,
  AlignmentType,
  TextRun,
  ImageRun,
} from 'docx';

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
  if (req.body.user_id) {
    createInput['userId'] = req.body.user_id;
  } else if (req.user) {
    createInput['userId'] = req.user.id;
  }
  try {
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
    await UploadFile(
      signature.buffer,
      uploadUrl + signature.fieldname + '.webp'
    );

    return res.status(200).send('Successfull signature');
  } catch (error) {
    console.log(error);
    return res.status(400).send('something went wrong');
  }
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
  if (!uuid) return res.status(400).send('No petition selected');
  const petiton = await prisma.petition.findFirst({
    where: {
      id: uuid,
    },
  });
  if (!petiton) return res.status(400).send('Invalid Petition');
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

/**
 * Download all vildate petitions as docx
 * @param req
 * @param res
 * @returns
 */
const Download = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  if (!IsStaff(req)) return res.status(403).send('Access Denied');
  const petitions = await prisma.petition.findMany({
    where: {
      valid: true,
    },
  });
  const tableCellText = (text: string) => {
    return new TableCell({
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: text,
              size: 16,
            }),
          ],
          alignment: AlignmentType.CENTER,
        }),
      ],
      verticalAlign: VerticalAlign.CENTER,
      margins: {
        left: 100,
        right: 100,
      },
    });
  };

  const rows: TableRow[] = [];
  for (const petition of petitions) {
    const uri = `petitions/${petition.id}/`;
    const signature = await getS3Object(`${uri}signature.webp`, true);
    const toPng = await sharp(signature).png().toBuffer();
    rows.push(
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new ImageRun({
                    data: toPng,
                    transformation: {
                      width: 122,
                      height: 45,
                    },
                  }),
                ],
              }),
            ],
            verticalAlign: VerticalAlign.CENTER,
          }),
          tableCellText(petition.email),
          tableCellText(petition.electoral_number),
          tableCellText(petition.address),
          tableCellText(petition.cin),
          tableCellText(`${petition.firstname} ${petition.lastname}`),
        ],
      })
    );
  }
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 100,
              right: 100,
              bottom: 100,
              left: 100,
            },
          },
        },
        children: [
          new Table({
            columnWidths: [1606, 1606, 1606, 2200, 1606, 1606],
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        text: 'التوقيع',
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                    verticalAlign: VerticalAlign.CENTER,
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        text: 'البريد الالكتروني',
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                    verticalAlign: VerticalAlign.CENTER,
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        text: 'رقم التسجيل في اللوائح الانتخابية',
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                    verticalAlign: VerticalAlign.CENTER,
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        text: 'عنوان الاقامة',
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                    verticalAlign: VerticalAlign.CENTER,
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        text: 'رقم البطاقة الوطنية',
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                    verticalAlign: VerticalAlign.CENTER,
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        text: 'الاسم',
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                    verticalAlign: VerticalAlign.CENTER,
                  }),
                ],
              }),
              ...rows,
            ],
          }),
        ],
      },
    ],
  });
  const blob = await Packer.toBuffer(doc);
  return res.status(200).send(blob);
};

export { Create, GetAll, GetFiles, Validate, Download };
