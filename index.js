import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import db from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import financesRoutes from "./routes/financesRoutes.js";
import cors from 'cors'

dotenv.config();
const app = express();

//conectar db
db.authenticate()
    .then( () => console.log("Databse connection successful") )
    .catch( (error) => console.log("Connection error: ", error) );

//CORS OPTIONS
const allowedDomains = [process.env.FRONTEND_URL, undefined];

const corsOptions = {
    origin: function(origin, callback){
        console.log(allowedDomains.indexOf(origin));
        if(allowedDomains.indexOf(origin) !== -1){
            callback(null, true);
        }else{
            callback(new Error("Not Allowed by CORS"));
        }
    }
}

app.use(bodyParser.json());
app.use(cors(corsOptions));

const port = process.env.PORT || 3000;

//Routes
app.use("/users", userRoutes);
app.use("/finances", financesRoutes);

app.listen(port, () => {
    console.log(`Working on port ${port}`);
});




