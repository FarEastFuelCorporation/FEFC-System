// routes/dashboard.js

const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/auth');
const { getDashboardController, getBookedTransactionsController, getClientsController, getUpdateClientController, postNewClientController, postUpdateClientController, getTypeOfWasteController, getQuotationsController, getNewQuotationController, postNewQuotationController, getUpdateQuotationController, postUpdateQuotationController, getQuotationWasteByClient, getQuotationTransportationByClient, postBookedTransactionsController, getCommissionsController, getVehicleTypes, getVehicles, getMarketingTransactions } = require('../controllers/dashboardControllers');

// Dashboard route
router.get('/', isAuthenticated, getDashboardController);

// Booked Transactions route
router.get('/booked_transactions', getBookedTransactionsController);
router.post('/booked_transactions', postBookedTransactionsController);

// Clients route
router.get('/clients', getClientsController);

// router.get('/clients/:clientId', getClientDetails);

// New Client Form route
router.post('/clients/new', postNewClientController);

// Update Client route
router.get('/clients/update/:clientId', getUpdateClientController);

router.post('/clients/update', postUpdateClientController);

// Type of Wastes route
router.get('/type_of_waste', getTypeOfWasteController);

// Quotations route
router.get('/quotations', getQuotationsController);

// New Quotation Form route
router.get('/quotations/new', getNewQuotationController);
router.post('/quotations/new', postNewQuotationController);

// Update Quotation Form route
router.get('/quotations/update/:quotationCode/:revisionNumber', getUpdateQuotationController);
router.post('/quotations/update/', postUpdateQuotationController);

// Commissions route
router.get('/commissions', getCommissionsController);

// Other route
router.get('/getQuotationWastesByClient', getQuotationWasteByClient);
router.get('/getQuotationTransportationByClient', getQuotationTransportationByClient);
router.get('/getVehicleTypes', getVehicleTypes);
router.get('/getMarketingTransaction', getMarketingTransactions);
router.get('/getVehicles', getVehicles);

module.exports = router;