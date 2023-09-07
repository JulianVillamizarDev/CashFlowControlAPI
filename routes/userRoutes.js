import express from "express";
import { 
    usersList,
    createUser,
    loginUser,
    confirmAccount,
    profile,
    forgotPassword,
    checkNewPasswordToken,
    newPassword
} from "../controllers/userController.js";
import checkAuth from "../middleware/authMiddleware.js";

const router = express.Router();


//---------PUBLIC ENDPOINTS---------

//GET
router.get("/users", usersList);//users list
router.get("/confirm/:token", confirmAccount);//user confirmation
//POST
router.post("/register", createUser);// user registration
router.post("/login",loginUser);// user login
router.post("/forgotPassword", forgotPassword);
//route
router.route("/forgotPassword/:token").get( checkNewPasswordToken ).post( newPassword );


//---------PRIVATE ENDPOINTS---------

//GET
router.get("/profile", checkAuth, profile);


export default router;