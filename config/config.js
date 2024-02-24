// config/config.js

const { Sequelize } = require('sequelize');
require('dotenv').config();

// const sequelize = new Sequelize({
//     dialect: 'mysql',
//     host: process.env.DB_HOST,
//     username: process.env.DB_USERNAME,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_DBNAME,
// });

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'mysql',
    logging: console.log, // or false to disable logging
});

sequelize.options.logging = console.log;

module.exports = sequelize;