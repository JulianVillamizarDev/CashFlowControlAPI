import express from "express";
import { 
    financesList,
    createFinance,
    financesTypesList,
    financesCategoriesList
} from "../controllers/financesController.js";

const router = express.Router();

//GET
router.get("/types", financesTypesList);
router.get("/categories", financesCategoriesList);

//POST
router.post("/finances", financesList);
router.post("/create", createFinance);

export default router;