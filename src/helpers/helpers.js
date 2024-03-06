import jwt from "jsonwebtoken";
import UsersSessions from "../models/UsersSessions.js";

//GENERATE ID
export const createID = () => {
    const length = 30;
    const characters = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZabcdefghijklmnñopqrstuvwxyz0123456789';
    const tokenArray = [];

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        const randomChar = characters.charAt(randomIndex);
        tokenArray.push(randomChar);
    }

    return tokenArray.join('');
}


//GENERATE JSON WEB TOKEN
export const generateJWT = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: "2d"
    });
}

//const authorize session token

export const authSessionToken = async(token) => {

    //find session in the db
    const session = await UsersSessions.findByPk(token,{
        attributes: [
            'id_session', 
            'user', 
            'expire_date', 
            'session_ip',
        ]
    });

    //if the session is not found, throw error
    if(!session){
        throw new Error("session not found");
    }

    const today = new Date();//actual date
    const expireDate = new Date(session.expire_date);//session expire date

    //check if the actual date is higher than the session expire date adn throw error
    if(today > expireDate){
        await session.destroy({force: true});
        throw new Error("session expired");
    }

    //get the ip where the login was make
    const user_ip = await fetch("https://api.ipify.org/?format=json")
                            .then(response => response.json());
    
    //check if user ip is the same as the session ip
    if(session.session_ip !== user_ip.ip){
        throw new Error("incorrect ip session");
    }

    return {
        authLogin:true,
        user: session.user
    }
}

export const parseToMMYYYY = (month, year) => {
    const date = new Date();
    date.setMonth( month - 1);
    
    const monthString =  date.toLocaleString('en-US',{
        month: '2-digit'
    });

    return `${year}-${monthString}`
}