# Credit Report XML Processor

This is a full-stack MERN application designed to upload, parse, and display soft credit pull data from Experian XML files. The application provides a clean interface to upload an XML file, a backend API to process and store the data, and a React-based frontend to render a comprehensive report.

# Features ✨
File Upload: A RESTful API endpoint to handle XML file uploads.

Data Extraction: Parses complex XML files to extract key credit report information.

Database Storage: Stores extracted data in a well-structured MongoDB schema.

Report Visualization: A clean React UI that fetches and displays the processed reports in three main sections:

Basic Details (Name, Credit Score, PAN, etc.)

Report Summary (Total Accounts, Active Accounts, Balances, etc.)

Credit Accounts Information (Bank names, Account Numbers, Balances, etc.)

# Tech Stack 🛠️
Frontend: React, Vite, axios, react-router-dom

Backend: Node.js, Express

Database: MongoDB (with Mongoose)

File Handling: multer (for file uploads), xml2js (for XML parsing)

Setup and Installation
Follow these steps to run the project on your local machine.

# Prerequisites
Node.js (v16 or later)

MongoDB (running locally) or a MongoDB Atlas connection string.

# 1. Backend Setup
  # 1. Navigate to the backend folder
    cd backend
  
  # 2. Install dependencies
    npm install
  
  # 3. Create an environment file
    # In Windows (CMD):
      type nul > .env
    # In macOS/Linux (or Git Bash):
      touch .env
  
  # 4. Add your MongoDB URI to the .env file
    # For local MongoDB:
      MONGO_URI=mongodb://127.0.0.1:27017/credit-reports
  
    # For MongoDB Atlas:
      MONGO_URI=mongodb+srv://<user>:<password>@your-cluster.mongodb.net/credit-reports
  
  # 5. Run the backend server
    npm run dev
    The backend server will be running on http://localhost:5001.

# 2. Frontend Setup
   # 1. Open a new terminal and navigate to the frontend folder
     cd frontend

  # 2. Install dependencies
    npm install

  # 3. Run the frontend development server
    npm run dev

    The frontend application will be available at http://localhost:5173.

FrontEnd vercel link: https://innotech-fullstack.vercel.app/
BackEnd Render link: https://innotech-backend-tx4w.onrender.com

  
