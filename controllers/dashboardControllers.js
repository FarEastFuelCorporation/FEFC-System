// controllers/dashboardController.js

const Client = require("../models/Client");
const Employee = require("../models/Employee");
const Quotation = require("../models/Quotation");
const QuotationWaste = require("../models/QuotationWaste");
const TreatmentProcess = require("../models/TreatmentProcess");
const TypeOfWaste = require("../models/TypeOfWaste");

// Dashboard controller
async function getDashboardController(req, res) {
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
async function getBookedTransactionsController(req, res) {
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

// Clients controller
async function getClientsController(req, res) {
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

        // Check for the success query parameter
        let successMessage;
        if(req.query.success === 'new'){
            successMessage = 'Client created successfully!';
        } else if (req.query.success === 'update'){
            successMessage = 'Client updated successfully!';
        }

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
            successMessage,
        };
        res.render('dashboard', viewsData);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}

// New Client controller
async function getNewClientController(req, res) {
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

// 
async function postNewClientController(req, res) {
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
            clientId: await generateClientId(), // You need to implement this function to generate a unique client ID
        });

        // Redirect back to the client route with a success message
        res.redirect('/dashboard/clients?success=new');
    } catch (error) {
        // Handling errors
        console.error('Error creating client:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Function to generate a unique client ID (You need to implement this)
async function generateClientId(req, res) {
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
        // Handle the error appropriately in your application
        return null; // or throw a different error or provide a default value
    }
};

// Update Client controller
async function getUpdateClientController(req, res) {
    var currentPage, totalPages, entriesPerPage, searchQuery

    // Fetch the client ID from the request parameters
    const clientId = req.query.clientId;

    // Fetch all clients from the database (You might need to modify this based on your use case)
    const clients = await Client.findAll();

    // Additional logic to filter clients based on the search query
    const filteredClients = clients.filter(client => {
        // Customize this logic based on how you want to perform the search
        return (
            client.clientId.toLowerCase().includes(clientId.toLowerCase())
        );
    });

    // Render the dashboard view with data
    const viewsData = {
        pageTitle: 'Marketing User - Update Client Form',
        sidebar: 'marketing/marketing_sidebar',
        content: 'marketing/update_client',
        route: 'marketing_dashboard',
        general_scripts: 'marketing/marketing_scripts',
        filteredClients,
        currentPage,
        totalPages,
        entriesPerPage,
        searchQuery,
    };
    res.render('dashboard', viewsData);
}

async function postUpdateClientController(req, res) {
    try {
        // Extracting data from the request body
        const {
            clientId,
            clientName,
            address,
            natureOfBusiness,
            contactNumber,
            billerName,
            billerAddress,
            billerContactPerson,
            billerContactNumber,
        } = req.body;

        // Find the client in the database based on the provided client ID
        const existingClient = await Client.findOne({
            where: {
                clientId: clientId,
            },
        });

        // If the client is not found, return an error
        if (!existingClient) {
            return res.status(404).json({ message: 'Client not found' });
        }

        // Update the client with the new data
        await existingClient.update({
            clientName,
            address,
            natureOfBusiness,
            contactNumber,
            billerName,
            billerAddress,
            billerContactPerson,
            billerContactNumber,
        });

        // Redirect back to the client route with a success message
        res.redirect('/dashboard/clients?success=update');
    } catch (error) {
        // Handling errors
        console.error('Error updating client:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Type of Waste controller
async function getTypeOfWasteController(req, res) {
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

// Quotations controller
async function getQuotationsController(req, res) {
    try {
        // Fetch all types of wastes from the database
        const quotationWastes = await QuotationWaste.findAll({
            include: [
                { model: Quotation, as: 'Quotation' },
                { model: TypeOfWaste, as: 'TypeOfWaste' },
            ],
        });

        // Get the page number, entries per page, and search query from the query parameters
        const currentPage = parseInt(req.query.page) || 1;
        const entriesPerPage = parseInt(req.query.entriesPerPage) || 10;
        const searchQuery = req.query.search || ''; // Default to an empty string if no search query

        // Additional logic to filter types of waste based on the search query
        const filteredQuotationWastes = quotationWastes.filter(quotationWaste => {
            // Customize this logic based on how you want to perform the search
            return (
                quotationWaste.wasteName.toLowerCase().includes(searchQuery.toLowerCase())
                // Add more fields if needed
            );
        });

        // Calculate total pages based on the total number of filtered types of waste and entries per page
        const totalFilteredQuotationWastes = filteredQuotationWastes.length;
        const totalPages = Math.ceil(totalFilteredQuotationWastes / entriesPerPage);

        // Implement pagination and send the filtered types of waste to the view
        const startIndex = (currentPage - 1) * entriesPerPage;
        const endIndex = currentPage * entriesPerPage;
        const paginatedQuotationWastes = filteredQuotationWastes.slice(startIndex, endIndex);

        // Check for the success query parameter
        let successMessage;
        if(req.query.success === 'new'){
            successMessage = 'Client created successfully!';
        } else if (req.query.success === 'update'){
            successMessage = 'Client updated successfully!';
        }

        const viewsData = {
            pageTitle: 'Marketing User - Quotations',
            sidebar: 'marketing/marketing_sidebar',
            content: 'marketing/quotations',
            route: 'quotations',
            general_scripts: 'marketing/marketing_scripts',
            quotationsWastes: paginatedQuotationWastes,
            currentPage,
            totalPages,
            entriesPerPage,
            searchQuery,
            successMessage,
        };
        res.render('dashboard', viewsData);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}


module.exports = { getDashboardController, getBookedTransactionsController, getClientsController, getNewClientController, getUpdateClientController, postNewClientController, postUpdateClientController, getTypeOfWasteController, getQuotationsController };