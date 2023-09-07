import Sequelize from 'sequelize';
import SequelizeTokenfy from "sequelize-tokenify";
import useBcrypt from "sequelize-bcrypt";
import db from "../config/db.js";

const User = db.define('users', {
    id_user: {
        type: Sequelize.STRING,
        primaryKey: true,
        unique: true
    },
    username: {
        type: Sequelize.STRING,
        unique: true
    },
    email: {
        type: Sequelize.STRING,
        unique: true
    },
    password: {
        type: Sequelize.STRING
    },
    firstname: {
        type: Sequelize.STRING
    },
    lastname: {
        type: Sequelize.STRING
    },
    token: {
        type: Sequelize.STRING,
        unique: true,
    },
    isConfirmed: {
        type: Sequelize.TINYINT
    }
});

//CREATE TOKEN
if (User.token === 0) {
    SequelizeTokenfy.tokenify(User, {
        field: 'token',
        length: 30
    });
}


//HASH PASSWORD
useBcrypt(User, {
    field: 'password', // secret field to hash, default: 'password'
    rounds: 12, // used to generate bcrypt salt, default: 12
    compare: 'authenticate', // method used to compare secrets, default: 'authenticate'
});

export default User;