"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = exports.getUser = exports.LoginUser = exports.RegisterUser = void 0;
const uuid_1 = require("uuid");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const utils_1 = require("../utils/utils");
const userModel_1 = __importDefault(require("../models/userModel"));
const orderModel_1 = __importDefault(require("../models/orderModel"));
async function RegisterUser(req, res, next) {
    const id = (0, uuid_1.v4)();
    try {
        const ValidateUser = utils_1.registerSchema.validate(req.body, utils_1.options);
        if (ValidateUser.error) {
            return res.status(400).json({
                Error: ValidateUser.error.details[0].message,
            });
        }
        const duplicatEmail = await userModel_1.default.findOne({
            where: { email: req.body.email },
        });
        if (duplicatEmail) {
            return res.status(409).json({
                msg: "Email is used, please enter another email",
            });
        }
        const duplicateUsername = await userModel_1.default.findOne({
            where: { username: req.body.username },
        });
        if (duplicateUsername) {
            return res.status(409).json({
                msg: "Username is used",
            });
        }
        const passwordHash = await bcryptjs_1.default.hash(req.body.password, 8);
        const record = await userModel_1.default.create({
            id: id,
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            password: passwordHash,
        });
        if (record) {
            return res.status(201).json({
                status: "Success",
                msg: "User created successfully",
                record
            });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'failed to register',
            route: '/create'
        });
    }
}
exports.RegisterUser = RegisterUser;
async function LoginUser(req, res, next) {
    const id = (0, uuid_1.v4)();
    try {
        const validateResult = utils_1.loginSchema.validate(req.body, utils_1.options);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message
            });
        }
        const userEmail = req.body.email;
        const userName = req.body.username;
        const record = userEmail
            ? (await userModel_1.default.findOne({
                where: [{ email: userEmail }]
            }))
            : (await userModel_1.default.findOne({
                where: [{ username: userName }]
            }));
        if (!record) {
            return res.status(404).json({
                status: "fail",
                msg: "Incorrect username/e-mail or password",
            });
        }
        const { id } = record;
        const { password } = record;
        const token = (0, utils_1.generateToken)({ id });
        res.cookie('mytoken', token, { httpOnly: true });
        res.cookie('id', id, { httpOnly: true });
        const validUser = await bcryptjs_1.default.compare(req.body.password, password);
        if (!validUser) {
            res.status(401);
            res.json({ message: "incorrect password"
            });
        }
        if (validUser) {
            res.status(200);
            res.json({ message: "login successful",
                record: record,
                token: token,
            });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500);
        res.json({
            message: 'failed to login',
            route: '/login'
        });
    }
}
exports.LoginUser = LoginUser;
async function getUser(req, res, next) {
    try {
        const id = req.params.id;
        const record = await userModel_1.default.findOne({ where: { id } });
        res.status(200).json({
            record
        });
    }
    catch (error) {
        res.status(500).json({
            msg: 'failed to get user',
            route: '/user/:id'
        });
    }
}
exports.getUser = getUser;
async function getUsers(req, res, next) {
    try {
        const limit = req.query.limit;
        const offset = req.query.offset;
        const id = req.params.id;
        const record = await userModel_1.default.findAndCountAll({ where: {}, limit, offset, include: [{
                    model: orderModel_1.default,
                    as: "orders"
                }] });
        res.status(200).json({
            record
        });
    }
    catch (error) {
        res.status(500).json({
            msg: 'failed to get users',
            route: '/getusers'
        });
    }
}
exports.getUsers = getUsers;
