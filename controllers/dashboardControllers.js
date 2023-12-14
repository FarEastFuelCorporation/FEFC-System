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

// clientsController function
async function clientsController(req, res) {
    try {
        // Fetch all clients from the database
        const clients = await Client.findAll();

        // Get the page number, entries per page, and search query from the query parameters
        const currentPage = parseInt(req.query.page) || 1;
        const entriesPerPage = parseInt(req.query.entriesPerPage) || 10;
        const searchQuery = req.query.search || ''; // Default to an empty string if no search query

        // Additional logic to filter clients based on the search query
        const filteredClients = clients.filter(client => {
            // Customize this logic based on how you want to perform the search
            return (
                client.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                client.address.toLowerCase().includes(searchQuery.toLowerCase())
            );
        });

        // Calculate total pages based on the total number of filtered clients and entries per page
        const totalFilteredClients = filteredClients.length;
        const totalPages = Math.ceil(totalFilteredClients / entriesPerPage);

        // Implement pagination and send the filtered clients to the view
        const paginatedClients = filteredClients.slice(
            (currentPage - 1) * entriesPerPage,
            currentPage * entriesPerPage
        );

        // Render the 'marketing/clients' view and pass the necessary data
        res.render('marketing/clients', {
            clients: paginatedClients,
            currentPage,
            totalPages,
            entriesPerPage,
            searchQuery, // Pass the search query to update the search input on the client side
            // ... other data
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = { dashboardController, bookedTransactionsController, clientsController };
