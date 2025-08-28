#!/usr/bin/env python3
"""
EarthSlight AI Model - Real Estate Price Prediction
XGBoost-based machine learning model for property valuation
"""

import sys
import json
import pickle
import numpy as np
import pandas as pd
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.ensemble import RandomForestRegressor
import xgboost as xgb
from datetime import datetime
import warnings
warnings.filterwarnings('ignore')

class RealEstatePredictor:
    def __init__(self):
        self.model = None
        self.label_encoders = {}
        self.scaler = None
        self.is_trained = False
        
        # Location multipliers (for your trained model - adjust these based on your model's training data)
        self.location_multipliers = {
            'Los Angeles': 2.5,
            'New York': 3.0,
            'San Francisco': 2.8,
            'Chicago': 1.8,
            'Miami': 1.9,
            'Seattle': 2.2,
            'Austin': 1.6,
            'Denver': 1.7,
            'Boston': 2.3,
            'Portland': 1.9
        }
        
        # Market growth rates by location
        self.growth_rates = {
            'Los Angeles': 0.04,
            'New York': 0.035,
            'San Francisco': 0.045,
            'Chicago': 0.025,
            'Miami': 0.03,
            'Seattle': 0.035,
            'Austin': 0.04,
            'Denver': 0.03,
            'Boston': 0.035,
            'Portland': 0.03
        }
    
    def generate_training_data(self, num_samples=10000):
        """Generate synthetic training data for the model"""
        np.random.seed(42)
        
        locations = list(self.location_multipliers.keys())
        
        data = {
            'floors': np.random.randint(1, 51, num_samples),
            'area': np.random.randint(100, 10001, num_samples),
            'bedrooms': np.random.randint(1, 11, num_samples),
            'bathrooms': np.random.randint(1, 11, num_samples),
            'age': np.random.randint(0, 101, num_samples),
            'location': np.random.choice(locations, num_samples)
        }
        
        df = pd.DataFrame(data)
        
        # Calculate synthetic prices based on features
        base_price = 150000
        prices = []
        
        for _, row in df.iterrows():
            location_mult = self.location_multipliers.get(row['location'], 1.5)
            area_mult = row['area'] / 1000
            bedroom_mult = 1 + (row['bedrooms'] - 2) * 0.15
            bathroom_mult = 1 + (row['bathrooms'] - 1) * 0.1
            floor_mult = 1 + (row['floors'] - 1) * 0.05
            age_mult = max(0.7, 1 - (row['age'] * 0.01))
            
            price = base_price * location_mult * area_mult * bedroom_mult * bathroom_mult * floor_mult * age_mult
            # Add some randomness
            price *= np.random.uniform(0.8, 1.2)
            prices.append(int(price))
        
        df['price'] = prices
        return df
    
    def train_model(self):
        """This method is kept for compatibility but will not be used with pre-trained model"""
        print("Using pre-trained model. Training is not required.")
        return True
    
    def predict_price(self, floors, area, bedrooms, bathrooms, age, location):
        """Predict property price using the trained model"""
        if not self.is_trained:
            print("Model not loaded. Please ensure your trained model is available.")
            return None
        
        try:
            # Prepare input data according to your model's expected format
            input_data = pd.DataFrame({
                'floors': [floors],
                'area': [area],
                'bedrooms': [bedrooms],
                'bathrooms': [bathrooms],
                'age': [age]
            })
            
            # Handle location encoding based on your model's requirements
            if self.label_encoders and 'location' in self.label_encoders:
                if location in self.label_encoders['location'].classes_:
                    location_encoded = self.label_encoders['location'].transform([location])[0]
                else:
                    # If location not in training data, use default
                    location_encoded = 0
                input_data['location_encoded'] = location_encoded
            else:
                # If no label encoder, use location as string or handle differently
                input_data['location'] = location
            
            # Scale features if scaler is available
            if self.scaler:
                input_scaled = self.scaler.transform(input_data)
            else:
                input_scaled = input_data.values
            
            # Make prediction using your trained model
            predicted_price = self.model.predict(input_scaled)[0]
            
            # Calculate confidence based on feature values
            confidence = self._calculate_confidence(floors, area, bedrooms, bathrooms, age, location)
            
            # Calculate market trend
            market_trend = self._get_market_trend(location)
            
            # Calculate location score
            location_score = self._calculate_location_score(location)
            
            # Generate factors analysis
            factors = self._analyze_factors(floors, area, bedrooms, bathrooms, age, location)
            
            return {
                'currentPrice': int(predicted_price),
                'confidence': confidence,
                'marketTrend': market_trend,
                'locationScore': location_score,
                'factors': factors
            }
        except Exception as e:
            print(f"Error making prediction: {e}")
            return None
    
    def generate_forecast(self, current_price, location, years=10):
        """Generate price forecast for the next N years"""
        growth_rate = self.growth_rates.get(location, 0.03)
        forecast = []
        
        for year in range(1, years + 1):
            # Add volatility to the forecast
            volatility = np.random.uniform(0.95, 1.05)
            growth_factor = (1 + growth_rate) ** year * volatility
            
            forecast_price = int(current_price * growth_factor)
            growth_percentage = ((growth_factor - 1) * 100)
            
            # Decreasing confidence over time
            confidence = max(60, 100 - year * 3)
            
            forecast.append({
                'year': datetime.now().year + year,
                'price': forecast_price,
                'growth': round(growth_percentage, 1),
                'confidence': confidence
            })
        
        return forecast
    
    def _calculate_confidence(self, floors, area, bedrooms, bathrooms, age, location):
        """Calculate prediction confidence based on input quality"""
        confidence = 85  # Base confidence
        
        # Adjust based on feature ranges
        if 1 <= floors <= 20:
            confidence += 5
        if 500 <= area <= 5000:
            confidence += 5
        if 1 <= bedrooms <= 5:
            confidence += 5
        if 1 <= bathrooms <= 4:
            confidence += 5
        if 0 <= age <= 50:
            confidence += 5
        
        # Location confidence
        if location in self.location_multipliers:
            confidence += 5
        
        return min(100, confidence)
    
    def _get_market_trend(self, location):
        """Get market trend for the location"""
        growth_rate = self.growth_rates.get(location, 0.03)
        
        if growth_rate > 0.04:
            return 'increasing'
        elif growth_rate > 0.02:
            return 'stable'
        else:
            return 'decreasing'
    
    def _calculate_location_score(self, location):
        """Calculate location score (0-100)"""
        if location in self.location_multipliers:
            multiplier = self.location_multipliers[location]
            # Convert multiplier to score (1.5 = 70, 3.0 = 100)
            score = 70 + (multiplier - 1.5) * 20
            return min(100, max(70, int(score)))
        return 75
    
    def _analyze_factors(self, floors, area, bedrooms, bathrooms, age, location):
        """Analyze the impact of different factors on price"""
        factors = []
        
        # Location factor
        location_mult = self.location_multipliers.get(location, 1.5)
        factors.append({
            'name': 'Location',
            'impact': round(location_mult, 2),
            'description': 'Location premium'
        })
        
        # Area factor
        area_mult = area / 1000
        factors.append({
            'name': 'Area',
            'impact': round(area_mult, 2),
            'description': 'Square footage'
        })
        
        # Bedrooms factor
        bedroom_mult = 1 + (bedrooms - 2) * 0.15
        factors.append({
            'name': 'Bedrooms',
            'impact': round(bedroom_mult, 2),
            'description': 'Number of bedrooms'
        })
        
        # Bathrooms factor
        bathroom_mult = 1 + (bathrooms - 1) * 0.1
        factors.append({
            'name': 'Bathrooms',
            'impact': round(bathroom_mult, 2),
            'description': 'Number of bathrooms'
        })
        
        # Age factor
        age_mult = max(0.7, 1 - (age * 0.01))
        factors.append({
            'name': 'Age',
            'impact': round(age_mult, 2),
            'description': 'Property age'
        })
        
        return factors
    
    def save_model(self, filepath='model.pkl'):
        """Save the trained model to file"""
        if self.is_trained:
            model_data = {
                'model': self.model,
                'label_encoders': self.label_encoders,
                'scaler': self.scaler,
                'location_multipliers': self.location_multipliers,
                'growth_rates': self.growth_rates
            }
            with open(filepath, 'wb') as f:
                pickle.dump(model_data, f)
            print(f"Model saved to {filepath}")
    
    def load_model(self, filepath='model.pkl'):
        """Load a trained model from file"""
        try:
            with open(filepath, 'rb') as f:
                model_data = pickle.load(f)
            
            # Load your pre-trained model
            self.model = model_data['model']
            
            # Load preprocessors if they exist in your model file
            if 'label_encoders' in model_data:
                self.label_encoders = model_data['label_encoders']
            if 'scaler' in model_data:
                self.scaler = model_data['scaler']
            
            # Load location data if available, otherwise use defaults
            if 'location_multipliers' in model_data:
                self.location_multipliers = model_data['location_multipliers']
            if 'growth_rates' in model_data:
                self.growth_rates = model_data['growth_rates']
            
            self.is_trained = True
            
            print(f"Pre-trained model loaded from {filepath}")
            return True
        except FileNotFoundError:
            print(f"Model file {filepath} not found. Please ensure your trained model is in the correct location.")
            return False
        except Exception as e:
            print(f"Error loading model: {e}")
            return False

def main():
    """Main function for command line usage"""
    if len(sys.argv) < 2:
        print("Usage: python predict.py <command> [args]")
        print("Commands:")
        print("  load - Load the pre-trained model")
        print("  predict <floors> <area> <bedrooms> <bathrooms> <age> <location> - Make prediction")
        print("  forecast <price> <location> [years] - Generate forecast")
        return
    
    command = sys.argv[1]
    predictor = RealEstatePredictor()
    
    if command == 'load':
        success = predictor.load_model()
        if success:
            print("Pre-trained model loaded successfully!")
        else:
            print("Failed to load pre-trained model. Please ensure model.pkl exists.")
    
    elif command == 'predict':
        if len(sys.argv) < 8:
            print("Usage: python predict.py predict <floors> <area> <bedrooms> <bathrooms> <age> <location>")
            return
        
        # Load model first
        if not predictor.load_model():
            print("Failed to load model. Cannot make prediction.")
            return
        
        floors = int(sys.argv[2])
        area = int(sys.argv[3])
        bedrooms = int(sys.argv[4])
        bathrooms = int(sys.argv[5])
        age = int(sys.argv[6])
        location = sys.argv[7]
        
        result = predictor.predict_price(floors, area, bedrooms, bathrooms, age, location)
        if result:
            print(json.dumps(result, indent=2))
        else:
            print("Prediction failed. Check model and input data.")
    
    elif command == 'forecast':
        if len(sys.argv) < 4:
            print("Usage: python predict.py forecast <price> <location> [years]")
            return
        
        price = int(sys.argv[2])
        location = sys.argv[3]
        years = int(sys.argv[4]) if len(sys.argv) > 4 else 10
        
        forecast = predictor.generate_forecast(price, location, years)
        print(json.dumps(forecast, indent=2))
    
    else:
        print(f"Unknown command: {command}")

if __name__ == "__main__":
    main() 