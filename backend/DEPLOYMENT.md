# Backend Deployment Guide

## 🚀 Deployment Checklist

### 1. Environment Variables
Make sure to set these environment variables in your deployment platform:

#### Required Variables:
- `NODE_ENV=production`
- `PORT=5000` (or your platform's assigned port)
- `MONGODB_URI` - Your MongoDB Atlas connection string
- `JWT_SECRET` - Strong random string (use a password generator)
- `CORS_ORIGIN` - Your frontend URL(s), comma-separated

#### Optional but Recommended:
- `EMAIL_SERVICE=gmail`
- `EMAIL_USER` - Gmail account
- `EMAIL_PASS` - Gmail app password (16 characters)
- `ALERT_EMAIL` - Email for alerts
- `OCR_API_KEY` - For PDF OCR processing
- `OPENROUTER_KEY` - For AI features
- `OPENROUTER_URL=https://openrouter.ai/api/v1/chat/completions`
- `NOWTRICITY_API_KEY` - For carbon intensity data
- `NOWTRICITY_BASE_URL=https://www.nowtricity.com/api`

### 2. Platform-Specific Instructions

#### Render.com
1. Connect your GitHub repository
2. Select "Web Service"
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Add environment variables in dashboard
6. Health check path: `/api/health`

#### Railway.app
1. Create new project from GitHub
2. Add environment variables
3. Railway auto-detects Node.js and runs `npm start`
4. Set custom domain if needed

#### Heroku
```bash
heroku login
heroku create earthsight-backend
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI="your-mongo-uri"
heroku config:set JWT_SECRET="your-secret"
heroku config:set CORS_ORIGIN="https://your-frontend.com"
git push heroku main
```

#### Vercel (Serverless)
1. Install Vercel CLI: `npm i -g vercel`
2. Create `vercel.json`:
```json
{
  "version": 2,
  "builds": [{ "src": "server.js", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "/server.js" }]
}
```
3. Deploy: `vercel --prod`

### 3. MongoDB Setup (MongoDB Atlas)
1. Go to https://cloud.mongodb.com
2. Create a new cluster (free tier available)
3. Create a database user
4. Whitelist IP: `0.0.0.0/0` (all IPs) for deployment
5. Get connection string
6. Replace `<password>` in connection string
7. Set as `MONGODB_URI` environment variable

### 4. Post-Deployment Checks
- ✅ Visit `https://your-backend-url/api/health` - should return `{"status":"OK"}`
- ✅ Check MongoDB connection in logs
- ✅ Test CORS with frontend
- ✅ Verify email service (if configured)
- ✅ Test authentication endpoints
- ✅ Check environment endpoints work

### 5. Common Issues & Solutions

#### CORS Errors
- Make sure `CORS_ORIGIN` includes your exact frontend URL
- Include both `http://` and `https://` if needed
- Include `www` subdomain if used

#### MongoDB Connection Fails
- Check connection string format
- Verify IP whitelist in MongoDB Atlas
- Ensure user has correct permissions

#### Port Issues
- Use `process.env.PORT` - most platforms assign dynamic ports
- Don't hardcode port 5000 in production

#### Python/AI Model Issues
- Ensure Python is installed on the server
- Check `ai_model/requirements.txt` dependencies
- Some platforms may need buildpacks for Python

### 6. Security Best Practices
- ✅ Strong JWT_SECRET (32+ random characters)
- ✅ HTTPS only in production
- ✅ Rate limiting (consider adding helmet.js, express-rate-limit)
- ✅ Input validation on all endpoints
- ✅ Keep dependencies updated: `npm audit fix`
- ✅ Never commit `.env` file
- ✅ Use environment variables for all secrets

### 7. Monitoring
- Check logs regularly
- Set up error notifications (email alerts already configured)
- Monitor MongoDB usage
- Check API response times

### 8. Scaling Considerations
- MongoDB Atlas: Scale to M10+ for production load
- Add Redis for session management
- Consider CDN for static files
- Load balancer for multiple instances

## 📝 Quick Deploy Command Summary

```bash
# 1. Check all dependencies
npm install

# 2. Test locally with production config
NODE_ENV=production npm start

# 3. Push to deployment platform
git add .
git commit -m "Ready for deployment"
git push origin main

# 4. Platform will auto-deploy or use platform CLI
```

## 🔗 Important Endpoints
- Health Check: `GET /api/health`
- Auth: `POST /api/auth/register`, `POST /api/auth/login`
- Environment: `GET /api/environment/gfw-data`, `GET /api/environment/carbon-intensity/:country`
- Predictions: `POST /api/predict`

## 📞 Support
If deployment fails:
1. Check server logs
2. Verify all environment variables are set
3. Test endpoints with Postman
4. Check MongoDB connection
5. Verify CORS settings match frontend URL

---
**Status**: ✅ Ready for deployment
**Last Updated**: November 3, 2025
