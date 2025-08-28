const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const jwt = require('jsonwebtoken');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const environmentRoutes = require('./routes/environment');
const predictionRoutes = require('./routes/prediction');
const pdfRoutes = require('./routes/pdf');

// Import middleware
const { authenticateToken } = require('./middleware/auth');

// Import services
const emailService = require('./services/emailService');
const aiModelService = require('./services/aiModelService');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection with improved error handling
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/earthslight';
    console.log('Attempting to connect to MongoDB...');
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      maxPoolSize: 10, // Maintain up to 10 socket connections
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });
    
    console.log('✅ Connected to MongoDB successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('⚠️  Server will continue without database. Some features may be limited.');
    
    // Don't exit the process, just log the error
    // process.exit(1);
  }
};

// Connect to database
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/environment', environmentRoutes);
app.use('/api/predict', predictionRoutes);
app.use('/api/pdf', pdfRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'EarthSlight Backend is running' });
});

// Email status endpoint
app.get('/api/email/status', (req, res) => {
  try {
    const status = emailService.getStatus();
    res.json({
      success: true,
      email: status,
      message: status.isInitialized ? 'Email service is running' : 'Email service not initialized'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get email status' });
  }
});// Test email alert endpoint (no auth required for testing)
app.post('/api/email/test-alert', async (req, res) => {
  try {
    const { message, type } = req.body;
    
    // Use custom message if provided, otherwise use default environmental alert
    if (message && type) {
      console.log(`� Sending custom ${type} alert: ${message.substring(0, 50)}...`);
      const result = await emailService.sendCustomAlert(message, type);
      res.json({ 
        success: result.success,
        message: `Custom alert sent: ${result.successCount} success, ${result.errorCount} failed`,
        details: result
      });
    } else {
      console.log('� Sending standard environmental alerts...');
      await emailService.sendEnvironmentalAlerts();
      res.json({ 
        success: true,
        message: 'Standard environmental alert sent successfully'
      });
    }
  } catch (error) {
    console.error('Test alert error:', error);
    res.status(500).json({ 
      error: 'Failed to send test alert',
      details: error.message
    });
  }
});

// Manual alert trigger endpoint
app.post('/api/send-alerts', authenticateToken, async (req, res) => {
  try {
    await emailService.sendEnvironmentalAlerts();
    res.json({ message: 'Alerts sent successfully' });
  } catch (error) {
    console.error('Error sending alerts:', error);
    res.status(500).json({ error: 'Failed to send alerts' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Initialize services
async function initializeServices() {
  try {
    // Initialize AI Model Service
    console.log('Initializing AI Model Service...');
    await aiModelService.initialize();
    
    // Initialize Email alert scheduler
    console.log('Initializing Email Service...');
    emailService.startAlertScheduler();
    
    console.log('All services initialized successfully!');
  } catch (error) {
    console.error('Error initializing services:', error);
  }
}

// Start server
app.listen(PORT, () => {
  console.log(`EarthSlight Backend running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  
  // Initialize services after server starts
  initializeServices();
}); 