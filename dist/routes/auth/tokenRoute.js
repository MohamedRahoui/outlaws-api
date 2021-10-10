"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tokenController_1 = require("@src/controllers/auth/tokenController");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post('/', tokenController_1.Refresh);
exports.default = router;
//# sourceMappingURL=tokenRoute.js.map