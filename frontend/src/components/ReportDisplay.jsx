import React from 'react';
import { TrendingUp, AlertCircle, CheckCircle, CreditCard, DollarSign, Calendar, User, Phone, Hash } from 'lucide-react';

export const ReportDisplay = ({ reports, isDark }) => {
  if (!reports || reports.length === 0) {
    return (
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-12 text-center`}>
        <AlertCircle className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
        <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          No reports to display. Upload a file to get started.
        </p>
      </div>
    );
  }

  const report = reports[0];
  const creditScore = report.basicDetails?.creditScore || 0;
  const scoreLabel = creditScore >= 750 ? 'Excellent' : creditScore >= 650 ? 'Good' : 'Fair';
  
  const cardClass = `${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`;
  const textPrimary = isDark ? 'text-white' : 'text-gray-800';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-500';
  const iconBg = isDark ? 'bg-teal-900 bg-opacity-50' : 'bg-teal-100';
  const iconColor = isDark ? 'text-teal-400' : 'text-teal-600';

  return (
    <div className="space-y-6">
      {/* Credit Score Header */}
      <div className={`${isDark ? 'bg-gradient-to-br from-teal-900 to-teal-700' : 'bg-gradient-to-br from-teal-500 to-teal-600'} rounded-xl shadow-lg p-8 text-white`}>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
          <h2 className="text-2xl font-bold">Credit Report Summary</h2>
          <div className="flex items-center gap-2 text-sm bg-white bg-opacity-20 px-3 py-2 rounded-full">
            <Calendar className="w-4 h-4" />
            {new Date(report.processedAt).toLocaleDateString()}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white bg-opacity-10 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <User className="w-5 h-5" />
              <span className="text-sm opacity-90">Account Holder</span>
            </div>
            <p className="text-2xl font-bold">{report.basicDetails?.name}</p>
          </div>
          
          <div className="bg-white bg-opacity-10 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm opacity-90">Credit Score</span>
            </div>
            <div className="flex items-baseline gap-3">
              <p className="text-4xl font-bold">{creditScore}</p>
              <span className="text-lg opacity-90">{scoreLabel}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Info */}
      <div className={cardClass}>
        <h3 className={`text-xl font-bold mb-4 ${textPrimary}`}>Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconBg}`}>
              <Phone className={`w-5 h-5 ${iconColor}`} />
            </div>
            <div>
              <p className={`text-sm ${textSecondary}`}>Mobile</p>
              <p className={`font-medium ${textPrimary}`}>{report.basicDetails?.mobilePhone}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconBg}`}>
              <Hash className={`w-5 h-5 ${iconColor}`} />
            </div>
            <div>
              <p className={`text-sm ${textSecondary}`}>PAN</p>
              <p className={`font-medium ${textPrimary}`}>{report.basicDetails?.pan}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`${cardClass} hover:shadow-xl transition-all`}>
          <div className="flex items-center justify-between mb-2">
            <CreditCard className="w-8 h-8 text-teal-500" />
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <p className={`text-sm ${textSecondary}`}>Total Accounts</p>
          <p className={`text-3xl font-bold ${textPrimary}`}>{report.reportSummary?.totalAccounts}</p>
          <div className="mt-3 flex gap-4 text-sm">
            <span className="text-green-500 font-medium">Active: {report.reportSummary?.activeAccounts}</span>
            <span className={textSecondary}>Closed: {report.reportSummary?.closedAccounts}</span>
          </div>
        </div>

        <div className={`${cardClass} hover:shadow-xl transition-all`}>
          <DollarSign className="w-8 h-8 text-teal-500 mb-2" />
          <p className={`text-sm ${textSecondary}`}>Current Balance</p>
          <p className={`text-3xl font-bold ${textPrimary}`}>${report.reportSummary?.currentBalanceAmount?.toLocaleString()}</p>
          <div className={`mt-3 text-sm ${textSecondary} space-y-1`}>
            <div>Secured: ${report.reportSummary?.securedAccountsAmount?.toLocaleString()}</div>
            <div>Unsecured: ${report.reportSummary?.unsecuredAccountsAmount?.toLocaleString()}</div>
          </div>
        </div>

        <div className={`${cardClass} hover:shadow-xl transition-all`}>
          <AlertCircle className="w-8 h-8 text-teal-500 mb-2" />
          <p className={`text-sm ${textSecondary}`}>Recent Enquiries</p>
          <p className={`text-3xl font-bold ${textPrimary}`}>{report.reportSummary?.last7DaysCreditEnquiries}</p>
          <div className={`mt-3 text-sm ${textSecondary}`}>Last 7 days</div>
        </div>
      </div>

      {/* Credit Accounts */}
      <div className={cardClass}>
        <h3 className={`text-xl font-bold mb-6 ${textPrimary}`}>Credit Accounts Information</h3>
        
        {report.creditAccounts?.length > 0 ? (
          <div className="space-y-4">
            {report.creditAccounts.map((acc, index) => (
              <div key={index} className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-5 border ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between mb-3 flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconBg}`}>
                      <CreditCard className={`w-5 h-5 ${iconColor}`} />
                    </div>
                    <div>
                      <p className={`font-semibold ${textPrimary}`}>{acc.bank}</p>
                      <p className={`text-sm ${textSecondary}`}>{acc.accountNumber}</p>
                    </div>
                  </div>
                  
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    acc.amountOverdue > 0 
                      ? isDark ? 'bg-red-900 text-red-300 border border-red-800' : 'bg-red-100 text-red-700 border border-red-300'
                      : isDark ? 'bg-green-900 text-green-300 border border-green-800' : 'bg-green-100 text-green-700 border border-green-300'
                  }`}>
                    {acc.amountOverdue > 0 ? 'Overdue' : 'Active'}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className={`text-sm ${textSecondary}`}>Current Balance</p>
                    <p className={`text-lg font-semibold ${textPrimary}`}>${acc.currentBalance?.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className={`text-sm ${textSecondary}`}>Amount Overdue</p>
                    <p className={`text-lg font-semibold ${acc.amountOverdue > 0 ? 'text-red-500' : isDark ? 'text-green-400' : 'text-green-600'}`}>
                      ${acc.amountOverdue?.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className={`text-center py-8 ${textSecondary}`}>No credit account information available.</p>
        )}
      </div>
    </div>
  );
};