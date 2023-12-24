// index.js

require('dotenv').config();
const express = require('express');
const session = require('express-session');
require('events').EventEmitter.defaultMaxListeners = 15;
const path = require('path');
const bodyParser = require('body-parser');
const sequelize = require('./config/config');
require('./utils/associations');
const qr = require('qr-image');
const puppeteer = require('puppeteer');
const multer = require('multer');
const fs = require('fs/promises');

// Set up storage for multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const app = express();
const port = process.env.PORT;

// Set up EJS as the view engine
app.set('view engine', 'ejs');

// Set the public folder as the location for static files
app.use(express.static(path.join(__dirname, 'public')));

// Serve Bootstrap files from the 'node_modules' folder
app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));


// Set Cache-Control header to prevent caching
app.use((req, res, next) => {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
});

app.use(bodyParser.urlencoded({ extended: true }));

// Use express-session middleware
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, // Use only with HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 10000, // Session expiration time
    },
}));

// Define a simple function to initialize the application
async function initializeApp() {
    try {
        console.log('Syncing models to the database...');
        await sequelize.sync({ });
        console.log('Models synced successfully.');
    } catch (error) {
        console.error('Error syncing models:', error);
    }
}

// Call the function to initialize the application
initializeApp();


// Middleware to check authentication
const { isAuthenticated } = require('./middlewares/auth');
app.use('/dashboard', isAuthenticated);


// Include your routes
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes); // Mount auth routes at /auth


// Protect a route with authentication
const dashboardRoutes = require('./routes/dashboard');
app.use('/dashboard', dashboardRoutes);


// Include the logout route
const logoutRoute = require('./routes/logout');
const Quotation = require('./models/Quotation');
const VehicleType = require('./models/VehicleType');
const TypeOfWaste = require('./models/TypeOfWaste');
const Employee = require('./models/Employee');
const QuotationWaste = require('./models/QuotationWaste');
const QuotationTransportation = require('./models/QuotationTransportation');
const Client = require('./models/Client');
app.use(logoutRoute);


// Define a route for the home view
app.get('/', (req, res) => {
    // Access the session variable
    const username = req.session.username || 'Guest';

    // Render the 'home' view and pass the session data
    const viewsData = {
        pageTitle: 'FAR EAST FUEL CORPORATION',
        username,
    };
    res.render('home', viewsData);
});

app.use(express.json()); // Middleware to parse JSON request bodies

// Validate Quotation route
app.get('/quotations/validate/:quotationCode/:revisionNumber', async (req, res) => {
    try {
        var currentPage, totalPages, entriesPerPage, searchQuery
        const quotationCode = req.params.quotationCode;
        const revisionNumber = req.params.revisionNumber;
        const typesOfWastes = await TypeOfWaste.findAll();
        const vehicleTypes = await VehicleType.findAll();
        const quotation = await Quotation.findAll({
            where: { quotationCode, revisionNumber },
            include: [
                { model: Client, as: 'Client' },
                { model: QuotationWaste, as: 'QuotationWaste',
                    include: [ 
                        { model: TypeOfWaste, as: 'TypeOfWaste' },
                    ],
                },
                { model: QuotationTransportation, as: 'QuotationTransportation',
                    include: [ 
                        { model: VehicleType, as: 'VehicleType' },
                    ], 
                },
                { model: Employee, as: 'Employee' }
            ],
        });

        // Function to convert a string to proper case
        function toProperCase(str) {
            return str.replace(/\w\S*/g, function(txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
        }

        // Apply the function to the employee's first and last names
        const employeeName = `${toProperCase(quotation[0]?.Employee.firstName)} ${toProperCase(quotation[0]?.Employee.lastName)}`;
        const employeeSignature = quotation[0]?.Employee.picture.replace(/\.jpg$/, '.png');

        // Render the dashboard view with data
        const viewsData = {
            pageTitle: 'Marketing User - Update Quotation Form',
            sidebar: 'marketing/marketing_sidebar',
            content: 'marketing/update_quotation',
            route: 'marketing_dashboard',
            general_scripts: 'marketing/marketing_scripts',
            currentPage,
            totalPages,
            entriesPerPage,
            searchQuery,
            employeeName,
            employeeSignature,
            quotation,
            typesOfWastes,
            vehicleTypes,
        };
        res.render('validate_quotation', viewsData);
    } catch (error) {
        console.error('Error in getUpdateQuotationController:', error);
        // Handle the error appropriately (e.g., send an error response)
        res.status(500).send('Internal Server Error');
    }
});


// Handle 404 errors
app.use((req, res, next) => {
    res.status(404).send('404 Not Found');
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
