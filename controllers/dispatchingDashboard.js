// controllers/dispatchingDashboardControllers.js

const Employee = require("../models/Employee");

// Dashboard controller
async function getDispatchingDashboardController(req, res) {
    try {
        // Retrieve data from the database or perform other logic
        const employeeId = req.session.employeeId;
        const employee = await Employee.findOne({ where: { employeeId } });
        var currentPage, totalPages, entriesPerPage, searchQuery
        
        // Render the dashboard view with data
        const viewsData = {
            pageTitle: 'Dispatching User - Dashboard',
            sidebar: 'dispatching/dispatching_sidebar',
            content: 'dispatching/dispatching_dashboard',
            route: 'dispatching_dashboard',
            employee,
            currentPage,
            totalPages,
            entriesPerPage,
            searchQuery,
        };
        res.render('dashboard', viewsData);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = { 
    getDispatchingDashboardController,
};