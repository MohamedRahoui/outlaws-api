import { Prisma, User } from '.prisma/client';
import { Response, Request } from 'express';
import { OAuth2Client } from 'google-auth-library';
import JWT from 'jsonwebtoken';
import prisma from '@src/tools/dbClient';

const AuthGoogle = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  if (!req?.body?.googleToken)
    return res.status(403).send({
      code: 'NO_ACCESS_TOKEN',
    });

  try {
    const client = new OAuth2Client({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    });
    const result = await client.verifyIdToken({
      idToken: req.body.googleToken,
    });
    const payload = result.getPayload();

    if (!payload || !payload.sub)
      return res.status(400).send({
        code: 'NO_PROFILE_DATA',
      });

    let currentUser: User | null = null;

    const findUser = await prisma.user.findFirst({
      where: {
        providerUserId: payload.sub,
        provider: 'GOOGLE',
      },
    });
    if (findUser && findUser.blocked) return res.status(403).send();

    const refreshToken = JWT.sign({}, process.env.AUTH_KEY as string, {
      expiresIn: '1d',
    });

    if (findUser) {
      currentUser = findUser;
      await prisma.user.update({
        where: {
          id: findUser.id,
        },
        data: {
          token: refreshToken,
        },
      });
    }

    if (!findUser) {
      // create User
      const userData: Prisma.UserCreateInput = {
        firstName: payload.given_name || '',
        lastName: payload.family_name || '',
        email: payload.email || '',
        image: payload.picture || '',
        provider: 'GOOGLE',
        providerUserId: payload.sub,
      };
      currentUser = await prisma.user.create({
        data: {
          ...userData,
          token: refreshToken,
        },
      });
    }

    if (!currentUser) return res.status(400).send();

    const tokenData = {
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      email: currentUser.email,
      image: currentUser.image,
      id: currentUser.id,
      role: currentUser.role,
    };

    const token = JWT.sign(
      {
        data: tokenData,
      },
      process.env.AUTH_KEY as string,
      { expiresIn: '15m' }
    );

    return res.status(200).send({
      outlaws: token,
      outlawsData: refreshToken,
      user: tokenData,
    });
  } catch (error) {
    console.log(error);
    res.status(403).send('WRONG_ACCESS_TOKEN');
  }
};
export { AuthGoogle };
