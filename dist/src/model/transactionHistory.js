"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionHistoryModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const getCurrentDateWithUTC08 = () => {
    const now = new Date();
    const utc08Offset = +8 * 60;
    now.setMinutes(now.getMinutes() + utc08Offset);
    return now;
};
const TransactionHistorySchema = new mongoose_1.default.Schema({
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
    status: {
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
exports.TransactionHistoryModel = mongoose_1.default.model("TransactionHistory", TransactionHistorySchema);
//# sourceMappingURL=transactionHistory.js.map