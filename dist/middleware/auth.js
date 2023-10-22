"use strict";
// import express, { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';
// const secret = process.env.JWT_SECRET as string;
// import  User  from '../models/userModel';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret = process.env.JWT_SECRET;
const userModel_1 = __importDefault(require("../models/userModel"));
async function auth(req, res, next) {
    try {
        const authorization = req.headers.authorization;
        if (!authorization) {
            return res.status(401).json({
                Error: 'Kindly sign in as a user'
            });
        }
        // Hide part of the token
        const token = authorization?.slice(7, authorization.length) || req.cookies.mytoken;
        const verified = jsonwebtoken_1.default.verify(token, secret);
        if (!verified) {
            return res.status(401).json({
                Error: "User not verified, you can't access this route"
            });
        }
        const { id } = verified;
        const user = await userModel_1.default.findOne({ where: { id } });
        if (!user) {
            return res.status(404).json({
                Error: 'User not found'
            });
        }
        req.user = verified;
        next();
    }
    catch (error) {
        return res.status(500).json({
            Error: "User not logged in"
        });
    }
}
exports.auth = auth;
