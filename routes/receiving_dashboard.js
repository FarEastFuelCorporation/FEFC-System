// routes/receiving_dashboard.js

const express = require('express');
const { getReceivingDashboardController, getVehicleTrackerController } = require('../controllers/receivingDashboardController');
const router = express.Router();

// Dashboard route
router.get('/', getReceivingDashboardController);

// Vehicle Tracker route
router.get('/vehicle_tracker', getVehicleTrackerController);



module.exports = router;