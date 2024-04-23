"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const token_1 = require("../controllers/token");
const index_1 = require("../middlewares/index");
exports.default = (router) => {
    router.get('/getToken', index_1.isAuthorized, token_1.getToken);
};
//# sourceMappingURL=token.js.map