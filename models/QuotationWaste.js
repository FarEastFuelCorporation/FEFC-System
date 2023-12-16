const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const Quotation = require('./Quotation');
const TypeOfWaste = require('./TypeOfWaste');

const QuotationWaste = sequelize.define(
    'QuotationWaste', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        quotationCode: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        wasteId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        wasteName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        mode: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        unit: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        unitPrice: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        vatCalculation: {
            type: DataTypes.STRING,
        },
        maxCapacity: {
            type: DataTypes.STRING,
        },
        submittedBy: {
            type: DataTypes.STRING,
            allowNull: false,
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

// Define associations
QuotationWaste.belongsTo(Quotation, { foreignKey: 'quotationCode', targetKey: 'quotationCode' });
QuotationWaste.belongsTo(TypeOfWaste, { foreignKey: 'wasteId', targetKey: 'wasteId' });

module.exports = QuotationWaste;
