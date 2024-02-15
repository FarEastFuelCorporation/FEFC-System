// routes/marketing_dashboard.js

const express = require('express');
const router = express.Router();
const { getMarketingDashboardController, getBookedTransactionsController, getClientsController, postNewClientController, postUpdateClientController, getTypeOfWasteController, getQuotationsController, getNewQuotationController, postNewQuotationController, getUpdateQuotationController, postUpdateQuotationController, postBookedTransactionsController, getCommissionsController, updateBookedTransactionsController } = require('../controllers/marketingDashboardControllers');

// Dashboard route
router.get('/', getMarketingDashboardController);

// Booked Transactions route
router.get('/booked_transactions', getBookedTransactionsController);
router.post('/booked_transactions', postBookedTransactionsController);
router.post('/update_booked_transactions/:id', updateBookedTransactionsController);

// Clients route
router.get('/clients', getClientsController);

// router.get('/clients/:clientId', getClientDetails);

// New Client Form route
router.post('/clients/new', postNewClientController);

// Update Client route
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

module.exports = router;