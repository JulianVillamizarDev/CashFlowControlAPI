import { DataTypes, Model } from 'sequelize';
import { sequelize } from "../config/db.js";

class FinanceCategories extends Model {
    declare id_finance_categories: number;
    declare finance_type: number;
    declare category: string;
}

FinanceCategories.init({
 id_finance_categories: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
 },
 
}, {
    tableName: 'finance_categories',
    sequelize,
})

export default FinanceCategories;