import { Sequelize } from 'sequelize';

const DB = process.env.DB || '';
const USER = process.env.DB_USER || '';
const PASSWORD = process.env.DB_PASSWORD || '';
const HOST = process.env.DB_HOST || '';
const PORT = Number(process.env.DB_PORT);

export const sequelize = new Sequelize(
  DB, 
  USER, 
  PASSWORD, 
  {
    port: PORT,
    host: HOST,
    dialect: 'mysql',
    define: {
      timestamps: false
  },
});


