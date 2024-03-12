import { DataTypes, Model } from 'sequelize';
import { sequelize } from "../config/db.js";

class Finances extends Model {
    declare id_finance: number;
    declare user: string;
    declare category: number;
    declare description: string;
    declare amount: number;
    declare date: string;
}

Finances.init({
    id_finance: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    user: {
        type: DataTypes.STRING(45),
        allowNull: false,
    },
    category: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING(128),
        allowNull: true
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    }
}, {
    tableName: 'finances',
    sequelize,
});

export default Finances;