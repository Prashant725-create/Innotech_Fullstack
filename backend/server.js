// server.js (or your entry file) — replace only the DB/connect block
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

dotenv.config();

const reportRoutes = require('./routes/reportRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// uploads dir (unchanged)
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// --- MONGODB (Mongoose) robust connect ---
mongoose.set('strictQuery', false);

// Optional: if you want immediate failures instead of silent buffering,
// uncomment the next line to disable buffering of model operations:
// mongoose.set('bufferCommands', false);

const MONGO_URI = `mongodb+srv://prashantgautambeg_db_user:Prashant%40123@cluster0.seaidnl.mongodb.net/credit-reports?retryWrites=true&w=majority&appName=Cluster0`;
if (!MONGO_URI) {
  console.error('MONGO_URI not set in .env. Exiting.');
  process.exit(1);
}

const connectWithRetry = async (retries = 5, delayMs = 2000) => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Short server selection timeout to fail fast if network unreachable
      serverSelectionTimeoutMS: 10000, // 10s
      socketTimeoutMS: 45000,
    });

    console.log('✅ MongoDB Connected (via mongoose).');

    // optional ping to be certain
    try {
      await mongoose.connection.db.admin().ping();
      console.log('✅ Ping to MongoDB successful.');
    } catch (pingErr) {
      console.warn('Ping to MongoDB failed (but connected):', pingErr);
    }

    // start the HTTP server only after DB is connected
    const PORT = process.env.PORT || 5001;
    app.use('/api/reports', reportRoutes);
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error(`MongoDB connection attempt failed: ${err.message || err}`);
    if (retries > 0) {
      console.log(`Retrying connection in ${delayMs}ms... (${retries} retries left)`);
      await new Promise(res => setTimeout(res, delayMs));
      return connectWithRetry(retries - 1, delayMs * 1.5);
    } else {
      console.error('All MongoDB connection attempts failed. Exiting process.');
      process.exit(1);
    }
  }
};

connectWithRetry();
