// routes/dashboard.js

const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/auth');
const { dashboardController, bookedTransactionsController, clientsController, typeOfWasteController, newClientsController, updateClientsController, createClient } = require('../controllers/dashboardControllers');

// Dashboard route
router.get('/', isAuthenticated, dashboardController);

// Booked Transactions route
router.get('/booked_transactions', bookedTransactionsController);

// Clients route
router.get('/clients', clientsController);

// New Client Form route
router.get('/clients/new', newClientsController);

router.post('/clients/new', createClient);

// Clients route
router.get('/clients/update', updateClientsController);

// Type of Wastes route
router.get('/type_of_waste', typeOfWasteController);

// Quotations route
router.get('/quotations', (req, res) => {
    res.render('quotations');
});

// Commissions route
router.get('/commissions', (req, res) => {
    res.render('commissions');
});

module.exports = router;