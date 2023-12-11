// routes/dashboard.js

const express = require('express');
const router = express.Router();

// Assuming you set 'employeeId' in the session during login
router.get('/:employeeId', (req, res) => {
    // Access the employeeId from the parameter
    const employeeId = req.params.employeeId;

    // Check if the user is logged in and the session employeeId matches the parameter
    if (req.session.employeeId === employeeId) {
        // Render the dashboard with the employeeId
        res.render('dashboard', { employeeId });
    } else {
        // Redirect to the login page if not logged in or invalid employeeId
        res.redirect('/auth/login');
    }
});

module.exports = router;