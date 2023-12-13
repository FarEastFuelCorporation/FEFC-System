// controllers/authController.js

const User = require("../models/User");
const bcrypt = require('bcrypt')

async function getSignupController(req, res){
    res.render('signup'); // Assuming you have a signup.ejs file in your views folder
}

// Example controller function for handling signup
async function postSignupController(req, res) {
    const { employeeId, password } = req.body;

    try {
        // Check if the employeeId is in the Employee table
        const existingEmployee = await Employee.findOne({ where: { employeeId } });

        if (!existingEmployee) {
            // Employee ID is not valid, render the signup page with an error message
            res.render('signup', { error: 'Invalid Employee ID' });
            return;
        }

        // Check if the employeeId is already registered in the User table
        const existingUser = await User.findOne({ where: { employeeId } });

        if (existingUser) {
            // Employee is already registered, render the signup page with an error message
            res.render('signup', { error: 'Employee is already registered' });
        } else {
            // Hash the password before storing it in the database
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create a new user in the User table
            const newUser = await User.create({ employeeId, password: hashedPassword });

            // Set session data or other authentication mechanisms if needed

            // Redirect to a dashboard or home page after successful sign-up
            res.redirect('/');
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}

async function getLoginController(req, res){
    res.render('login'); // Assuming you have a login.ejs file in your views folder
}

// Example controller function for handling login
async function postLoginController(req, res) {
    const { employeeId, password } = req.body;
    try {
        // Find the user with the provided employee ID
        const user = await User.findOne({ where: { employeeId } });

        // Check if the user exists and the password is correct (implement your authentication logic)
        if (user && await bcrypt.compare(password, user.password)) {
            // Set session data with employee ID
            req.session.employeeId = user.employeeId;

            // Redirect to a separate route for rendering the dashboard
            res.redirect(`/dashboard`);
        } else {
            // Display an error message for incorrect credentials
            res.render('login', { error: 'Invalid employee ID or password' });
        }
    } catch (error) {
        console.error('Error:', error);
        // Handle errors gracefully, redirect to an error page, or display a generic error message
        res.status(500).send('Internal Server Error');
    }
}

module.exports = { getSignupController, postLoginController, getLoginController, postSignupController };