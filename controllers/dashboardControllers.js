// controllers/dashboardController.js

const Client = require("../models/Client");
const Employee = require("../models/Employee");
const Quotation = require("../models/Quotation");
const QuotationTransportation = require("../models/QuotationTransportation");
const QuotationWaste = require("../models/QuotationWaste");
const TreatmentProcess = require("../models/TreatmentProcess");
const TypeOfWaste = require("../models/TypeOfWaste");
const User = require("../models/User");
const VehicleType = require("../models/VehicleType");

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

async function getClientDetails (req, res) {
    try {
        const clientId = req.params.clientId;

        // Find the client by ID
        const client = await Client.findOne({
            where: {
            clientId: clientId,
            },
        });

        if (!client) {
            return res.status(404).json({ error: 'Client not found' });
        }

        // Respond with client details
        return res.status(200).json(client);
    } catch (error) {
        console.error('Error fetching client details:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

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
                typeOfWaste.wasteDescription.toLowerCase().includes(searchQuery.toLowerCase())
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
        // Fetch all quotations from the database
        const quotations = await Quotation.findAll({
            include: [
                { model: Client, as: 'Client' },
                { model: QuotationWaste, as: 'QuotationWaste' },
                { model: QuotationTransportation, as: 'QuotationTransportation', include: [{ model: VehicleType, as: 'VehicleType' }] },
            ],
        });

        // Get the page number, entries per page, and search query from the query parameters
        const currentPage = parseInt(req.query.page) || 1;
        const entriesPerPage = parseInt(req.query.entriesPerPage) || 10;
        const searchQuery = req.query.search || ''; // Default to an empty string if no search query

        // Additional logic to filter types of waste based on the search query
        const filteredQuotations = quotations.filter(quotation => {
            // Customize this logic based on how you want to perform the search
            const clientName = quotation.Client.clientName;
            return (
                clientName.toLowerCase().includes(searchQuery.toLowerCase())
                // Add more fields if needed
            );
        });

        // Calculate total pages based on the total number of filtered types of waste and entries per page
        const totalFilteredQuotations = filteredQuotations.length;
        const totalPages = Math.ceil(totalFilteredQuotations / entriesPerPage);

        // Implement pagination and send the filtered types of waste to the view
        const startIndex = (currentPage - 1) * entriesPerPage;
        const endIndex = currentPage * entriesPerPage;
        const paginatedQuotations = filteredQuotations.slice(startIndex, endIndex);

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
            quotations: paginatedQuotations,
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

// New Quotation controller
async function getNewQuotationController(req, res) {
    var currentPage, totalPages, entriesPerPage, searchQuery
    const employeeId = req.session.employeeId;

    const employee = await Employee.findOne({ where: { employeeId } });
    const typesOfWastes = await TypeOfWaste.findAll();
    const clients = await Client.findAll();
    const vehicleTypes = await VehicleType.findAll();

    // Function to convert a string to proper case
    function toProperCase(str) {
        return str.replace(/\w\S*/g, function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    // Apply the function to the employee's first and last names
    const employeeName = `${toProperCase(employee.firstName)} ${toProperCase(employee.lastName)}`;

    // Sorting the clients array by clientName
    clients.sort((clientA, clientB) => {
        const nameA = clientA.clientName.toUpperCase(); // Convert names to uppercase for case-insensitive sorting
        const nameB = clientB.clientName.toUpperCase();

        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0; // Names are equal
    });
        
    // Render the dashboard view with data
    const viewsData = {
        pageTitle: 'Marketing User - New Quotation Form',
        sidebar: 'marketing/marketing_sidebar',
        content: 'marketing/new_quotation',
        route: 'marketing_dashboard',
        general_scripts: 'marketing/marketing_scripts',
        currentPage,
        totalPages,
        entriesPerPage,
        searchQuery,
        employeeName,
        typesOfWastes,
        clients,
        vehicleTypes,
    };
    res.render('dashboard', viewsData);
}


module.exports = { getDashboardController, getBookedTransactionsController, getClientsController, getClientDetails, getNewClientController, getUpdateClientController, postNewClientController, postUpdateClientController, getTypeOfWasteController, getQuotationsController, getNewQuotationController };