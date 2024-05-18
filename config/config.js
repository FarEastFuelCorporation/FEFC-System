// config/config.js

const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL,{
    dialect: 'mysql',
    pool: {
        max: 10, // Maximum number of connections
        min: 0,  // Minimum number of connections
        acquire: 30000, // Maximum time in milliseconds to acquire a connection before throwing an error
        idle: 10000 // Maximum time in milliseconds that a connection can be idle before being released
    }
});

sequelize.options.logging = console.log;

module.exports = sequelize;