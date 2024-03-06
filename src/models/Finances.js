import Sequelize from 'sequelize';
import db from "../config/db.js";

const Finances = db.define('finances', {
    id_finance: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    user: {
        type: Sequelize.INTEGER
    },
    type_category: {
        type: Sequelize.INTEGER
    },
    description: {
        type: Sequelize.STRING
    },
    amount: {
        type: Sequelize.DECIMAL(10, 2)
    },
    date: {
        type: Sequelize.DATEONLY
    }
});

const FinancesVW = db.define('vw_finances', {
    id_finance: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    user_id: {
        type: Sequelize.INTEGER
    },
    username: {
        type: Sequelize.STRING
    },
    finance_type: {
        type: Sequelize.STRING
    },
    finance_category: {
        type: Sequelize.STRING
    },
    description: {
        type: Sequelize.STRING
    },
    amount: {
        type: Sequelize.DECIMAL(10,2)
    },
    date: {
        type: Sequelize.STRING
    }

});


export  {Finances, FinancesVW};