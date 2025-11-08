# 🚀 Quick Start Guide - Local Backend + Render Frontend

## What You Have Now

✅ **Backend (Local)**: Running on your computer at `http://localhost:5000`  
✅ **Frontend (Render)**: Deployed at `https://earth-sight.onrender.com`  
✅ **CORS**: Configured to allow both connections

## 🎯 How to Use

### Step 1: Start Your Backend Locally

**Option A - Using the batch file (Windows):**
```bash
# Just double-click: start-backend.bat
```

**Option B - Manual start:**
```bash
cd backend
npm run dev
```

You should see:
```
🌍 CORS: Allowed origins: [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  'https://earth-sight.onrender.com'
]
Server running on http://localhost:5000
Connected to MongoDB
```

### Step 2: Test Your Backend

Open browser and go to:
```
http://localhost:5000/api/environment/dummy-data
```

You should see JSON data. ✅

### Step 3: Use Your Render Frontend

Now open: `https://earth-sight.onrender.com`

Your frontend will make requests to `http://localhost:5000` (your local backend).

## ⚙️ Configuration Files

### Backend (.env)
Make sure your `backend/.env` has:
```bash
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NODE_ENV=development
```

### Frontend (On Render Dashboard)
Set environment variable in Render:
```bash
VITE_API_BASE=http://localhost:5000
```

⚠️ **Important**: Your Render frontend can only connect to your local backend when:
1. Your computer is ON
2. Backend server is RUNNING
3. You're on the same network OR using a tunneling service (like ngrok)

## 🔧 Troubleshooting

### Problem: "CORS Error" in browser console

**Check:**
1. Is backend running? Go to `http://localhost:5000`
2. Check backend console logs for CORS messages
3. Verify your origin is in the allowed list

**Fix:**
- Backend should automatically allow `https://earth-sight.onrender.com`
- If not, check `backend/server.js` line 30-35

### Problem: Frontend can't reach backend

**Possible causes:**
1. ❌ Backend not running → Start backend
2. ❌ Wrong API URL → Check `.env.local` or Render env vars
3. ❌ Firewall blocking → Allow port 5000 in firewall

**Solution:**
```bash
# Test if backend is accessible:
curl http://localhost:5000/api/environment/dummy-data

# Or in browser:
http://localhost:5000/api/environment/dummy-data
```

### Problem: Authentication not working

**Check:**
1. JWT_SECRET is set in backend `.env`
2. MongoDB is connected
3. Token is being sent in requests (check Network tab)

**Debug:**
```javascript
// In browser console on your Render site:
localStorage.getItem('token')
// Should show your JWT token
```

## 🌐 Network Setup (Optional)

### To access backend from anywhere:

#### Option 1: ngrok (Recommended for testing)
```bash
# Install ngrok: https://ngrok.com/
ngrok http 5000

# You'll get a URL like: https://abc123.ngrok.io
# Update Render env: VITE_API_BASE=https://abc123.ngrok.io
```

#### Option 2: Local Network Access
```bash
# Find your local IP:
ipconfig  # Windows
ifconfig  # Mac/Linux

# Example: 192.168.1.100
# Update Render env: VITE_API_BASE=http://192.168.1.100:5000
# Add this IP to backend allowedOrigins in server.js
```

## 📊 Current Setup Summary

```
┌─────────────────────────────────────┐
│  Render Frontend                    │
│  https://earth-sight.onrender.com   │
│                                     │
│  Makes requests to ↓                │
└─────────────────────────────────────┘
            ↓
┌─────────────────────────────────────┐
│  Your Local Backend                 │
│  http://localhost:5000              │
│                                     │
│  Running on your computer           │
└─────────────────────────────────────┘
            ↓
┌─────────────────────────────────────┐
│  MongoDB Database                   │
│  (Local or Cloud)                   │
└─────────────────────────────────────┘
```

## ✅ Testing Checklist

Before using your app:
- [ ] Backend server is running (check terminal)
- [ ] Backend accessible at http://localhost:5000
- [ ] MongoDB is connected (check backend logs)
- [ ] Render frontend loads without errors
- [ ] Can login/register successfully
- [ ] Protected routes work (Deforestation, Real Estate)
- [ ] No CORS errors in browser console

## 🔐 Security Notes

**Current setup is for development only!**

For production:
1. Deploy backend to Render/Heroku/AWS
2. Use HTTPS for both frontend and backend
3. Update CORS origins to production URLs only
4. Never expose local backend to internet without security

## 📝 Common Commands

```bash
# Start backend
cd backend && npm run dev

# Start frontend locally (for development)
cd earthsight && npm run dev

# Check backend status
curl http://localhost:5000/api/environment/dummy-data

# View backend logs
# Just check the terminal where backend is running

# Stop backend
# Press Ctrl+C in the terminal
```

## 🆘 Need Help?

1. Check backend terminal for errors
2. Check browser console for frontend errors
3. Read `CORS_SETUP_GUIDE.md` for detailed info
4. Verify all environment variables are set correctly

## 🎉 You're Ready!

Just run `start-backend.bat` and visit `https://earth-sight.onrender.com`!

Your local backend will handle all API requests from your deployed frontend.
