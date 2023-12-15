// controllers/dashboardController.js

const Client = require("../models/Client");
const Employee = require("../models/Employee");
const TreatmentProcess = require("../models/TreatmentProcess");
const TypeOfWaste = require("../models/TypeOfWaste");

// Dashboard controller
async function dashboardController(req, res) {
    try {
        // Retrieve data from the database or perform other logic
        const employeeId = req.session.employeeId;
        const employee = await Employee.findOne({ where: { employeeId } });
        var currentPage, totalPages, entriesPerPage, searchQuery
        
        
        // Render the dashboard view with data
        const viewsData = {
            pageTitle: 'Marketing User - Dashboard',
            sidebar: 'marketing/marketing_sidebar',
            content: 'marketing/marketing_dashboard',
            route: 'marketing_dashboard',
            general_scripts: 'marketing/marketing_scripts',
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

// Booked Transactions controller
async function bookedTransactionsController(req, res) {
    try {
        const viewsData = {
            pageTitle: 'Marketing User - Booked Transactions',
        };
        res.render('booked_transactions', viewsData);
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
                client.clientName.toLowerCase().includes(searchQuery.toLowerCase())
                // Add more fields if needed
            );
        });

        // Calculate total pages based on the total number of filtered clients and entries per page
        const totalFilteredClients = filteredClients.length;
        const totalPages = Math.ceil(totalFilteredClients / entriesPerPage);

        // Implement pagination and send the filtered clients to the view
        const startIndex = (currentPage - 1) * entriesPerPage;
        const endIndex = currentPage * entriesPerPage;
        const paginatedClients = filteredClients.slice(startIndex, endIndex);

        // Render the 'marketing/clients' view and pass the necessary data
        const viewsData = {
            pageTitle: 'Marketing User - Clients',
            sidebar: 'marketing/marketing_sidebar',
            content: 'marketing/clients',
            route: 'clients',
            general_scripts: 'marketing/marketing_scripts',
            clients: paginatedClients,
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

// newClientsController function
async function newClientsController(req, res) {
    var currentPage, totalPages, entriesPerPage, searchQuery
        
    // Render the dashboard view with data
    const viewsData = {
        pageTitle: 'Marketing User - New Client Form',
        sidebar: 'marketing/marketing_sidebar',
        content: 'marketing/new_client',
        route: 'marketing_dashboard',
        general_scripts: 'marketing/marketing_scripts',
        currentPage,
        totalPages,
        entriesPerPage,
        searchQuery,
    };
    res.render('dashboard', viewsData);
}

// newClientsController function
async function updateClientsController(req, res) {
    var currentPage, totalPages, entriesPerPage, searchQuery
        
    // Render the dashboard view with data
    const viewsData = {
        pageTitle: 'Marketing User - Update Client Form',
        sidebar: 'marketing/marketing_sidebar',
        content: 'marketing/new_client',
        route: 'marketing_dashboard',
        general_scripts: 'marketing/marketing_scripts',
        currentPage,
        totalPages,
        entriesPerPage,
        searchQuery,
    };
    res.render('dashboard', viewsData);
}

// controllers/clientsController.js
const createClient = async (req, res) => {
    try {
        // Extracting data from the request body
        const {
            clientName,
            address,
            natureOfBusiness,
            contactNumber,
            billerName,
            billerAddress,
            billerContactPerson,
            billerContactNumber,
        } = req.body;

        // Creating a new client
        const newClient = await Client.create({
            clientName,
            address,
            natureOfBusiness,
            contactNumber,
            billerName,
            billerAddress,
            billerContactPerson,
            billerContactNumber,
            clientId: generateClientId(), // You need to implement this function to generate a unique client ID
        });

        // Sending a success response
        res.status(201).json({ message: 'Client created successfully', data: newClient });
    } catch (error) {
        // Handling errors
        console.error('Error creating client:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Function to generate a unique client ID (You need to implement this)
const generateClientId = async () => {
    try {
        // Find the last created client
        const lastClient = await Client.findOne({
            order: [['clientId', 'DESC']], // Order by clientId in descending order
        });

        // Extract the counter from the last client's ID
        const lastCounter = lastClient ? parseInt(lastClient.clientId.slice(-4), 10) : 0;

        // Increment the counter
        const counter = lastCounter + 1;

        // Generate the new client ID
        const currentYear = new Date().getFullYear();
        const clientId = `C${currentYear}${counter.toString().padStart(4, '0')}`;

        return clientId;
    } catch (error) {
        console.error('Error generating client ID:', error);
        throw error; // Handle the error appropriately in your application
    }
};

async function typeOfWasteController(req, res) {
    try {
        // Fetch all types of wastes from the database
        const typesOfWaste = await TypeOfWaste.findAll({
            include: [{ model: TreatmentProcess, as: 'TreatmentProcess' }],
        });

        // Get the page number, entries per page, and search query from the query parameters
        const currentPage = parseInt(req.query.page) || 1;
        const entriesPerPage = parseInt(req.query.entriesPerPage) || 10;
        const searchQuery = req.query.search || ''; // Default to an empty string if no search query

        // Additional logic to filter types of waste based on the search query
        const filteredTypesOfWaste = typesOfWaste.filter(typeOfWaste => {
            // Customize this logic based on how you want to perform the search
            return (
                typeOfWaste.wasteCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                typeOfWaste.wasteName.toLowerCase().includes(searchQuery.toLowerCase())
                // Add more fields if needed
            );
        });

        // Calculate total pages based on the total number of filtered types of waste and entries per page
        const totalFilteredTypesOfWaste = filteredTypesOfWaste.length;
        const totalPages = Math.ceil(totalFilteredTypesOfWaste / entriesPerPage);

        // Implement pagination and send the filtered types of waste to the view
        const startIndex = (currentPage - 1) * entriesPerPage;
        const endIndex = currentPage * entriesPerPage;
        const paginatedTypesOfWaste = filteredTypesOfWaste.slice(startIndex, endIndex);

        const viewsData = {
            pageTitle: 'Marketing User - Type of Waste',
            sidebar: 'marketing/marketing_sidebar',
            content: 'marketing/type_of_waste',
            route: 'type_of_waste',
            general_scripts: 'marketing/marketing_scripts',
            typesOfWaste: paginatedTypesOfWaste,
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


module.exports = { dashboardController, bookedTransactionsController, clientsController, typeOfWasteController, newClientsController, updateClientsController, createClient };