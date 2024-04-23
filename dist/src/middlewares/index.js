"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkCredentials = exports.tokenAuth = exports.isAuthorized = void 0;
// require("dotenv").config();
const express_basic_auth_1 = __importDefault(require("express-basic-auth"));
const token_1 = require("../services/token");
exports.isAuthorized = (0, express_basic_auth_1.default)({
    authorizeAsync: true,
    authorizer: async (username, password, cb) => {
        try {
            // console.log(username, password);
            // console.log(process.env.USERNAME, process.env.PASSWORD);
            if (username === process.env.USERNAMEE &&
                password === process.env.PASSWORD) {
                return cb(null, true);
            }
            else {
                return cb(null, false, { message: "Invalid credentials", status: 401 });
            }
        }
        catch (error) {
            return cb(error);
        }
    },
    challenge: true,
    unauthorizedResponse: () => {
        return {
            messages: {
                code: 1,
                message: "Unauthorized",
            },
            response: {}
        };
    },
});
const tokenAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res
            .status(401)
            .json({
            messages: {
                code: 1, message: "Unauthorized access"
            },
            response: {}
        });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        return res
            .status(401)
            .json({
            messages: {
                code: 1, message: "Bearer token is missing"
            },
            response: {}
        });
    }
    try {
        const existingToken = await (0, token_1.getToken)(token);
        if (!existingToken) {
            return res
                .status(401)
                .json({
                messages: {
                    code: 1,
                    message: "Token no similarities"
                },
                response: {}
            });
        }
        next();
    }
    catch (error) {
        return res
            .status(401)
            .json({
            messages: { code: 1, message: "Invalid token" },
            response: { token: token }
        });
    }
};
exports.tokenAuth = tokenAuth;
const checkCredentials = async (req, res, next) => {
    const { email, password } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileNumberRegex = /^(09|\+639)\d{9}$/;
    const passwordRegex = /^.{8,}$/;
    if (emailRegex.test(email)) {
        if (!passwordRegex.test(password)) {
            return res
                .status(401)
                .json({
                messages: { code: 1, message: "Password must be at least 8 characters" },
                response: {}
            });
        }
    }
    else if (mobileNumberRegex.test(email)) {
        if (!passwordRegex.test(password)) {
            return res
                .status(401)
                .json({
                messages: { code: 1, message: "Password must be at least 8 characters" },
                response: {}
            });
        }
    }
    else {
        return res
            .status(401)
            .json({
            messages: { code: 1, message: "Invalid email or password" },
            response: {}
        });
    }
    next();
};
exports.checkCredentials = checkCredentials;
//# sourceMappingURL=index.js.map