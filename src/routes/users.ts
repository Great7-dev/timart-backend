import express from 'express';
import { LoginUser, RegisterUser, getUser, getUsers } from '../controllers/userController';
import { CreateOrder, getUserOrder } from '../controllers/orderController';
import { auth } from '../middleware/auth';
const router = express.Router()

/* GET users listing. */
router.post('/create', RegisterUser);
router.get('/getuser/:id', getUser);
router.post('/login', LoginUser)
router.post('/createorder', auth, CreateOrder )
router.get('/getorder/:id', auth, getUserOrder )
router.get('/getusers', getUsers )

export default router;
