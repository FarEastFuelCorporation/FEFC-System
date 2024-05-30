// config/config.js

const { Sequelize } = require('sequelize');
require('dotenv').config();

// const sequelize = new Sequelize(process.env.DATABASE_URL,{
const sequelize = new Sequelize(process.env.DB_DBNAME2, process.env.DB_USERNAME2, process.env.DB_PASSWORD2, {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
      max: 10, // maximum number of connection in pool
      min: 0, // minimum number of connection in pool
      acquire: 30000, // maximum time (in milliseconds) that pool will try to get connection before throwing error
      idle: 10000 // maximum time (in milliseconds) that a connection can be idle before being released
    }
});

sequelize.options.logging = console.log;

module.exports = sequelize;