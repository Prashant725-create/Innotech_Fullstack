const mongoose = require('mongoose');
const Report = require('../models/Report');
const xml2js = require('xml2js');
const fs = require('fs');

const parser = new xml2js.Parser({ explicitArray: false });

// A helper function to safely parse numbers
const parseNum = (val) => {
  const num = Number(val);
  return isNaN(num) ? 0 : num;
};

// @desc    Upload & process XML file
// @route   POST /api/reports/upload
// @access  Public
exports.uploadReport = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  // Check for XML file type
  if (req.file.mimetype !== 'text/xml' && req.file.mimetype !== 'application/xml') {
    fs.unlinkSync(req.file.path); // Delete the invalid file
    return res.status(400).json({ message: 'Invalid file type. Only XML is allowed.' });
  }

  try {
    // 1. Read the uploaded file
    const xmlData = fs.readFileSync(req.file.path, 'utf8');

    // 2. Parse the XML data
    let parsedData;
    await parser.parseString(xmlData, (err, result) => {
      if (err) {
        throw new Error('Error parsing XML');
      }
      parsedData = result; // This is now a JS object
    });

    // 3. Map parsedData to your Schema using the *correct* paths
    const root = parsedData.INProfileResponse;
    const applicantDetails = root.Current_Application.Current_Application_Details.Current_Applicant_Details;
    const summary = root.CAIS_Account.CAIS_Summary;
    const accounts = root.CAIS_Account.CAIS_Account_DETAILS || [];

    const reportData = {
      basicDetails: {
        name: `${applicantDetails.First_Name} ${applicantDetails.Last_Name}`,
        mobilePhone: applicantDetails.MobilePhoneNumber,
        // Find the first PAN number available in the accounts
        pan: accounts.length > 0 ? accounts[0].CAIS_Holder_Details.Income_TAX_PAN : '',
        creditScore: parseNum(root.SCORE.BureauScore),
      },
      reportSummary: {
        totalAccounts: parseNum(summary.Credit_Account.CreditAccountTotal),
        activeAccounts: parseNum(summary.Credit_Account.CreditAccountActive),
        closedAccounts: parseNum(summary.Credit_Account.CreditAccountClosed),
        currentBalanceAmount: parseNum(summary.Total_Outstanding_Balance.Outstanding_Balance_All),
        securedAccountsAmount: parseNum(summary.Total_Outstanding_Balance.Outstanding_Balance_Secured),
        unsecuredAccountsAmount: parseNum(summary.Total_Outstanding_Balance.Outstanding_Balance_UnSecured),
        last7DaysCreditEnquiries: parseNum(root.TotalCAPS_Summary.TotalCAPSLast7Days),
      },
      // Loop through the array of accounts and map them
      creditAccounts: accounts.map(acc => ({
        bank: acc.Subscriber_Name.trim(), // .trim() to remove extra spaces
        accountNumber: acc.Account_Number,
        amountOverdue: parseNum(acc.Amount_Past_Due),
        currentBalance: parseNum(acc.Current_Balance),
      })),
      // Loop through accounts and extract addresses
      addresses: accounts.map(acc => {
        const addr = acc.CAIS_Holder_Address_Details;
        return {
          fullAddress: `${addr.First_Line_Of_Address_non_normalized}, ${addr.Second_Line_Of_Address_non_normalized}, ${addr.City_non_normalized}, ${addr.State_non_normalized} - ${addr.ZIP_Postal_Code_non_normalized}`
        };
      }),
    };

    // 4. Create and save the new report
    const newReport = await Report.create(reportData);
    
    // 5. Delete the temporary file
    fs.unlinkSync(req.file.path);
    
    // 6. Send success response
    res.status(201).json({ 
      message: 'File processed successfully!',
      data: newReport 
    });

  } catch (error) {
    console.error('Error processing file:', error);
    // Clean up the file if an error occurs
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Server error while processing file.', error: error.message });
  }
};

// @desc    Get all reports
// @route   GET /api/reports
// @access  Public
exports.getReports = async (req, res) => {
  try {
    const reports = await Report.find().sort({ processedAt: -1 });
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reports.' });
  }
};