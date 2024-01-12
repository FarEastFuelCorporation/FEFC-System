// utils/associations.js

const Employee = require('../models/Employee');
const EmployeeRole = require('../models/EmployeeRole');
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
const WasteCategory = require('../models/WasteCategory');
const TransactionStatus = require('../models/TransactionStatus');
const LogisticsTransaction = require('../models/LogisticsTransaction');
const LogisticsTransactionHelper = require('../models/LogisticsTransactionHelper');
const DispatchLogisticsTransaction = require('../models/DispatchLogisticsTransaction');
const VehicleStatus = require('../models/VehicleStatus');
const VehicleLog = require('../models/VehicleLog');

// Define associations
User.belongsTo(Employee, { as: 'Employee', foreignKey: 'employeeId', targetKey: 'employeeId' });

EmployeeRole.hasMany(Employee, { as: 'Employee', foreignKey: 'employeeRoleId', sourceKey: 'employeeRoleId', });

Employee.belongsTo(EmployeeRole, { as: 'EmployeeRole', foreignKey: 'employeeRoleId', targetKey: 'employeeRoleId' });
Employee.hasMany(User, { as: 'User', foreignKey: 'employeeId', sourceKey: 'employeeId' });
Employee.hasMany(Quotation, { as: 'Quotation', foreignKey: 'submittedBy', sourceKey: 'employeeId', });
Employee.hasMany(MarketingTransaction, { as: 'MarketingTransaction', foreignKey: 'submittedBy', sourceKey: 'employeeId', });
Employee.hasMany(LogisticsTransaction, { as: 'Driver', foreignKey: 'driverId', sourceKey: 'employeeId', });
Employee.hasMany(LogisticsTransaction, { as: 'LogisticsTransaction', foreignKey: 'scheduledBy', sourceKey: 'employeeId', });
Employee.hasMany(LogisticsTransactionHelper, { as: 'LogisticsTransactionHelper', foreignKey: 'truckHelperId', sourceKey: 'employeeId', });
Employee.hasMany(DispatchLogisticsTransaction, { as: 'DispatchLogisticsTransaction', foreignKey: 'dispatchedBy', sourceKey: 'employeeId', });

VehicleType.hasMany(Vehicle, { as: 'Vehicle', foreignKey: 'vehicleId', sourceKey: 'vehicleId' });
VehicleType.hasMany(QuotationTransportation, { as: 'QuotationTransportation', foreignKey: 'vehicleId', sourceKey: 'vehicleId' });

// VehicleStatus.hasMany(Vehicle, { as: 'Vehicle', foreignKey: 'vehicleStatusId', sourceKey: 'id' });
VehicleStatus.hasMany(VehicleLog, { as: 'VehicleLog', foreignKey: 'vehicleStatusId', sourceKey: 'id' });

Vehicle.belongsTo(VehicleType, { as: 'VehicleType', foreignKey: 'vehicleId', targetKey: 'vehicleId' });
// Vehicle.belongsTo(VehicleStatus, { as: 'VehicleStatus', foreignKey: 'vehicleStatusId', targetKey: 'id' });
Vehicle.belongsTo(LogisticsTransaction, { as: 'LogisticsTransaction', foreignKey: 'plateNumber', targetKey: 'plateNumber' });
Vehicle.hasMany(VehicleLog, { as: 'VehicleLog', foreignKey: 'plateNumber', sourceKey: 'plateNumber' });

VehicleLog.belongsTo(DispatchLogisticsTransaction, { as: 'DispatchLogisticsTransaction', foreignKey: 'dispatchId', targetKey: 'id' });
VehicleLog.belongsTo(Vehicle, { as: 'Vehicle', foreignKey: 'plateNumber', targetKey: 'plateNumber' });
VehicleLog.belongsTo(VehicleStatus, { as: 'VehicleStatus', foreignKey: 'vehicleStatusId', targetKey: 'id' });

Client.hasMany(Quotation, { as: 'Quotation', foreignKey: 'clientId', sourceKey: 'clientId' });
Client.hasMany(MarketingTransaction, { as: 'MarketingTransaction', foreignKey: 'clientId', sourceKey: 'clientId' });

TypeOfWaste.hasMany(QuotationWaste, { as: 'QuotationWaste', foreignKey: 'wasteId', sourceKey: 'wasteId' });

WasteCategory.hasMany(MarketingTransaction, { as: 'MarketingTransaction', foreignKey: 'wasteCategoryId', sourceKey: 'id' });

TransactionStatus.hasMany(MarketingTransaction, { as: 'MarketingTransaction', foreignKey: 'statusId', sourceKey: 'id' });

Quotation.hasMany(QuotationWaste, { as: 'QuotationWaste', foreignKey: 'quotationId', sourceKey: 'quotationId' });
Quotation.hasMany(QuotationTransportation, { as: 'QuotationTransportation', foreignKey: 'quotationId', sourceKey: 'quotationId' });
Quotation.belongsTo(Client, { as: 'Client', foreignKey: 'clientId', targetKey: 'clientId' });
Quotation.belongsTo(Employee, { as: 'Employee', foreignKey: 'submittedBy', targetKey: 'employeeId' });

QuotationWaste.belongsTo(Quotation, { as: 'Quotation', foreignKey: 'quotationId', targetKey: 'quotationId' });
QuotationWaste.belongsTo(TypeOfWaste, { as: 'TypeOfWaste', foreignKey: 'wasteId', targetKey: 'wasteId' });
QuotationWaste.hasMany(MarketingTransaction, { as: 'MarketingTransaction', foreignKey: 'id', sourceKey: 'id' });

QuotationTransportation.belongsTo(Quotation, { as: 'Quotation', foreignKey: 'quotationId', targetKey: 'quotationId' });
QuotationTransportation.belongsTo(VehicleType, { as: 'VehicleType', foreignKey: 'vehicleId', targetKey: 'vehicleId' });
QuotationTransportation.hasMany(MarketingTransaction, { as: 'MarketingTransaction', foreignKey: 'id', sourceKey: 'id' });

MarketingTransaction.belongsTo(Client, { as: 'Client', foreignKey: 'clientId', targetKey: 'clientId' });
MarketingTransaction.belongsTo(QuotationWaste, { as: 'QuotationWaste', foreignKey: 'quotationWasteId', targetKey: 'id' });
MarketingTransaction.belongsTo(QuotationTransportation, { as: 'QuotationTransportation', foreignKey: 'quotationTransportationId', targetKey: 'id' });
MarketingTransaction.belongsTo(WasteCategory, { as: 'WasteCategory', foreignKey: 'wasteCategoryId', targetKey: 'id' });
MarketingTransaction.belongsTo(TransactionStatus, { as: 'TransactionStatus', foreignKey: 'statusId', targetKey: 'id' });
MarketingTransaction.belongsTo(Employee, { as: 'Employee', foreignKey: 'submittedBy', targetKey: 'employeeId' });
MarketingTransaction.hasMany(LogisticsTransaction, { as: 'LogisticsTransaction', foreignKey: 'mtfId', sourceKey: 'id' });

LogisticsTransaction.hasMany(LogisticsTransactionHelper, { as: 'LogisticsTransactionHelper', foreignKey: 'logisticsTransactionId', sourceKey: 'id' });
LogisticsTransaction.hasMany(DispatchLogisticsTransaction, { as: 'DispatchLogisticsTransaction', foreignKey: 'logisticsTransactionId', sourceKey: 'id' });
LogisticsTransaction.belongsTo(MarketingTransaction, { as: 'MarketingTransaction', foreignKey: 'mtfId', targetKey: 'id' });
LogisticsTransaction.belongsTo(Employee, { as: 'Driver', foreignKey: 'driverId', targetKey: 'employeeId' });
LogisticsTransaction.belongsTo(Employee, { as: 'Employee', foreignKey: 'scheduledBy', targetKey: 'employeeId' });
LogisticsTransaction.hasMany(Vehicle, { as: 'Vehicle', foreignKey: 'plateNumber', sourceKey: 'plateNumber' });

LogisticsTransactionHelper.belongsTo(LogisticsTransaction, { as: 'LogisticsTransaction', foreignKey: 'logisticsTransactionId', targetKey: 'id' });
LogisticsTransactionHelper.belongsTo(Employee, { as: 'Employee', foreignKey: 'truckHelperId', targetKey: 'employeeId' });

DispatchLogisticsTransaction.belongsTo(LogisticsTransaction, { as: 'LogisticsTransaction', foreignKey: 'logisticsTransactionId', targetKey: 'id' });
DispatchLogisticsTransaction.belongsTo(Employee, { as: 'Employee', foreignKey: 'dispatchedBy', targetKey: 'employeeId' });
DispatchLogisticsTransaction.hasMany(VehicleLog, { as: 'VehicleLog', foreignKey: 'dispatchId', sourceKey: 'id', onDelete: 'CASCADE' }); 

// Export the associations
module.exports = {
    Employee,
    EmployeeRole,
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
    WasteCategory,
    TransactionStatus,
};
