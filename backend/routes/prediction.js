const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const aiModelService = require('../services/aiModelService');

const router = express.Router();

// AI Model prediction endpoint
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { floors, area, bedrooms, bathrooms, age } = req.body;
    let { location, lat, lng } = req.body;

    // Validate input
    if (!floors || !area || !bedrooms || !bathrooms || !age || (!location && (lat == null || lng == null))) {
      return res.status(400).json({ 
        error: 'Required: floors, area, bedrooms, bathrooms, age, and either location string or lat/lng' 
      });
    }

    // Validate data types and ranges
    const validation = validatePredictionInput({
      floors, area, bedrooms, bathrooms, age, location, lat, lng
    });

    if (!validation.isValid) {
      return res.status(400).json({ error: validation.error });
    }

    // Track performance
    const startTime = Date.now();

    // Parse coordinates from location if provided as "lat,lng"
    if ((!lat || !lng) && typeof location === 'string' && location.includes(',')) {
      const parts = location.split(',');
      const pl = parseFloat(parts[0]);
      const pL = parseFloat(parts[1]);
      if (!isNaN(pl) && !isNaN(pL)) {
        lat = pl;
        lng = pL;
      }
    }

    // Generate prediction using optimized AI service
    const prediction = await aiModelService.predictPrice(floors, area, bedrooms, bathrooms, age, location, { lat, lng });
    
    // Generate forecast based on prediction
    const forecast = await generateForecast(prediction.currentPrice, location, { lat, lng }, prediction.baseGrowth);
    
    const processingTime = Date.now() - startTime;
    
    res.json({
      success: true,
      prediction: {
        currentPrice: prediction.currentPrice,
        confidence: prediction.confidence,
        factors: prediction.factors,
        modelType: prediction.modelType,
        processingTime: processingTime
      },
      forecast: forecast,
      summary: {
        totalProperties: Math.floor(Math.random() * 1000) + 500,
        averagePrice: Math.floor(prediction.currentPrice * 0.9),
        marketTrend: prediction.marketTrend,
        locationScore: prediction.locationScore
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).json({ error: 'Failed to generate prediction' });
  }
});

// Validate prediction input
function validatePredictionInput(data) {
  const { floors, area, bedrooms, bathrooms, age, location, lat, lng } = data;

  if (floors < 1 || floors > 50) {
    return { isValid: false, error: 'Floors must be between 1 and 50' };
  }

  if (area < 100 || area > 10000) {
    return { isValid: false, error: 'Area must be between 100 and 10000 sq ft' };
  }

  if (bedrooms < 1 || bedrooms > 10) {
    return { isValid: false, error: 'Bedrooms must be between 1 and 10' };
  }

  if (bathrooms < 1 || bathrooms > 10) {
    return { isValid: false, error: 'Bathrooms must be between 1 and 10' };
  }

  if (age < 0 || age > 100) {
    return { isValid: false, error: 'Age must be between 0 and 100 years' };
  }

  // Accept either a named location or coordinates
  if ((!location || location.toString().trim().length < 2) && (lat == null || lng == null)) {
    return { isValid: false, error: 'Provide a location name or valid lat/lng' };
  }

  if (lat != null && (lat < -90 || lat > 90)) {
    return { isValid: false, error: 'Latitude must be between -90 and 90' };
  }

  if (lng != null && (lng < -180 || lng > 180)) {
    return { isValid: false, error: 'Longitude must be between -180 and 180' };
  }

  return { isValid: true };
}

// AI Model status endpoint
router.get('/model-status', authenticateToken, async (req, res) => {
  try {
    const modelInfo = await aiModelService.getModelInfo();
    res.json({
      success: true,
      modelInfo: modelInfo
    });
  } catch (error) {
    console.error('Model status error:', error);
    res.status(500).json({ error: 'Failed to get model status' });
  }
});

// Test AI model endpoint
router.post('/test-model', authenticateToken, async (req, res) => {
  try {
    await aiModelService.testModelLoad();
    res.json({
      success: true,
      message: 'AI model tested successfully'
    });
  } catch (error) {
    console.error('Model test error:', error);
    res.status(500).json({ error: 'Failed to test model' });
  }
});

// Get prediction history for a user
router.get('/history', authenticateToken, async (req, res) => {
  try {
    // In a real application, you would store predictions in a database
    // For now, return dummy history
    const history = [
      {
        id: 1,
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        location: 'Los Angeles',
        predictedPrice: 850000,
        actualPrice: null,
        accuracy: null
      },
      {
        id: 2,
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        location: 'New York',
        predictedPrice: 1200000,
        actualPrice: null,
        accuracy: null
      }
    ];

    res.json({
      success: true,
      history: history
    });

  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({ error: 'Failed to get prediction history' });
  }
});

// Get market insights
router.get('/insights', authenticateToken, async (req, res) => {
  try {
    const { location } = req.query;

    if (!location) {
      return res.status(400).json({ error: 'Location parameter is required' });
    }

    // Generate dummy market insights
    const insights = {
      location: location,
      averagePrice: Math.floor(Math.random() * 500000) + 300000,
      pricePerSqFt: Math.floor(Math.random() * 200) + 100,
      marketTrend: ['increasing', 'stable', 'decreasing'][Math.floor(Math.random() * 3)],
      daysOnMarket: Math.floor(Math.random() * 30) + 10,
      inventory: Math.floor(Math.random() * 100) + 50,
      recommendations: [
        'Consider properties in emerging neighborhoods',
        'Look for properties with renovation potential',
        'Focus on properties with good school districts'
      ]
    };

    res.json({
      success: true,
      insights: insights
    });

  } catch (error) {
    console.error('Insights error:', error);
    res.status(500).json({ error: 'Failed to get market insights' });
  }
});

// Generate forecast data
async function generateForecast(currentPrice, location, coords = {}, baseGrowth) {
  const regionGrowth = (loc, { lat, lng }) => {
    const named = {
      'Los Angeles': 0.04, 'New York': 0.035, 'San Francisco': 0.045,
      'Chicago': 0.025, 'Miami': 0.03, 'Seattle': 0.035,
      'Austin': 0.04, 'Denver': 0.03, 'Boston': 0.035, 'Portland': 0.03
    };
    if (loc && named[loc]) return named[loc];
    if (typeof loc === 'string' && loc.includes(',')) {
      const [la, ln] = loc.split(',').map(parseFloat);
      lat = isNaN(la) ? lat : la; lng = isNaN(ln) ? lng : ln;
    }
    if (lat == null || lng == null) return 0.03;
    // Rough regional growth by continent
    if (lat > 5 && lng > -170 && lng < -50) return 0.035; // North America
    if (lat < 12 && lng > -85 && lng < -35) return 0.03;  // South America
    if (lat > 35 && lng > -10 && lng < 40) return 0.03;   // Europe
    if (lat > 5 && lng >= 40 && lng <= 180) return 0.04;  // Asia
    if (lat >= -35 && lat <= 35 && lng > -20 && lng < 50) return 0.032; // Africa
    if (lat < 0 && lng >= 110 && lng <= 180) return 0.033; // Oceania
    return 0.03;
  };

  const growth = baseGrowth || regionGrowth(location, coords);
  const years = Array.from({ length: 10 }, (_, i) => i + 1);
  const now = new Date().getFullYear();

  const forecast = years.map((yrIdx) => {
    const horizonYears = yrIdx;
    const futurePrice = currentPrice * Math.pow(1 + growth, horizonYears);
    const variation = (Math.random() - 0.5) * 0.08; // ±4% variation
    const price = Math.round(futurePrice * (1 + variation));
    const conf = Math.max(55, Math.round(90 - horizonYears * 2.5));
    return {
      year: now + yrIdx,
      price,
      growth: (growth * 100).toFixed(1),
      confidence: conf
    };
  });

  return forecast;
}

module.exports = router; 