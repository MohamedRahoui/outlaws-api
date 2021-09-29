"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const indexController_1 = require("@controllers/indexController");
const router = (0, express_1.Router)();
router.get('/', indexController_1.Get);
exports.default = router;
//# sourceMappingURL=indexRoute.js.map