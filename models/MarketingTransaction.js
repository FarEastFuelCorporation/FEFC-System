// models/MarketingTransaction.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const MarketingTransaction = sequelize.define(
    'MarketingTransaction', 
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        mtfNumber: {
            type: DataTypes.STRING,
            allowNull: false,
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
        wasteCategoryId: {
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
        statusId: {
            type: DataTypes.INTEGER,
        },
        dispatchId: {
            type: DataTypes.INTEGER,
        },
        submittedBy: {
            type: DataTypes.STRING,
            allowNull: false,
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
    }
);

// Add a hook before creating or updating a record
MarketingTransaction.beforeCreate((transaction, options) => {
    handleTimezoneConversion(transaction);
});

MarketingTransaction.beforeUpdate((transaction, options) => {
    handleTimezoneConversion(transaction);
});

function handleTimezoneConversion(transaction) {
    // Convert haulingDate and haulingTime to the desired timezone
    // Assuming 'Asia/Shanghai' as the desired timezone
    const desiredTimezone = 'Asia/Shanghai';

    // Perform the conversion using a library like 'moment-timezone' or 'dayjs'
    // For example, using 'moment-timezone'
    const moment = require('moment-timezone');

    // Get the current date and time
    const currentDate = moment().tz(desiredTimezone).format('YYYY-MM-DD');

    // Combine the current date with the transaction's haulingTime
    const combinedDateTime = `${currentDate} ${transaction.haulingTime}`;
    const convertedDateTime = moment.tz(combinedDateTime, desiredTimezone).format();

    // Log intermediate values for debugging
    console.log('Current Date:', currentDate);
    console.log('Hauling Date:', transaction.haulingDate);
    console.log('Hauling Time:', transaction.haulingTime);
    console.log('Combined DateTime:', combinedDateTime);
    console.log('Converted DateTime:', convertedDateTime);

    // Update the fields with the converted date and time
    transaction.haulingDate = convertedDateTime.slice(0, 10); // Extract date part
    transaction.haulingTime = convertedDateTime.slice(11, 19); // Extract time part

    // Use the current date for timestamps
    transaction.createdAt = currentDate + ' ' + transaction.haulingTime;
    transaction.updatedAt = currentDate + ' ' + transaction.haulingTime;
}

module.exports = MarketingTransaction;