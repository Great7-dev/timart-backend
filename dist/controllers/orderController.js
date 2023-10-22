"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserOrder = exports.CreateOrder = void 0;
const uuid_1 = require("uuid");
const utils_1 = require("../utils/utils");
const orderModel_1 = __importDefault(require("../models/orderModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
async function CreateOrder(req, res, next) {
    const id = (0, uuid_1.v4)();
    try {
        const userID = req.user.id;
        const ValidateAccount = utils_1.createOrderSchema.validate(req.body, utils_1.options);
        if (ValidateAccount.error) {
            return res.status(400).json({
                Error: ValidateAccount.error.details[0].message,
            });
        }
        const duplicatName = await orderModel_1.default.findOne({
            where: { name: req.body.name },
        });
        if (duplicatName) {
            return res.status(409).json({
                msg: "Order already placed",
            });
        }
        const record = await orderModel_1.default.create({
            id: id,
            name: req.body.name,
            date: req.body.date,
            address: req.body.address,
            userId: userID,
            totalamount: req.body.totalamount,
        });
        if (record) {
            return res.status(201).json({
                msg: "Order created successfully",
                data: record
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "Internal server error",
            error: error
        });
    }
}
exports.CreateOrder = CreateOrder;
async function getUserOrder(req, res, next) {
    try {
        const { id } = req.params;
        const record = await userModel_1.default.findOne({ where: { id } });
        return res.status(200).json({ "record": record });
    }
    catch (error) {
        return res.status(500).json({
            msg: "Invalid User",
            route: "/read/:id",
        });
    }
}
exports.getUserOrder = getUserOrder;
