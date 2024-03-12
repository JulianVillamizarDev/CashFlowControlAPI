import { Model, DataTypes } from 'sequelize';
import { sequelize } from "../config/db.js";

class User extends Model {
    declare id_user: string;
    declare name: string;
    declare surname: string;
    declare email: string;
    declare password: string;
    declare token: string | null;
    declare is_confirmed: number;
}

User.init({
    id_user: {
        type: DataTypes.STRING(45),
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(45),
        allowNull: true,
    },
    surname: {
        type: DataTypes.STRING(45),
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING(128),
        unique: true,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    token: {
        type: DataTypes.STRING(45),
        unique: true,
        allowNull: true,
    },
    is_confirmed: {
        type: DataTypes.TINYINT,
        allowNull: false,
    },
}, {
    tableName: 'users',
    sequelize,
})

export default User;