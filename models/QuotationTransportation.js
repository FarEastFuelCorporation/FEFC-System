const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

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
            type: DataTypes.INTEGER,
        },
    },
);

module.exports = QuotationTransportation;
