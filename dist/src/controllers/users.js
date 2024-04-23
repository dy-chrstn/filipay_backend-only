"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionHistories = exports.updateBalance = exports.findWallet = exports.completeRegistration = exports.registerUser = exports.loginUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const moment_1 = __importDefault(require("moment"));
const mongoose_1 = __importDefault(require("mongoose"));
const wallet_1 = require("../services/wallet");
const transactionHistory_1 = require("../services/transactionHistory");
const users_1 = require("../services/users");
const loginUser = async (req, res) => {
    const timestamp = (0, moment_1.default)().format("MMMM Do YYYY, h:mm:ss a");
    try {
        const email = req.body.email;
        const password = req.body.password;
        if (!email || !password) {
            return res.status(400).json({
                messages: {
                    code: 1,
                    message: "Email and password are required",
                    timestamp: timestamp,
                },
                response: {}
            });
        }
        const user = await (0, users_1.getUserByEmail)(email);
        if (!user) {
            return res.status(400).json({
                messages: {
                    code: 1,
                    message: "User not found",
                    timestamp: timestamp,
                },
                response: {}
            });
        }
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (isMatch) {
            return res.status(200).json({
                messages: {
                    code: 0,
                    message: "User logged in successfully"
                },
                response: {
                    id: user._id,
                    email: user.email,
                    pin: user.pin,
                    firstName: user.firstName,
                    middleName: user.middleName,
                    lastName: user.lastName,
                    type: user.type,
                    address: user.address,
                    birthday: user.birthday,
                    mobileNumber: user.mobileNumber,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                },
            });
        }
        else {
            return res.status(400).json({
                messages: {
                    code: 1,
                    message: "Invalid email or password",
                    timestamp: timestamp,
                },
                response: {}
            });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            messages: {
                code: 1,
                message: "Internal server error",
                timestamp: timestamp,
            },
            response: {}
        });
    }
};
exports.loginUser = loginUser;
const registerUser = async (req, res) => {
    try {
        const { email, password, firstName, middleName, lastName, type, address, birthday, mobileNumber, pin, } = req.body;
        if (!email || !password) {
            return res.sendStatus(400).json({
                code: 1,
                message: "Email and password are required",
            });
        }
        const existingUser = await (0, users_1.getUserByEmail)(email);
        if (existingUser) {
            return res.status(400).json({
                messages: {
                    code: 1,
                    message: "Email already exists",
                },
                response: {}
            });
        }
        const hashPassword = await bcrypt_1.default.hash(password, 10);
        let newUser = {
            email: email,
            password: hashPassword,
            firstName: firstName,
            middleName: middleName,
            lastName: lastName,
            type: type,
            address: address,
            birthday: birthday,
            mobileNumber: mobileNumber,
            pin: pin,
        };
        try {
            const user = await (0, users_1.createUser)(newUser);
            const wallet = await (0, wallet_1.createWallet)(user._id);
            return res.status(200).json({
                messages: {
                    code: 0,
                    message: "User created",
                },
                response: {
                    user,
                    wallet,
                }
            });
        }
        catch (error) {
            console.log("Error creating user: ", error);
            return res.sendStatus(400).json({
                messages: {
                    code: 1,
                    message: "Error creating user",
                },
                response: {}
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400).json({
            messages: {
                code: 1,
                message: "Internal server error",
            },
            response: {}
        });
    }
};
exports.registerUser = registerUser;
const completeRegistration = async (req, res) => {
    const id = req.params.id;
    try {
        const objectId = new mongoose_1.default.Types.ObjectId(id);
        const user = await (0, users_1.getUserById)(objectId);
        if (!user) {
            return res.status(400).json({
                messages: {
                    code: 1,
                    message: "User not found",
                },
                response: {}
            });
        }
        const updatedUser = await (0, users_1.updateUser)(user._id, req.body);
        return res.status(200).json({
            messages: {
                code: 0,
                message: "User updated"
            },
            response: {
                _id: updatedUser._id,
                email: updatedUser.email,
                pin: updatedUser.pin,
                firstName: updatedUser.firstName,
                middleName: updatedUser.middleName,
                lastName: updatedUser.lastName,
                type: updatedUser.type,
                address: updatedUser.address,
                birthday: updatedUser.birthday,
                mobileNumber: updatedUser.mobileNumber,
                createdAt: updatedUser.createdAt,
                updatedAt: updatedUser.updatedAt,
            }
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            messages: {
                code: 1,
                message: "Internal server error",
            },
            response: {}
        });
    }
};
exports.completeRegistration = completeRegistration;
const findWallet = async (req, res) => {
    try {
        const id = req.params.id;
        const wallet = await (0, wallet_1.getWallet)(id);
        return res.status(200).json({
            messages: {
                code: 0,
                message: "Wallet found",
            },
            response: {
                _id: wallet._id,
                userId: wallet.userId,
                balance: wallet.balance,
                sNo: wallet.sNo,
                cardId: wallet.cardId,
                createdAt: wallet.createdAt,
                updatedAt: wallet.updatedAt,
            }
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            messages: {
                code: 1,
                message: "Internal server error",
            },
            response: {}
        });
    }
};
exports.findWallet = findWallet;
const updateBalance = async (req, res) => {
    const id = req.params.id;
    const { balance, userId, referenceCode, paymentMethod, serviceFee, status } = req.body;
    try {
        const objectId = new mongoose_1.default.Types.ObjectId(id);
        const user = await (0, users_1.getUserById)(objectId);
        const beforeBalance = await (0, wallet_1.getWallet)(id);
        const wallet = await (0, wallet_1.updateWallet)(id, balance);
        const fullName = `${user.firstName} ${user.middleName} ${user.lastName}`;
        const newHistory = await (0, transactionHistory_1.createTransactionHistory)(userId, referenceCode, paymentMethod, serviceFee, status, fullName, beforeBalance.balance, balance, "Balance updated");
        if (!user) {
            return res.status(400).json({
                messages: {
                    code: 1,
                    message: "User not found",
                },
                response: {}
            });
        }
        if (!wallet) {
            return res.status(400).json({
                messages: {
                    code: 1,
                    message: "Wallet not found",
                },
                response: {}
            });
        }
        if (!newHistory) {
            return res.status(400).json({
                messages: {
                    code: 1,
                    message: "Transaction history not found",
                },
                response: {}
            });
        }
        return res.status(200).json({
            messages: {
                code: 0,
                message: "Wallet updated",
            },
            response: { wallet }
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            messages: {
                code: 1,
                message: "Internal server error",
            },
            response: {}
        });
    }
};
exports.updateBalance = updateBalance;
const getTransactionHistories = async (req, res) => {
    try {
        const id = req.params.id;
        const transactionHistories = await (0, transactionHistory_1.findTransactionHistories)(id);
        return res.status(200).json({
            messages: {
                code: 0,
                message: "User transaction histories retrieved"
            },
            response: transactionHistories
        });
    }
    catch (error) {
        console.log(error);
    }
};
exports.getTransactionHistories = getTransactionHistories;
//# sourceMappingURL=users.js.map