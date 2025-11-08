const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const jwt = require('jsonwebtoken');
const axios = require('axios');

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
// Configure CORS for both development and production
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  'https://earth-sight.onrender.com'
];

// Add any additional origins from environment variable
const envOrigin = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',').map(s => s.trim()) : [];
const allAllowedOrigins = [...allowedOrigins, ...envOrigin];

console.log('🌍 CORS: Allowed origins:', allAllowedOrigins);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like curl, mobile apps, Postman, or server-to-server)
    if (!origin) {
      console.log('✅ CORS: Allowing request with no origin (Postman/curl/server)');
      return callback(null, true);
    }

    // Check if origin is in allowed list
    if (allAllowedOrigins.includes(origin)) {
      console.log(`✅ CORS: Allowing origin: ${origin}`);
      return callback(null, true);
    }

    // In development mode: Allow any localhost/127.0.0.1 with any port
    if (process.env.NODE_ENV !== 'production') {
      try {
        const url = new URL(origin);
        if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
          console.log(`✅ CORS: Allowing localhost origin: ${origin}`);
          return callback(null, true);
        }
      } catch (err) {
        // ignore URL parse errors
      }
    }

    // Reject unknown origins
    console.warn(`❌ CORS: Blocked origin: ${origin}`);
    return callback(new Error(`CORS policy: Origin ${origin} not allowed`), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
}));
// Allow larger JSON payloads (extracted PDF text can be large). Set to 5mb.
app.use(bodyParser.json({ limit: process.env.BODY_PARSER_LIMIT || '5mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: process.env.BODY_PARSER_LIMIT || '5mb' }));

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
    // Check OpenRouter connectivity if configured
    await checkOpenRouterConnectivity();
    
    // Initialize Email alert scheduler
    console.log('Initializing Email Service...');
    emailService.startAlertScheduler();
    
    console.log('All services initialized successfully!');
  } catch (error) {
    console.error('Error initializing services:', error);
  }
}

async function checkOpenRouterConnectivity() {
  try {
    const openRouterKey = process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_KEY
    if (!openRouterKey) {
      console.log('OpenRouter key not configured — skipping connectivity check')
      return
    }
    const openRouterUrl = process.env.OPENROUTER_URL || process.env.OPENROUTER_API_URL || 'https://api.openrouter.ai/v1/chat/completions'
    const model = process.env.OPENROUTER_MODEL || 'gpt-4o-mini'
    console.log('Checking OpenRouter connectivity...', { tryUrl: openRouterUrl, model })

    const payload = {
      model,
      messages: [
        { role: 'system', content: 'You are a connectivity test agent.' },
        { role: 'user', content: 'Say hello in one sentence.' }
      ],
      max_tokens: 20
    }

    const resp = await axios.post(openRouterUrl, payload, { headers: { Authorization: `Bearer ${openRouterKey}`, 'Content-Type': 'application/json' }, timeout: 10000 })
    const data = resp && resp.data
    console.log('OpenRouter connectivity check succeeded:', resp.status, data && (data.choices ? 'choices present' : 'no choices'))
  } catch (err) {
    console.warn('OpenRouter connectivity check failed:', err && (err.response ? `${err.response.status} ${JSON.stringify(err.response.data).slice(0,200)}` : err.message))
  }
}

// Start server
app.listen(PORT, () => {
  console.log(`EarthSlight Backend running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  
  // Initialize services after server starts
  initializeServices();
}); 