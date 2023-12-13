//middlewares/auth.js

function isAuthenticated(req, res, next) {
    if (req.session && req.session.employeeId) {
        return next();
    } else {
        return res.status(401).redirect('/auth/login');
    }
}

module.exports = { isAuthenticated };