// routes/dashboard.js

const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/auth');
const { getDashboardController, getBookedTransactionsController, getClientsController, getNewClientController, getUpdateClientController, postNewClientController, postUpdateClientController, getTypeOfWasteController, getQuotationsController, getNewQuotationController, getClientDetails, postNewQuotationController } = require('../controllers/dashboardControllers');

// Dashboard route
router.get('/', isAuthenticated, getDashboardController);

// Booked Transactions route
router.get('/booked_transactions', getBookedTransactionsController);

// Clients route
router.get('/clients', getClientsController);

router.get('/clients/:clientId', getClientDetails);

// New Client Form route
router.get('/clients/new', getNewClientController);

router.post('/clients/new', postNewClientController);

// Clients route
router.get('/clients/update', getUpdateClientController);

router.post('/clients/update', postUpdateClientController);

// Type of Wastes route
router.get('/type_of_waste', getTypeOfWasteController);

// Quotations route
router.get('/quotations', getQuotationsController);

// New Client Form route
router.get('/quotations/new', getNewQuotationController);
router.post('/quotations/new', postNewQuotationController);

// Commissions route
router.get('/commissions', (req, res) => {
    res.render('commissions');
});

module.exports = router;