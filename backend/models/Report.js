const mongoose = require('mongoose');

// This schema is based directly on your project overview
const ReportSchema = new mongoose.Schema({
  // 1. Basic Details
  basicDetails: {
    name: { type: String, required: true },
    mobilePhone: { type: String },
    pan: { type: String },
    creditScore: { type: Number, required: true },
  },

  // 2. Report Summary
  reportSummary: {
    totalAccounts: { type: Number, default: 0 },
    activeAccounts: { type: Number, default: 0 },
    closedAccounts: { type: Number, default: 0 },
    currentBalanceAmount: { type: Number, default: 0 },
    securedAccountsAmount: { type: Number, default: 0 },
    unsecuredAccountsAmount: { type: Number, default: 0 },
    last7DaysCreditEnquiries: { type: Number, default: 0 },
  },

  // 3. Credit Accounts Information
  // This will be an array of account objects
  creditAccounts: [
    {
      bank: { type: String },
      accountNumber: { type: String },
      amountOverdue: { type: Number, default: 0 },
      currentBalance: { type: Number, default: 0 },
    }
  ],

  // We'll also store the associated addresses
  addresses: [
    {
      fullAddress: { type: String },
    }
  ],

  // Timestamp for when the report was processed
  processedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Report', ReportSchema);