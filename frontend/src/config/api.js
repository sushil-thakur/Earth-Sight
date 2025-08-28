// API Configuration for EarthSlight Frontend
// This file contains all API endpoint definitions and configurations

const API_BASE_URL = process.env.REACT_APP_API_URL || '';

// API Endpoints Configuration
export const API_ENDPOINTS = {
  // Health & Status
  health: '/api/health',
  
  // Authentication
  auth: {
    register: '/api/auth/register',
    login: '/api/auth/login',
    profile: '/api/auth/profile'
  },
  
  // Environmental Data
  environment: {
    dummyData: '/api/environment/dummy-data',
    statistics: '/api/environment/statistics',
  risksByType: (type) => `/api/environment/risks/${type}`,
  marineLife: '/api/environment/marine-life',
  marineLifeStatistics: '/api/environment/marine-life/statistics'
  },
  
  // AI Predictions
  prediction: {
    predict: '/api/predict',
    modelStatus: '/api/predict/model-status',
    trainModel: '/api/predict/train-model',
    history: '/api/predict/history',
    insights: '/api/predict/insights',
    testModel: '/api/predict/test-model'
  },
  
  // PDF Reports
  pdf: {
    generateReport: '/api/pdf/report',
    download: (filename) => `/api/pdf/download/${filename}`
  },
  
  // Email System (replacing Telegram)
  email: {
    status: '/api/email/status',
    testAlert: '/api/email/test-alert',
    sendAlerts: '/api/send-alerts'
  }
};

// HTTP Methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH'
};

// Common request configurations
export const REQUEST_CONFIG = {
  // Standard JSON request
  json: {
    headers: {
      'Content-Type': 'application/json'
    }
  },
  
  // File upload request
  multipart: {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  },
  
  // PDF blob download
  pdfBlob: {
    responseType: 'blob',
    headers: {
      'Accept': 'application/pdf'
    }
  },
  
  // With authentication
  withAuth: (token) => ({
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
};

// API Response Status Codes
export const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized. Please log in again.',
  TOKEN_EXPIRED: 'Your session has expired. Please log in again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  NOT_FOUND: 'The requested resource was not found.'
};

// Default timeout for requests (in milliseconds)
export const DEFAULT_TIMEOUT = 30000; // 30 seconds

// Retry configuration
export const RETRY_CONFIG = {
  attempts: 3,
  delay: 1000, // 1 second
  backoff: 2 // exponential backoff multiplier
};

// Sample data for testing
export const SAMPLE_DATA = {
  prediction: {
    floors: 2,
    area: 1200,
    bedrooms: 3,
    bathrooms: 2,
    age: 5,
    location: 'Los Angeles'
  },
  
  user: {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123'
  },
  
  emailAlert: {
    message: 'Test environmental alert',
    type: 'deforestation'
  }
};

// Validation schemas
export const VALIDATION_RULES = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  password: {
    minLength: 6,
    pattern: /^(?=.*[a-zA-Z])(?=.*\d)/
  },
  prediction: {
    floors: { min: 1, max: 50 },
    area: { min: 100, max: 10000 },
    bedrooms: { min: 1, max: 10 },
    bathrooms: { min: 1, max: 10 },
    age: { min: 0, max: 100 }
  }
};

// Feature flags
export const FEATURES = {
  API_TESTING: process.env.NODE_ENV === 'development',
  EMAIL_ALERTS: true,
  PDF_REPORTS: true,
  REAL_TIME_UPDATES: true,
  ADVANCED_CHARTS: true
};

const apiConfig = {
  API_BASE_URL,
  API_ENDPOINTS,
  HTTP_METHODS,
  REQUEST_CONFIG,
  STATUS_CODES,
  ERROR_MESSAGES,
  DEFAULT_TIMEOUT,
  RETRY_CONFIG,
  SAMPLE_DATA,
  VALIDATION_RULES,
  FEATURES
};
