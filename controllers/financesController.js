import {Finances, FinancesVW} from "../models/Finances.js";
import FinanceTypes from "../models/FinanceTypes.js";
import {FinanceCategories, FinanceCategoriesVW} from "../models/FinanceCategories.js";
import db from "../config/db.js";

//FINANCES TYPES LIST
const financesTypesList = async (req, res) => {
    try {

        const types = await FinanceTypes.findAll();

        res.status(201).json(types);
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            msg: 'Finances types list error',
            error
        });
    }
}

//FINANCES CATEGORIES LIST
const financesCategoriesList = async (req, res) => {
    try {

        const categories = await FinanceCategoriesVW.findAll();

        res.status(201).json(categories);
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            msg: 'Finances categories list error',
            error
        });
    }
}

//FINANCES LIST
const financesList = async (req, res) => {
    try {
        const {user_id} = req.body

        //GET THE ID
        const finance = await FinancesVW.findAll({
            where: {
                user_id
            }
        });

        res.status(201).json(finance);
    } catch (error) {
        res.status(500).json({ 
            msg: 'Finances list error',
            error
        });
    }
}


//CREATE FINANCE
const createFinance = async (req, res) => {
    try {
        const {user, type_category, description, amount, date} = req.body;

        const newFinance = await Finances.create({
            user,
            type_category,
            description,
            amount,
            date
        });

        res.status(201).json(newFinance);
        
    } catch (error) {
        res.status(500).json({ 
            msg: 'Finance creation error',
            error
        });
    }
}

export {
    financesList,
    createFinance,
    financesTypesList,
    financesCategoriesList
}