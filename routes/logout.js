// routes/logout.js

const express = require('express');
const { logoutController } = require('../controllers/logoutController');
const router = express.Router();

router.get('/logout', logoutController);

module.exports = router;
