// utils/associations.js

const Employee = require('../models/Employee');
const User = require('../models/User');
const TypeOfWaste = require('../models/TypeOfWaste');
const TreatmentProcess = require('../models/TreatmentProcess');
const VehicleType = require('../models/VehicleType');
const Vehicle = require('../models/Vehicle');
const Client = require('../models/Client');
const Quotation = require('../models/Quotation');
const QuotationWaste = require('../models/QuotationWaste');
const QuotationTransportation = require('../models/QuotationTransportation');
const MarketingTransaction = require('../models/MarketingTransaction');

// Define associations
User.belongsTo(Employee, { as: 'Employee', foreignKey: 'employeeId', targetKey: 'employeeId' });

Employee.hasMany(User, { as: 'User', foreignKey: 'employeeId', sourceKey: 'employeeId' });
Employee.hasMany(Quotation, { as: 'Quotation', foreignKey: 'submittedBy', sourceKey: 'employeeId', });

Vehicle.belongsTo(VehicleType, { as: 'VehicleType', foreignKey: 'vehicleId', targetKey: 'vehicleId' });

VehicleType.hasMany(Vehicle, { as: 'Vehicle', foreignKey: 'vehicleId', sourceKey: 'vehicleId' });
VehicleType.hasMany(QuotationTransportation, { as: 'QuotationTransportation', foreignKey: 'vehicleId', sourceKey: 'vehicleId' });

TypeOfWaste.hasMany(QuotationWaste, { as: 'QuotationWaste', foreignKey: 'wasteId', sourceKey: 'wasteId' });

Client.hasMany(Quotation, { as: 'Quotation', foreignKey: 'clientId', sourceKey: 'clientId' });
Client.hasMany(MarketingTransaction, { as: 'MarketingTransaction', foreignKey: 'clientId', sourceKey: 'clientId' });

Quotation.belongsTo(Client, { as: 'Client', foreignKey: 'clientId', targetKey: 'clientId' });
Quotation.hasMany(QuotationWaste, { as: 'QuotationWaste', foreignKey: 'quotationCode', sourceKey: 'quotationCode' });
Quotation.hasMany(QuotationTransportation, { as: 'QuotationTransportation', foreignKey: 'quotationCode', sourceKey: 'quotationCode' });
Quotation.belongsTo(Employee, { as: 'Employee', foreignKey: 'submittedBy', targetKey: 'employeeId' });

QuotationWaste.belongsTo(Quotation, { as: 'Quotation', foreignKey: 'quotationCode', targetKey: 'quotationCode' });
QuotationWaste.belongsTo(TypeOfWaste, { as: 'TypeOfWaste', foreignKey: 'wasteId', targetKey: 'wasteId' });
QuotationWaste.hasMany(MarketingTransaction, { as: 'MarketingTransaction', foreignKey: 'id', sourceKey: 'id' });

QuotationTransportation.belongsTo(Quotation, { as: 'Quotation', foreignKey: 'quotationCode', targetKey: 'quotationCode' });
QuotationTransportation.belongsTo(VehicleType, { as: 'VehicleType', foreignKey: 'vehicleId', targetKey: 'vehicleId' });
QuotationTransportation.hasMany(MarketingTransaction, { as: 'MarketingTransaction', foreignKey: 'id', sourceKey: 'id' });

MarketingTransaction.belongsTo(Client, { as: 'Client', foreignKey: 'clientId', targetKey: 'clientId' });
MarketingTransaction.belongsTo(QuotationWaste, { as: 'QuotationWaste', foreignKey: 'quotationWasteId', targetKey: 'id' });
MarketingTransaction.belongsTo(QuotationTransportation, { as: 'QuotationTransportation', foreignKey: 'quotationTransportationId', targetKey: 'id' });


// Export the associations
module.exports = {
    Employee,
    User,
    TypeOfWaste,
    TreatmentProcess,
    VehicleType,
    Vehicle,
    Client,
    Quotation,
    QuotationWaste,
    QuotationTransportation,
    MarketingTransaction,
};
