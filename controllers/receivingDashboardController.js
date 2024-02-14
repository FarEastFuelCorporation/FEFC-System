// controllers/receivingDashboardController.js

require('dotenv').config();
const { Op, Sequelize } = require('sequelize');
const Employee = require('../models/Employee');

// Dashboard controller
async function getReceivingDashboardController(req, res) {
    try {
        // Retrieve data from the database or perform other logic
        const employeeId = req.session.employeeId;
        const employee = await Employee.findOne({ where: { employeeId } });
        
        // Render the dashboard view with data
        const viewsData = {
            pageTitle: 'Receiving User - Dashboard',
            sidebar: 'receiving/receiving_sidebar',
            content: 'receiving/receiving_dashboard',
            route: 'receiving_dashboard',
            employee,
        };
        res.render('dashboard', viewsData);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}

// Vehicle Tracker controller
async function getVehicleTrackerController(req, res) {
    try {
        // Retrieve data from the database or perform other logic
        const apiKey = process.env.GOOGLE_MAPS_API_KEY;
        const employeeId = req.session.employeeId;
        const employee = await Employee.findOne({ where: { employeeId } });
        // Render the dashboard view with data
        const viewsData = {
            pageTitle: 'Receiving User - Vehicle Tracker',
            sidebar: 'receiving/receiving_sidebar',
            content: 'receiving/vehicle_tracker',
            route: 'vehicle_tracker',
            employee,
            apiKey: apiKey,
        };
        res.render('dashboard', viewsData);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = { 
    getReceivingDashboardController,
    getVehicleTrackerController,
};