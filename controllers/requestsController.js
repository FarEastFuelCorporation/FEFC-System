const sequelize = require("../config/config");
const { Op } = require('sequelize');
const Client = require("../models/Client");
const MarketingTransaction = require("../models/MarketingTransaction");
const Quotation = require("../models/Quotation");
const QuotationTransportation = require("../models/QuotationTransportation");
const QuotationWaste = require("../models/QuotationWaste");
const Vehicle = require("../models/Vehicle");
const VehicleType = require("../models/VehicleType");

async function getQuotationWasteByClient(req, res) {
    try {
        const clientId = req.query.clientId;
        // Fetch Quotations and include associated QuotationWastes
        const quotations = await Quotation.findAll({
            where: { clientId },
            include: [
                { model: QuotationWaste, as: 'QuotationWaste' }
            ]
        });
        // Extract QuotationWastes from the fetched Quotations
        const wastes = quotations.flatMap(quotation => quotation.QuotationWaste);
        
        // Respond with the fetched wastes in JSON format
        res.json(wastes);
    } catch (error) {
        console.error('Error fetching wastes by client:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
async function getQuotationTransportationByClient(req, res) {
    try {
        const clientId = req.query.clientId;
        // Fetch Quotations and include associated QuotationTransportation
        const quotations = await Quotation.findAll({
            where: { clientId },
            include: [{ model: QuotationTransportation, as: 'QuotationTransportation',
                include: [{ model: VehicleType, as: 'VehicleType' }]
            }],
        });
        // Extract QuotationTransportation from the fetched Quotations
        const transportation = quotations.flatMap(quotation => quotation.QuotationTransportation);
        
        // Respond with the fetched wastes in JSON format
        res.json(transportation);
    } catch (error) {
        console.error('Error fetching wastes by client:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
async function getVehicleTypes(req, res) {
    try {
        const vehicleTypes = await VehicleType.findAll();
        res.json(vehicleTypes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
async function getMarketingTransactions(req, res) {
    try {
        const marketingTransaction = await MarketingTransaction.findAll({
            include: [{ model: QuotationTransportation, as: 'QuotationTransportation',
                include: [{ model: VehicleType, as: 'VehicleType' }]
            }],
        });
        res.json(marketingTransaction);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
async function getClients(req, res) {
    try {
        const client = await Client.findAll();
        res.json(client);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
async function getVehicles(req, res) {
    try {
        const vehicle = await Vehicle.findAll({
            include: [{ model: VehicleType, as: 'VehicleType' }],
        });
        res.json(vehicle);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
async function getMarketingTransactionsByMonth(req, res) {
    try {
        // Calculate the start of the current month
        const currentDate = new Date();
        currentDate.setMonth(currentDate.getMonth() + 1);
        currentDate.setDate(0); // Set to the last day of the current month
        
        // Calculate the start of the previous 2 months
        const prevMonth2 = new Date();
        prevMonth2.setMonth(prevMonth2.getMonth() - 3);
        prevMonth2.setDate(1);

        const monthlyTransactionData = await MarketingTransaction.findAll({
            attributes: [
                [sequelize.literal("DATE_FORMAT(haulingDate, '%Y-%m')"), 'yearMonth'],
                [sequelize.literal('COUNT(*)'), 'count']
            ],
            where: {
                haulingDate: {
                    [Op.gte]: prevMonth2,
                    [Op.lt]: currentDate,
                }
            },
            group: ['yearMonth'],
            raw: true
        });

        res.json(monthlyTransactionData);
    } catch (error) {
        console.error('Error executing Sequelize query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = { 
    getQuotationWasteByClient,
    getQuotationTransportationByClient,
    getVehicleTypes,
    getMarketingTransactions,
    getClients,
    getVehicles,
    getMarketingTransactionsByMonth,
};