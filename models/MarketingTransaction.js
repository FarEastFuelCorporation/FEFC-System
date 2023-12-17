// models/MarketingTransaction.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const MarketingTransaction = sequelize.define(
    'MarketingTransaction', 
    {
        mtfNumber: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
            unique: true,
        },
        clientId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        quotationWasteId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        quotationTransportationId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        haulingDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        haulingTime: {
            type: DataTypes.TIME,
            allowNull: false,
        },
        vehicleId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        pullOutFormNumber: {
            type: DataTypes.STRING,
        },
        pttNumber: {
            type: DataTypes.STRING,
        },
        manifestNumber: {
            type: DataTypes.STRING,
        },
        remarks: {
            type: DataTypes.STRING,
        },
        submitTo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        submittedBy: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
        },
        deletedAt: {
            type: DataTypes.DATE,
            allowNull: true, 
            defaultValue: null, 
        },
    },
    {
        // Add the paranoid option for soft delete
        paranoid: true,
        id: false,
    }
);

module.exports = MarketingTransaction;