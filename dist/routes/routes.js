"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const indexRoute_1 = __importDefault(require("./indexRoute"));
const googleRoute_1 = __importDefault(require("@routes/auth/googleRoute"));
const Routes = (app) => {
    app.use('/', indexRoute_1.default);
    app.use('/auth/google', googleRoute_1.default);
};
exports.default = Routes;
//# sourceMappingURL=routes.js.map