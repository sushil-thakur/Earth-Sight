# 🌍 EarthSlight

**Environmental Risk Monitoring & Real Estate Prediction Platform**

A full-stack web application that combines environmental monitoring with AI-powered real estate price prediction, featuring real-time alerts via Telegram.

## 🚀 Features

### Backend (Node.js + Express + MongoDB)
- **JWT Authentication** - Secure user registration and login
- **Environmental Risk API** - Real-time monitoring of deforestation, mining, and forest fires
- **AI-Powered Predictions** - XGBoost machine learning model for real estate valuation
- **Telegram Integration** - Automated environmental alerts
- **PDF Report Generation** - Professional prediction reports
- **RESTful API** - Complete CRUD operations

### Frontend (React + Tailwind + Leaflet)
- **Interactive Maps** - Real-time environmental risk visualization
- **Prediction Forms** - User-friendly property valuation interface
- **Responsive Design** - Mobile-first modern UI
- **Real-time Charts** - 10-year price forecasts with Recharts
- **Authentication System** - Secure login/register pages

### AI Model (Python + XGBoost)
- **Machine Learning** - XGBoost regression for price prediction
- **Feature Analysis** - Impact analysis of property characteristics
- **Location Intelligence** - City-specific market multipliers
- **Forecast Generation** - 10-year price projections
- **Model Persistence** - Save/load trained models

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **node-telegram-bot-api** - Telegram integration
- **node-cron** - Scheduled tasks
- **puppeteer** - PDF generation
- **handlebars** - HTML templating
- **python-shell** - Python integration

### Frontend
- **React** - UI library
- **Tailwind CSS** - Styling
- **Leaflet.js** - Interactive maps
- **React-Leaflet** - React wrapper for Leaflet
- **Recharts** - Data visualization
- **Axios** - HTTP client
- **React Router** - Navigation
- **React Hot Toast** - Notifications
- **Lucide React** - Icons

### AI Model
- **Python 3.8+** - Programming language
- **XGBoost** - Machine learning algorithm
- **scikit-learn** - Data preprocessing
- **pandas** - Data manipulation
- **numpy** - Numerical computing

## 📦 Installation

### Prerequisites
- Node.js 16+
- Python 3.8+
- MongoDB
- Telegram Bot Token

### 1. Clone the Repository
```bash
git clone <repository-url>
cd earthslight
```

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Install Python dependencies for AI model
cd ai_model
pip install -r requirements.txt
cd ..

# Create environment file
cp .env.example .env
# Edit .env with your configuration

# Start the server
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

### 4. Environment Configuration

Create `.env` file in the backend directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/earthslight

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d

# Telegram Bot
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
TELEGRAM_CHAT_ID=your-chat-id

# CORS
CORS_ORIGIN=http://localhost:3000
```

## 🚀 Usage

### 1. User Registration
- Navigate to `/register`
- Fill in name, email, password, and Telegram ID
- Receive confirmation email

### 2. Environmental Monitoring
- Access `/dashboard` after login
- View interactive map with real-time risk markers
- Monitor deforestation, mining, and forest fire alerts

### 3. Real Estate Predictions
- Go to `/prediction`
- Enter property details (floors, area, bedrooms, etc.)
- Get AI-powered price prediction and 10-year forecast
- Download detailed PDF report

### 4. Telegram Alerts
- Receive automated environmental alerts every 5 minutes
- Manual alert trigger available via API

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Environmental Data
- `GET /api/environment/dummy-data` - Get environmental risk data
- `GET /api/environment/statistics` - Get risk statistics
- `GET /api/environment/risks/:type` - Get risks by type

### AI Predictions
- `POST /api/predict` - Generate price prediction
- `GET /api/predict/model-status` - Get AI model status
- `POST /api/predict/train-model` - Retrain AI model
- `GET /api/predict/history` - Get prediction history
- `GET /api/predict/insights` - Get market insights

### PDF Reports
- `POST /api/pdf/report` - Generate PDF report
- `GET /api/pdf/download/:filename` - Download PDF

### Telegram Alerts
- `POST /api/send-alerts` - Send manual alerts

## 🤖 AI Model Details

### Features
- **XGBoost Regression** - Advanced gradient boosting
- **Location Intelligence** - City-specific market data
- **Feature Analysis** - Property characteristic impact
- **Confidence Scoring** - Prediction reliability metrics
- **Forecast Generation** - 10-year price projections

### Supported Locations
- Los Angeles, New York, San Francisco
- Chicago, Miami, Seattle
- Austin, Denver, Boston, Portland

### Model Performance
- Training Data: 10,000 synthetic samples
- Prediction Time: ~100ms
- Accuracy: 85-95% (simulated)
- Confidence: 85-100%

## 🔧 Development

### Backend Development
```bash
cd backend
npm run dev  # Development mode with nodemon
npm test     # Run tests
```

### Frontend Development
```bash
cd frontend
npm start    # Development server
npm build    # Production build
npm test     # Run tests
```

### AI Model Development
```bash
cd backend/ai_model
python predict.py train      # Train model
python predict.py predict    # Test prediction
python predict.py forecast   # Test forecast
```

## 📁 Project Structure

```
earthslight/
├── backend/
│   ├── ai_model/
│   │   ├── predict.py          # AI model script
│   │   ├── requirements.txt    # Python dependencies
│   │   └── README.md          # AI model documentation
│   ├── models/
│   │   └── User.js            # User model
│   ├── routes/
│   │   ├── auth.js            # Authentication routes
│   │   ├── environment.js     # Environmental data routes
│   │   ├── prediction.js      # AI prediction routes
│   │   └── pdf.js             # PDF generation routes
│   ├── services/
│   │   ├── aiModelService.js  # AI model integration
│   │   └── telegramService.js # Telegram integration
│   ├── middleware/
│   │   └── auth.js            # JWT middleware
│   ├── uploads/               # Generated PDFs
│   ├── server.js              # Main server file
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/            # Page components
│   │   ├── contexts/         # React contexts
│   │   └── index.js          # App entry point
│   ├── public/
│   └── package.json
└── README.md
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

### API Testing
Import the provided Postman collection:
- `backend/Postman_Collection.json`

## 🚀 Deployment

### Backend Deployment
```bash
cd backend
npm run build
npm start
```

### Frontend Deployment
```bash
cd frontend
npm run build
# Deploy build folder to your hosting service
```

### Environment Variables
Ensure all environment variables are set in production:
- Database connection string
- JWT secret
- Telegram bot token
- CORS origins

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation in each directory
- Review the AI model README for ML-specific questions
- Open an issue for bugs or feature requests

## 🔮 Future Enhancements

- [ ] Real-time satellite data integration
- [ ] Advanced ML models (Neural Networks)
- [ ] Mobile app development
- [ ] Blockchain integration for data integrity
- [ ] Multi-language support
- [ ] Advanced analytics dashboard 