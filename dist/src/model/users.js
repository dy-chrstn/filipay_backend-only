"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const getCurrentDateWithUTC08 = () => {
    const now = new Date();
    const utc08Offset = +8 * 60;
    now.setMinutes(now.getMinutes() + utc08Offset);
    return now;
};
const UserSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    pin: {
        type: String,
    },
    firstName: {
        type: String,
    },
    middleName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    type: {
        type: String,
    },
    address: {
        type: String,
    },
    birthday: {
        type: Date,
    },
    mobileNumber: {
        type: String,
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
UserSchema.pre("save", async function (next) {
    this.set({ type: "STANDARD" });
    next();
});
UserSchema.pre("update", async function (next) {
    this.set({ updatedAt: getCurrentDateWithUTC08 });
    next();
});
exports.UserModel = mongoose_1.default.model("User", UserSchema);
//# sourceMappingURL=users.js.map