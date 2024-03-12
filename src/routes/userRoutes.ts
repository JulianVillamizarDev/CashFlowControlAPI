import express from "express";
import * as UserController from '../controllers/users/userController.js';
import checkAuth from "../middleware/authMiddleware.js";

const router = express.Router();


//---------PUBLIC ENDPOINTS---------

//GET
router.get("/", UserController.usersList);//users list
router.get("/verify-account/:token", UserController.confirmAccount);//user confirmation
router.get("/setSessionCookie/:session", UserController.setSessionCookie);
router.get("/getSessionCookie", UserController.getSessionCookie);
router.get("/find", UserController.findBy);

//POST
router.post("/register", UserController.createUser);// user registration
router.post("/login", UserController.loginUser);// user login
router.post("/forgot-password", UserController.forgotPassword);

//PUT
router.put('/:id_user', UserController.updateUserInfo);

//route
router.route("/change-password/:token").get( UserController.checkNewPasswordToken ).post( UserController.newPassword );


//---------PRIVATE ENDPOINTS---------

//GET
router.get("/authLogin", checkAuth, UserController.profile);

export default router;