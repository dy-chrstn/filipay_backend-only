"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const getCurrentDateWithUTC08 = () => {
    const now = new Date();
    const utc08Offset = +8 * 60;
    now.setMinutes(now.getMinutes() + utc08Offset);
    return now;
};
const WalletSchema = new mongoose_1.default.Schema({
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
exports.WalletModel = mongoose_1.default.model("Wallet", WalletSchema);
//# sourceMappingURL=wallet.js.map