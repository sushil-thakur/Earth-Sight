# Pre-trained Model Setup Guide

This guide explains how to integrate your own trained machine learning model with the EarthSlight system.

## 📋 Prerequisites

- Your trained model exported as `model.pkl`
- Model trained with features: `floors`, `area`, `bedrooms`, `bathrooms`, `age`, `location`
- Python 3.8+ with required dependencies

## 🔧 Setup Steps

### 1. Prepare Your Model File

Ensure your `model.pkl` file contains:
```python
{
    'model': your_trained_model,  # Your trained XGBoost/RandomForest/etc. model
    'label_encoders': {...},      # Optional: Location encoders if used
    'scaler': scaler_object,      # Optional: Feature scaler if used
    'location_multipliers': {...}, # Optional: Location-specific multipliers
    'growth_rates': {...}         # Optional: Location growth rates
}
```

### 2. Place Your Model

Copy your `model.pkl` file to:
```
backend/ai_model/model.pkl
```

### 3. Update Location Data (Optional)

If your model uses different locations than the defaults, update the location data in `predict.py`:

```python
# In backend/ai_model/predict.py
self.location_multipliers = {
    'Your Location 1': 2.5,
    'Your Location 2': 3.0,
    # ... your locations
}

self.growth_rates = {
    'Your Location 1': 0.04,
    'Your Location 2': 0.035,
    # ... your growth rates
}
```

### 4. Test Your Model

Test the model loading and prediction:

```bash
cd backend/ai_model

# Test model loading
python predict.py load

# Test prediction
python predict.py predict 2 1500 3 2 5 "Your Location"
```

## 🔍 Model Requirements

### Expected Input Format
Your model should accept input in this format:
```python
{
    'floors': int,      # Number of floors
    'area': int,        # Square footage
    'bedrooms': int,    # Number of bedrooms
    'bathrooms': int,   # Number of bathrooms
    'age': int,         # Property age in years
    'location': str     # Location name
}
```

### Expected Output Format
Your model should return:
```python
{
    'currentPrice': int,  # Predicted price
    'confidence': int,    # Confidence score (0-100)
    'marketTrend': str,   # 'increasing', 'stable', or 'decreasing'
    'locationScore': int, # Location score (0-100)
    'factors': [...]      # List of factor impacts
}
```

## 🚀 Integration

### Automatic Integration
The system will automatically:
1. Load your model on startup
2. Use it for predictions via `/api/predict`
3. Fall back to JavaScript simulation if Python model fails

### API Endpoints
- `POST /api/predict` - Make predictions
- `GET /api/predict/model-status` - Check model status
- `POST /api/predict/test-model` - Test model loading

## 🛠️ Troubleshooting

### Common Issues

1. **Model not found**
   ```
   Error: Model file model.pkl not found
   Solution: Ensure your model.pkl is in backend/ai_model/
   ```

2. **Feature mismatch**
   ```
   Error: Expected features not found
   Solution: Check your model's expected input format
   ```

3. **Location encoding error**
   ```
   Error: Location not in training data
   Solution: Update location_multipliers with your locations
   ```

4. **Python dependencies missing**
   ```
   Error: Module not found
   Solution: Run pip install -r requirements.txt
   ```

### Debug Mode

Enable detailed logging:
```bash
export DEBUG_AI_MODEL=true
```

### Manual Testing

Test your model directly:
```bash
cd backend/ai_model
python predict.py predict 2 1500 3 2 5 "Your Location"
```

## 📊 Model Performance

### Expected Performance
- **Loading Time**: < 5 seconds
- **Prediction Time**: < 100ms
- **Memory Usage**: < 100MB
- **Accuracy**: Based on your training

### Monitoring
Check model performance via:
- Server logs
- `/api/predict/model-status` endpoint
- Prediction response times

## 🔄 Updates

### Updating Your Model
1. Replace `model.pkl` with new version
2. Restart the backend server
3. Test with `/api/predict/test-model`

### Version Control
Consider versioning your models:
```
model_v1.pkl
model_v2.pkl
model_latest.pkl -> model.pkl
```

## 📝 Example Model Structure

Here's an example of how your `model.pkl` should be structured:

```python
import pickle
import xgboost as xgb
from sklearn.preprocessing import LabelEncoder, StandardScaler

# Your trained model
model = xgb.XGBRegressor()
# ... train your model ...

# Preprocessors
label_encoder = LabelEncoder()
scaler = StandardScaler()
# ... fit your preprocessors ...

# Location data
location_multipliers = {
    'Los Angeles': 2.5,
    'New York': 3.0,
    # ... your locations
}

growth_rates = {
    'Los Angeles': 0.04,
    'New York': 0.035,
    # ... your rates
}

# Save model
model_data = {
    'model': model,
    'label_encoders': {'location': label_encoder},
    'scaler': scaler,
    'location_multipliers': location_multipliers,
    'growth_rates': growth_rates
}

with open('model.pkl', 'wb') as f:
    pickle.dump(model_data, f)
```

## ✅ Verification Checklist

- [ ] `model.pkl` placed in `backend/ai_model/`
- [ ] Model accepts required features
- [ ] Location data updated (if needed)
- [ ] Python dependencies installed
- [ ] Model loads successfully
- [ ] Predictions work correctly
- [ ] API endpoints respond properly
- [ ] Fallback system works

## 🆘 Support

If you encounter issues:
1. Check server logs for error messages
2. Verify model file structure
3. Test model loading manually
4. Check Python environment and dependencies
5. Review this setup guide 