"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const RecaptchaMiddleware = async (req, res, next) => {
    let token = '';
    if (req.method === 'POST') {
        token = req.body.recaptcha;
    }
    else if (req.method === 'GET') {
        token = req.query.recaptcha;
    }
    if (!token) {
        res.status(403).send('Recaptcha is required');
    }
    else {
        const secret = process.env.RECAPTCHA_SECRETE_KEY;
        try {
            const results = await axios_1.default.post(`https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`, {}, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
                },
            });
            const { success, score } = results.data;
            if (success && score >= 0.5) {
                next();
            }
            else {
                res.status(422).send('Recaptcha error');
            }
        }
        catch (error) {
            console.error(error);
            res.status(422).send('Recaptcha error');
        }
    }
};
exports.default = RecaptchaMiddleware;
//# sourceMappingURL=recaptcha.js.map