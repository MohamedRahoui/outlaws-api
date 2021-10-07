"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const petitionsController_1 = require("@controllers/petitionsController");
const upload_1 = __importDefault(require("@src/middlewares/upload"));
const router = (0, express_1.Router)();
router.post('/', upload_1.default, petitionsController_1.Create);
router.get('/', petitionsController_1.GetAll);
router.get('/files/:uuid', petitionsController_1.GetFiles);
router.post('/validate', petitionsController_1.Validate);
exports.default = router;
//# sourceMappingURL=petitionsRoute.js.map