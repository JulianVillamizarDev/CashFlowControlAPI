import jwt from "jsonwebtoken";

//GENERATE ID
const createID = () => {
    const length = 30;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const tokenArray = [];

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        const randomChar = characters.charAt(randomIndex);
        tokenArray.push(randomChar);
    }

    return tokenArray.join('');
}


//GENERATE JSON WEB TOKEN
const generateJWT = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: "2d"
    });
}

export {
    createID,
    generateJWT
}