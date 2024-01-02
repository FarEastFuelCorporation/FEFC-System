// routes/logout.js

const express = require('express');
const { getQuotationWasteByClient, getQuotationTransportationByClient, getVehicleTypes, getMarketingTransactions, getClients, getVehicles, getMarketingTransactionsByMonth } = require('../controllers/requestsController');
const router = express.Router();

router.get('/getQuotationWastesByClient', getQuotationWasteByClient);
router.get('/getQuotationTransportationByClient', getQuotationTransportationByClient);
router.get('/getVehicleTypes', getVehicleTypes);
router.get('/getClients', getClients);
router.get('/getVehicles', getVehicles);
router.get('/getMarketingTransaction', getMarketingTransactions);
router.get('/getMarketingTransactionsByMonth', getMarketingTransactionsByMonth);

module.exports = router;
