"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.getUserById = exports.getUserByEmail = exports.createUser = void 0;
const users_1 = require("../model/users");
// User Actions
const createUser = (data) => new users_1.UserModel(data).save();
exports.createUser = createUser;
const getUserByEmail = (email) => users_1.UserModel.findOne({ email });
exports.getUserByEmail = getUserByEmail;
const getUserById = (id) => users_1.UserModel.findOne({ _id: id });
exports.getUserById = getUserById;
const updateUser = async (id, data) => {
    return await users_1.UserModel.findOneAndUpdate({ _id: id }, data, { new: true });
};
exports.updateUser = updateUser;
//# sourceMappingURL=users.js.map