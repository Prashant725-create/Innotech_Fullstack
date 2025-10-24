import React, { useState } from 'react';
import { uploadFile } from '../services/api';
import { Upload, FileText } from 'lucide-react';

export const FileUpload = ({ onUploadSuccess, isDark }) => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setMessage('');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type === 'text/xml' || droppedFile.name.endsWith('.xml'))) {
      setFile(droppedFile);
      setMessage('');
    } else {
      setMessage('Please upload a valid XML file');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
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
      // Reset file input
      const fileInput = document.getElementById('file-upload');
      if (fileInput) fileInput.value = '';
      
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
    <div className={`${
      isDark ? 'bg-gray-800' : 'bg-white'
    } rounded-xl shadow-lg p-8 transition-all duration-300`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-8 h-8 text-teal-500" />
        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
          Upload Credit Report
        </h2>
      </div>
      
      <form onSubmit={handleSubmit}>
        {/* Drag & Drop Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
            isDragOver 
              ? 'border-teal-500 bg-teal-50' 
              : isDark 
              ? 'border-gray-600 bg-gray-700 bg-opacity-50' 
              : 'border-gray-300 bg-gray-50'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <Upload className={`w-16 h-16 mx-auto mb-4 ${
            isDark ? 'text-gray-400' : 'text-gray-400'
          }`} />
          
          <p className={`text-lg mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            {file ? (
              <span className="flex items-center justify-center gap-2">
                <FileText className="w-5 h-5 text-teal-500" />
                {file.name}
              </span>
            ) : (
              'Drag & drop your XML file here'
            )}
          </p>
          
          <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            or click to browse
          </p>
          
          <input
            type="file"
            accept=".xml,text/xml"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          
          <label
            htmlFor="file-upload"
            className="inline-block px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg cursor-pointer transition-colors duration-200 font-medium shadow-md hover:shadow-lg"
          >
            Choose File
          </label>
        </div>

        {/* Upload Button */}
        <button
          type="submit"
          disabled={isUploading || !file}
          className={`w-full mt-6 py-4 rounded-lg font-semibold text-white transition-all duration-200 shadow-md ${
            isUploading || !file
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-teal-600 hover:bg-teal-700 hover:shadow-lg transform hover:-translate-y-0.5'
          }`}
        >
          {isUploading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Processing...
            </span>
          ) : (
            'Upload & Process Report'
          )}
        </button>
      </form>

      {/* Message Display */}
      {message && (
        <div className={`mt-4 p-4 rounded-lg transition-all duration-300 ${
          message.includes('success') || message.includes('successfully')
            ? isDark ? 'bg-green-900 bg-opacity-30 text-green-300 border border-green-800' : 'bg-green-100 text-green-800 border border-green-400'
            : message.includes('failed') || message.includes('Failed')
            ? isDark ? 'bg-red-900 bg-opacity-30 text-red-300 border border-red-800' : 'bg-red-100 text-red-800 border border-red-400'
            : isDark ? 'bg-blue-900 bg-opacity-30 text-blue-300 border border-blue-800' : 'bg-blue-100 text-blue-800 border border-blue-400'
        }`}>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            {message}
          </div>
        </div>
      )}
    </div>
  );
};