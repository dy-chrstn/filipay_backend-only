"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getToken = exports.createToken = void 0;
const token_1 = require("../model/token");
const moment_1 = __importDefault(require("moment"));
const createToken = (token) => {
    try {
        const expiresAt = (0, moment_1.default)().add('1m').toDate();
        const newToken = new token_1.TokenModel({
            token,
            expiresAt
        });
        return newToken.save();
    }
    catch (error) {
        console.log('Error saving token: ' + error);
    }
};
exports.createToken = createToken;
const getToken = (token) => {
    try {
        return token_1.TokenModel.findOne({ token: token });
    }
    catch (error) {
        console.log('Error getting token: ' + error);
    }
};
exports.getToken = getToken;
//# sourceMappingURL=token.js.map