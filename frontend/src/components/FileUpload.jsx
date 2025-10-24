import React, { useState } from 'react';
import { uploadFile } from '../services/api';

export const FileUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a file to upload.');
      return;
    }

    // The key 'xmlfile' MUST match the backend (upload.single('xmlfile'))
    const formData = new FormData();
    formData.append('xmlfile', file);

    setIsUploading(true);
    setMessage('Uploading and processing...');

    try {
      const response = await uploadFile(formData);
      setMessage(response.data.message);
      setFile(null);
      if (onUploadSuccess) {
        onUploadSuccess(); // Tell the parent component to refetch reports
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <h2>Upload Experian XML Report</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".xml,text/xml" onChange={handleFileChange} />
        <button type="submit" disabled={isUploading}>
          {isUploading ? 'Processing...' : 'Upload'}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};