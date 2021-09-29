"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const googleController_1 = require("@src/controllers/auth/googleController");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post('/', googleController_1.AuthGoogle);
exports.default = router;
//# sourceMappingURL=googleRoute.js.map