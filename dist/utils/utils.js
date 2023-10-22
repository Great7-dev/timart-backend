"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.options = exports.generateToken = exports.createOrderSchema = exports.loginSchema = exports.registerSchema = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const joi_1 = __importDefault(require("joi"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.registerSchema = joi_1.default.object({
    name: joi_1.default.string().trim().required(),
    username: joi_1.default.string().trim().required(),
    email: joi_1.default.string().email().lowercase().required(),
    password: joi_1.default.string().required(),
    confirmpassword: joi_1.default.ref('password')
}).with('password', 'confirmpassword');
exports.loginSchema = joi_1.default.object().keys({
    email: joi_1.default.string().email().lowercase(),
    username: joi_1.default.string().trim(),
    password: joi_1.default.string().trim()
});
exports.createOrderSchema = joi_1.default.object().keys({
    name: joi_1.default.string().required(),
    date: joi_1.default.string().trim().required(),
    totalamount: joi_1.default.string().required(),
    address: joi_1.default.string().required()
});
//Generate Token
const generateToken = (user) => {
    const pass = process.env.JWT_SECRET;
    return jsonwebtoken_1.default.sign(user, pass, { expiresIn: '7d' });
};
exports.generateToken = generateToken;
exports.options = {
    abortEarly: false,
    errors: {
        wrap: {
            label: ''
        }
    }
};
