// routes/dispatching_dashboard.js

const express = require('express');
const { getDispatchingDashboardController } = require('../controllers/dispatchingdashboard');
const router = express.Router();

// Dashboard route
router.get('/', getDispatchingDashboardController);

module.exports = router;