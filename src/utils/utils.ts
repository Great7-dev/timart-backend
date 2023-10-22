import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import Joi from 'joi';
import jwt from 'jsonwebtoken';

export const registerSchema = Joi.object({
    name: Joi.string().trim().required(),
    username: Joi.string().trim().required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().required(),
    confirmpassword: Joi.ref('password')
  }).with('password', 'confirmpassword');

  export const loginSchema = Joi.object().keys({
    email: Joi.string().email().lowercase(),
    username: Joi.string().trim(),
    password: Joi.string().trim()
  });

  export const createOrderSchema = Joi.object().keys({
    name: Joi.string().required(),
    date: Joi.string().trim().required(),
    totalamount: Joi.string().required(),
    address: Joi.string().required()
  });  

  //Generate Token
export const generateToken = (user: { [key: string]: unknown }): unknown => {
    const pass = process.env.JWT_SECRET as string;
    return jwt.sign(user, pass, { expiresIn: '7d' });
  };

  export const options = {
    abortEarly: false,
    errors: {
      wrap: {
        label: ''
      }
    }
  };