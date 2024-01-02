// routes/dispatching_dashboard.js

const express = require('express');
const { getDispatchingDashboardController, getVehicleTracker, getDispatchingTransactions, postDispatchedTransactions, postScheduledTransactions } = require('../controllers/dispatchingDashboardController');
const router = express.Router();

// Dashboard route
router.get('/', getDispatchingDashboardController);

// Vehicle Tracker route
router.get('/vehicle_tracker', getVehicleTracker);

// Dispatching Transactions route
router.get('/dispatching_transactions', getDispatchingTransactions);
router.post('/schedule_transactions', postDispatchedTransactions);
router.post('/dispatch_transactions', postScheduledTransactions);

module.exports = router;