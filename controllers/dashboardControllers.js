// controllers/dashboardController.js

const Employee = require("../models/Employee");

// Example controller function for handling the dashboard route
async function dashboardController(req, res) {
    try {
        // Retrieve data from the database or perform other logic
        const employeeId = req.session.employeeId;
        const employee = await Employee.findOne({ where: { employeeId } });

        // Render the dashboard view with data
        res.render('dashboard', { employee });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = { dashboardController };