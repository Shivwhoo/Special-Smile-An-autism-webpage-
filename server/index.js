import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import serviceRoutes from './routes/serviceRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import contactRoutes from './routes/contactRoutes.js';

dotenv.config();

const app = express();

// Middleware
const clientOrigin = (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/+$/, '');
app.use(cors({
  origin: clientOrigin,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/services', serviceRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/contact', contactRoutes);

// Database Connection
const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error('Please ensure your IP is whitelisted in MongoDB Atlas or use a local database.');
    // We remove process.exit(1) so the server stays alive even without DB
  }
};

// Basic Route
app.get('/api/health', (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  res.json({ 
    status: 'ok', 
    message: 'Server is running normally',
    database: isDbConnected ? 'connected' : 'disconnected'
  });
});

const PORT = process.env.PORT || 5000;

// Connect to DB and start server independently
connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
