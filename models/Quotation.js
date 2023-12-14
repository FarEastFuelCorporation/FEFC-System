// models/Quotation.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const Client = require('./Client'); // Import the Client model

const Quotation = sequelize.define(
    'Quotation',
    {
        quotationCode: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },
        revisionNumber: {
            type: DataTypes.STRING,
        },
        validity: {
            type: DataTypes.DATE,
        },
        clientId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        termsCharge: {
            type: DataTypes.STRING,
        },
        termsBuying: {
            type: DataTypes.STRING,
        },
        scopeOfWork: {
            type: DataTypes.STRING,
        },
        remarks: {
            type: DataTypes.STRING,
        },
        submittedBy: {
            type: DataTypes.STRING,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false,
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false,
        },
    },
);

// Define the association between Quotation and Client
Quotation.belongsTo(Client, { foreignKey: 'clientId', targetKey: 'clientId' });

module.exports = Quotation;
