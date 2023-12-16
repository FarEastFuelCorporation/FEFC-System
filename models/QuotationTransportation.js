const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const VehicleType = require('./VehicleType');
const Quotation = require('./Quotation');

const QuotationTransportation = sequelize.define(
    'QuotationTransportation', {
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
        vehicleId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        haulingArea: {
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
QuotationTransportation.belongsTo(Quotation, { foreignKey: 'quotationCode', targetKey: 'quotationCode' });
QuotationTransportation.belongsTo(VehicleType, { foreignKey: 'vehicleId', targetKey: 'vehicleId' });

module.exports = QuotationTransportation;
