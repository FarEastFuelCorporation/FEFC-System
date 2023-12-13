// controllers/logoutController.js

async function logoutController (req, res) {
    // Destroy the session
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            res.status(500).send('Internal Server Error');
        } else {
            // Redirect to the login page after successful logout
            res.redirect('/auth/login');
        }
    });
}

module.exports = { logoutController };