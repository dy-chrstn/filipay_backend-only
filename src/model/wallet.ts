import mongoose from "mongoose";

const WalletSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    default: 0
  },
  sNo: {
    type: String,
    default: ""
  },
  cardId: {
    type: String,
    default: ""
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

WalletSchema.pre("update", async function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

export const WalletModel = mongoose.model("Wallet", WalletSchema);
