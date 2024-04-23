"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const token_1 = require("../services/token");
const getToken = async (req, res) => {
    try {
        const user = req.auth.user;
        const password = req.auth.password;
        let TokenData = {
            email: user,
            password: password,
        };
        const token = jsonwebtoken_1.default.sign(TokenData, process.env.SECRET_KEY, {
            expiresIn: "1m",
        });
        try {
            const newToken = await (0, token_1.createToken)(token);
            return res.status(200).json({
                messages: {
                    code: 0,
                    message: "Token created",
                },
                response: newToken
            });
        }
        catch (error) {
            console.log(error);
            return res.sendStatus(400).json({
                messages: {
                    code: 1,
                    message: "Invalid credentials",
                }
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400).json({
            messages: {
                code: 1,
                message: "Invalid credentials",
            },
            response: {}
        });
    }
};
exports.getToken = getToken;
//# sourceMappingURL=token.js.map