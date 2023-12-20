// index.js

require('dotenv').config();
const express = require('express');
const session = require('express-session');
require('events').EventEmitter.defaultMaxListeners = 15;
require('./utils/associations');
const path = require('path');
const bodyParser = require('body-parser');
const sequelize = require('./config/config');
const qr = require('qr-image');
const puppeteer = require('puppeteer');

const app = express();
const port = process.env.PORT;

// Set up EJS as the view engine
app.set('view engine', 'ejs');

// Set the public folder as the location for static files
app.use(express.static(path.join(__dirname, 'public')));

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
        console.log('Syncing models to the database...');
        await sequelize.sync({ alter: true });
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

app.post('/generate-image', async (req, res) => {
  try {
    const htmlContent = req.body.htmlContent;

    // Use puppeteer to convert HTML content to a Data URL
    const browser = await puppeteer.launch({
      headless: 'new', // Opt into the new headless mode
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent);

    // Get the HTML content as Data URL
    const dataUrl = await page.evaluate(() => {
      return new Promise((resolve) => {
        resolve(document.documentElement.outerHTML);
      });
    });

    // Close the browser
    await browser.close();

    // Send the Data URL as the response
    res.json({ dataUrl });
  } catch (error) {
    console.error('Error generating image:', error);
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
