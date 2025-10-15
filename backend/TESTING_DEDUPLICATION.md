# Alert Deduplication - Testing Guide

## ✅ FIXED: Duplicate Email Alerts

### Problem Summary
You were receiving duplicate emails for:
1. **Login Alerts** - Every time you logged in
2. **Environmental Alerts** - From the 5-minute scheduler

### Solution Applied

#### 1. Login Alert Deduplication
- **Cooldown**: 5 minutes per user
- **Hash Format**: `login_user@email.com`
- **Behavior**: 
  - First login → Email sent ✅
  - Login again within 5 min → Email skipped ⏭️
  - Login after 5+ min → New email sent ✅

#### 2. Environmental Alert Deduplication  
- **Cooldown**: 1 hour per alert type+location
- **Hash Format**: `type_location_severity`
- **Example**: `deforestation_Sagarmatha National Park, Nepal_High`
- **Behavior**:
  - New alert → Email sent to all users ✅
  - Same alert within 1 hour → Skipped ⏭️
  - After 1 hour → Can be sent again ✅

## Testing Instructions

### Test 1: Login Alert Deduplication

1. **Login First Time**
   - Go to login page
   - Enter credentials and login
   - ✅ Check email: You should receive "Login Alert"
   - ✅ Check console: `[ALERT] Login alert sent to: your@email.com`

2. **Login Again Immediately**
   - Logout and login again (within 5 minutes)
   - ❌ Check email: Should NOT receive another alert
   - ✅ Check console: `[ALERT] Skipping duplicate login alert for your@email.com (sent XXs ago)`

3. **Login After Cooldown**
   - Wait 5+ minutes
   - Login again
   - ✅ Check email: Should receive new alert
   - ✅ Check console: `[ALERT] Login alert sent to: your@email.com`

### Test 2: Environmental Alert Deduplication

1. **Check Backend Console**
   - Monitor backend terminal
   - Wait for scheduler trigger (every 5 minutes)
   - Look for these messages:

2. **First Alert Sent**
   ```
   🔄 Running scheduled environmental alert check...
   📤 Sending alerts to 1 users...
   ✅ Alert sent to User Name (user@email.com)
   🔖 Alert marked as sent: deforestation_Sagarmatha National Park, Nepal_High
   📊 Environmental alerts completed: 1 successful, 0 failed
   ```

3. **Duplicate Alert Skipped**
   ```
   🔄 Running scheduled environmental alert check...
   ⏭️ Skipping duplicate alert: deforestation at Sagarmatha National Park, Nepal (sent within last hour)
   ```

## Console Commands to Monitor

### Watch Backend Logs
```powershell
# Backend terminal will show:
[ALERT] Checking login alert for: user@email.com
[ALERT] Skipping duplicate login alert for user@email.com (sent 45s ago)
⏭️ Skipping duplicate alert: deforestation at Sagarmatha National Park, Nepal
```

## Expected Results

### ✅ Working Correctly
- Login once → 1 email received
- Login 5 times in 2 minutes → Only 1 email total
- Environment alert every 5 min → Only unique alerts sent (max 1 per hour for same type+location)

### ❌ If Still Broken
If you're still receiving duplicates:
1. Check backend server is restarted with new code
2. Clear browser localStorage (logout/login)
3. Check console for deduplication messages
4. Verify email timestamps to confirm duplicates

## Current Status

**Server Status**: ✅ Running with deduplication enabled
**Files Modified**:
- ✅ `backend/services/emailService.js` - Environmental alerts
- ✅ `backend/routes/auth.js` - Login alerts

**Cooldown Periods**:
- Login Alerts: 5 minutes
- Environmental Alerts: 1 hour

## Need Help?

If duplicates still occur:
1. Share backend console logs
2. Share email screenshots with timestamps
3. Confirm you've logged in multiple times within 5 minutes
4. Check if server was restarted after fix
