import React, { useState, useEffect } from 'react';
import { FileUpload } from './components/FileUpload';
import { ReportDisplay } from './components/ReportDisplay';
import { fetchReports } from './services/api';
import { Moon, Sun, FileText } from 'lucide-react';
import './App.css';

function App() {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDark, setIsDark] = useState(false);

  const loadReports = () => {
    setIsLoading(true);
    fetchReports()
      .then(response => {
        setReports(response.data);
        setIsLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch reports.');
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadReports();
    // Check for saved theme preference
    const savedTheme = window.themePreference || 'light';
    if (savedTheme === 'dark') {
      setIsDark(true);
    }
  }, []);

  useEffect(() => {
    // Save theme preference
    window.themePreference = isDark ? 'dark' : 'light';
  }, [isDark]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 to-teal-50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  Credit Report Processor
                </h1>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Analyze your Experian XML credit reports
                </p>
              </div>
            </div>
            
            {/* Theme Toggle Button */}
            <button
              onClick={() => setIsDark(!isDark)}
              className={`p-3 rounded-lg transition-all duration-200 shadow-lg ${
                isDark 
                  ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' 
                  : 'bg-white hover:bg-gray-100 text-gray-700'
              }`}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </button>
          </div>
        </header>

        <main className="space-y-8">
          <FileUpload onUploadSuccess={loadReports} isDark={isDark} />
          
          {isLoading && (
            <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-12 text-center`}>
              <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Loading reports...</p>
            </div>
          )}
          
          {error && (
            <div className={`border px-6 py-4 rounded-xl ${
              isDark 
                ? 'bg-red-900 bg-opacity-30 border-red-800 text-red-300' 
                : 'bg-red-100 border-red-400 text-red-700'
            }`}>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </div>
          )}
          
          {!isLoading && !error && <ReportDisplay reports={reports} isDark={isDark} />}
        </main>

        {/* Footer */}
        <footer className={`mt-12 text-center py-6 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
          <p className="text-sm">Secure credit report processing • Your data is never stored</p>
        </footer>
      </div>
    </div>
  );
}

export default App;