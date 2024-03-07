import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import db from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import financesRoutes from "./routes/financesRoutes.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();

//conectar db
// db.authenticate()
//     .then( () => console.log("Databse connection successful") )
//     .catch( (error) => console.log("Connection error: ", error) );

//CORS OPTIONS
const allowedDomains = [process.env.FRONTEND_URL, undefined];

const corsOptions = {
    origin: function(origin: any, callback: any){
        if(allowedDomains.indexOf(origin) !== -1){
            callback(null, true);
        }else{
            callback(new Error("Not Allowed by CORS"));
        }
    }
}

//middlewares
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL); // Ajusta esto según tus necesidades
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Ajusta esto según tus necesidades
    res.header('Access-Control-Allow-Headers', 'Content-Type'); // Ajusta esto según tus necesidades
    next();
});

const port = process.env.PORT || 3000;

//Routes
app.use("/users", userRoutes);
app.use("/finances", financesRoutes);

app.listen(port, () => {
    console.log(`Working on port ${port}`);
});
