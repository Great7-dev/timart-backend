import express,{Request,Response, NextFunction } from 'express';
import { v4 as uuidv4, validate } from "uuid";
import { createOrderSchema, options } from '../utils/utils';
import Order from '../models/orderModel';
import User from '../models/userModel';


export async function CreateOrder(
    req: Request | any,
    res: Response,
    next: NextFunction
  ) {
      const id = uuidv4();
      try {
          const userID=req.user.id;
          const ValidateAccount = createOrderSchema.validate(req.body,options);
          if (ValidateAccount.error) {
              return res.status(400).json({
                  Error: ValidateAccount.error.details[0].message,
              });
          }
          const duplicatName = await Order.findOne({
              where: { name: req.body.name },
          });
          if (duplicatName) {
              return res.status(409).json({
                  msg: "Order already placed",
              });
          }
          const record = await Order.create({
              id: id,
              name: req.body.name,
              date: req.body.date,
              address:req.body.address,
              userId: userID,
              totalamount: req.body.totalamount,
          })
          if (record) {
              return res.status(201).json({
                  msg: "Order created successfully",
                  data: record
              })
          }
      } catch (error) {
        console.log(error)
          return res.status(500).json({
              msg: "Internal server error",
              error: error
          })
      }
  }

  export async function getUserOrder(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const record = await User.findOne({ where: { id } });
  
      return res.status(200).json({ "record": record });
    } catch (error) {
      return res.status(500).json({
        msg: "Invalid User",
        route: "/read/:id",
      });
    }
  }





