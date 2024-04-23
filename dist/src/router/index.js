"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = __importDefault(require("./users"));
const token_1 = __importDefault(require("./token"));
const router = express_1.default.Router();
exports.default = () => {
    (0, users_1.default)(router);
    (0, token_1.default)(router);
    return router;
};
//# sourceMappingURL=index.js.map