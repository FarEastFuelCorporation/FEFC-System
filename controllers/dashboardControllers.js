// controllers/dashboardController.js

const Client = require("../models/Client");
const Employee = require("../models/Employee");
const MarketingTransaction = require("../models/MarketingTransaction");
const Quotation = require("../models/Quotation");
const QuotationTransportation = require("../models/QuotationTransportation");
const QuotationWaste = require("../models/QuotationWaste");
const TreatmentProcess = require("../models/TreatmentProcess");
const TypeOfWaste = require("../models/TypeOfWaste");
const User = require("../models/User");
const VehicleType = require("../models/VehicleType");
const { createCanvas } = require('canvas');
const htmlToImage = require('html-to-image');

// Dashboard controller
async function getDashboardController(req, res) {
    try {
        // Retrieve data from the database or perform other logic
        const employeeId = req.session.employeeId;
        const employee = await Employee.findOne({ where: { employeeId } });
        var currentPage, totalPages, entriesPerPage, searchQuery
        
        
        // Render the dashboard view with data
        const viewsData = {
            pageTitle: 'Marketing User - Dashboard',
            sidebar: 'marketing/marketing_sidebar',
            content: 'marketing/marketing_dashboard',
            route: 'marketing_dashboard',
            general_scripts: 'marketing/marketing_scripts',
            employee,
            currentPage,
            totalPages,
            entriesPerPage,
            searchQuery,
        };
        res.render('dashboard', viewsData);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}

// Booked Transactions controller
async function getBookedTransactionsController(req, res) {
    try {
        var currentPage, totalPages, entriesPerPage, searchQuery;
        const employeeId = req.session.employeeId;

        // Fetch all clients from the database
        const clients = await Client.findAll();
        const quotation = await Quotation.findAll({
            where: { 
                status: 'ACTIVE' // Add this condition
            },
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

        // Check for the success query parameter
        let successMessage;
        if(req.query.success === 'new'){
            successMessage = 'Transaction created successfully!';
        } else if (req.query.success === 'update'){
            successMessage = 'Transaction updated successfully!';
        }

        // Render the 'marketing/booked_transactions' view and pass the necessary data
        const viewsData = {
            pageTitle: 'Marketing User - Booked Transactions',
            sidebar: 'marketing/marketing_sidebar',
            content: 'marketing/booked_transactions',
            route: 'booked_transactions',
            general_scripts: 'marketing/marketing_scripts',
            employeeId,
            clients,
            quotation,
            currentPage,
            totalPages,
            entriesPerPage,
            searchQuery,
            successMessage,
        };
        res.render('dashboard', viewsData);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}
async function postBookedTransactionsController(req, res) {
    try {
        const {
            status,
            haulingDate,
            haulingTime,
            clientId,
            submitTo,
            wasteId,
            wasteCategory,
            vehicleCounter,
            ptt,
            manifest,
            pull_out_form,
            remarks,
        } = req.body;

        const lastMTFTransaction = await MarketingTransaction.findOne({
            order: [['createdAt', 'DESC']],
        });
        
        const employeeId = req.session.employeeId;

        // Get the current year and month
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear().toString();
        const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');

        // Check if it's a new year
        const mtfNumber = generateMTFNumber(lastMTFTransaction)
        function generateMTFNumber (lastMTFTransaction) {
            if (lastMTFTransaction) {
                const lastYear = lastMTFTransaction.mtfNumber.slice(3, 7);
                const lastCounter = parseInt(lastMTFTransaction.mtfNumber.slice(-4));
    
                if (lastYear === currentYear) {
                    // Generate the MTF number with the current year and month
                    const newCounter = (lastCounter + 1).toString().padStart(4, '0');
                    const generatedMtfNumber = `MTF${currentYear}${currentMonth}${newCounter}`;
    
                    // Log the data type of generatedMtfNumber
                    console.log('Data type of generatedMtfNumber:', typeof generatedMtfNumber);
    
                    return generatedMtfNumber.toString(); // Explicitly convert to string
                } else {
                    // If it's a new year, start the counter at 1
                    const generatedMtfNumber = `MTF${currentYear}${currentMonth}0001`;
    
                    // Log the data type of generatedMtfNumber
                    console.log('Data type of generatedMtfNumber:', typeof generatedMtfNumber);
    
                    return generatedMtfNumber;
                }
            } else {
                // If there are no previous transactions, start the counter at 1
                const generatedMtfNumber = `MTF${currentYear}${currentMonth}0001`;
    
                // Log the data type of generatedMtfNumber
                console.log('Data type of generatedMtfNumber:', typeof generatedMtfNumber);
    
                return generatedMtfNumber;
            }
        }

        // Process dynamic fields
        for (let i = 1; i <= vehicleCounter; i++) {
            const typeOfVehicle =  req.body[`typeOfVehicle${i}`];

            // Creating a new MarketingTransaction
            const newMarketingTransaction = await MarketingTransaction.create({
                mtfNumber: mtfNumber,
                clientId: clientId,
                quotationWasteId: wasteId,
                quotationTransportationId: typeOfVehicle,
                wasteCategoryId: wasteCategory,
                haulingDate: haulingDate,
                haulingTime: haulingTime,
                pullOutFormNumber: pull_out_form,
                pttNumber: ptt,
                manifestNumber: manifest,
                remarks: remarks,
                submitTo: submitTo,
                statusId: status,
                submittedBy: employeeId,
            });
        }

        // Redirect back to the quotation route with a success message
        res.redirect('/dashboard/booked_transactions?success=new');
    } catch (error) {
        // Handling errors
        console.error('Error creating quotation:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Clients controller
async function getClientsController(req, res) {
    try {
        // Fetch all clients from the database
        const clients = await Client.findAll();

        // Get the page number, entries per page, and search query from the query parameters
        const currentPage = parseInt(req.query.page) || 1;
        const entriesPerPage = parseInt(req.query.entriesPerPage) || 10;
        const searchQuery = req.query.search || ''; // Default to an empty string if no search query

        // Additional logic to filter clients based on the search query
        const filteredClients = clients.filter(client => {
            // Customize this logic based on how you want to perform the search
            return (
                client.clientName.toLowerCase().includes(searchQuery.toLowerCase())
                // Add more fields if needed
            );
        });

        // Calculate total pages based on the total number of filtered clients and entries per page
        const totalFilteredClients = filteredClients.length;
        const totalPages = Math.ceil(totalFilteredClients / entriesPerPage);

        // Implement pagination and send the filtered clients to the view
        const startIndex = (currentPage - 1) * entriesPerPage;
        const endIndex = currentPage * entriesPerPage;
        const paginatedClients = filteredClients.slice(startIndex, endIndex);

        // Check for the success query parameter
        let successMessage;
        if(req.query.success === 'new'){
            successMessage = 'Client created successfully!';
        } else if (req.query.success === 'update'){
            successMessage = 'Client updated successfully!';
        }

        // Render the 'marketing/clients' view and pass the necessary data
        const viewsData = {
            pageTitle: 'Marketing User - Clients',
            sidebar: 'marketing/marketing_sidebar',
            content: 'marketing/clients',
            route: 'clients',
            general_scripts: 'marketing/marketing_scripts',
            clients: paginatedClients,
            currentPage,
            totalPages,
            entriesPerPage,
            searchQuery,
            successMessage,
        };
        res.render('dashboard', viewsData);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}

async function getClientDetails (req, res) {
    try {
        const clientId = req.params.clientId;

        // Find the client by ID
        const client = await Client.findOne({
            where: {
            clientId: clientId,
            },
        });

        if (!client) {
            return res.status(404).json({ error: 'Client not found' });
        }

        // Respond with client details
        return res.status(200).json(client);
    } catch (error) {
        console.error('Error fetching client details:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}


// New Client controller
async function getNewClientController(req, res) {
    var currentPage, totalPages, entriesPerPage, searchQuery
        
    // Render the dashboard view with data
    const viewsData = {
        pageTitle: 'Marketing User - New Client Form',
        sidebar: 'marketing/marketing_sidebar',
        content: 'marketing/new_client',
        route: 'marketing_dashboard',
        general_scripts: 'marketing/marketing_scripts',
        currentPage,
        totalPages,
        entriesPerPage,
        searchQuery,
    };
    res.render('dashboard', viewsData);
}

async function postNewClientController(req, res) {
    try {
        // Extracting data from the request body
        const {
            clientName,
            address,
            natureOfBusiness,
            contactNumber,
            billerName,
            billerAddress,
            billerContactPerson,
            billerContactNumber,
        } = req.body;

        // Creating a new client
        const newClient = await Client.create({
            clientName,
            address,
            natureOfBusiness,
            contactNumber,
            billerName,
            billerAddress,
            billerContactPerson,
            billerContactNumber,
            clientId: await generateClientId(), // You need to implement this function to generate a unique client ID
        });

        // Redirect back to the client route with a success message
        res.redirect('/dashboard/clients?success=new');
    } catch (error) {
        // Handling errors
        console.error('Error creating client:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Function to generate a unique client ID (You need to implement this)
async function generateClientId(req, res) {
    try {
        // Find the last created client
        const lastClient = await Client.findOne({
            order: [['clientId', 'DESC']], // Order by clientId in descending order
        });

        // Extract the counter from the last client's ID
        const lastCounter = lastClient ? parseInt(lastClient.clientId.slice(-4), 10) : 0;

        // Increment the counter
        const counter = lastCounter + 1;

        // Generate the new client ID
        const currentYear = new Date().getFullYear();
        const clientId = `C${currentYear}${counter.toString().padStart(4, '0')}`;

        return clientId;
    } catch (error) {
        console.error('Error generating client ID:', error);
        // Handle the error appropriately in your application
        return null; // or throw a different error or provide a default value
    }
};

// Update Client controller
async function getUpdateClientController(req, res) {
    var currentPage, totalPages, entriesPerPage, searchQuery

    // Fetch the client ID from the request parameters
    const clientId = req.params.clientId;

    // Fetch all clients from the database (You might need to modify this based on your use case)
    const client = await Client.findOne({
            where: { clientId },
        }
    );

    // Render the dashboard view with data
    const viewsData = {
        pageTitle: 'Marketing User - Update Client Form',
        sidebar: 'marketing/marketing_sidebar',
        content: 'marketing/update_client',
        route: 'marketing_dashboard',
        general_scripts: 'marketing/marketing_scripts',
        client,
        currentPage,
        totalPages,
        entriesPerPage,
        searchQuery,
    };
    res.render('dashboard', viewsData);
}

async function postUpdateClientController(req, res) {
    try {
        // Extracting data from the request body
        const {
            clientId,
            clientName,
            address,
            natureOfBusiness,
            contactNumber,
            billerName,
            billerAddress,
            billerContactPerson,
            billerContactNumber,
        } = req.body;

        // Find the client in the database based on the provided client ID
        const existingClient = await Client.findOne({
            where: {
                clientId: clientId,
            },
        });

        // If the client is not found, return an error
        if (!existingClient) {
            return res.status(404).json({ message: 'Client not found' });
        }

        // Update the client with the new data
        await existingClient.update({
            clientName,
            address,
            natureOfBusiness,
            contactNumber,
            billerName,
            billerAddress,
            billerContactPerson,
            billerContactNumber,
        });

        // Redirect back to the client route with a success message
        res.redirect('/dashboard/clients?success=update');
    } catch (error) {
        // Handling errors
        console.error('Error updating client:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Type of Waste controller
async function getTypeOfWasteController(req, res) {
    try {
        // Fetch all types of wastes from the database
        const typesOfWaste = await TypeOfWaste.findAll({
            include: [{ model: TreatmentProcess, as: 'TreatmentProcess' }],
        });

        // Get the page number, entries per page, and search query from the query parameters
        const currentPage = parseInt(req.query.page) || 1;
        const entriesPerPage = parseInt(req.query.entriesPerPage) || 10;
        const searchQuery = req.query.search || ''; // Default to an empty string if no search query

        // Additional logic to filter types of waste based on the search query
        const filteredTypesOfWaste = typesOfWaste.filter(typeOfWaste => {
            // Customize this logic based on how you want to perform the search
            return (
                typeOfWaste.wasteDescription.toLowerCase().includes(searchQuery.toLowerCase())
                // Add more fields if needed
            );
        });

        // Calculate total pages based on the total number of filtered types of waste and entries per page
        const totalFilteredTypesOfWaste = filteredTypesOfWaste.length;
        const totalPages = Math.ceil(totalFilteredTypesOfWaste / entriesPerPage);

        // Implement pagination and send the filtered types of waste to the view
        const startIndex = (currentPage - 1) * entriesPerPage;
        const endIndex = currentPage * entriesPerPage;
        const paginatedTypesOfWaste = filteredTypesOfWaste.slice(startIndex, endIndex);

        const viewsData = {
            pageTitle: 'Marketing User - Type of Waste',
            sidebar: 'marketing/marketing_sidebar',
            content: 'marketing/type_of_waste',
            route: 'type_of_waste',
            general_scripts: 'marketing/marketing_scripts',
            typesOfWaste: paginatedTypesOfWaste,
            currentPage,
            totalPages,
            entriesPerPage,
            searchQuery,
        };
        res.render('dashboard', viewsData);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}

// Quotations controller
async function getQuotationsController(req, res) {
    try {
        // Fetch all quotations from the database
        const quotations = await Quotation.findAll({
            include: [
                { model: Client, as: 'Client' },
                { model: Employee, as: 'Employee' },
            ],
        });

        // Get the page number, entries per page, and search query from the query parameters
        const currentPage = parseInt(req.query.page) || 1;
        const entriesPerPage = parseInt(req.query.entriesPerPage) || 10;
        const searchQuery = req.query.search || ''; // Default to an empty string if no search query

        // Additional logic to filter types of waste based on the search query
        const filteredQuotations = quotations.filter(quotation => {
            // Customize this logic based on how you want to perform the search
            const clientName = quotation.Client.clientName;
            return (
                clientName.toLowerCase().includes(searchQuery.toLowerCase())
                // Add more fields if needed
            );
        });

        // Calculate total pages based on the total number of filtered types of waste and entries per page
        const totalFilteredQuotations = filteredQuotations.length;
        const totalPages = Math.ceil(totalFilteredQuotations / entriesPerPage);

        // Implement pagination and send the filtered types of waste to the view
        const startIndex = (currentPage - 1) * entriesPerPage;
        const endIndex = currentPage * entriesPerPage;
        const paginatedQuotations = filteredQuotations.slice(startIndex, endIndex);

        // Check for the success query parameter
        let successMessage;
        if(req.query.success === 'new'){
            successMessage = 'Quotation created successfully!';
        } else if (req.query.success === 'update'){
            successMessage = 'Quotation updated successfully!';
        }

        const viewsData = {
            pageTitle: 'Marketing User - Quotations',
            sidebar: 'marketing/marketing_sidebar',
            content: 'marketing/quotations',
            route: 'quotations',
            general_scripts: 'marketing/marketing_scripts',
            quotations: paginatedQuotations,
            currentPage,
            totalPages,
            entriesPerPage,
            searchQuery,
            successMessage,
        };
        res.render('dashboard', viewsData);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}

// New Quotation controller
async function getNewQuotationController(req, res) {
    var currentPage, totalPages, entriesPerPage, searchQuery
    const employeeId = req.session.employeeId;

    const employee = await Employee.findOne({ where: { employeeId } });
    const clients = await Client.findAll();
    const typesOfWastes = await TypeOfWaste.findAll();
    const vehicleTypes = await VehicleType.findAll();

    // Function to convert a string to proper case
    function toProperCase(str) {
        return str.replace(/\w\S*/g, function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    // Apply the function to the employee's first and last names
    const employeeName = `${toProperCase(employee.firstName)} ${toProperCase(employee.lastName)}`;
    const employeeSignature = employee.picture.replace(/\.jpg$/, '.png');

    // Sorting the clients array by clientName
    clients.sort((clientA, clientB) => {
        const nameA = clientA.clientName.toUpperCase(); // Convert names to uppercase for case-insensitive sorting
        const nameB = clientB.clientName.toUpperCase();

        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0; // Names are equal
    });
        
    // Render the dashboard view with data
    const viewsData = {
        pageTitle: 'Marketing User - New Quotation Form',
        sidebar: 'marketing/marketing_sidebar',
        content: 'marketing/new_quotation',
        route: 'marketing_dashboard',
        general_scripts: 'marketing/marketing_scripts',
        currentPage,
        totalPages,
        entriesPerPage,
        searchQuery,
        employeeName,
        employeeId,
        employeeSignature,
        typesOfWastes,
        clients,
        vehicleTypes,
    };
    res.render('dashboard', viewsData);
}
async function postNewQuotationController(req, res) {
    try {
        const {
            userId,
            quotation_no,
            revision_no,
            validity,
            terms,
            terms2,
            client,
            scope_of_work,
            remarks,
            list_counter,
            tf_counter,
        } = req.body;

        // Creating a new Quotation
        const newQuotation = await Quotation.create({
            quotationCode: quotation_no,
            revisionNumber: revision_no,
            validity: validity,
            clientId: client,
            termsCharge: terms,
            termsBuying: terms2,
            scopeOfWork: scope_of_work,
            remarks: remarks,
            submittedBy: userId,
        });
        
        // Process dynamic fields
        for (let i = 1; i <= list_counter; i++) {
            const waste_code =  req.body[`waste_code${i}`];
            const waste_name =  req.body[`waste_name${i}`];
            const mode =  req.body[`mode${i}`];
            const unit =  req.body[`unit${i}`];
            const unit_price =  req.body[`unit_price${i}`];
            const vat_calculation =  req.body[`vat_calculation${i}`];
            const fix_price =  req.body[`fix_price${i}`];

            // Creating a new QuotationWaste
            const newQuotationWaste = await QuotationWaste.create({
                quotationCode: quotation_no,
                wasteId: waste_code,
                wasteName: waste_name,
                mode: mode,
                unit: unit,
                unitPrice: unit_price,
                vatCalculation: vat_calculation,
                maxCapacity: fix_price,
            });
        }
    
        // Process dynamic transportation fields
        for (let i = 1; i <= tf_counter; i++) {
            const type_of_vehicle =  req.body[`type_of_vehicle${i}`];
            const hauling_area =  req.body[`hauling_area${i}`];
            const tf_mode =  req.body[`tf_mode${i}`];
            const tf_unit =  req.body[`tf_unit${i}`];
            const tf_unit_price =  req.body[`tf_unit_price${i}`];
            const tf_vat_calculation =  req.body[`tf_vat_calculation${i}`];
            const max_capacity =  req.body[`max_capacity${i}`];

            // Creating a new QuotationTransportation
            const newQuotationTransportation = await QuotationTransportation.create({
                quotationCode: quotation_no,
                vehicleId: type_of_vehicle,
                haulingArea: hauling_area,
                mode: tf_mode,
                unit: tf_unit,
                unitPrice: tf_unit_price,
                vatCalculation: tf_vat_calculation,
                maxCapacity: max_capacity,
            });
        }

        // Redirect back to the quotation route with a success message
        res.redirect('/dashboard/quotations?success=new');
    } catch (error) {
        // Handling errors
        console.error('Error creating quotation:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update Quotation controller
async function getUpdateQuotationController(req, res) {
    try {
        var currentPage, totalPages, entriesPerPage, searchQuery
        const employeeId = req.session.employeeId;
        const quotationCode = req.params.quotationCode;
        const revisionNumber = req.params.revisionNumber;
    
        const employee = await Employee.findOne({ where: { employeeId } });
        const typesOfWastes = await TypeOfWaste.findAll();
        const vehicleTypes = await VehicleType.findAll();
        const quotation = await Quotation.findAll({
            where: { 
                quotationCode, 
                revisionNumber,
                status: 'ACTIVE' // Add this condition
            },
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
        const employeeName = `${toProperCase(employee.firstName)} ${toProperCase(employee.lastName)}`;
        const employeeSignature = employee.picture.replace(/\.jpg$/, '.png');
    
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
            employeeId,
            employeeSignature,
            quotation,
            typesOfWastes,
            vehicleTypes,
        };
        res.render('dashboard', viewsData);
    } catch (error) {
        console.error('Error in getUpdateQuotationController:', error);
        // Handle the error appropriately (e.g., send an error response)
        res.status(500).send('Internal Server Error');
    }

}
async function postUpdateQuotationController(req, res) {
    try {
        const {
            userId,
            quotation_no,
            revision_no,
            validity,
            terms,
            terms2,
            client,
            scope_of_work,
            remarks,
            list_counter,
            tf_counter,
            imageDataUrl,
        } = req.body;
        
        // Convert base64 image data to buffer
        const imageDataBuffer = Buffer.from(imageDataUrl.split(',')[1], 'base64');

        // You may want to generate a unique filename or use the quotation code as the filename
        const filename = 'your-unique-filename.png';

        // Save the image to a specific directory (create the directory if it doesn't exist)
        const imagePath = path.join(__dirname, 'images', filename);
        await fs.writeFile(imagePath, imageDataBuffer);
        // Creating a new Quotation
        const newQuotation = await Quotation.create({
            quotationCode: quotation_no,
            revisionNumber: revision_no,
            validity: validity,
            clientId: client,
            termsCharge: terms,
            termsBuying: terms2,
            scopeOfWork: scope_of_work,
            remarks: remarks,
            submittedBy: userId,
            quotationImage: `/images/${filename}`,
        });
        
        // Process dynamic fields
        for (let i = 1; i <= list_counter; i++) {
            const waste_code =  req.body[`waste_code${i}`];
            const waste_name =  req.body[`waste_name${i}`];
            const mode =  req.body[`mode${i}`];
            const unit =  req.body[`unit${i}`];
            const unit_price =  req.body[`unit_price${i}`];
            const vat_calculation =  req.body[`vat_calculation${i}`];
            const fix_price =  req.body[`fix_price${i}`];

            // Creating a new QuotationWaste
            const newQuotationWaste = await QuotationWaste.create({
                quotationCode: quotation_no,
                wasteId: waste_code,
                wasteName: waste_name,
                mode: mode,
                unit: unit,
                unitPrice: unit_price,
                vatCalculation: vat_calculation,
                maxCapacity: fix_price,
            });
        }
    
        // Process dynamic transportation fields
        for (let i = 1; i <= tf_counter; i++) {
            const type_of_vehicle =  req.body[`type_of_vehicle${i}`];
            const hauling_area =  req.body[`hauling_area${i}`];
            const tf_mode =  req.body[`tf_mode${i}`];
            const tf_unit =  req.body[`tf_unit${i}`];
            const tf_unit_price =  req.body[`tf_unit_price${i}`];
            const tf_vat_calculation =  req.body[`tf_vat_calculation${i}`];
            const max_capacity =  req.body[`max_capacity${i}`];

            // Creating a new QuotationTransportation
            const newQuotationTransportation = await QuotationTransportation.create({
                quotationCode: quotation_no,
                vehicleId: type_of_vehicle,
                haulingArea: hauling_area,
                mode: tf_mode,
                unit: tf_unit,
                unitPrice: tf_unit_price,
                vatCalculation: tf_vat_calculation,
                maxCapacity: max_capacity,
            });
        }

        // Redirect back to the quotation route with a success message
        res.redirect('/dashboard/quotations?success=new');
    } catch (error) {
        // Handling errors
        console.error('Error creating quotation:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Quotations controller
async function getCommissionsController(req, res) {
    try {
        // Fetch all quotations from the database
        const quotations = await Quotation.findAll({
            include: [
                { model: Client, as: 'Client' },
                { model: Employee, as: 'Employee' },
            ],
        });

        // Get the page number, entries per page, and search query from the query parameters
        // const currentPage = parseInt(req.query.page) || 1;
        const currentPage = 1;
        const entriesPerPage = parseInt(req.query.entriesPerPage) || 10;
        const searchQuery = req.query.search || ''; // Default to an empty string if no search query

        // Additional logic to filter types of waste based on the search query
        const filteredQuotations = quotations.filter(quotation => {
            // Customize this logic based on how you want to perform the search
            const clientName = quotation.Client.clientName;
            return (
                clientName.toLowerCase().includes(searchQuery.toLowerCase())
                // Add more fields if needed
            );
        });

        // Calculate total pages based on the total number of filtered types of waste and entries per page
        // const totalFilteredQuotations = filteredQuotations.length;
        const totalFilteredQuotations = 1;
        const totalPages = Math.ceil(totalFilteredQuotations / entriesPerPage);

        // Implement pagination and send the filtered types of waste to the view
        const startIndex = (currentPage - 1) * entriesPerPage;
        const endIndex = currentPage * entriesPerPage;
        const paginatedQuotations = filteredQuotations.slice(startIndex, endIndex);

        // Check for the success query parameter
        let successMessage;
        if(req.query.success === 'new'){
            successMessage = 'Quotation created successfully!';
        } else if (req.query.success === 'update'){
            successMessage = 'Quotation updated successfully!';
        }

        const viewsData = {
            pageTitle: 'Marketing User - Commissions',
            sidebar: 'marketing/marketing_sidebar',
            content: 'marketing/commissions',
            route: 'commissions',
            general_scripts: 'marketing/marketing_scripts',
            quotations: paginatedQuotations,
            currentPage,
            totalPages,
            entriesPerPage,
            searchQuery,
            successMessage,
        };
        res.render('dashboard', viewsData);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}

// other controller
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

module.exports = { 
    getDashboardController,
    getBookedTransactionsController,
    postBookedTransactionsController,
    getClientsController,
    getClientDetails,
    getNewClientController,
    getUpdateClientController,
    postNewClientController,
    postUpdateClientController,
    getTypeOfWasteController,
    getQuotationsController,
    getNewQuotationController,
    postNewQuotationController,
    getUpdateQuotationController,
    postUpdateQuotationController,
    getCommissionsController,
    getQuotationWasteByClient,
    getQuotationTransportationByClient,
};