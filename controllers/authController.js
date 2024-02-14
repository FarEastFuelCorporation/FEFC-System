// controllers/authController.js

const Employee = require("../models/Employee");
const User = require("../models/User");
const bcrypt = require('bcrypt')

async function getSignupController(req, res){
    try {
        const viewsData = {
            pageTitle: 'Sign Up',
        };
        res.render('signup', viewsData); // Assuming you have a signup.ejs file in your views folder    
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}

// Example controller function for handling signup
async function postSignupController(req, res) {
    try {
        const { employeeId, password } = req.body;
        // Check if the employeeId is in the Employee table
        const existingEmployee = await Employee.findOne({ where: { employeeId } });

        if (!existingEmployee) {
            // Employee ID is not valid, render the signup page with an error message
            const viewsData = {
                pageTitle: 'Sign Up',
                error: 'Invalid Employee ID'
            };
            res.render('signup', viewsData);
            return;
        }

        // Check if the employeeId is already registered in the User table
        const existingUser = await User.findOne({ where: { employeeId } });

        if (existingUser) {
            // Employee is already registered, render the signup page with an error message
            const viewsData = {
                pageTitle: 'Sign Up',
                error: 'Employee is already registered'
            };
            res.render('signup', viewsData);
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
    try {
        const viewsData = {
            pageTitle: 'Login',
        };
        res.render('login', viewsData); // Assuming you have a login.ejs file in your views folder    
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}

// Example controller function for handling login
async function postLoginController(req, res) {
    const { employeeId, password } = req.body;
    try {
        // Find the user with the provided employee ID
        const user = await User.findOne({ 
            where: { employeeId },
            include: [{ model: Employee, as: 'Employee' }],
        });

        // Check if the user exists and the password is correct (implement your authentication logic)
        if (user && await bcrypt.compare(password, user.password)) {
            // Check the employeeRoleId
            if (user.Employee.employeeRoleId === 2) {
                req.session.employeeId = user.employeeId;
                res.redirect(`/marketing_dashboard`);
            } else if (user.Employee.employeeRoleId === 3) {
                req.session.employeeId = user.employeeId;
                res.redirect(`/dispatching_dashboard`);
            } else if (user.Employee.employeeRoleId === 4) {
                req.session.employeeId = user.employeeId;
                res.redirect(`/receiving_dashboard`);
            } else {
                // Redirect to a different route if needed
                res.redirect(`/`);
            }
        } else {
            // Display an error message for incorrect credentials
            const viewsData = {
                pageTitle: 'Login',
                error: 'Invalid employee ID or password',
            };
            res.render('login', viewsData);
        }
    } catch (error) {
        console.error('Error:', error);
        // Handle errors gracefully, redirect to an error page, or display a generic error message
        res.status(500).send('Internal Server Error');
    }
}

module.exports = { getSignupController, postLoginController, getLoginController, postSignupController };