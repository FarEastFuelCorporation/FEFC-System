// models/user.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const User = sequelize.define(
    'User', 
    {
        employeeId: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }
);

module.exports = User;
