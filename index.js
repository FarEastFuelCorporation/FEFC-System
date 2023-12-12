// index.js

const express = require('express');
const session = require('express-session');
const path = require('path');  // Import the 'path' module
const bodyParser = require('body-parser');
const sequelize = require('./config/config'); // Adjust the path based on your project structure
const User = require('./models/User');
const Employee = require('./models/Employee');

const app = express();
const port = 3000;

// Set up EJS as the view engine
app.set('view engine', 'ejs');

// Set the public folder as the location for static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

// Serve Bootstrap files from the 'node_modules' folder
app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));

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
        // Sync the models with the database (this will create tables if they don't exist)
        await sequelize.sync();

        // Find all users
        const allUsers = await User.findAll();
    } catch (error) {
        console.error('Error:', error);
    }
}

// Call the function to initialize the application
initializeApp();


// Middleware to check authentication
function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    } else {
        return res.status(401).redirect('/login');
    }
}

// Protect a route with authentication
const dashboardRoutes = require('./routes/dashboard');
app.get('/dashboard', isAuthenticated, (req, res) => {
    // Only accessible to authenticated users
    res.render('dashboard');
});

// Include your routes
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes); // Mount auth routes at /auth
app.use('/dashboard', dashboardRoutes);


// Include the logout route
const logoutRoute = require('./routes/logout');
app.use(logoutRoute);

// Define a route for the home view
app.get('/', (req, res) => {
    // Access the session variable
    const username = req.session.username || 'Guest';

    // Render the 'home' view and pass the session data
    res.render('home', { username });
});


// Handle 404 errors
app.use((req, res, next) => {
    res.status(404).send('404 Not Found');
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
