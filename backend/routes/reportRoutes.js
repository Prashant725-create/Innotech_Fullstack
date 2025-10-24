const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadReport, getReports } = require('../controllers/reportController');

// Configure Multer for temporary file storage
// It will save files to a folder named 'uploads'
const upload = multer({ dest: 'uploads/' });

// @route   POST /api/reports/upload
// We use upload.single('xmlfile') as middleware.
// 'xmlfile' must match the name of the form field in React.
router.post('/upload', upload.single('xmlfile'), uploadReport);

// @route   GET /api/reports
router.get('/', getReports);

module.exports = router;