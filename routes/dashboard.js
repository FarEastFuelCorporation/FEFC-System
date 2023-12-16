// routes/dashboard.js

const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/auth');
const { getDashboardController, getBookedTransactionsController, getClientsController, getNewClientController, getUpdateClientController, postNewClientController, postUpdateClientController, getTypeOfWasteController, getQuotationsController } = require('../controllers/dashboardControllers');

// Dashboard route
router.get('/', isAuthenticated, getDashboardController);

// Booked Transactions route
router.get('/booked_transactions', getBookedTransactionsController);

// Clients route
router.get('/clients', getClientsController);

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

// Commissions route
router.get('/commissions', (req, res) => {
    res.render('commissions');
});

module.exports = router;