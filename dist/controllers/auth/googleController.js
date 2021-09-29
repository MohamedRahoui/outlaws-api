"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthGoogle = void 0;
const client_1 = require(".prisma/client");
const google_auth_library_1 = require("google-auth-library");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AuthGoogle = async (req, res) => {
    var _a;
    if (!((_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.googleToken)) {
        res.status(403).send({
            code: 'NO_ACCESS_TOKEN',
        });
    }
    try {
        const client = new google_auth_library_1.OAuth2Client({
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
        }
        else {
            const prisma = new client_1.PrismaClient();
            const user = {
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
            const refreshToken = jsonwebtoken_1.default.sign({}, process.env.AUTH_KEY, {
                expiresIn: '1d',
            });
            if (findUser) {
                if (findUser.blocked) {
                    res.status(403).send({
                        code: 'USER_BLOCKED',
                    });
                }
                else {
                    const tokenData = {
                        firstName: findUser.firstName,
                        lastName: findUser.lastName,
                        email: findUser.email,
                        image: findUser.image,
                        id: findUser.id,
                        role: findUser.role,
                    };
                    const token = jsonwebtoken_1.default.sign({
                        data: tokenData,
                    }, process.env.AUTH_KEY, { expiresIn: '15m' });
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
            }
            else {
                try {
                    const newUser = await prisma.user.create({
                        data: Object.assign(Object.assign({}, user), { token: refreshToken }),
                    });
                    const tokenData = {
                        firstName: newUser.firstName,
                        lastName: newUser.lastName,
                        email: newUser.email,
                        image: newUser.image,
                        id: newUser.id,
                        role: newUser.role,
                    };
                    const token = jsonwebtoken_1.default.sign({
                        data: tokenData,
                    }, process.env.AUTH_KEY, { expiresIn: '15m' });
                    res.status(200).send({
                        outlaws: token,
                        outlawsData: refreshToken,
                        user: tokenData,
                    });
                }
                catch (error) {
                    console.log(error);
                }
            }
        }
    }
    catch (error) {
        console.log(error);
        res.status(403).send('WRONG_ACCESS_TOKEN');
    }
};
exports.AuthGoogle = AuthGoogle;
//# sourceMappingURL=googleController.js.map