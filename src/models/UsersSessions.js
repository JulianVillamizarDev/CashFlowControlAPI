import Sequelize from 'sequelize';
import db from "../config/db.js";

const UserSessions = db.define('users_sessions', {
    id_session: {
        type: Sequelize.STRING,
        primaryKey: true,
        unique: true
    },
    user: {
        type: Sequelize.STRING,
    },
    expire_date: {
        type: Sequelize.DATE
    },
    session_ip: {
        type: Sequelize.STRING
    }
});

export default UserSessions;