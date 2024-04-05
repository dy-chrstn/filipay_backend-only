import { TransactionHistoryModel } from "../model/transactionHistory";

export const createTransactionHistory = (
  userId: string,
  referenceCode: string,
  paymentMethod: string,
  serviceFee: number,
  status: string,
  name: string,
  previousBalance: number,
  newBalance: number,
  message: string
) => new TransactionHistoryModel({ userId, referenceCode, paymentMethod, serviceFee, status, name, previousBalance, newBalance, message }).save();

export const findTransactionHistories = (userId: string) => TransactionHistoryModel.find({ userId: userId });