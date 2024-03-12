import { Finances, FinancesVW } from "../../models/Finances.js";
import FinanceTypes from "../../models/FinanceTypes.js";
import { FinanceCategoriesVW } from "../../models/FinanceCategories.js";
import db from "../../config/db.js";
import sequelize from "../../config/db.js";
import { QueryTypes } from "sequelize";
import { parseToMMYYYY } from "../../helpers/helpers.js";
import { Request, Response } from "express";

//FINANCES TYPES LIST
export const financesTypesList = async (req: Request, res: Response) => {
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
export const financesCategoriesList = async (req: Request, res: Response) => {
    try {
        const { type } = req.params;

        const categories = await FinanceCategoriesVW.findAll({
            where: {
                type_name: type,
            },
            attributes: [['id_finances_types_categories', 'id'], ['category_name', 'name']],
        });

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
//Get List page by limit and offset
export const getFinancePage = async (user_id: number, limit: number, offset: number) => {
    const finance = await FinancesVW.findAll({
        where: {
            user_id
        },
        attributes: [
            ['id_finance', 'id'],
            'username',
            ['finance_type', 'type'],
            ['finance_category', 'category'],
            'description',
            'amount',
            'date'
        ],
        order: [
            ['date', 'DESC'],
            ['amount', 'DESC'],
        ],
        limit,
        offset
    });

    if (finance.length === 0) {
        return {
            isEmpty: true
        }
    }

    return {
        list: finance,
        isEmpty: false
    }
}

//Get list of finances and pages sorted in arrays
export const financesList = async (req: Request, res: Response) => {
    try {
        const { user_id, limit } = req.body;

        let offset = 0,
            page = 1,
            from = 1,
            financeList = [];

        let finance = await getFinancePage(user_id, limit, offset);

        while (!finance.isEmpty) {
            financeList.push({
                list: finance.list,
                page,
                from,
                to: offset + finance.list.length
            });
            offset += limit;
            from = offset + 1;
            page++;
            finance = await getFinancePage(user_id, limit, offset);
        }

        res.status(201).json(financeList);
    } catch (error) {
        res.status(500).json({
            msg: 'Finances list error',
            error
        });
    }
}

//get full list
export const getFullList = async (req: Request, res: Response) => {
    const { user_id } = req.params

    try {
        const finance = await FinancesVW.findAll({
            where: {
                user_id
            },
            attributes: [
                ['id_finance', 'id'],
                'username',
                ['finance_type', 'type'],
                ['finance_category', 'category'],
                'description',
                'amount',
                'date'
            ],
            order: [
                ['date', 'DESC'],
                ['amount', 'DESC'],
            ],
        });

        return res.status(201).json(finance);

    } catch (error) {
        res.status(500).json({
            msg: 'Finances list error',
            error
        });
    }
}

//CREATE FINANCE
export const createFinance = async (req: Request, res: Response) => {
    try {
        const { user, type_category, description, amount, date } = req.body;

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

// ----------------------GET FINANCES BY LAST X MONTHS----------------------
export const getFinancesByMonths = async (req: Request, res: Response) => {
    try {
        const { user, type, interval, } = req.body;

        let query = `
            SELECT 
                year(f.date) as year, 
                month(f.date) as month, 
                coalesce(SUM(f.amount), 0)  as amount
            FROM finances f
            INNER JOIN finances_types_categories ftc ON ftc.id_finances_types_categories = f.type_category
            INNER JOIN finances_types ft ON ft.id_finance_type = ftc.finance_type
            WHERE ft.type_name = "${type}" AND f.user = "${user}" AND f.date >= now() - INTERVAL ${interval} MONTH
            GROUP BY year(f.date), month(f.date)
            ORDER BY year(f.date) ASC, month(f.date) ASC;
        `;

        if (type === 'all') {
            query = `
                SELECT
                    year(f.date) AS 'year',
                    month(f.date) AS 'month',
                    COALESCE(SUM(CASE WHEN ft.type_name = 'income' THEN f.amount ELSE 0 END), 0) as incomes , 
                    COALESCE(SUM(CASE WHEN ft.type_name = 'expense' THEN f.amount ELSE 0 END), 0) AS expenses
                FROM finances f
                INNER JOIN finances_types_categories ftc ON ftc.id_finances_types_categories = f.type_category
                INNER JOIN finances_types ft ON ft.id_finance_type = ftc.finance_type
                WHERE f.date >= NOW() - INTERVAL ${interval} MONTH AND f.user = '${user}'
                GROUP BY year(f.date), month(f.date)
                ORDER BY year(f.date) ASC, month(f.date) ASC;
            `;
        }

        const finances = await sequelize.query(query, { type: QueryTypes.SELECT });

        let financesList: Array<any> = [];

        finances.forEach((item: any) => {
            const date = parseToMMYYYY(item.month, item.year);

            if (type === 'all') {
                financesList.push({
                    date,
                    incomes: item.incomes,
                    expenses: item.expenses,
                })
            } else {
                financesList.push({
                    date,
                    amount: item.amount
                });
            }
        });

        res.status(200).json({ data: financesList });
    } catch (error) {
        res.status(500).json({
            msg: '',
            error
        });
    }
}

// ----------------GET FINANCES BY LAST X DAYS----------------
export const getFinancesByDays = async (req: Request, res: Response) => {
    try {
        const { user, type, interval, } = req.body;

        let query = `
            SELECT 
                f.date as 'date', 
                coalesce(SUM(f.amount), 0)  as amount
            FROM finances f
            INNER JOIN finances_types_categories ftc ON ftc.id_finances_types_categories = f.type_category
            INNER JOIN finances_types ft ON ft.id_finance_type = ftc.finance_type
            WHERE ft.type_name = '${type}' AND f.user = '${user}' AND f.date >= now() - INTERVAL ${interval} DAY
            GROUP BY f.date
            ORDER BY f.date ASC;
        `;

        if (type === 'all') {

            query = `
                SELECT
                    f.date as 'date',
                    COALESCE(SUM(CASE WHEN ft.type_name = 'income' THEN f.amount ELSE 0 END), 0) as incomes , 
                    COALESCE(SUM(CASE WHEN ft.type_name = 'expense' THEN f.amount ELSE 0 END), 0) AS expenses
                FROM finances f
                INNER JOIN finances_types_categories ftc ON ftc.id_finances_types_categories = f.type_category
                INNER JOIN finances_types ft ON ft.id_finance_type = ftc.finance_type
                WHERE f.date >= NOW() - INTERVAL ${interval} DAY AND f.user = '${user}'
                GROUP BY f.date
                ORDER BY f.date ASC;
            `;
        }

        const finances = await sequelize.query(query, { type: QueryTypes.SELECT });

        res.status(200).json({ data: finances });

    } catch (error: any) {
        res.status(500).json({
            msg: error.message,
            error
        });
    }
}

//----------------GET FINANCES BALANCE BY LAST X DAYS----------------
export const getBalancesByDays = async (req: Request, res: Response) => {

    try {
        const { user, interval } = req.body;

        const query = `
            SELECT
                f.date AS 'date',
                COALESCE(SUM(CASE WHEN ft.type_name = 'income' THEN f.amount ELSE 0 END), 0) - COALESCE(SUM(CASE WHEN ft.type_name = 'expense' THEN f.amount ELSE 0 END), 0) AS balance
            FROM finances f
            INNER JOIN finances_types_categories ftc ON ftc.id_finances_types_categories = f.type_category
            INNER JOIN finances_types ft ON ft.id_finance_type = ftc.finance_type
            WHERE f.date >= NOW() - INTERVAL ${interval} DAY AND f.user = '${user}'
            GROUP BY f.date
            ORDER BY f.date ASC;
        `;

        const balances = await sequelize.query(query, { type: QueryTypes.SELECT });

        res.status(200).json({ data: balances });

    } catch (error: any) {
        res.status(500).json({
            msg: error.message,
            error
        });
    }
}

//----------------GET FINANCES BALANCE BY LAST X DAYS----------------
export const getBalancesByMonths = async (req: Request, res: Response) => {

    try {
        const { user, interval } = req.body;

        const query = `
            SELECT
                year(f.date) AS 'year',
                month(f.date) AS 'month',
                COALESCE(SUM(CASE WHEN ft.type_name = 'income' THEN f.amount ELSE 0 END), 0) - COALESCE(SUM(CASE WHEN ft.type_name = 'expense' THEN f.amount ELSE 0 END), 0) AS balance
            FROM finances f
            INNER JOIN finances_types_categories ftc ON ftc.id_finances_types_categories = f.type_category
            INNER JOIN finances_types ft ON ft.id_finance_type = ftc.finance_type
            WHERE f.date >= NOW() - INTERVAL ${interval} MONTH AND f.user = '${user}'
            GROUP BY year(f.date), month(f.date)
            ORDER BY year(f.date), month(f.date) ASC;
        `;

        const balances = await sequelize.query(query, { type: QueryTypes.SELECT });

        let balancesList: Array<any> = [];

        balances.forEach((item: any) => {
            const date = parseToMMYYYY(item.month, item.year);

            balancesList.push({
                date,
                balance: item.balance
            });
        });

        res.status(200).json({ data: balancesList });

    } catch (error: any) {
        res.status(500).json({
            msg: error.message,
            error
        });
    }
}