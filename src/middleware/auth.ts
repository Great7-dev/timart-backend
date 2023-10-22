// import express, { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';
// const secret = process.env.JWT_SECRET as string;
// import  User  from '../models/userModel';

// export async function auth(req: Request | any, res: Response, next: NextFunction) {


//     try {
//         const authorization = req.headers.authorization;

//         if (!authorization) {
//             res.status(401)
//             res.json({
//                 Error: 'kindly sign in as a user'
//             })
//         }
//         //hide part of the token 
//         const token = authorization?.slice(7, authorization.length) as string || req.cookies.mytoken
//         const verified = jwt.verify(token, secret);

//         if (!verified) {
//             res.status(401)
//             res.json({
//                 Error: 'User not verified, you cant access this route'
//             })
//             return
//         }
//         const { id } = verified as { [key: string]: string }

//         const user = await User.findOne({ where: { id } })
//         if (!user) {
//             res.status(404)
//             res.json({
//                 Error: 'user not verified'
//             })
//             return
//         }
//         req.user = verified;

//         next()
//     } catch (error) {
//         res.status(500)
//         res.json({
//             Error: "user not logged in"
//         })
//         return
//     }

// }

import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET as string;
import User from '../models/userModel';

export async function auth(req: Request | any, res: Response, next: NextFunction) {
    try {
        const authorization = req.headers.authorization;

        if (!authorization) {
            return res.status(401).json({
                Error: 'Kindly sign in as a user'
            });
        }

        // Hide part of the token
        const token = authorization?.slice(7, authorization.length) as string || req.cookies.mytoken;
        const verified = jwt.verify(token, secret);

        if (!verified) {
            return res.status(401).json({
                Error: "User not verified, you can't access this route"
            });
        }

        const { id } = verified as { [key: string]: string };

        const user = await User.findOne({ where: { id } });

        if (!user) {
            return res.status(404).json({
                Error: 'User not found'
            });
        }

        req.user = verified;
        next();
    } catch (error) {
        return res.status(500).json({
            Error: "User not logged in"
        });
    }
}
