# Backend CORS Configuration Guide

## Overview
Your backend is now configured to accept requests from:
- ✅ `http://localhost:5173` (Local Vite dev server)
- ✅ `http://localhost:3000` (Alternative local port)
- ✅ `https://earth-sight.onrender.com` (Your deployed frontend on Render)

## How It Works

### 1. Backend Configuration (server.js)
The backend now has explicit CORS configuration that allows:
- Your Render frontend: `https://earth-sight.onrender.com`
- Local development: `http://localhost:5173`
- Any localhost port in development mode

### 2. Frontend Configuration

#### For Local Development:
When running backend locally, use `.env.local`:
```bash
VITE_API_BASE=http://localhost:5000
```

#### For Render Deployment:
In Render dashboard, set environment variable:
```bash
VITE_API_BASE=http://your-local-ip:5000
```
OR if you deploy backend later:
```bash
VITE_API_BASE=https://your-backend.onrender.com
```

## Setup Instructions

### Running Backend Locally (Port 5000)
```bash
cd backend
npm install
npm run dev
```

### Frontend Options:

#### Option 1: Local Frontend + Local Backend
```bash
cd earthsight
# Create .env.local with:
# VITE_API_BASE=http://localhost:5000
npm run dev
```

#### Option 2: Render Frontend + Local Backend
1. Find your local IP address:
   - Windows: `ipconfig` (look for IPv4 Address)
   - Mac/Linux: `ifconfig` or `ip addr`

2. Update backend to accept your IP:
   - Add your IP to `allowedOrigins` in `backend/server.js`

3. In Render dashboard:
   - Set `VITE_API_BASE=http://YOUR_LOCAL_IP:5000`
   - Redeploy frontend

4. Run backend locally:
   ```bash
   cd backend
   npm run dev
   ```

## Testing CORS Configuration

### Test from Browser Console:
```javascript
// Should work from both localhost and Render
fetch('http://localhost:5000/api/environment/dummy-data')
  .then(r => r.json())
  .then(console.log)
```

### Check Backend Logs:
Backend will log all CORS requests:
```
🌍 CORS: Allowed origins: [...]
✅ CORS: Allowing origin: https://earth-sight.onrender.com
✅ CORS: Allowing origin: http://localhost:5173
```

## Common Issues

### Issue: "CORS policy: Origin not allowed"
**Solution**: 
1. Check backend logs for rejected origin
2. Add the origin to `allowedOrigins` array in `server.js`
3. Restart backend server

### Issue: Frontend can't connect to backend
**Solution**:
1. Verify backend is running: `http://localhost:5000`
2. Check `.env.local` has correct `VITE_API_BASE`
3. Restart frontend dev server after changing `.env` files

### Issue: Authentication not working
**Solution**:
1. Check `withCredentials: true` is set in axios config
2. Verify `credentials: true` in CORS config
3. Make sure both frontend and backend use same protocol (http/https)

## Environment Variables

### Backend (.env)
```bash
PORT=5000
MONGODB_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=https://earth-sight.onrender.com
```

### Frontend (.env.local)
```bash
VITE_API_BASE=http://localhost:5000
```

## Production Deployment Notes

### If Backend is Deployed:
1. Update backend `CORS_ORIGIN` to include backend URL
2. Update frontend `VITE_API_BASE` to deployed backend URL
3. Ensure both use HTTPS in production

### Current Setup (Local Backend + Render Frontend):
- Backend runs on your machine (port 5000)
- Frontend is deployed on Render
- Frontend makes requests to your local backend
- ⚠️ Your computer must be running and accessible

## Security Notes

- ✅ CORS is properly configured with explicit origins
- ✅ Credentials (cookies, auth headers) are supported
- ✅ Development mode allows localhost flexibility
- ✅ Production mode requires explicit origin approval
- ⚠️ Never commit `.env.local` to git (contains local config)
- ⚠️ Always use HTTPS in production

## Quick Reference

| Scenario | VITE_API_BASE | Backend Location |
|----------|---------------|------------------|
| Local Dev | `http://localhost:5000` | Local Machine |
| Render + Local Backend | `http://YOUR_IP:5000` | Local Machine |
| Full Production | `https://backend.onrender.com` | Render/Cloud |

## Testing Checklist

- [ ] Backend starts without errors
- [ ] Backend logs show allowed origins
- [ ] Frontend can reach backend API
- [ ] Authentication works (login/logout)
- [ ] Protected routes work correctly
- [ ] CORS errors don't appear in browser console

## Support

If you encounter issues:
1. Check backend console logs
2. Check browser console for errors
3. Verify environment variables are set correctly
4. Ensure backend is running and accessible
