// controllers/dashboardController.js

const Client = require("../models/Client");
const Employee = require("../models/Employee");

// Dashboard controller
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

// Booked Transactions controller
async function bookedTransactionsController(req, res) {
    try {
        res.render('booked_transactions');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}

// Clients controller
async function clientsController(req, res) {
    try {
        // Fetch all clients from the database
        const clients = await Client.findAll();

        // Get the page number from the query parameter (default to 1 if not provided)
        const currentPage = parseInt(req.query.page) || 1;

        // Fetch the total number of clients (for pagination)
        const totalClientsCount = await Client.count();

        // Calculate total pages based on the total number of clients and entries per page
        const totalEntriesPerPage = 10; // You can adjust this based on your preference
        const totalPages = Math.ceil(totalClientsCount / totalEntriesPerPage);

        // Render the 'marketing/clients' view and pass the necessary data
        res.render('marketing/clients', {
            clients,
            currentPage,
            totalPages,
            // ... other data
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = { dashboardController, bookedTransactionsController, clientsController };