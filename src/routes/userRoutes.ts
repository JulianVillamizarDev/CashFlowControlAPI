import express from "express";
import * as userController from '../controllers/userController.js';
import checkAuth from "../middleware/authMiddleware.js";

const router = express.Router();


//---------PUBLIC ENDPOINTS---------

//GET
router.get("/", userController.usersList);//users list
router.get("/verify-account/:token", userController.confirmAccount);//user confirmation
router.get("/setSessionCookie/:session", userController.setSessionCookie);
router.get("/getSessionCookie", userController.getSessionCookie);
router.get("/find", userController.findBy);

//POST
router.post("/register", userController.createUser);// user registration
router.post("/login", userController.loginUser);// user login
router.post("/forgot-password", userController.forgotPassword);

//PUT
router.put('/:id_user', userController.updateUserInfo);

//route
router.route("/change-password/:token").get( userController.checkNewPasswordToken ).post( userController.newPassword );


//---------PRIVATE ENDPOINTS---------

//GET
router.get("/authLogin", checkAuth, userController.profile);



export default router;