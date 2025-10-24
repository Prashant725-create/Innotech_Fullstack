import React, { useState, useEffect } from 'react';
import { FileUpload } from './components/FileUpload';
import { ReportDisplay } from './components/ReportDisplay';
import { fetchReports } from './services/api';
import './App.css'; // You can delete the contents of App.css for a clean look

function App() {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Load reports on initial component mount
  useEffect(() => {
    loadReports();
  }, []);

  return (
    <div style={{ maxWidth: '900px', margin: '20px auto', padding: '20px' }}>
      <header>
        <h1>Credit Report Processor</h1>
      </header>
      <main>
        <FileUpload onUploadSuccess={loadReports} />
        <hr style={{ margin: '20px 0' }} />
        {isLoading && <p>Loading reports...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!isLoading && !error && <ReportDisplay reports={reports} />}
      </main>
    </div>
  );
}

export default App;