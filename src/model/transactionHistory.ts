import mongoose from "mongoose";

const TransactionHistorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  previousBalance: {
    type: Number,
  },
  newBalance: {
    type: Number,
  },
  message: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

TransactionHistorySchema.pre("update", async function (next) {
  this.set({ updatedAt: new Date() });
  next();
})

export const TransactionHistoryModel = mongoose.model("TransactionHistory", TransactionHistorySchema)