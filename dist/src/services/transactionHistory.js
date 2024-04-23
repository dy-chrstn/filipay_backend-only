"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findTransactionHistories = exports.createTransactionHistory = void 0;
const transactionHistory_1 = require("../model/transactionHistory");
const createTransactionHistory = (userId, referenceCode, paymentMethod, serviceFee, status, name, previousBalance, newBalance, message) => new transactionHistory_1.TransactionHistoryModel({ userId, referenceCode, paymentMethod, serviceFee, status, name, previousBalance, newBalance, message }).save();
exports.createTransactionHistory = createTransactionHistory;
const findTransactionHistories = (userId) => transactionHistory_1.TransactionHistoryModel.find({ userId: userId });
exports.findTransactionHistories = findTransactionHistories;
//# sourceMappingURL=transactionHistory.js.map