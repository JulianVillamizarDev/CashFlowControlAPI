import User from "../models/User.js";
import { createID, generateJWT } from "../helpers/helpers.js";
import {sendConfirmationEmail, sendNewPasswordEmail} from "../helpers/mailer.js";

//--------------------USERS LIST--------------------
const usersList = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ["username","email"]
        });
        res.json(users)
    } catch (error) {
        res.status(500).json({ 
            message: 'Users list error',
            error
        });
    }
}
//------------------USER REGISTRATION------------------

const createUser = async (req, res) => {
    try {
        const { username, email, password, firstname, lastname } = req.body;
        const id_user = createID();
        //crear el usuario
        const newUser = await User.create({
            id_user,
            username,
            email,
            password,
            firstname,
            lastname,
            isConfirmed: 0
        });

        //send email
        sendConfirmationEmail({
            username: newUser.username, 
            email: newUser.email, 
            token: newUser.token
        });

        //response
        res.status(201).json(newUser);
    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            msg: 'User registration failed',
            error
        });
    }
}

//-------------------------USER LOGIN-------------------------
const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;

        console.log(typeof password);
        const user = await User.findOne({
            where: {email},
            attributes: ["id_user", "username", "password", "isConfirmed"]
        });

        //check if user exist
        if(!user){
            const error = new Error("User not found");
            return res.status(404).json({msg: error.message}); 
        }

        //check if user is confirmed
        if( user.isConfirmed === 0){
            const error = new Error("Account not confirmed");
            return res.status(403).json({msg: error.message});
        }

        //check if the password is correct
        if(!user.authenticate(password)){
            const error = new Error("Incorrect password");
            return res.status(403).json({msg: error.message});
        }

        const jwt = generateJWT(user.id_user);

        res.status(200).json({
            msg: "Login successful",
            jwt
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            msg: 'Login error',
            error
        });
    }
}

//-------------------------CONFIRM ACCOUNT-------------------------
const confirmAccount = async (req, res) => {
    try {
        const token = req.params.token;
        //find user
        const user = await User.findOne({
            where: {token},
            attributes: ["id_user","token", "isConfirmed"]
        });

        //update and save data
        user.isConfirmed = 1;
        user.token = null;
        await user.save();

        //response
        res.status(201).json({msg: "Successful confirmation"});
    } catch (error) {
        res.status(500).json({ 
            msg: 'Confirmation error',
            error
        });
    }
}

//------------------JWT authentication test------------------
const profile = (req, res) => {
    const { user } = req;
    res.json({
        msg: "from profile",
        profile: user
});
}

//-------------------------FORGOT PASSWORD-------------------------

const forgotPassword = async (req, res) => {
    const {email} = req.body;
    const user = await User.findOne({
        where: {email},
        attributes: ["id_user", "username", "password", "token"]
    });

    if(!user){
        const error = new Error("User not found");
        return res.status(404).json({msg: error.message});
    }

    try {
        const token = createID();
        console.log(token);
        user.token = token;
        await user.save();
        sendNewPasswordEmail({
            username: user.username, 
            email,
            token
        });
        res.status(201).json({msg: "link sent to your email!"});
    } catch (error) {
        res.status(400).json({error});
    }
};

const checkNewPasswordToken = async (req, res) => {
    const {token} = req.params;
    try {
        const user = await User.findOne({where: {token}});

        //User doesnt exist || unvalid token
        if(!user){
            return res.status(404).json({msg: "Unvalid token"});
        }

        //User is not confirmed
        if(user.isConfirmed === 0){
            return res.status(403).json({msg: "User is not confirmed"});
        }


        res.status(201).json({msg: "Valid token"});
    } catch (error) {
        res.status(404).json({error});
    }
}

const newPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;
    try {
        const user = await User.findOne({
            where: { token },
            attributes: ["id_user","password", "token"]
        });

        if(!user){
            const error = new Error("User doesnt exist");
            return res.status(404).json({error: error.message});
        }

        user.password = newPassword;
        user.token = null;
        await user.save();
        console.log(user.password);
        res.status(201).json({msg: "your password has been changed"});

    } catch ( error ) {
        res.status(404).json({error});
    }
}
//--------------------EXPORT--------------------
export {
    usersList,
    createUser,
    loginUser,
    confirmAccount,
    profile,
    forgotPassword,
    checkNewPasswordToken,
    newPassword
}

