# EarthSlight Backend

**Node.js + Express + MongoDB + AI Model + GEE + Telegram**

A comprehensive backend server for environmental risk monitoring and real estate prediction platform.

## 🚀 Features

### Authentication System
- JWT-based user registration and login
- Secure password hashing with bcrypt
- User profile management
- Telegram ID integration for alerts

### Environmental Risk API
- Dummy GEE data simulation
- Deforestation, mining, and forest fire risk data
- GeoJSON format with coordinates and severity
- Real-time risk statistics

### Telegram Alert System
- Automated alerts every 5 minutes
- Manual alert triggering endpoint
- Customizable alert messages
- User-specific notifications

### AI Model Integration
- XGBoost model simulation for real estate prediction
- Property valuation with confidence scoring
- 10-year market forecast
- Factor analysis and market insights

### PDF Report Generation
- Professional property valuation reports
- User data and prediction results
- Downloadable PDF files
- Customizable templates

## 🛠️ Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database with Mongoose ODM
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing
- **node-telegram-bot-api** - Telegram Bot integration
- **node-cron** - Scheduled tasks
- **puppeteer** - PDF generation
- **handlebars** - HTML templating
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment configuration

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Telegram Bot Token (optional)

### Setup Instructions

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp env.example .env
   ```

3. **Configure environment variables**
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/earthslight

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=24h

   # Telegram Bot Configuration
   TELEGRAM_BOT_TOKEN=your-telegram-bot-token
   TELEGRAM_CHAT_ID=your-default-chat-id

   # CORS Configuration
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Start the server**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## 📱 API Endpoints

### Authentication Routes (`/api/auth`)

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "telegramId": "123456789"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

#### Update Profile
```http
PUT /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Updated",
  "telegramId": "987654321"
}
```

### Environmental Routes (`/api/environment`)

#### Get Dummy Environmental Data
```http
GET /api/environment/dummy-data
```

#### Get Environmental Statistics
```http
GET /api/environment/statistics
```

#### Get Risks by Type
```http
GET /api/environment/risks/deforestation
```

### Prediction Routes (`/api/predict`)

#### Generate Prediction
```http
POST /api/predict
Authorization: Bearer <token>
Content-Type: application/json

{
  "floors": 3,
  "area": 1200,
  "bedrooms": 3,
  "bathrooms": 2,
  "age": 4,
  "location": "Los Angeles"
}
```

#### Get Prediction History
```http
GET /api/predict/history
Authorization: Bearer <token>
```

#### Get Market Insights
```http
GET /api/predict/insights?location=Los Angeles
Authorization: Bearer <token>
```

### PDF Routes (`/api/pdf`)

#### Generate PDF Report
```http
POST /api/pdf/report
Authorization: Bearer <token>
Content-Type: application/json

{
  "predictionData": {
    "prediction": {
      "currentPrice": 850000,
      "confidence": 92,
      "factors": [...]
    },
    "forecast": [...],
    "summary": {...}
  },
  "userInput": {
    "floors": 3,
    "area": 1200,
    "bedrooms": 3,
    "bathrooms": 2,
    "age": 4,
    "location": "Los Angeles"
  }
}
```

#### Download PDF Report
```http
GET /api/pdf/download/report_1234567890_userid.pdf
Authorization: Bearer <token>
```

### Telegram Alerts

#### Send Manual Alerts
```http
POST /api/send-alerts
Authorization: Bearer <token>
```

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  telegramId: String (unique),
  role: String (enum: ['user', 'admin']),
  isActive: Boolean,
  lastLogin: Date,
  timestamps: true
}
```

## 🔧 Configuration

### Telegram Bot Setup

1. **Create a Telegram Bot**
   - Message [@BotFather](https://t.me/botfather) on Telegram
   - Use `/newbot` command
   - Follow instructions to create bot
   - Save the bot token

2. **Configure Environment**
   ```env
   TELEGRAM_BOT_TOKEN=your-bot-token-here
   ```

3. **Test Bot**
   - Start your bot in Telegram
   - Send `/start` message
   - Bot will respond with welcome message

### MongoDB Setup

1. **Local MongoDB**
   ```bash
   # Install MongoDB
   # Start MongoDB service
   mongod
   ```

2. **MongoDB Atlas**
   - Create account at [MongoDB Atlas](https://cloud.mongodb.com)
   - Create cluster
   - Get connection string
   - Update `MONGODB_URI` in `.env`

## 🚀 Deployment

### Production Setup

1. **Environment Variables**
   ```env
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=your-production-mongodb-uri
   JWT_SECRET=your-production-jwt-secret
   TELEGRAM_BOT_TOKEN=your-telegram-bot-token
   CORS_ORIGIN=https://your-frontend-domain.com
   ```

2. **Process Manager (PM2)**
   ```bash
   npm install -g pm2
   pm2 start server.js --name earthslight-backend
   pm2 save
   pm2 startup
   ```

3. **Reverse Proxy (Nginx)**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## 📊 Monitoring

### Health Check
```http
GET /api/health
```

### Logs
- Application logs are written to console
- Use PM2 for log management in production
- Monitor MongoDB connection status

## 🔒 Security

### Authentication
- JWT tokens with expiration
- Password hashing with bcrypt
- Protected routes with middleware

### Data Validation
- Input validation on all endpoints
- MongoDB injection protection
- CORS configuration

### Rate Limiting
- Implement rate limiting for production
- Monitor API usage

## 🧪 Testing

### Postman Collection
Import `Postman_Collection.json` to test all endpoints.

### Manual Testing
1. Start the server
2. Test registration and login
3. Test protected endpoints with JWT token
4. Test environmental data endpoints
5. Test prediction endpoints
6. Test PDF generation

## 📝 API Response Format

### Success Response
```json
{
  "success": true,
  "data": {...},
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "error": "Error message",
  "details": "Additional error details"
}
```

## 🔮 Future Enhancements

- Real GEE (Google Earth Engine) integration
- Advanced ML model integration
- Real-time satellite data
- WebSocket support for live updates
- Advanced caching with Redis
- Microservices architecture
- GraphQL API
- Advanced analytics and reporting

## 🆘 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check MongoDB service status
   - Verify connection string
   - Check network connectivity

2. **JWT Token Issues**
   - Verify JWT_SECRET is set
   - Check token expiration
   - Validate token format

3. **Telegram Bot Not Working**
   - Verify bot token
   - Check bot permissions
   - Test bot manually

4. **PDF Generation Fails**
   - Check Puppeteer installation
   - Verify file permissions
   - Check available memory

## 📄 License

MIT License - see LICENSE file for details.

---

**EarthSlight Backend** - Powering environmental monitoring and real estate prediction. 🌍🏠 