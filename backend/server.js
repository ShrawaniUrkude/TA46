const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const connectDB = async () => {
  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('✅ MongoDB Connected Successfully');
    } else {
      console.log('⚠️ MongoDB URI not provided, running without database');
    }
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
  }
};

connectDB();

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'WareTrack API Server',
    status: 'Running',
    version: '1.0.0'
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Import routes
const assetRoutes = require('./routes/assetRoutes');
const warehouseRoutes = require('./routes/warehouseRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const hospitalRoutes = require('./routes/hospitalRoutes');
const authRoutes = require('./routes/authRoutes');

// Use routes
app.use('/api/assets', assetRoutes);
app.use('/api/warehouse', warehouseRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/hospital', hospitalRoutes);
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

module.exports = app;
