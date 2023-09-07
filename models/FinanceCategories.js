import Sequelize from 'sequelize';
import db from "../config/db.js";

const FinanceCategories = db.define('finances_types_categories', {
    id_finances_types_categories: {
        type: Sequelize.INTEGER,
        primaryKey: true, 
        unique: true
    },
    finance_type: {
        type: Sequelize.INTEGER
    },
    category_name: {
        type: Sequelize.STRING,
    }
});

const FinanceCategoriesVW = db.define('vw_finance_categories', {
    id_finances_types_categories: {
        type: Sequelize.INTEGER,
        primaryKey: true, 
        unique: true
    },
    type_name: {
        type: Sequelize.STRING
    },
    category_name: {
        type: Sequelize.STRING,
    }
});

export {FinanceCategories, FinanceCategoriesVW};