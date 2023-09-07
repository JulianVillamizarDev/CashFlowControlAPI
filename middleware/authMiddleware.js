import jwt from "jsonwebtoken";
import User from "../models/User.js";
const checkAuth = async (req, res, next) => {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        
        try {
            token = req.headers.authorization.split(" ")[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findByPk(decoded.id, {
                attributes: [
                    'id_user', 
                    'username', 
                    'email', 
                    'firstname',
                    'lastname'
                ]
            });
            req.user = user.dataValues;

            return next();
        } catch (error) {
            const e = new Error("Unvalid token");
            return res.status(403).json({msg: e.message});
        }

    }

    if(!token){
        const error = new Error("Token does not exist");
        res.status(403).json({msg: error.message}); 
    }   
    

    next();
}

export default checkAuth;