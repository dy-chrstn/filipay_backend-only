import { WalletModel } from "../model/wallet";

export const createWallet = (userId: object) => new WalletModel({ userId }).save()
export const getWallet = (userId: string) => WalletModel.findOne({ userId })
export const updateWallet = async (userId: string, newBalance: number) => {
    return await WalletModel.findOneAndUpdate({ userId: userId }, {$set: {balance: newBalance}}, {new: true});
}