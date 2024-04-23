"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateWallet = exports.getWallet = exports.createWallet = void 0;
const wallet_1 = require("../model/wallet");
const createWallet = (userId) => new wallet_1.WalletModel({ userId }).save();
exports.createWallet = createWallet;
const getWallet = (userId) => wallet_1.WalletModel.findOne({ userId });
exports.getWallet = getWallet;
const updateWallet = async (userId, newBalance) => {
    return await wallet_1.WalletModel.findOneAndUpdate({ userId: userId }, { $set: { balance: newBalance } }, { new: true });
};
exports.updateWallet = updateWallet;
//# sourceMappingURL=wallet.js.map