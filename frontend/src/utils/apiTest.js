// API Testing Utility for EarthSlight Frontend
import axios from 'axios';
import { API_ENDPOINTS, SAMPLE_DATA } from '../config/api';

// Test all API endpoints to ensure they're working correctly
export const testAllEndpoints = async () => {
  const results = {
    health: null,
    auth: { register: null, login: null, profile: null },
    environment: { dummyData: null, statistics: null },
    prediction: { predict: null, modelStatus: null },
    email: { status: null, testAlert: null }
  };

  try {
    // Test health endpoint
    console.log('Testing health endpoint...');
    try {
      const healthResponse = await axios.get(API_ENDPOINTS.health);
      results.health = { success: true, data: healthResponse.data };
      console.log('✅ Health endpoint working');
    } catch (error) {
      results.health = { success: false, error: error.message };
      console.log('❌ Health endpoint failed:', error.message);
    }

    // Test environment endpoints (public)
    console.log('Testing environment endpoints...');
    try {
      const [dummyResponse, statsResponse] = await Promise.all([
        axios.get(API_ENDPOINTS.environment.dummyData),
        axios.get(API_ENDPOINTS.environment.statistics)
      ]);
      results.environment.dummyData = { success: true, data: dummyResponse.data };
      results.environment.statistics = { success: true, data: statsResponse.data };
      console.log('✅ Environment endpoints working');
    } catch (error) {
      results.environment.dummyData = { success: false, error: error.message };
      results.environment.statistics = { success: false, error: error.message };
      console.log('❌ Environment endpoints failed:', error.message);
    }

    // Test email status endpoint
    console.log('Testing email status endpoint...');
    try {
      const emailResponse = await axios.get(API_ENDPOINTS.email.status);
      results.email.status = { success: true, data: emailResponse.data };
      console.log('✅ Email status endpoint working');
    } catch (error) {
      results.email.status = { success: false, error: error.message };
      console.log('❌ Email status endpoint failed:', error.message);
    }

    // Test auth endpoints only if token exists
    const token = localStorage.getItem('token');
    if (token) {
      console.log('Testing authenticated endpoints...');
      
      // Test profile endpoint
      try {
        const profileResponse = await axios.get(API_ENDPOINTS.auth.profile);
        results.auth.profile = { success: true, data: profileResponse.data };
        console.log('✅ Profile endpoint working');
      } catch (error) {
        results.auth.profile = { success: false, error: error.message };
        console.log('❌ Profile endpoint failed:', error.message);
      }

      // Test model status endpoint
      try {
        const modelResponse = await axios.get(API_ENDPOINTS.prediction.modelStatus);
        results.prediction.modelStatus = { success: true, data: modelResponse.data };
        console.log('✅ Model status endpoint working');
      } catch (error) {
        results.prediction.modelStatus = { success: false, error: error.message };
        console.log('❌ Model status endpoint failed:', error.message);
      }
    } else {
      console.log('⚠️ No auth token found, skipping authenticated endpoints');
    }

  } catch (error) {
    console.error('Global test error:', error);
  }

  return results;
};

// Test specific endpoint
export const testEndpoint = async (endpoint, method = 'GET', data = null, requiresAuth = false) => {
  try {
    const config = {
      method,
      url: endpoint,
      headers: {}
    };

    if (data) {
      config.data = data;
      config.headers['Content-Type'] = 'application/json';
    }

    if (requiresAuth) {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await axios(config);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return { 
      success: false, 
      error: error.message, 
      status: error.response?.status,
      data: error.response?.data 
    };
  }
};

// Validate API response structure
export const validateApiResponse = (response, expectedFields = []) => {
  if (!response || typeof response !== 'object') {
    return { valid: false, missing: ['response object'] };
  }

  const missing = expectedFields.filter(field => !(field in response));
  return { valid: missing.length === 0, missing };
};

// Test prediction endpoint with sample data
export const testPrediction = async () => {
  console.log('Testing prediction endpoint with sample data...');
  const result = await testEndpoint(API_ENDPOINTS.prediction.predict, 'POST', SAMPLE_DATA.prediction, true);
  
  if (result.success) {
    console.log('✅ Prediction endpoint working');
    const validation = validateApiResponse(result.data, ['prediction', 'forecast', 'summary']);
    if (validation.valid) {
      console.log('✅ Prediction response structure valid');
    } else {
      console.log('⚠️ Prediction response missing fields:', validation.missing);
    }
  } else {
    console.log('❌ Prediction endpoint failed:', result.error);
  }

  return result;
};

const apiTestConfig = {
  testAllEndpoints,
  testEndpoint,
  validateApiResponse,
  testPrediction
};
