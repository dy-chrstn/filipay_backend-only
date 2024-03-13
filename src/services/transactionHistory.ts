import { TransactionHistoryModel } from "../model/transactionHistory";

export const createTransactionHistory = (
  name: string,
  previousBalance: number,
  newBalance: number,
  message: string
) => new TransactionHistoryModel({ name, previousBalance, newBalance, message }).save();
