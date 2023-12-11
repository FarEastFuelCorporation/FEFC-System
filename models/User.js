// models/user.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');  // Adjust the path accordingly

const User = sequelize.define(
'User', {
    employeeId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = User;
