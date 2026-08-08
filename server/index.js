import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';

import venueRoutes from './routes/venues.js';
import templateRoutes from './routes/templates.js';
import assignmentRoutes from './routes/assignments.js';
import recordRoutes from './routes/records.js';
import auditorRoutes from './routes/auditors.js';
import seedRoutes from './routes/seed.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Database status helper
app.use((req, res, next) => {
  req.isDbConnected = mongoose.connection.readyState === 1;
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    server: 'FC Smart Audit Express Server',
    databaseConnected: mongoose.connection.readyState === 1,
    dbState: mongoose.connection.readyState, // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    timestamp: new Date().toISOString()
  });
});

// Register API Routes
app.use('/api/venues', venueRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/auditors', auditorRoutes);
app.use('/api/seed', seedRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('[Express Global Error]', err.stack);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// Start Server & Connect MongoDB
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 FC Smart Audit Backend Server Running on Port ${PORT}`);
    console.log(`📡 API Base URL: http://localhost:${PORT}/api`);
    console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`====================================================`);
  });
});
