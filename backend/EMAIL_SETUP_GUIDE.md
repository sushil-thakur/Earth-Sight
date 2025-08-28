# Email Alert Setup Guide

Since Telegram is banned in Nepal, we've switched to email alerts for environmental monitoring.

## Step 1: Gmail App Password Setup

1. **Enable 2-Factor Authentication** on your Gmail account:
   - Go to https://myaccount.google.com/security
   - Turn on 2-Step Verification

2. **Create an App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Copy the 16-character app password

## Step 2: Update .env Configuration

Replace your email settings in the `.env` file:

```
# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_16_character_app_password
ALERT_EMAIL=sushilt2059@gmail.com
```

**Example:**
```
EMAIL_SERVICE=gmail
EMAIL_USER=earthslight.alerts@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
ALERT_EMAIL=sushilt2059@gmail.com
```

## Step 3: Alternative Email Services

If you prefer other email services:

### Outlook/Hotmail:
```
EMAIL_SERVICE=hotmail
EMAIL_USER=your_email@outlook.com
EMAIL_PASS=your_password
```

### Yahoo Mail:
```
EMAIL_SERVICE=yahoo
EMAIL_USER=your_email@yahoo.com
EMAIL_PASS=your_app_password
```

### Custom SMTP:
```
EMAIL_SERVICE=
EMAIL_HOST=smtp.your-provider.com
EMAIL_PORT=587
EMAIL_SECURE=true
EMAIL_USER=your_email@domain.com
EMAIL_PASS=your_password
```

## Step 4: Test the Setup

After updating the .env file, restart the server and test:

```bash
# Test email alert
curl -X POST http://localhost:5000/api/email/test-alert \
  -H "Content-Type: application/json" \
  -d '{"message": "Test deforestation alert", "type": "deforestation"}'

# Check email status
curl http://localhost:5000/api/email/status
```

## Alert Types Supported

- **deforestation**: 🌳🪓 Forest clearing alerts
- **mining**: ⛏️💥 Mining operation alerts  
- **fire**: 🔥🚨 Wildfire alerts
- **general**: ⚠️📢 General environmental alerts

## Features

✅ **HTML Email Templates** - Beautiful, professional alerts  
✅ **Fallback Text Format** - Works with all email clients  
✅ **Automatic Scheduling** - Alerts every 5 minutes  
✅ **Multiple Recipients** - Database users + fallback email  
✅ **Error Handling** - Resilient to network issues  
✅ **Nepal-Friendly** - No blocked services  

## Security Notes

- Use App Passwords, never your main email password
- Keep EMAIL_PASS in .env file (never commit to git)
- ALERT_EMAIL receives all environmental alerts
- Service works offline when database unavailable

## Troubleshooting

1. **"Authentication failed"** - Check app password
2. **"Service not initialized"** - Verify EMAIL_USER and EMAIL_PASS
3. **"No recipients found"** - Ensure ALERT_EMAIL is set
4. **Emails not received** - Check spam folder first
