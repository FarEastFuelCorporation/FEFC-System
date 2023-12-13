// models/user.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');  // Adjust the path accordingly
const Employee = require('./Employee');

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

// Define the association between User and Employee
User.belongsTo(Employee, { foreignKey: 'employeeId', targetKey: 'employeeId' });

module.exports = User;
