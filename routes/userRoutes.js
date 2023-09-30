import express from "express";
import { 
    usersList,
    createUser,
    loginUser,
    confirmAccount,
    profile,
    forgotPassword,
    checkNewPasswordToken,
    newPassword,
    getUserByToken,
    getUserById,
    getUserByUsername,
    getUserByEmail
} from "../controllers/userController.js";
import checkAuth from "../middleware/authMiddleware.js";

const router = express.Router();


//---------PUBLIC ENDPOINTS---------

//GET
router.get("/", usersList);//users list
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
router.get("/:id", getUserById);
router.get("/token/:token", getUserByToken);
router.get("/username/:username", getUserByUsername);
router.get("/email/:username", getUserByUsername);


export default router;