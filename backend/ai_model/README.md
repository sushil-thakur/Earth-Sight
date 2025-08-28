# EarthSlight AI Model

This directory contains the XGBoost-based machine learning model for real estate price prediction.

## Features

- **XGBoost Regression Model**: Trained on synthetic real estate data
- **Location-based Predictions**: Supports multiple US cities with different market characteristics
- **Feature Analysis**: Analyzes the impact of various property features on price
- **10-Year Forecast**: Generates price forecasts with confidence intervals
- **Model Persistence**: Saves and loads trained models

## Setup

### Prerequisites

1. **Python 3.8+** installed on your system
2. **Node.js** with the backend dependencies installed
3. **Your trained model** exported as `model.pkl`

### Installation

1. **Install Python Dependencies**:
   ```bash
   cd backend/ai_model
   pip install -r requirements.txt
   ```

2. **Add Your Pre-trained Model**:
   ```bash
   # Copy your trained model to the ai_model directory
   cp /path/to/your/model.pkl backend/ai_model/model.pkl
   ```

3. **Verify Installation**:
   ```bash
   python predict.py --help
   python predict.py load
   ```

## Usage

### Command Line Interface

The AI model can be used directly from the command line:

```bash
# Load the pre-trained model
python predict.py load

# Make a prediction
python predict.py predict 2 1500 3 2 5 "Los Angeles"

# Generate forecast
python predict.py forecast 850000 "Los Angeles" 10
```

### API Integration

The model is automatically integrated with the Node.js backend through the `aiModelService.js`. The backend will:

1. **Auto-initialize** the model on startup
2. **Load your pre-trained model** from `model.pkl`
3. **Use the model** for predictions via the `/api/predict` endpoint
4. **Fallback** to JavaScript simulation if Python model fails

## Model Details

### Features Used
- **Floors**: Number of floors in the building
- **Area**: Square footage of the property
- **Bedrooms**: Number of bedrooms
- **Bathrooms**: Number of bathrooms
- **Age**: Age of the property in years
- **Location**: City/location (encoded as categorical variable)

### Supported Locations
- Los Angeles (2.5x multiplier)
- New York (3.0x multiplier)
- San Francisco (2.8x multiplier)
- Chicago (1.8x multiplier)
- Miami (1.9x multiplier)
- Seattle (2.2x multiplier)
- Austin (1.6x multiplier)
- Denver (1.7x multiplier)
- Boston (2.3x multiplier)
- Portland (1.9x multiplier)

### Model Performance
- **Training Data**: 10,000 synthetic samples
- **Algorithm**: XGBoost Regressor
- **Features**: 6 (5 numerical + 1 categorical)
- **Confidence**: 85-100% based on input quality

## API Endpoints

### Prediction Endpoints
- `POST /api/predict` - Generate price prediction
- `GET /api/predict/model-status` - Get model status
- `POST /api/predict/test-model` - Test model loading
- `GET /api/predict/history` - Get prediction history
- `GET /api/predict/insights` - Get market insights

### Example Request
```json
{
  "floors": 2,
  "area": 1500,
  "bedrooms": 3,
  "bathrooms": 2,
  "age": 5,
  "location": "Los Angeles"
}
```

### Example Response
```json
{
  "success": true,
  "prediction": {
    "currentPrice": 850000,
    "confidence": 92,
    "factors": [
      {"name": "Location", "impact": "2.5", "description": "Location premium"},
      {"name": "Area", "impact": "1.5", "description": "Square footage"},
      {"name": "Bedrooms", "impact": "1.15", "description": "Number of bedrooms"},
      {"name": "Bathrooms", "impact": "1.1", "description": "Number of bathrooms"},
      {"name": "Age", "impact": "0.95", "description": "Property age"}
    ]
  },
  "forecast": [
    {"year": 2024, "price": 850000, "growth": "0.0", "confidence": 92},
    {"year": 2025, "price": 884000, "growth": "4.0", "confidence": 89}
  ],
  "summary": {
    "totalProperties": 750,
    "averagePrice": 765000,
    "marketTrend": "increasing",
    "locationScore": 85
  }
}
```

## Troubleshooting

### Common Issues

1. **Python not found**: Ensure Python 3.8+ is installed and in PATH
2. **Dependencies missing**: Run `pip install -r requirements.txt`
3. **Model training fails**: Check Python environment and dependencies
4. **Fallback mode**: If Python model fails, the system automatically uses JavaScript simulation

### Debug Mode

Enable debug logging by setting the environment variable:
```bash
export DEBUG_AI_MODEL=true
```

### Model Files

- `model.pkl` - Trained model file (auto-generated)
- `predict.py` - Main model script
- `requirements.txt` - Python dependencies

## Development

### Adding New Locations

1. Update `location_multipliers` in `predict.py`
2. Update `growth_rates` in `predict.py`
3. Retrain the model using the API endpoint

### Model Customization

The model can be customized by modifying:
- Training data generation in `generate_training_data()`
- XGBoost parameters in `train_model()`
- Feature engineering in `predict_price()`
- Confidence calculation in `_calculate_confidence()`

## Performance

- **Training Time**: ~30 seconds for 10,000 samples
- **Prediction Time**: ~100ms per prediction
- **Memory Usage**: ~50MB for loaded model
- **Accuracy**: Simulated accuracy of 85-95% on synthetic data 