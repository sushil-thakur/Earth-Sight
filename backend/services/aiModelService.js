const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs').promises;

const aiModelService = {
  modelPath: path.join(__dirname, '../ai_model'),
  modelFile: path.join(__dirname, '../ai_model/model.pkl'),
  isInitialized: false,
  modelLoaded: false,

  async initialize() {
    try {
      console.log('🔄 Initializing AI Model Service...');
      
      // Check if pre-trained model file exists
      try {
        await fs.access(this.modelFile);
        console.log('✅ Pre-trained AI model file found');
        
        // Test loading the model with timeout
        await this.testModelLoad();
      } catch {
        console.log('⚠️  Pre-trained model file not found. Using fallback JavaScript simulation.');
      }
      
      this.isInitialized = true;
      console.log('✅ AI Model Service initialized successfully');
      return 'initialized';
    } catch (error) {
      console.error('❌ Failed to initialize AI Model Service:', error);
      console.log('Will use fallback JavaScript simulation.');
      this.isInitialized = true;
      return 'fallback mode';
    }
  },

  async testModelLoad() {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Model load test timeout after 10 seconds'));
      }, 10000);

      const pythonPath = 'C:/Program Files/Python313/python.exe';
      const python = spawn(pythonPath, ['predict.py', 'load'], {
        cwd: this.modelPath,
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let output = '';
      let error = '';

      python.stdout.on('data', (data) => {
        output += data.toString();
      });

      python.stderr.on('data', (data) => {
        error += data.toString();
      });

      python.on('close', (code) => {
        clearTimeout(timeout);
        if (code === 0) {
          console.log('✅ Python model loaded successfully');
          this.modelLoaded = true;
          resolve(output.trim().split('\n'));
        } else {
          console.error('❌ Python model load failed with code:', code);
          if (error) console.error('Error output:', error);
          reject(new Error(`Python process exited with code ${code}`));
        }
      });

      python.on('error', (err) => {
        clearTimeout(timeout);
        console.error('❌ Failed to start Python process:', err);
        reject(err);
      });
    });
  },

  async predictPrice(floors, area, bedrooms, bathrooms, age, location, coords) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    // If Python model is loaded, use it; otherwise use fallback
    if (this.modelLoaded) {
      return this.predictPricePython(floors, area, bedrooms, bathrooms, age, location);
    } else {
      return this.predictPriceFallback(floors, area, bedrooms, bathrooms, age, location, coords);
    }
  },

  async predictPricePython(floors, area, bedrooms, bathrooms, age, location) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        console.log('⚠️  Python prediction timeout, falling back to JavaScript simulation...');
        this.predictPriceFallback(floors, area, bedrooms, bathrooms, age, location)
          .then(resolve)
          .catch(reject);
      }, 8000); // 8 second timeout

      const pythonPath = 'C:/Program Files/Python313/python.exe';
      const python = spawn(pythonPath, ['predict.py', 'predict', floors, area, bedrooms, bathrooms, age, location], {
        cwd: this.modelPath,
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let output = '';
      let error = '';

      python.stdout.on('data', (data) => {
        output += data.toString();
      });

      python.stderr.on('data', (data) => {
        error += data.toString();
      });

      python.on('close', (code) => {
        clearTimeout(timeout);
        if (code === 0) {
          try {
            const lines = output.trim().split('\n');
            const jsonResult = lines[lines.length - 1];
            const result = JSON.parse(jsonResult);
            console.log('✅ Python prediction successful');
            resolve(result);
          } catch (parseError) {
            console.error('Error parsing Python prediction result:', parseError);
            console.log('Python output:', output);
            this.predictPriceFallback(floors, area, bedrooms, bathrooms, age, location)
              .then(resolve)
              .catch(reject);
          }
        } else {
          console.error('Python prediction failed with code:', code);
          if (error) console.error('Error output:', error);
          this.predictPriceFallback(floors, area, bedrooms, bathrooms, age, location)
            .then(resolve)
            .catch(reject);
        }
      });

      python.on('error', (err) => {
        clearTimeout(timeout);
        console.error('Failed to start Python process:', err);
        this.predictPriceFallback(floors, area, bedrooms, bathrooms, age, location)
          .then(resolve)
          .catch(reject);
      });
    });
  },

  async predictPriceFallback(floors, area, bedrooms, bathrooms, age, location, coords = {}) {
    const locationMultipliers = {
      'Los Angeles': 2.5, 'New York': 3.0, 'San Francisco': 2.8,
      'Chicago': 1.8, 'Miami': 1.9, 'Seattle': 2.2,
      'Austin': 1.6, 'Denver': 1.7, 'Boston': 2.3, 'Portland': 1.9
    };

    const basePrice = 150000;
    let locationMult = locationMultipliers[location] || 1.5;

    // If coordinates provided, roughly infer region multiplier
    let { lat, lng } = coords || {};
    if (typeof location === 'string' && location.includes(',')) {
      const [la, ln] = location.split(',').map(parseFloat);
      if (!isNaN(la) && !isNaN(ln)) { lat = la; lng = ln; }
    }
    if (lat != null && lng != null) {
      // Very rough proxy by region/cities premium
      if (lat > 25 && lat < 50 && lng < -60 && lng > -125) locationMult = 2.0; // North America
      else if (lat > 45 && lng > -10 && lng < 40) locationMult = 2.1; // Western/Central Europe
      else if (lat > 10 && lng > 70 && lng < 140) locationMult = 1.9; // South/East Asia
      else if (lat < 0 && lng > 110 && lng < 160) locationMult = 1.7; // Australia/NZ
      else if (lat > -35 && lat < 35 && lng > -20 && lng < 50) locationMult = 1.4; // Africa
      else if (lat < 15 && lng < -35 && lng > -80) locationMult = 1.3; // South America
      else locationMult = 1.5;
    }
    const areaMult = area / 1000;
    const bedroomMult = 1 + (bedrooms - 2) * 0.15;
    const bathroomMult = 1 + (bathrooms - 1) * 0.1;
    const floorMult = 1 + (floors - 1) * 0.05;
    const ageMult = Math.max(0.7, 1 - (age * 0.01));

    const price = basePrice * locationMult * areaMult * bedroomMult * bathroomMult * floorMult * ageMult;
    const finalPrice = Math.round(price * (0.9 + Math.random() * 0.2));

    let confidence = 75;
    if (area >= 500 && area <= 5000) confidence += 5;
    if (bedrooms >= 1 && bedrooms <= 5) confidence += 5;
    if (age <= 50) confidence += 5;
    if (locationMultipliers[location]) confidence += 10;

    const growthRates = {
      'Los Angeles': 0.04, 'New York': 0.035, 'San Francisco': 0.045,
      'Chicago': 0.025, 'Miami': 0.03, 'Seattle': 0.035,
      'Austin': 0.04, 'Denver': 0.03, 'Boston': 0.035, 'Portland': 0.03
    };
    
    let growth = growthRates[location] || 0.03;
    if (lat != null && lng != null) {
      if (lat > 5 && lng > -170 && lng < -50) growth = 0.035; // North America
      else if (lat < 12 && lng > -85 && lng < -35) growth = 0.03; // South America
      else if (lat > 35 && lng > -10 && lng < 40) growth = 0.03; // Europe
      else if (lat > 5 && lng >= 40 && lng <= 180) growth = 0.04; // Asia
      else if (lat >= -35 && lat <= 35 && lng > -20 && lng < 50) growth = 0.032; // Africa
      else if (lat < 0 && lng >= 110 && lng <= 180) growth = 0.033; // Oceania
    }
    const marketTrend = growth > 0.04 ? 'increasing' : growth > 0.02 ? 'stable' : 'decreasing';
    const locationScore = Math.min(100, Math.max(70, Math.round(70 + (locationMult - 1.5) * 20)));

    const factors = [
      { name: 'Location', impact: locationMult.toFixed(2), description: 'Location premium' },
      { name: 'Area', impact: areaMult.toFixed(2), description: 'Square footage' },
      { name: 'Bedrooms', impact: bedroomMult.toFixed(2), description: 'Number of bedrooms' },
      { name: 'Bathrooms', impact: bathroomMult.toFixed(2), description: 'Number of bathrooms' },
      { name: 'Age', impact: ageMult.toFixed(2), description: 'Property age' }
    ];

    console.log('⚡ Using JavaScript fallback for prediction');
    return {
      currentPrice: finalPrice,
      confidence: Math.min(100, confidence),
      marketTrend,
      locationScore,
      factors,
      modelType: 'JavaScript Simulation',
      baseGrowth: growth
    };
  },

  async getModelInfo() {
    if (!this.isInitialized) {
      await this.initialize();
    }

    return {
      isLoaded: this.modelLoaded,
      modelType: this.modelLoaded ? 'XGBoost (Python)' : 'JavaScript Simulation',
      modelFile: this.modelFile,
      supportedLocations: [
        'Los Angeles', 'New York', 'San Francisco', 'Chicago', 'Miami',
        'Seattle', 'Austin', 'Denver', 'Boston', 'Portland'
      ],
      features: ['floors', 'area', 'bedrooms', 'bathrooms', 'age', 'location'],
      status: this.isInitialized ? 'Ready' : 'Initializing'
    };
  }
};

module.exports = aiModelService;