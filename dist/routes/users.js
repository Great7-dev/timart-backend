"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const orderController_1 = require("../controllers/orderController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
/* GET users listing. */
router.post('/create', userController_1.RegisterUser);
router.get('/getuser/:id', userController_1.getUser);
router.post('/login', userController_1.LoginUser);
router.post('/createorder', auth_1.auth, orderController_1.CreateOrder);
router.get('/getorder/:id', auth_1.auth, orderController_1.getUserOrder);
router.get('/getusers', userController_1.getUsers);
exports.default = router;
