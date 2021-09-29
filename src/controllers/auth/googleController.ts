import { Prisma, PrismaClient } from '.prisma/client';
import { Response, Request } from 'express';
import { OAuth2Client } from 'google-auth-library';
import JWT from 'jsonwebtoken';

const AuthGoogle = async (req: Request, res: Response): Promise<void> => {
  if (!req?.body?.googleToken) {
    res.status(403).send({
      code: 'NO_ACCESS_TOKEN',
    });
  }
  try {
    const client = new OAuth2Client({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    });
    const result = await client.verifyIdToken({
      idToken: req.body.googleToken,
    });
    const payload = result.getPayload();
    if (!payload || !payload.sub) {
      res.status(422).send({
        code: 'NO_PROFILE_DATA',
      });
    } else {
      const prisma = new PrismaClient();
      const user: Prisma.UserCreateInput = {
        firstName: payload.given_name || '',
        lastName: payload.family_name || '',
        email: payload.email || '',
        image: payload.picture || '',
        provider: 'GOOGLE',
        providerUserId: payload.sub,
      };
      const findUser = await prisma.user.findFirst({
        where: {
          providerUserId: user.providerUserId,
          provider: 'GOOGLE',
        },
      });
      const refreshToken = JWT.sign({}, process.env.AUTH_KEY as string, {
        expiresIn: '1d',
      });
      if (findUser) {
        if (findUser.blocked) {
          res.status(403).send({
            code: 'USER_BLOCKED',
          });
        } else {
          const tokenData = {
            firstName: findUser.firstName,
            lastName: findUser.lastName,
            email: findUser.email,
            image: findUser.image,
            id: findUser.id,
            role: findUser.role,
          };
          const token = JWT.sign(
            {
              data: tokenData,
            },
            process.env.AUTH_KEY as string,
            { expiresIn: '15m' }
          );
          await prisma.user.update({
            where: {
              id: findUser.id,
            },
            data: {
              token: refreshToken,
            },
          });
          res.status(200).send({
            outlaws: token,
            outlawsData: refreshToken,
            user: tokenData,
          });
        }
      } else {
        try {
          const newUser = await prisma.user.create({
            data: {
              ...user,
              token: refreshToken,
            },
          });
          const tokenData = {
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            image: newUser.image,
            id: newUser.id,
            role: newUser.role,
          };
          const token = JWT.sign(
            {
              data: tokenData,
            },
            process.env.AUTH_KEY as string,
            { expiresIn: '15m' }
          );
          res.status(200).send({
            outlaws: token,
            outlawsData: refreshToken,
            user: tokenData,
          });
        } catch (error) {
          console.log(error);
        }
      }
    }
  } catch (error) {
    console.log(error);
    res.status(403).send('WRONG_ACCESS_TOKEN');
  }
};
export { AuthGoogle };
