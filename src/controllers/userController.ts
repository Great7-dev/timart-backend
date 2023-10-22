import express,{Request, Response, NextFunction } from 'express'
import dotenv from "dotenv";
import { v4 as uuidv4} from "uuid"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { generateToken, loginSchema, options, registerSchema } from '../utils/utils';
import User from '../models/userModel';
import Order from '../models/orderModel';

export async function RegisterUser(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
      const id = uuidv4();
      try {
          const ValidateUser = registerSchema.validate(req.body,options);
          if (ValidateUser.error) {
              return res.status(400).json({
                  Error: ValidateUser.error.details[0].message,
              });
          }
          const duplicatEmail = await User.findOne({
              where: { email: req.body.email },
          });
          if (duplicatEmail) {
              return res.status(409).json({
                  msg: "Email is used, please enter another email",
              });
          }
  
          const duplicateUsername= await User.findOne({
              where: { username: req.body.username },
          });
  
          if (duplicateUsername) {
              return res.status(409).json({
                  msg: "Username is used",
              });
          }
          const passwordHash = await bcrypt.hash(req.body.password, 8);
          const record = await User.create({
              id: id,
              name: req.body.name,
              username: req.body.username,
              email: req.body.email,
              password: passwordHash,
          })
          if (record) {      
         return res.status(201).json({
          status:"Success",
          msg:"User created successfully",
          record})
          }  
      } catch (error) {
        console.log(error)
          res.status(500).json({
              message:'failed to register',
              route:'/create'
  
          })
      }
      
  }

  export async function LoginUser(req:Request, res:Response, next:NextFunction) {
    const id = uuidv4()
    try{
        const validateResult = loginSchema.validate(req.body,options)
        if(validateResult.error){
            return res.status(400).json({
                Error:validateResult.error.details[0].message
            })
        }
        const userEmail = req.body.email;
        const userName = req.body.username;
    
        const record = userEmail
          ? ((await User.findOne({
            where: [{ email: userEmail }]
          })) as unknown as { [key: string]: string })
          : ((await User.findOne({
            where: [{ username: userName }]
          })) as unknown as { [key: string]: string });
    
          if (!record) {
            return res.status(404).json({
              status: "fail",
              msg: "Incorrect username/e-mail or password",
            });
          }

       const {id} = record
       const { password } = record;
       const token = generateToken({id})
       res.cookie('mytoken', token, {httpOnly:true})
       res.cookie('id',id,{httpOnly:true})
       const validUser= await bcrypt.compare(req.body.password, password)
       if(!validUser){
        res.status(401)
       res.json({message: "incorrect password"  
         })
       }
       if(validUser){
       res.status(200)
       res.json({message: "login successful",
       record: record,  
          token: token,
         })
       }
    } catch(err){
        console.log(err)
        res.status(500)
        res.json({
            message:'failed to login',
            route:'/login'

        })
    }

  }

export async function getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id
      const record = await User.findOne({ where: { id } })
      res.status(200).json({
        record
      })
    } catch (error) {
      res.status(500).json({
        msg: 'failed to get user',
        route: '/user/:id'
  
      })
    }
  }

  export async function getUsers(req: Request, res: Response, next: NextFunction) {
    try {
        const limit = req.query.limit as number | undefined
        const offset = req.query.offset as number| undefined
      const id = req.params.id
      const record = await User.findAndCountAll({where:{}, limit, offset,include:[{
        model:Order,
        as:"orders"
    }]})
      res.status(200).json({
        record
      })
    } catch (error) {
      res.status(500).json({
        msg: 'failed to get users',
        route: '/getusers'
  
      })
    }
  }
  