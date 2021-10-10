"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const checks_1 = require("@src/tools/checks");
const RecaptchaMiddleware = async (req, res, next) => {
    const isNoRecaptcha = (0, checks_1.RouteIsNoRecapthca)(req);
    if (isNoRecaptcha)
        return next();
    const token = req.header('X-RECAPTCHA');
    if (!token)
        return res.status(403).send('Recaptcha is required');
    const secret = process.env.RECAPTCHA_SECRETE_KEY;
    try {
        const results = await axios_1.default.post(`https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`, {}, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
            },
        });
        const { success, score } = results.data;
        if (success && score < 0.5)
            return res.status(422).send('Recaptcha error');
        return next();
    }
    catch (error) {
        console.error(error);
        res.status(422).send('Recaptcha error');
    }
};
exports.default = RecaptchaMiddleware;
//# sourceMappingURL=recaptcha.js.map