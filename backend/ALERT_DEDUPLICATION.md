# Alert Deduplication System

## Problem
The system was sending duplicate emails for TWO types of alerts:

### 1. Environmental Alerts (Scheduled)
- The scheduler runs every 5 minutes
- The `generateDummyAlertData()` function uses random selection
- The same alert (type + location + severity) could be randomly generated multiple times
- No tracking mechanism existed to prevent duplicate alerts

### 2. Login Alerts (User-triggered)
- Sent every time a user logs in
- If user refreshes or logs in multiple times quickly, duplicate emails are sent
- No cooldown period existed

## Solution Implemented

### 1. Alert Tracking System (EmailService)
Added a shared `Map` to track ALL sent alerts with timestamps:
```javascript
// In emailService.js constructor
this.sentAlerts = new Map(); // Format: { alertHash: timestamp }
this.ALERT_COOLDOWN = 60 * 60 * 1000; // 1 hour cooldown for environmental alerts
```

### 2. Environmental Alert Hash Generation
Created unique identifiers for environmental alerts based on:
- Alert type (deforestation, mining, forest_fire)
- Location name
- Severity level

**Example hash**: `deforestation_Sagarmatha National Park, Nepal_High`

This ignores timestamp and random values (area, confidence) to identify truly unique alerts.

### 3. Login Alert Hash Generation
Created unique identifiers per user:
**Example hash**: `login_user@email.com`

**Cooldown**: 5 minutes (prevents spam on multiple quick logins)

### 4. Deduplication Logic

#### Environmental Alerts (emailService.js)
Before sending alerts:
1. Generate hash for the new alert
2. Check if same alert was sent within last hour
3. If yes: Skip sending (log skip message)
4. If no: Send to all users and mark as sent

#### Login Alerts (auth.js)
Before sending login notification:
1. Generate hash: `login_${user.email}`
2. Check if alert was sent within last 5 minutes
3. If yes: Skip sending (log skip message)
4. If no: Send to user and mark as sent with timestamp

### 5. Automatic Cleanup
Old alert tracking entries are automatically removed:
- When cooldown period expires (1 hour for environmental, 5 min for login)
- During cleanup of entries older than 2x cooldown (2 hours)

## How It Works

```
┌─────────────────────────────────────────────────────────────┐
│  Every 5 minutes: Scheduler triggers                        │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  Generate random alert data                                 │
│  (type, location, severity, area, confidence)               │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  Create hash: type_location_severity                        │
│  Example: "deforestation_Sagarmatha National Park_High"     │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  Check if hash exists in sentAlerts Map                     │
└─────────────────────┬───────────────────────────────────────┘
                      │
            ┌─────────┴─────────┐
            │                   │
            ▼                   ▼
    ┌──────────────┐    ┌──────────────┐
    │ Hash exists  │    │ Hash new or  │
    │ (< 1hr ago)  │    │ expired      │
    └──────┬───────┘    └──────┬───────┘
           │                   │
           ▼                   ▼
    ┌──────────────┐    ┌──────────────┐
    │ SKIP sending │    │ SEND alerts  │
    │ Log skip msg │    │ to all users │
    └──────────────┘    └──────┬───────┘
                               │
                               ▼
                        ┌──────────────┐
                        │ Mark as sent │
                        │ in Map       │
                        └──────────────┘
```

## Console Output Examples

### Environmental Alerts

**When duplicate alert is detected:**
```
⏭️  Skipping duplicate alert: deforestation at Sagarmatha National Park, Nepal (sent within last hour)
```

**When new alert is sent:**
```
📤 Sending alerts to 1 users...
✅ Alert sent to User Name (user@email.com)
🔖 Alert marked as sent: deforestation_Sagarmatha National Park, Nepal_High
📊 Environmental alerts completed: 1 successful, 0 failed
```

### Login Alerts

**When duplicate login alert is detected:**
```
[ALERT] Checking login alert for: user@email.com
[ALERT] Skipping duplicate login alert for user@email.com (sent 45s ago)
```

**When new login alert is sent:**
```
[ALERT] Checking login alert for: user@email.com
[ALERT] Login alert sent to: user@email.com
```

## Configuration

### Environmental Alerts
**Cooldown Period**: 1 hour (60 * 60 * 1000 ms)
- Location: `emailService.js` constructor
- Can be adjusted: `this.ALERT_COOLDOWN`
- Recommended: 30 minutes to 2 hours

### Login Alerts
**Cooldown Period**: 5 minutes (5 * 60 * 1000 ms)
- Location: `routes/auth.js` login endpoint
- Can be adjusted: `LOGIN_COOLDOWN`
- Recommended: 3-10 minutes

**Cleanup Threshold**: 2x cooldown period
- Automatically removes old entries
- Prevents memory buildup
- Shared across both alert types

## Benefits

✅ **No more duplicate emails**: Same alert won't be sent twice within cooldown period
✅ **Memory efficient**: Old entries are automatically cleaned up
✅ **Flexible**: Cooldown period can be easily adjusted
✅ **Transparent**: All actions are logged for debugging
✅ **Maintains randomness**: Different alerts can still be generated

## Technical Details

### Files Modified
1. `backend/services/emailService.js` - Environmental alert deduplication
2. `backend/routes/auth.js` - Login alert deduplication

### New Methods Added (emailService.js)
1. `generateAlertHash(alertData)` - Creates unique identifier for environmental alerts
2. `isAlertRecentlySent(alertHash)` - Checks if alert was sent recently
3. `markAlertAsSent(alertHash)` - Records alert as sent with timestamp

### Constructor Updates (emailService.js)
```javascript
// Track sent alerts to prevent duplicates (shared for all alert types)
this.sentAlerts = new Map(); // Format: { alertHash: timestamp }
this.ALERT_COOLDOWN = 60 * 60 * 1000; // 1 hour cooldown for environmental alerts
```

### Login Route Updates (auth.js)
```javascript
// In POST /login endpoint
const alertHash = `login_${user.email}`;
const LOGIN_COOLDOWN = 5 * 60 * 1000; // 5 minutes

// Check sentAlerts Map before sending
if (emailService.sentAlerts.has(alertHash)) {
  const timeSinceLastSent = Date.now() - emailService.sentAlerts.get(alertHash);
  if (timeSinceLastSent < LOGIN_COOLDOWN) {
    // Skip duplicate
  }
}
```

## Testing

### Environmental Alerts
Monitor the console logs:
1. Wait for scheduler to trigger (every 5 minutes)
2. First run: Alert should be sent
3. Within next hour: Same alert type+location should be skipped
4. After 1 hour: Same alert can be sent again if randomly generated

### Login Alerts
Test by logging in:
1. Login once: Alert email should be sent
2. Login again within 5 minutes: Alert should be skipped (check console)
3. Wait 5+ minutes and login: New alert should be sent

## Future Enhancements

Consider implementing:
- Database persistence for alert tracking (survives server restarts)
- Admin dashboard to view alert history
- Configurable cooldown periods per alert type
- User preferences for alert frequency
- Real-time environmental data integration
