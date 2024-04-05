import mongoose from "mongoose";

const getCurrentDateWithUTC08 = () => {
  const now = new Date();

  const utc08Offset = +8 * 60; 
  now.setMinutes(now.getMinutes() + utc08Offset);
  return now;
};

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
    default: getCurrentDateWithUTC08,
  },
  updatedAt: {
    type: Date,
    default: getCurrentDateWithUTC08,
  },
});

WalletSchema.pre("update", async function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

export const WalletModel = mongoose.model("Wallet", WalletSchema);
