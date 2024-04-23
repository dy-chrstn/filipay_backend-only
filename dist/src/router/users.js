"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import { registerUser, loginUser } from '../controllers/users';
const users_1 = require("../controllers/users");
const index_1 = require("../middlewares/index");
exports.default = (router) => {
    router.post('/register', index_1.tokenAuth, index_1.checkCredentials, users_1.registerUser);
    router.post('/login', index_1.tokenAuth, index_1.checkCredentials, users_1.loginUser);
    router.get('/getWallet/:id', index_1.tokenAuth, users_1.findWallet);
    router.get('/getHistories/:id', index_1.tokenAuth, users_1.getTransactionHistories);
    router.patch('/update/:id', index_1.tokenAuth, users_1.completeRegistration);
    router.patch('/updateBalance/:id', index_1.tokenAuth, users_1.updateBalance);
};
//# sourceMappingURL=users.js.map