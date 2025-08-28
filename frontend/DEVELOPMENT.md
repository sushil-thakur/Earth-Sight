# EarthSlight Frontend Development Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Backend server running on http://localhost:5000

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd earthslight/frontend

# Install dependencies
npm install

# Start development server
npm start
```

The frontend will be available at http://localhost:3000

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the frontend root:
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_MAP_TILE_URL=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
```

### API Proxy
The `package.json` includes a proxy configuration for development:
```json
"proxy": "http://localhost:5000"
```

## 🛠️ Development Features

### API Testing (Development Mode Only)
- The Dashboard includes an "Test APIs" button in development mode
- This tests all backend endpoints and reports success/failure
- View results in the browser console

### Error Handling
- Error Boundary component catches React errors
- Comprehensive error messages with retry options
- Development mode shows detailed error information

### Code Structure
```
src/
├── components/          # Reusable UI components
│   ├── ErrorBoundary.js # Error handling
│   ├── LoadingSpinner.js # Loading states
│   └── Navbar.js       # Navigation
├── contexts/           # React contexts
│   └── AuthContext.js  # Authentication state
├── pages/              # Main page components
│   ├── Dashboard.js    # Environmental monitoring
│   ├── Login.js        # User authentication
│   ├── PredictionForm.js # Real estate prediction
│   └── Register.js     # User registration
├── config/             # Configuration files
│   └── api.js          # API endpoints and configs
└── utils/              # Utility functions
    └── apiTest.js      # API testing utilities
```

## 🌟 Key Features

### Authentication System
- JWT token-based authentication
- Automatic token management
- Protected routes
- Profile management with email preferences

### Environmental Dashboard
- Interactive Leaflet.js map
- Real-time risk monitoring
- Email notification toggle
- Statistics cards with visual indicators

### Real Estate Prediction
- AI-powered property valuation
- Interactive form with validation
- 10-year market forecast charts
- PDF report generation with blob download

### Email Notification System
- Replaced Telegram with email alerts
- User preference management
- Professional HTML email templates
- Real-time status indicators

## 🔧 API Integration

### Endpoint Configuration
All API endpoints are defined in `src/config/api.js`:

```javascript
export const API_ENDPOINTS = {
  health: '/api/health',
  auth: {
    register: '/api/auth/register',
    login: '/api/auth/login',
    profile: '/api/auth/profile'
  },
  environment: {
    dummyData: '/api/environment/dummy-data',
    statistics: '/api/environment/statistics'
  },
  prediction: {
    predict: '/api/predict',
    modelStatus: '/api/predict/model-status'
  },
  email: {
    status: '/api/email/status',
    testAlert: '/api/email/test-alert'
  }
};
```

### Error Handling
Centralized error handling with proper status code management:
- 401: Automatic logout and redirect to login
- 400: Validation error display
- 500: Server error with retry options

### Request Configuration
Pre-configured request types:
- JSON requests with proper headers
- PDF blob downloads
- Authenticated requests with JWT tokens

## 🎨 UI/UX Features

### Responsive Design
- Mobile-first approach with Tailwind CSS
- Adaptive navigation (hamburger menu on mobile)
- Responsive grid layouts
- Touch-friendly interactions

### Visual Feedback
- Loading spinners for async operations
- Toast notifications for user feedback
- Color-coded status indicators
- Progress indicators for multi-step processes

### Accessibility
- Semantic HTML structure
- Keyboard navigation support
- Screen reader friendly
- High contrast color schemes

## 🧪 Testing

### Manual Testing Checklist
- [ ] Authentication flow (login/register/logout)
- [ ] Protected route access
- [ ] Environmental data loading
- [ ] Map functionality
- [ ] Email notification toggle
- [ ] Prediction form submission
- [ ] PDF report download
- [ ] Mobile responsiveness

### API Testing
Use the built-in API testing utility:
1. Open Dashboard in development mode
2. Click "Test APIs" button
3. Check browser console for results
4. All green checkmarks indicate working endpoints

## 🚀 Production Deployment

### Build Process
```bash
# Create production build
npm run build

# The build folder contains optimized static files
ls build/
```

### Environment Setup
1. Update API endpoints for production
2. Configure CORS settings on backend
3. Set up HTTPS for secure token transmission
4. Configure error logging and monitoring

### Hosting Options
- **Netlify**: Easy deployment with automatic builds
- **Vercel**: Optimized for React applications
- **AWS S3**: Static hosting with CloudFront CDN
- **Traditional hosting**: Any web server supporting static files

## 🔍 Troubleshooting

### Common Issues

1. **Map not loading**
   - Check internet connection
   - Verify Leaflet CSS import
   - Check console for tile loading errors

2. **API calls failing**
   - Verify backend server is running
   - Check CORS configuration
   - Validate JWT token in localStorage

3. **PDF downloads not working**
   - Ensure backend has Puppeteer dependencies
   - Check file permissions for uploads directory
   - Verify blob response handling

4. **Email notifications not working**
   - Check email service configuration
   - Verify Gmail App Password setup
   - Test email endpoint manually

### Development Tips
- Use browser DevTools Network tab to debug API calls
- Check React DevTools for component state
- Monitor browser console for errors
- Use the API testing utility for endpoint validation

## 📝 Contributing

### Code Style
- Follow ESLint configuration
- Use functional components with hooks
- Implement proper error boundaries
- Add comprehensive error handling

### Git Workflow
- Create feature branches for new functionality
- Write descriptive commit messages
- Test thoroughly before merging
- Update documentation as needed

## 📄 License
This project is licensed under the MIT License.
