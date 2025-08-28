# EarthSlight Frontend

**React + Tailwind + Leaflet + Axios**

A modern, responsive React frontend for the EarthSlight environmental monitoring and real estate prediction platform.

## 🚀 Features

### Authentication System
- User registration and login forms
- JWT token management
- Protected routes
- User profile management

### Environmental Dashboard
- Interactive Leaflet.js map
- Real-time environmental risk markers
- Risk statistics and analytics
- Telegram alert reminders

### Real Estate Prediction
- Property valuation form
- AI-powered price prediction
- 10-year market forecast charts
- PDF report generation

### Modern UI/UX
- Responsive design with Tailwind CSS
- Mobile-first approach
- Smooth animations and transitions
- Toast notifications

## 🛠️ Tech Stack

- **React 18** - UI framework
- **React Router** - Navigation and routing
- **Tailwind CSS** - Utility-first CSS framework
- **Leaflet.js** - Interactive maps
- **Recharts** - Data visualization
- **Axios** - HTTP client
- **React Hot Toast** - Toast notifications
- **Lucide React** - Icon library

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Backend server running

### Setup Instructions

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npm start
   ```

3. **Build for production**
   ```bash
   npm run build
   ```

## 🏗️ Project Structure

```
src/
├── components/          # Reusable components
│   ├── Navbar.js       # Navigation component
│   └── LoadingSpinner.js # Loading indicator
├── contexts/           # React contexts
│   └── AuthContext.js  # Authentication context
├── pages/              # Page components
│   ├── Login.js        # Login page
│   ├── Register.js     # Registration page
│   ├── Dashboard.js    # Environmental dashboard
│   └── PredictionForm.js # Real estate prediction
├── App.js              # Main app component
├── index.js            # Entry point
└── index.css           # Global styles
```

## 🎨 Components

### Authentication Components

#### Login Page (`pages/Login.js`)
- Email and password form
- Form validation
- Loading states
- Error handling
- Link to registration

#### Register Page (`pages/Register.js`)
- Complete registration form
- Password confirmation
- Telegram ID input
- Form validation
- Success/error feedback

### Dashboard Components

#### Environmental Dashboard (`pages/Dashboard.js`)
- Interactive Leaflet map
- Environmental risk markers
- Statistics cards
- Risk summary sidebar
- Telegram alert reminder

#### Navigation (`components/Navbar.js`)
- Responsive navigation
- User menu
- Mobile hamburger menu
- Logout functionality

### Prediction Components

#### Real Estate Prediction (`pages/PredictionForm.js`)
- Property details form
- AI prediction results
- 10-year forecast chart
- Market insights
- PDF report download

## 🗺️ Map Integration

### Leaflet.js Setup
The application uses Leaflet.js for interactive maps with:

- **Custom Markers**: Color-coded risk markers
- **Popups**: Detailed risk information
- **Responsive Design**: Mobile-friendly map interface

### Risk Markers
- **Deforestation**: Red markers (🌳)
- **Mining**: Brown markers (⛏️)
- **Forest Fire**: Orange markers (🔥)

## 📊 Data Visualization

### Recharts Integration
- **Bar Charts**: 10-year price forecasts
- **Responsive Design**: Mobile-friendly charts
- **Custom Styling**: Branded color scheme
- **Interactive Tooltips**: Detailed information

## 🔐 Authentication Flow

### JWT Token Management
1. **Login/Register**: Get JWT token from backend
2. **Token Storage**: Store in localStorage
3. **Axios Interceptor**: Add token to all requests
4. **Protected Routes**: Redirect if not authenticated
5. **Token Refresh**: Handle token expiration

### Context Usage
```javascript
import { useAuth } from '../contexts/AuthContext';

const { user, login, logout, isAuthenticated } = useAuth();
```

## 🎯 Key Features

### Environmental Monitoring
- **Real-time Data**: Fetch environmental risks from API
- **Interactive Map**: Click markers for detailed information
- **Statistics Dashboard**: Visual representation of risks
- **Auto-refresh**: Manual data refresh capability

### Real Estate Prediction
- **Form Validation**: Client-side validation
- **AI Integration**: Connect to backend prediction API
- **Chart Visualization**: 10-year forecast display
- **PDF Reports**: Download detailed reports

### User Experience
- **Responsive Design**: Works on all devices
- **Loading States**: Smooth loading indicators
- **Error Handling**: User-friendly error messages
- **Toast Notifications**: Success/error feedback

## 🎨 Styling

### Tailwind CSS Configuration
- **Custom Colors**: Primary and secondary color schemes
- **Custom Components**: Button, card, input styles
- **Responsive Utilities**: Mobile-first approach
- **Custom Animations**: Smooth transitions

### Component Classes
```css
.btn-primary    /* Primary button styling */
.card          /* Card component styling */
.input-field   /* Form input styling */
.form-label    /* Form label styling */
```

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile Features
- **Hamburger Menu**: Collapsible navigation
- **Touch-friendly**: Large touch targets
- **Optimized Maps**: Mobile-optimized map controls
- **Responsive Charts**: Mobile-friendly data visualization

## 🔧 Configuration

### Environment Variables
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_MAP_TILE_URL=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
```

### API Configuration
- **Base URL**: Configured in package.json proxy
- **Axios Defaults**: Automatic token inclusion
- **Error Handling**: Centralized error management

## 🚀 Deployment

### Build Process
```bash
npm run build
```

### Static Hosting
Deploy to platforms like:
- **Netlify**
- **Vercel**
- **GitHub Pages**
- **AWS S3**

### Environment Setup
1. Set production environment variables
2. Update API endpoints
3. Configure CORS settings
4. Test all functionality

## 🧪 Testing

### Manual Testing Checklist
1. **Authentication**
   - Registration flow
   - Login/logout
   - Protected routes
   - Token expiration

2. **Environmental Dashboard**
   - Map loading
   - Marker display
   - Statistics cards
   - Data refresh

3. **Real Estate Prediction**
   - Form validation
   - API integration
   - Chart display
   - PDF download

4. **Responsive Design**
   - Mobile navigation
   - Tablet layout
   - Desktop experience

## 🔒 Security

### Frontend Security
- **Input Validation**: Client-side validation
- **XSS Prevention**: React's built-in protection
- **CSRF Protection**: Token-based requests
- **Secure Storage**: JWT token management

## 📊 Performance

### Optimization
- **Code Splitting**: React.lazy for route-based splitting
- **Image Optimization**: Optimized map tiles
- **Bundle Size**: Minimal dependencies
- **Caching**: Browser caching strategies

## 🆘 Troubleshooting

### Common Issues

1. **Map Not Loading**
   - Check internet connection
   - Verify Leaflet CSS import
   - Check console for errors

2. **API Calls Failing**
   - Verify backend server is running
   - Check CORS configuration
   - Validate JWT token

3. **Styling Issues**
   - Check Tailwind CSS compilation
   - Verify custom CSS imports
   - Check browser compatibility

4. **Build Errors**
   - Clear node_modules and reinstall
   - Check Node.js version
   - Verify all dependencies

## 🔮 Future Enhancements

- **PWA Support**: Progressive Web App features
- **Offline Mode**: Service worker implementation
- **Real-time Updates**: WebSocket integration
- **Advanced Charts**: More visualization options
- **Mobile App**: React Native version
- **Dark Mode**: Theme switching
- **Internationalization**: Multi-language support

## 📝 Development Guidelines

### Code Style
- Use functional components with hooks
- Follow React best practices
- Use meaningful component names
- Add proper comments and documentation

### File Organization
- Group related components
- Use consistent naming conventions
- Separate concerns (UI, logic, data)
- Keep components small and focused

## 📄 License

MIT License - see LICENSE file for details.

---

**EarthSlight Frontend** - Modern UI for environmental monitoring and real estate prediction. 🌍🏠 