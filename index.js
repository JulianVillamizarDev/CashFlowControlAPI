import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import db from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import financesRoutes from "./routes/financesRoutes.js";

dotenv.config();
const app = express();

//conectar db
db.authenticate()
    .then( () => console.log("Databse connection successful") )
    .catch( (error) => console.log("Connection error: ", error) );

app.use(bodyParser.json());

const port = process.env.PORT || 3000;

//Routes
app.use("/user", userRoutes);
app.use("/finances", financesRoutes);

app.listen(port, () => {
    console.log(`Working on port ${port}`);
});




