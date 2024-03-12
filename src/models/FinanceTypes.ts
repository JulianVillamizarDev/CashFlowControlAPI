import Sequelize, { DataTypes, Model } from 'sequelize';
import { sequelize } from "../config/db.js";

class FinanceTypes extends Model {
    declare id_finance_type: number;
    declare type: string;
}

FinanceTypes.init({
    id_finance_type: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING(45),
        allowNull: false,
    }
}, {
    tableName: 'finance_types',
    sequelize,
})

export default FinanceTypes;