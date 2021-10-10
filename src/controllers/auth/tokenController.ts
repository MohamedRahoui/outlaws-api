import { PrismaClient } from '.prisma/client';
import { Response, Request } from 'express';
import { TokenExpiredError, verify, sign } from 'jsonwebtoken';
const Refresh = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  const { refreshToken } = req.body || '';
  if (!refreshToken) return res.status(403).send('Refresh token required');
  const prisma = new PrismaClient();
  const user = await prisma.user.findFirst({
    where: {
      token: refreshToken,
    },
  });
  if (!user) return res.status(403).send('Refresh token not valid');
  const secret = process.env.AUTH_KEY || '';
  try {
    await verify(refreshToken, secret);
    const tokenData = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      image: user.image,
      id: user.id,
      role: user.role,
    };
    const token = sign(
      {
        data: tokenData,
      },
      process.env.AUTH_KEY as string,
      { expiresIn: '15m' }
    );
    return res.status(200).send({
      newToken: token,
    });
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          token: '',
        },
      });
      return res.status(403).send('Refresh Token expired');
    }
    return res.status(403).send('Refresh token not valid');
  }
};
export { Refresh };
