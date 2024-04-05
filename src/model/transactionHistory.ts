import mongoose from "mongoose";

const getCurrentDateWithUTC08 = () => {
  const now = new Date();

  const utc08Offset = +8 * 60; 
  now.setMinutes(now.getMinutes() + utc08Offset);
  return now;
};

const TransactionHistorySchema = new mongoose.Schema({
  userId: {
    type: String,
  },
  referenceCode: {
    type: String
  },
  paymentMethod: {
    type: String
  },
  serviceFee: {
    type: Number
  },
  status:{
    type: String
  },
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
    default: getCurrentDateWithUTC08,
  },
  updatedAt: {
    type: Date,
    default: getCurrentDateWithUTC08, 
  }
});

TransactionHistorySchema.pre("update", async function (next) {
  this.set({ updatedAt: getCurrentDateWithUTC08() });
  next();
});

export const TransactionHistoryModel = mongoose.model("TransactionHistory", TransactionHistorySchema);
