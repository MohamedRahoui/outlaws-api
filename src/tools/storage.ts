import { S3 } from 'aws-sdk';

const s3 = new S3({
  endpoint: process.env.SPACES_URL,
  accessKeyId: process.env.SPACES_ACCESS_KEY,
  secretAccessKey: process.env.SPACES_SECRET_KEY,
});

export const UploadFile = async (
  buffer: Buffer,
  url: string
): Promise<void> => {
  await s3
    .upload({
      Bucket: 'moroccanoutlaws',
      ACL: 'private', // Specify whether anyone with link can access the file
      Key: url,
      Body: buffer,
    })
    .send((err) => {
      if (err) {
        console.error(err);
      }
    });
};

export const getS3Object = (key: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    s3.getObject(
      {
        Bucket: 'moroccanoutlaws',
        Key: key,
      },
      (err, data) => {
        if (err) {
          console.log(key, err);
          reject(err);
        }
        if (data && data.Body) {
          const buffer = Buffer.from(
            data.Body as WithImplicitCoercion<ArrayBuffer>
          );
          // console.log(buffer);
          resolve(buffer.toString('base64'));
        } else {
          reject('NONE');
        }
      }
    );
  });
};

export const emptyS3Directory = async (dir: string): Promise<void> => {
  const listParams = {
    Bucket: 'moroccanoutlaws',
    Prefix: dir,
  };
  try {
    const listedObjects = await s3.listObjectsV2(listParams).promise();

    if (listedObjects.Contents?.length === 0) return;

    const deleteParams = {
      Bucket: 'moroccanoutlaws',
      Delete: { Objects: [] },
    };

    listedObjects.Contents?.forEach(({ Key }) => {
      deleteParams.Delete?.Objects?.push({ Key } as never);
    });

    await s3.deleteObjects(deleteParams).promise();

    if (listedObjects.IsTruncated) await emptyS3Directory(dir);
  } catch (error) {
    console.error(error);
    return;
  }
};

export const filesSizeCheck = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  files: Express.Multer.File[] | any[] | undefined,
  size = 20
): boolean => {
  if (!files || !files.length) return false;
  return files.every((file) => {
    const mb = file.size / 1024 / 1024;
    return mb <= size;
  });
};
export const filesTypeCheck = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  files: Express.Multer.File[] | any[] | undefined,
  types: string[]
): boolean => {
  if (!files || !files.length) return false;
  return files.every((file) => {
    return types.includes(file.mimetype);
  });
};
