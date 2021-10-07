"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NO_RECAPTCHA = exports.PUBLIC_ROUTES = void 0;
const PUBLIC_ROUTES = [
    {
        path: '/petitions',
        method: 'POST',
    },
    {
        path: '/auth/google',
        method: 'POST',
        skip: true,
    },
    {
        path: '/auth/refresh-token',
        method: 'POST',
        skip: true,
    },
];
exports.PUBLIC_ROUTES = PUBLIC_ROUTES;
const NO_RECAPTCHA = [
    {
        path: '/auth/refresh-token',
        method: 'POST',
    },
];
exports.NO_RECAPTCHA = NO_RECAPTCHA;
//# sourceMappingURL=vars.js.map