import Sequelize from 'sequelize';
import dotenv from "dotenv";


dotenv.config();

// const sequelize = new Sequelize(
//     process.env.MYSQL_ADDON_DB, 
//     process.env.MYSQL_ADDON_USER, 
//     process.env.MYSQL_ADDON_PASSWORD, 
//     {
//   host: process.env.MYSQL_ADDON_HOST,
//   dialect: 'mysql',
//   define: {
//     timestamps: false
//   },
//   pool: {
//     max: 5,
//     min: 0,
//     acquire: 30000,
//     idle: 10000
//   },
//   operatorsAliases: false
// });
const sequelize = new Sequelize(process.env.MYSQL_URL, {
    define: {
        timestamps: false
    }
});

export default sequelize;


