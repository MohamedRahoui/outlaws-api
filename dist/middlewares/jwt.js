"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const checks_1 = require("@src/tools/checks");
const jsonwebtoken_1 = require("jsonwebtoken");
const JWTMiddleware = async (req, res, next) => {
    const jwt = req.header('Authorization') || '';
    const whiteListed = (0, checks_1.RouteIsWhiteListed)(req);
    if (!whiteListed && !jwt)
        return res.status(403).send('Access denied');
    if (whiteListed && !jwt)
        return next();
    if (whiteListed && (0, checks_1.SkipRoute)(req))
        return next();
    if (!jwt)
        return res.status(403).send('Access denied');
    const secret = process.env.AUTH_KEY || '';
    (0, jsonwebtoken_1.verify)(jwt, secret, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError')
                return res.status(401).send('Token expired');
            return res.status(403).send('Access denied');
        }
        const user = decoded && decoded.data;
        req.user = user;
        return next();
    });
};
exports.default = JWTMiddleware;
//# sourceMappingURL=jwt.js.map