import User from "../../models/User.js";
import UserSessions from "../../models/UsersSessions.js";
import { createID, generateJWT } from "../../helpers/helpers.js";
import { sendConfirmationEmail, sendNewPasswordEmail } from "../../helpers/mailer.js";
import { QueryTypes } from "sequelize";
import sequelize from "../../config/db.js";
import { v4 as uuidv4 } from 'uuid';
import { Request, Response } from "express";

//--------------------USERS LIST--------------------
export const usersList = async (req: Request, res: Response) => {
    try {
        const users = await User.findAll({
            attributes: ["username", "email"]
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

export const createUser = async (req: Request, res: Response) => {
    try {
        const { username, email, password, firstname, lastname } = req.body;
        const id_user = createID();

        const emailExist = await User.findOne({ where: { email } });
        const usernameExist = await User.findOne({ where: { username } });

        //EMAIL ALREADY EXIST
        if (emailExist) {
            return res.status(400).json({ hasError: true, msg: "Email already in use" });
        }

        //USERNAME ALREADY EXIST
        if (usernameExist) {
            return res.status(400).json({ hasError: true, msg: "Username already in use" });
        }

        //crear el usuario
        const newUser = await User.create({
            id_user,
            username,
            email,
            password,
            firstname,
            lastname,
        });
        //send email
        sendConfirmationEmail({
            username: newUser.username,
            email: newUser.email,
            token: newUser.token
        });

        //response
        res.status(201).json({ hasError: false, newUser });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'User registration failed',
            error
        });
    }
}

//-------------------------USER LOGIN-------------------------
export const loginUser = async (req: Request, res: Response, next: any) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({
            where: { email },
            attributes: ["id_user", "username", "password", "isConfirmed"]
        });

        //check if user exist
        if (!user) {
            const error = new Error("User not found.");
            return res.status(404).json({
                hasError: true,
                msg: error.message,
                user
            });
        }

        //check if user is confirmed
        if (user.isConfirmed === 0) {
            const error = new Error("This account is not verified.");
            return res.status(403).json({
                hasError: true,
                msg: error.message
            });
        }

        //check if the password is correct
        if (!user.authenticate(password)) {
            const error = new Error("Incorrect password or email.");
            return res.status(403).json({
                hasError: true,
                msg: error.message
            });
        }

        // const jwt = generateJWT(user.id_user);

        // //send session with JWT
        // res.cookie("cfc_session", jwt, {
        //     expires: new Date( Date.now() + (2 * 60 * 60 * 1000)), // expires in 2 days
        //     //secure: true,
        //     httpOnly: true,
        // });
        // res.json({
        //     hasError: false, 
        //     msg: "login seccessful",
        // });

        const user_ip = await fetch("https://api.ipify.org/?format=json")
            .then(response => response.json());

        const newSession = await UserSessions.create({
            id_session: uuidv4(),
            user: user.id_user,
            expire_date: new Date(Date.now() + (1 * 1000 * 60 * 60 * 24 * 2)).toISOString().substring(0, 10),
            session_ip: user_ip.ip
        });

        res.status(200).json({
            hasError: false,
            msg: "Login successful",
            session: newSession,
            user: user.username,
        });

        next();

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Login error',
            error
        });
    }
}

//-----------------------CREATE COOKIE WITH USER SESSION-----------------------
export const setSessionCookie = async (req: Request, res: Response) => {
    const session = req.params;
    res.cookie("CFC_SESSION", session.session, {
        httpOnly: true,
        sameSite: 'lax',
    });

    res.json({ msg: "cookie sent" });
}

//-----------------------SEND SESSION COOKIE-----------------------
export const getSessionCookie = async (req: Request, res: Response) => {

    res.status(200).json({ session: req.cookies });
}

//-------------------------CONFIRM ACCOUNT-------------------------
export const confirmAccount = async (req: Request, res: Response) => {
    try {
        const token = req.params.token;
        //find user
        const user = await User.findOne({
            where: { token },
            attributes: ["id_user", "token", "isConfirmed"]
        });

        if (!user) {
            const error = new Error("User not found.");
            return res.status(404).json({
                hasError: true,
                msg: error.message
            });
        }

        //update and save data
        user.isConfirmed = 1;
        await user.save();

        const query = `UPDATE users SET token = NULL WHERE id_user = "${user.id_user}"`;
        await sequelize.query(query, { types: QueryTypes.UPDATE });

        //response
        res.status(201).json({
            hasError: false,
            msg: "Successful confirmation"
        });
    } catch (error) {
        res.status(500).json({
            msg: 'Confirmation error',
            error
        });
    }
}

//------------------Return user from middleware------------------
export const profile = (req: Request, res: Response) => {
    const { user } = req.body;
    res.json(user);
}

//-------------------------FORGOT PASSWORD-------------------------

export const forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({
            where: { email },
            attributes: ["id_user", "username", "password", "token", "isConfirmed"]
        });

        if (!user) {
            const error = new Error("User not found");
            return res.status(404).json({ msg: error.message });
        }

        if (user.isConfirmed === 0) {
            const error = new Error("User not verified");
            return res.status(404).json({
                msg: error.message
            });
        }

        const newToken = createID();
        const query = `UPDATE users SET token = "${newToken}" WHERE id_user = "${user.id_user}"`;
        await sequelize.query(query, { types: QueryTypes.UPDATE });

        sendNewPasswordEmail({
            username: user.username,
            email,
            token: newToken
        });

        res.status(201).json({ msg: "link sent to your email!" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ error });
    }
};

export const checkNewPasswordToken = async (req: Request, res: Response) => {
    const { token } = req.params;
    try {
        const user = await User.findOne({ where: { token } });

        //User doesnt exist || unvalid token
        if (!user) {
            return res.status(404).json({
                hasError: true,
                msg: "Unvalid token"
            });
        }

        //User is not confirmed
        if (user.isConfirmed === 0) {
            return res.status(403).json({
                hasError: true,
                msg: "User is not confirmed"
            });
        }


        res.status(201).json({
            hasError: false,
            msg: "Valid token"
        });
    } catch (error) {
        res.status(404).json({ error });
    }
}

export const newPassword = async (req: Request, res: Response) => {
    const { token } = req.params;
    const { newPassword } = req.body;
    try {
        const user = await User.findOne({
            where: { token },
            attributes: ["id_user", "password", "token", "isConfirmed"]
        });

        if (!user) {
            const error = new Error("User doesnt exist");
            return res.status(404).json({
                hasError: true,
                msg: error.message
            });
        }

        //User is not confirmed
        if (user.isConfirmed === 0) {
            return res.status(403).json({
                hasError: true,
                msg: "User is not confirmed"
            });
        }

        user.password = newPassword;
        await user.save();

        const query = `UPDATE users SET token = NULL WHERE id_user = "${user.id_user}"`;
        await sequelize.query(query, { type: QueryTypes.UPDATE });

        res.status(201).json({
            hasError: false,
            msg: "your password has been changed"
        });

    } catch (error) {
        res.status(404).json({ error });
    }
}

export const updateUserInfo = async (req: Request, res: Response) => {}

//GET USER BY
export const findBy = async (req: Request, res: Response) => {
    try {
        const query = req.query;

        const user = await User.findOne({
            where: query,
            attributes: ["id_user", "email", "username", "token", "firstname", "lastname"]
        });
    } catch (error) {
        res.render('error', {error})
    }
}