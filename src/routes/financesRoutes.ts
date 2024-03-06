import express from "express";
import * as financesController from "../controllers/financesController.js";

const router = express.Router();

//GET
router.get("/types", financesController.financesTypesList);
router.get("/categories/:type", financesController.financesCategoriesList); // type = 'income' | 'expense'
router.get("/list/:user_id", financesController.getFullList);

//POST
router.post("/list", financesController.financesList);
router.post("/create", financesController.createFinance);
router.post("/interval/months", financesController.getFinancesByMonths);
router.post("/interval/days", financesController.getFinancesByDays);
router.post("/balance/interval/days", financesController.getBalancesByDays);
router.post("/balance/interval/months", financesController.getBalancesByMonths);

export default router;