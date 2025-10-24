import React from 'react';

export const ReportDisplay = ({ reports }) => {
  if (!reports || reports.length === 0) {
    return <p>No reports to display. Upload a file to get started.</p>;
  }

  // Displaying the most recent report
  const report = reports[0]; 

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <h2>Most Recent Report (Processed: {new Date(report.processedAt).toLocaleString()})</h2>

      <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
        <h3>1. Basic Details</h3>
        <p><strong>Name:</strong> {report.basicDetails?.name}</p>
        <p><strong>Credit Score:</strong> {report.basicDetails?.creditScore}</p>
        <p><strong>Mobile:</strong> {report.basicDetails?.mobilePhone}</p>
        <p><strong>PAN:</strong> {report.basicDetails?.pan}</p>
      </div>

      <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
        <h3>2. Report Summary</h3>
        <p><strong>Total Accounts:</strong> {report.reportSummary?.totalAccounts}</p>
        <p><strong>Active Accounts:</strong> {report.reportSummary?.activeAccounts}</p>
        <p><strong>Closed Accounts:</strong> {report.reportSummary?.closedAccounts}</p>
        <p><strong>Current Balance:</strong> ${report.reportSummary?.currentBalanceAmount}</p>
        <p><strong>Secured Accounts Amount:</strong> ${report.reportSummary?.securedAccountsAmount}</p>
        <p><strong>Unsecured Accounts Amount:</strong> ${report.reportSummary?.unsecuredAccountsAmount}</p>
        <p><strong>Last 7 Days Enquiries:</strong> {report.reportSummary?.last7DaysCreditEnquiries}</p>
      </div>

      <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
        <h3>3. Credit Accounts Information</h3>
        {report.creditAccounts?.length > 0 ? (
          report.creditAccounts.map((acc, index) => (
            <div key={index} style={{ borderBottom: '1px solid #eee', marginBottom: '10px' }}>
              <p><strong>Bank:</strong> {acc.bank}</p>
              <p><strong>Account Number:</strong> {acc.accountNumber}</p>
              <p><strong>Current Balance:</strong> ${acc.currentBalance}</p>
              <p><strong>Amount Overdue:</strong> ${acc.amountOverdue}</p>
            </div>
          ))
        ) : (
          <p>No credit account information available.</p>
        )}
      </div>
    </div>
  );
};