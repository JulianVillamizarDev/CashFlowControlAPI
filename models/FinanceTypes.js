import Sequelize from 'sequelize';
import db from "../config/db.js";

const FinanceTypes = db.define('finances_types', {
    id_finance_type: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        unique: true
    },
    type_name: {
        type: Sequelize.STRING
    }
});

export default FinanceTypes;