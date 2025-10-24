import axios from 'axios';

// Set up a base URL for all requests
const API = axios.create({
  baseURL: 'https://innotech-backend-tx4w.onrender.com/api', // Your backend URL
});

export const uploadFile = (formData) => {
  return API.post('/reports/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const fetchReports = () => {
  return API.get('/reports');
};