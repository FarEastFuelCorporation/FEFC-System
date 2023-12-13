// routes/dashboard.js

const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/auth');
const { dashboardController } = require('../controllers/dashboardControllers');

// Assuming you set 'employeeId' in the session during login
router.get('/', isAuthenticated, dashboardController);

module.exports = router;