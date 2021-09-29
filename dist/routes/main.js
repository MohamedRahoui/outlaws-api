"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const indexRoute_1 = __importDefault(require("./indexRoute"));
const Routes = (app) => {
    app.use('/', indexRoute_1.default);
};
exports.default = Routes;
//# sourceMappingURL=main.js.map