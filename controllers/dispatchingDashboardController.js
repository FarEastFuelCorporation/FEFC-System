// controllers/dispatchingDashboardControllers.js

const { Op, Sequelize } = require('sequelize');
const Client = require("../models/Client");
const Employee = require("../models/Employee");
const MarketingTransaction = require("../models/MarketingTransaction");
const QuotationTransportation = require("../models/QuotationTransportation");
const QuotationWaste = require("../models/QuotationWaste");
const TransactionStatus = require("../models/TransactionStatus");
const TypeOfWaste = require("../models/TypeOfWaste");
const Vehicle = require("../models/Vehicle");
const VehicleType = require("../models/VehicleType");
const WasteCategory = require("../models/WasteCategory");
const LogisticsTransaction = require('../models/LogisticsTransaction');

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

// Vehicle Tracker controller
async function getVehicleTracker(req, res) {
    try {
        // Retrieve data from the database or perform other logic
        const employeeId = req.session.employeeId;
        const employee = await Employee.findOne({ where: { employeeId } });
        var currentPage, totalPages, entriesPerPage, searchQuery
        
        // Render the dashboard view with data
        const viewsData = {
            pageTitle: 'Dispatching User - Vehicle Tracker',
            sidebar: 'dispatching/dispatching_sidebar',
            content: 'dispatching/vehicle_tracker',
            route: 'vehicle_tracker',
            employee,
            currentPage,
            totalPages,
            entriesPerPage,
            searchQuery,
            apiKey: 'AIzaSyBtwRzRYR6HP_eMlN4yLUp6FRYbK0t1YAQ',
        };
        res.render('dashboard', viewsData);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}

// Dispatching Transactions controller
async function getDispatchingTransactions(req, res) {
    try {
        // Fetch all clients from the database
        const marketingTransactions = await MarketingTransaction.findAll({
            include: [
                { model: Client, as: 'Client' },
                { model: QuotationWaste, as: 'QuotationWaste',
                    include: [ 
                        { model: TypeOfWaste, as: 'TypeOfWaste' },
                    ],
                },
                { model: QuotationTransportation, as: 'QuotationTransportation',
                    include: [ 
                        { model: VehicleType, as: 'VehicleType' },
                    ], 
                },
                { model: Employee, as: 'Employee' },
                { model: WasteCategory, as: 'WasteCategory' },
                { model: TransactionStatus, as: 'TransactionStatus' },
                {
                    model: LogisticsTransaction, as: 'LogisticsTransaction',
                    where: { mtfId: Sequelize.col('MarketingTransaction.id') },
                    required: false, // Use 'false' to perform a LEFT JOIN
                },
            ],
        });
        // Get logistics transactions for all MTF IDs
        const logisticsTransactions = await LogisticsTransaction.findAll({
            where: { mtfId: marketingTransactions.map(transaction => transaction.id) },
        });
        const vehicles = await Vehicle.findAll();
        const drivers = await Employee.findAll({
            where: {
                designation: {
                    [Sequelize.Op.like]: '%Driver%', // Use the like operator with a wildcard
                },
            },
            order: [
                ['lastName', 'ASC'], // Sort by lastName in ascending order
            ],
        });
        const truckHelpers = await Employee.findAll({
            where: {
                designation: {
                    [Sequelize.Op.like]: '%Truck Helper%', // Use the like operator with a wildcard
                },
            },
            order: [
                ['lastName', 'ASC'], // Sort by lastName in ascending order
            ],
        });

        // Get the page number, entries per page, and search query from the query parameters
        const currentPage = parseInt(req.query.page) || 1;
        const entriesPerPage = parseInt(req.query.entriesPerPage) || 10;
        const searchQuery = req.query.search || ''; // Default to an empty string if no search query

        // Additional logic to filter clients based on the search query
        const filteredMarketingTransactions = marketingTransactions.filter(marketingTransaction => {
            // Customize this logic based on how you want to perform the search
            return (
                marketingTransaction.Client.clientName.toLowerCase().includes(searchQuery.toLowerCase())
                // Add more fields if needed
            );
        });

        // Check if mtfId is present in LogisticsTransaction for each MarketingTransaction
        const logisticsTransactionsPromises = filteredMarketingTransactions.map(async (marketingTransaction) => {
            const logisticsTransaction = await LogisticsTransaction.findOne({
                where: { mtfId: marketingTransaction.id },
            });
            return !!logisticsTransaction; // Return true if logisticsTransaction exists, false otherwise
        });

        // Wait for all promises to resolve
        const logisticsTransactionResults = await Promise.all(logisticsTransactionsPromises);

        // Combine MarketingTransactions with logisticsTransactionExists information
        const transactionsWithLogisticsInfo = filteredMarketingTransactions.map((marketingTransaction, index) => {
            return {
                ...marketingTransaction.toJSON(),
                logisticsTransactionExists: logisticsTransactionResults[index],
            };
        });

        // Calculate total pages based on the total number of filtered transactions and entries per page
        const totalFilteredTransactions = transactionsWithLogisticsInfo.length;
        const totalPages = Math.ceil(totalFilteredTransactions / entriesPerPage);

        // Implement pagination and send the filtered transactions to the view
        const startIndex = (currentPage - 1) * entriesPerPage;
        const endIndex = currentPage * entriesPerPage;
        const paginatedTransactions = transactionsWithLogisticsInfo.slice(startIndex, endIndex);

        // Check for the success query parameter
        let successMessage;
        if(req.query.success === 'schedule'){
            successMessage = 'Transaction scheduled successfully!';
        } else if (req.query.success === 'dispatch'){
            successMessage = 'Transaction dispatched successfully!';
        }

        // Render the 'marketing/clients' view and pass the necessary data
        const viewsData = {
            pageTitle: 'Dispatching User - Dispatching Transactions',
            sidebar: 'dispatching/dispatching_sidebar',
            content: 'dispatching/dispatching_transactions',
            route: 'dispatching_transactions',
            paginatedTransactions: paginatedTransactions,
            vehicles,
            drivers,
            truckHelpers,
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
async function postScheduledTransactions(req, res) {
    try {
        const employeeId = req.session.employeeId;
        // Extracting data from the request body
        const {
            mtfId,
            departureDate,
            departureTime,
            vehicle,
            plateNumber,
            driverId,
            truckHelperId,
            remarks,
        } = req.body;

        // Creating a new client
        await LogisticsTransaction.create({
            mtfId,
            departureDate,
            departureTime,
            vehicle,
            plateNumber,
            driverId,
            truckHelperId,
            remarks,
            submittedBy: employeeId,
        });

        // Redirect back to the client route with a success message
        res.redirect('/dispatching_dashboard/dispatching_transactions?success=schedule');
    } catch (error) {
        // Handling errors
        console.error('Error creating client:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
async function postDispatchedTransactions(req, res) {
    try {
        const employeeId = req.session.employeeId;
        // Extracting data from the request body
        const {
            mtfId,
            departureDate,
            departureTime,
            vehicle,
            plateNumber,
            driverId,
            truckHelperId,
            remarks,
        } = req.body;

        // Creating a new client
        await LogisticsTransaction.create({
            mtfId,
            departureDate,
            departureTime,
            vehicle,
            plateNumber,
            driverId,
            truckHelperId,
            remarks,
            submittedBy: employeeId,
        });

        // Redirect back to the client route with a success message
        res.redirect('/dispatching_dashboard/dispatching_transactions?success=new');
    } catch (error) {
        // Handling errors
        console.error('Error creating client:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports = { 
    getDispatchingDashboardController,
    getVehicleTracker,
    getDispatchingTransactions,
    postDispatchedTransactions,
    postScheduledTransactions,
};