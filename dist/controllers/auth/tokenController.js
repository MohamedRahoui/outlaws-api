"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Refresh = void 0;
const client_1 = require(".prisma/client");
const jsonwebtoken_1 = require("jsonwebtoken");
const Refresh = async (req, res) => {
    const { refreshToken } = req.body || '';
    if (!refreshToken)
        return res.status(403).send('Refresh token required');
    const prisma = new client_1.PrismaClient();
    const user = await prisma.user.findFirst({
        where: {
            token: refreshToken,
        },
    });
    if (!user)
        return res.status(403).send('Refresh token not valid');
    const secret = process.env.AUTH_KEY || '';
    try {
        await (0, jsonwebtoken_1.verify)(refreshToken, secret);
        const tokenData = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            image: user.image,
            id: user.id,
            role: user.role,
        };
        const token = (0, jsonwebtoken_1.sign)({
            data: tokenData,
        }, process.env.AUTH_KEY, { expiresIn: '15m' });
        return res.status(200).send({
            newToken: token,
        });
    }
    catch (err) {
        if (err instanceof jsonwebtoken_1.TokenExpiredError) {
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
exports.Refresh = Refresh;
//# sourceMappingURL=tokenController.js.map