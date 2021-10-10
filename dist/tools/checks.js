"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsStaff = exports.SkipRoute = exports.RouteIsNoRecapthca = exports.RouteIsWhiteListed = void 0;
const vars_1 = require("./vars");
const RouteIsWhiteListed = (req) => {
    const isWhiteListed = vars_1.PUBLIC_ROUTES.some((route) => {
        return route.path === req.url && route.method === req.method;
    });
    return isWhiteListed;
};
exports.RouteIsWhiteListed = RouteIsWhiteListed;
const SkipRoute = (req) => {
    const isSkip = vars_1.PUBLIC_ROUTES.some((route) => {
        return route.path === req.url && route.method === req.method && route.skip;
    });
    return isSkip;
};
exports.SkipRoute = SkipRoute;
const RouteIsNoRecapthca = (req) => {
    const isNoRecaptcha = vars_1.NO_RECAPTCHA.some((route) => {
        return route.path === req.url && route.method === req.method;
    });
    return isNoRecaptcha;
};
exports.RouteIsNoRecapthca = RouteIsNoRecapthca;
const IsStaff = (req) => {
    if (!req.user || req.user.role !== 'STAFF')
        return false;
    return true;
};
exports.IsStaff = IsStaff;
//# sourceMappingURL=checks.js.map