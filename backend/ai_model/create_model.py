#!/usr/bin/env python3
"""
Script to create the pre-trained model for the Real Estate Price Prediction system
This will generate model.pkl with all required components
"""

import pickle
import numpy as np
import pandas as pd
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.ensemble import RandomForestRegressor
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
import warnings
warnings.filterwarnings('ignore')

def create_pretrained_model():
    """Create and save a pre-trained XGBoost model"""
    
    # Set random seed for reproducibility
    np.random.seed(42)
    
    # Location multipliers (based on real estate market data)
    location_multipliers = {
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
    growth_rates = {
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
    
    print("Generating training data...")
    
    # Generate comprehensive training data
    num_samples = 50000
    locations = list(location_multipliers.keys())
    
    data = {
        'floors': np.random.randint(1, 51, num_samples),
        'area': np.random.randint(100, 10001, num_samples),
        'bedrooms': np.random.randint(1, 11, num_samples),
        'bathrooms': np.random.randint(1, 11, num_samples),
        'age': np.random.randint(0, 101, num_samples),
        'location': np.random.choice(locations, num_samples)
    }
    
    df = pd.DataFrame(data)
    
    # Calculate realistic prices based on features
    base_price = 150000
    prices = []
    
    for _, row in df.iterrows():
        location_mult = location_multipliers.get(row['location'], 1.5)
        area_mult = row['area'] / 1000
        bedroom_mult = 1 + (row['bedrooms'] - 2) * 0.15
        bathroom_mult = 1 + (row['bathrooms'] - 1) * 0.1
        floor_mult = 1 + (row['floors'] - 1) * 0.05
        age_mult = max(0.7, 1 - (row['age'] * 0.01))
        
        price = base_price * location_mult * area_mult * bedroom_mult * bathroom_mult * floor_mult * age_mult
        # Add realistic market noise
        price *= np.random.uniform(0.85, 1.15)
        prices.append(int(max(50000, price)))  # Minimum price floor
    
    df['price'] = prices
    
    print(f"Generated {len(df)} training samples")
    print(f"Price range: ${df['price'].min():,} - ${df['price'].max():,}")
    print(f"Average price: ${df['price'].mean():,.0f}")
    
    # Prepare features for training
    print("\nPreparing features...")
    
    # Encode location
    label_encoder = LabelEncoder()
    df['location_encoded'] = label_encoder.fit_transform(df['location'])
    
    # Prepare feature matrix
    feature_columns = ['floors', 'area', 'bedrooms', 'bathrooms', 'age', 'location_encoded']
    X = df[feature_columns]
    y = df['price']
    
    # Scale features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)
    
    print(f"Training set size: {len(X_train)}")
    print(f"Test set size: {len(X_test)}")
    
    # Train XGBoost model
    print("\nTraining XGBoost model...")
    
    model = xgb.XGBRegressor(
        n_estimators=200,
        max_depth=8,
        learning_rate=0.1,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42,
        n_jobs=-1
    )
    
    model.fit(X_train, y_train)
    
    # Evaluate model
    train_pred = model.predict(X_train)
    test_pred = model.predict(X_test)
    
    train_mae = mean_absolute_error(y_train, train_pred)
    test_mae = mean_absolute_error(y_test, test_pred)
    train_r2 = r2_score(y_train, train_pred)
    test_r2 = r2_score(y_test, test_pred)
    
    print(f"\nModel Performance:")
    print(f"Training MAE: ${train_mae:,.0f}")
    print(f"Testing MAE: ${test_mae:,.0f}")
    print(f"Training R²: {train_r2:.4f}")
    print(f"Testing R²: {test_r2:.4f}")
    
    # Prepare label encoders dictionary
    label_encoders = {'location': label_encoder}
    
    # Save complete model package
    print("\nSaving model...")
    
    model_data = {
        'model': model,
        'label_encoders': label_encoders,
        'scaler': scaler,
        'location_multipliers': location_multipliers,
        'growth_rates': growth_rates,
        'feature_columns': feature_columns,
        'model_info': {
            'model_type': 'XGBoost',
            'training_samples': num_samples,
            'test_mae': test_mae,
            'test_r2': test_r2,
            'created_date': '2025-08-04'
        }
    }
    
    # Save as model.pkl (main model file)
    with open('model.pkl', 'wb') as f:
        pickle.dump(model_data, f)
    
    print("✓ Model saved as 'model.pkl'")
    
    # Also save individual components for compatibility with existing files
    with open('real_estate_price_model_package.pkl', 'wb') as f:
        pickle.dump(model, f)
    
    with open('scaler.pkl', 'wb') as f:
        pickle.dump(scaler, f)
    
    with open('location_encoding.pkl', 'wb') as f:
        pickle.dump(label_encoder, f)
    
    print("✓ Individual components updated")
    
    # Test the saved model
    print("\nTesting saved model...")
    
    # Reload and test
    with open('model.pkl', 'rb') as f:
        loaded_data = pickle.load(f)
    
    loaded_model = loaded_data['model']
    loaded_scaler = loaded_data['scaler']
    loaded_encoders = loaded_data['label_encoders']
    
    # Test prediction
    test_input = pd.DataFrame({
        'floors': [2],
        'area': [1500],
        'bedrooms': [3],
        'bathrooms': [2],
        'age': [10],
        'location_encoded': [loaded_encoders['location'].transform(['Los Angeles'])[0]]
    })
    
    test_scaled = loaded_scaler.transform(test_input)
    test_prediction = loaded_model.predict(test_scaled)[0]
    
    print(f"Test prediction: ${test_prediction:,.0f}")
    print("✓ Model loading and prediction test successful!")
    
    return True

if __name__ == "__main__":
    create_pretrained_model()
