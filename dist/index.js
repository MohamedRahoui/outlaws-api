"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("module-alias/register");
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("@routes/routes"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const recaptcha_1 = __importDefault(require("./middlewares/recaptcha"));
const jwt_1 = __importDefault(require("./middlewares/jwt"));
const app = (0, express_1.default)();
const PORT = process.env.PORT;
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
});
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('common'));
app.use((0, helmet_1.default)());
app.use(limiter);
app.use(recaptcha_1.default);
app.use(jwt_1.default);
(0, routes_1.default)(app);
app.listen(PORT, () => {
    console.log(`Outlaws API listening at http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map