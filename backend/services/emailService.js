const nodemailer = require('nodemailer');
const cron = require('node-cron');
const User = require('../models/User');

class EmailService {
  constructor() {
    this.transporter = null;
    this.isInitialized = false;
    this.init();
  }

  init() {
    try {
      const emailUser = process.env.EMAIL_USER;
      const emailPass = process.env.EMAIL_PASS;
      const emailService = process.env.EMAIL_SERVICE || 'gmail';

      if (!emailUser || !emailPass) {
        console.warn('EMAIL_USER or EMAIL_PASS not found in environment variables');
        return;
      }

      // Create transporter with improved Gmail configuration
      this.transporter = nodemailer.createTransport({
        service: emailService,
        auth: {
          user: emailUser,
          pass: emailPass
        },
        secure: true,
        port: 465,
        tls: {
          rejectUnauthorized: false,
          ciphers: 'SSLv3'
        },
        debug: process.env.NODE_ENV === 'development',
        logger: process.env.NODE_ENV === 'development'
      });

      this.isInitialized = true;
      console.log('📧 Email service initialized successfully');
      
      // Test email connection
      setTimeout(() => this.testEmailConnection(), 2000);
    } catch (error) {
      console.error('Failed to initialize email service:', error);
    }
  }

  // Test email connection
  async testEmailConnection() {
    try {
      await this.transporter.verify();
      console.log('✅ Email service connected successfully');
      return true;
    } catch (error) {
      console.warn('⚠️ Email service connection test failed (service still available):', error.message);
      return false;
    }
  }

  // Start the alert scheduler (runs every 5 minutes)
  startAlertScheduler() {
    if (!this.isInitialized) {
      console.warn('Email service not initialized, skipping scheduler');
      return;
    }

    // Schedule alerts every 5 minutes
    cron.schedule('*/5 * * * *', async () => {
      console.log('🔄 Running scheduled environmental alert check...');
      try {
        await this.sendEnvironmentalAlerts();
      } catch (error) {
        console.error('❌ Error in scheduled alert check:', this.getErrorMessage(error));
        
        // If it's a database error, log but don't crash
        if (error.message?.includes('MongoServerError') || error.message?.includes('ECONNREFUSED')) {
          console.log('⚠️ Database not available, skipping this alert cycle');
        }
      }
    });

    console.log('⏰ Environmental alert scheduler started (every 5 minutes)');
  }

  // Send environmental alerts to all users
  async sendEnvironmentalAlerts() {
    if (!this.isInitialized) {
      console.log('⚠️ Email service not initialized, skipping alerts');
      return;
    }

    try {
      // Get users or use fallback email
      let users = [];
      
      // First try to use environment email if available
      const fallbackEmail = process.env.ALERT_EMAIL;
      if (fallbackEmail) {
        console.log('🎯 Using environment email for alerts');
        users = [{
          name: 'Environment User',
          email: fallbackEmail,
          _id: 'env_user'
        }];
      } else {
        // Fallback to database users if no environment email
        try {
          users = await User.find({ 
            isActive: true, 
            email: { $exists: true, $ne: null },
            emailNotifications: true 
          });
          console.log(`📋 Found ${users.length} users with email notifications enabled`);
        } catch (dbError) {
          console.log('⚠️ Database not available and no environment email configured');
        }
      }

      if (users.length === 0) {
        console.log('No users with emails found');
        return;
      }

      console.log(`📤 Sending alerts to ${users.length} users...`);

      // Generate dummy environmental data
      const environmentalData = this.generateDummyAlertData();
      
      let successCount = 0;
      let errorCount = 0;

      // Send alerts to each user with better error handling
      for (const user of users) {
        try {
          await this.sendAlertToUser(user, environmentalData);
          successCount++;
          console.log(`✅ Alert sent to ${user.name} (${user.email})`);
          
          // Add delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(`❌ Failed to send alert to ${user.name} (${user.email}):`, this.getErrorMessage(error));
          errorCount++;
          
          // If it's a network error, wait longer before next attempt
          if (this.isNetworkError(error)) {
            await new Promise(resolve => setTimeout(resolve, 3000));
          }
        }
      }

      console.log(`📊 Environmental alerts completed: ${successCount} successful, ${errorCount} failed`);
    } catch (error) {
      console.error('Error in sendEnvironmentalAlerts:', error.message);
      throw error;
    }
  }

  // Send alert to a specific user
  async sendAlertToUser(user, environmentalData) {
    if (!this.isInitialized) {
      throw new Error('Email service not initialized');
    }

    // Validate email format
    if (!user.email || !user.email.includes('@')) {
      throw new Error(`Invalid email format: ${user.email}`);
    }

    const { subject, html, text } = this.formatAlertEmail(user, environmentalData);
    
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: subject,
        text: text,
        html: html
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      // Add more context to the error
      error.userId = user._id;
      error.userEmail = user.email;
      error.userName = user.name;
      throw error;
    }
  }

  // Send custom environmental alert
  async sendCustomAlert(message, type = 'general') {
    if (!this.isInitialized) {
      throw new Error('Email service not initialized');
    }

    try {
      // Get users or use fallback email
      let users = [];
      
      // First try to use environment email if available
      const fallbackEmail = process.env.ALERT_EMAIL;
      if (fallbackEmail) {
        console.log('🎯 Using environment email for alerts');
        users = [{
          name: 'Environment User',
          email: fallbackEmail,
          _id: 'env_user'
        }];
      } else {
        // Fallback to database users if no environment email
        try {
          users = await User.find({ 
            isActive: true, 
            email: { $exists: true, $ne: null },
            emailNotifications: true 
          });
          console.log(`📋 Found ${users.length} users with email notifications enabled`);
        } catch (dbError) {
          console.log('⚠️ Database not available and no environment email configured');
        }
      }

      if (users.length === 0) {
        throw new Error('No users with emails found and no fallback email configured');
      }

      // Format the email based on type
      const alertTypes = {
        deforestation: { subject: '🌳 DEFORESTATION ALERT', emoji: '🌳🪓', color: '#d32f2f' },
        mining: { subject: '⛏️ MINING ALERT', emoji: '⛏️💥', color: '#f57c00' },
        fire: { subject: '🔥 FOREST FIRE ALERT', emoji: '🔥🚨', color: '#d32f2f' },
        general: { subject: '⚠️ ENVIRONMENTAL ALERT', emoji: '⚠️📢', color: '#1976d2' }
      };

      const alertConfig = alertTypes[type] || alertTypes.general;
      const timestamp = new Date().toLocaleString();

      let successCount = 0;
      let errorCount = 0;
      const results = [];

      // Send to each user/email
      for (const user of users) {
        try {
          // Validate email format
          if (!user.email || !user.email.includes('@')) {
            throw new Error(`Invalid email format: ${user.email}`);
          }

          const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: `${alertConfig.subject} - EarthSlight Alert System`,
            html: this.createCustomAlertHTML(message, alertConfig, timestamp, user.name),
            text: this.createCustomAlertText(message, type, timestamp, user.name)
          };

          await this.transporter.sendMail(mailOptions);

          successCount++;
          results.push({
            user: user.name || user._id,
            status: 'success',
            email: user.email
          });
          
          console.log(`✅ Alert sent to ${user.name || user._id} (${user.email})`);

        } catch (error) {
          errorCount++;
          const errorMsg = this.getErrorMessage(error);
          results.push({
            user: user.name || user._id,
            status: 'error',
            error: errorMsg,
            email: user.email
          });
          
          console.error(`❌ Failed to send alert to ${user.name || user._id}: ${errorMsg}`);
        }
      }

      console.log(`📊 Alert sending complete: ${successCount} success, ${errorCount} failed`);
      
      return {
        success: successCount > 0,
        successCount,
        errorCount,
        totalAttempts: users.length,
        results
      };

    } catch (error) {
      console.error('Error in sendCustomAlert:', error.message);
      throw error;
    }
  }

  // Helper function to check if error is network-related
  isNetworkError(error) {
    const networkErrors = ['ECONNRESET', 'ENOTFOUND', 'ETIMEDOUT', 'ECONNREFUSED'];
    return networkErrors.some(code => error.message?.includes(code) || error.code === code);
  }

  // Helper function to get clean error message
  getErrorMessage(error) {
    if (error.message) {
      return error.message;
    }
    return 'Unknown error';
  }

  // Generate dummy environmental alert data
  generateDummyAlertData() {
    const riskTypes = [
      { type: 'deforestation', icon: '🌳', severity: 'High' },
      { type: 'mining', icon: '⛏️', severity: 'Medium' },
      { type: 'forest_fire', icon: '🔥', severity: 'High' }
    ];

    const locations = [
      { name: 'Kathmandu, Nepal', lat: 27.7172, lng: 85.324 },
      { name: 'Chitwan National Park, Nepal', lat: 27.5291, lng: 84.3542 },
      { name: 'Langtang National Park, Nepal', lat: 28.2096, lng: 85.5418 },
      { name: 'Sagarmatha National Park, Nepal', lat: 27.9881, lng: 86.9250 }
    ];

    const randomRisk = riskTypes[Math.floor(Math.random() * riskTypes.length)];
    const randomLocation = locations[Math.floor(Math.random() * locations.length)];

    return {
      type: randomRisk.type,
      icon: randomRisk.icon,
      severity: randomRisk.severity,
      location: randomLocation.name,
      lat: randomLocation.lat,
      lng: randomLocation.lng,
      timestamp: new Date().toISOString(),
      area: Math.floor(Math.random() * 1000) + 100,
      confidence: Math.floor(Math.random() * 30) + 70
    };
  }

  // Format alert email for standard environmental alerts
  formatAlertEmail(user, data) {
  const severityColor = data.severity === 'High' ? '#d32f2f' : data.severity === 'Medium' ? '#f57c00' : '#1976d2';
  const subject = `${data.icon} Environmental Alert: ${data.type.charAt(0).toUpperCase() + data.type.slice(1)} Detected`;
  // Fallbacks for lat/lng
  const lat = (typeof data.lat === 'number' && !isNaN(data.lat)) ? data.lat : 0;
  const lng = (typeof data.lng === 'number' && !isNaN(data.lng)) ? data.lng : 0;
  const mainHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Environmental Alert</title>
</head>
<body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
    <div style="background-color: ${severityColor}; color: white; padding: 20px; text-align: center;">
      <h1 style="margin: 0; font-size: 24px;">${data.icon} Environmental Alert</h1>
      <p style="margin: 10px 0 0 0; font-size: 16px;">EarthSlight Monitoring System</p>
    </div>
    <div style="padding: 30px;">
      <p style="margin: 0 0 20px 0; font-size: 16px;">Dear ${user.name || 'User'},</p>
      <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 4px; padding: 15px; margin: 20px 0;">
        <h2 style="margin: 0 0 15px 0; color: ${severityColor}; font-size: 18px;">
          ${data.type.charAt(0).toUpperCase() + data.type.slice(1)} Alert
        </h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 5px 0; font-weight: bold;">Location:</td><td style="padding: 5px 0;">${data.location}</td></tr>
          <tr><td style="padding: 5px 0; font-weight: bold;">Coordinates:</td><td style="padding: 5px 0;">Lat: ${(typeof lat === 'number' && !isNaN(lat)) ? lat.toFixed(4) : '0.0000'}, Lon: ${(typeof lng === 'number' && !isNaN(lng)) ? lng.toFixed(4) : '0.0000'}</td></tr>
          <tr><td style="padding: 5px 0; font-weight: bold;">Severity:</td><td style="padding: 5px 0; color: ${severityColor}; font-weight: bold;">${data.severity}</td></tr>
          <tr><td style="padding: 5px 0; font-weight: bold;">Area Affected:</td><td style="padding: 5px 0;">${data.area} hectares</td></tr>
          <tr><td style="padding: 5px 0; font-weight: bold;">Confidence:</td><td style="padding: 5px 0;">${data.confidence}%</td></tr>
          <tr><td style="padding: 5px 0; font-weight: bold;">Detected:</td><td style="padding: 5px 0;">${new Date(data.timestamp).toLocaleString()}</td></tr>
        </table>
      </div>
      <p style="margin: 20px 0; color: #666; font-size: 14px;">
        This is an automated alert from the EarthSlight environmental monitoring system. 
        Please take appropriate action based on the severity and type of the detected event.
      </p>
      <div style="background-color: #f8f9fa; padding: 15px; border-radius: 4px; margin: 20px 0;">
        <p style="margin: 0; font-size: 12px; color: #666; text-align: center;">
          EarthSlight - Environmental Risk Monitoring & Real Estate Prediction<br>
          This email was sent to ${user.email}
        </p>
      </div>
    </div>
  </div>
</body>
</html>`;
  const mainText = `
Environmental Alert - ${data.type.charAt(0).toUpperCase() + data.type.slice(1)}

Dear ${user.name || 'User'},

An environmental alert has been detected by the EarthSlight monitoring system.

Details:
- Type: ${data.type.charAt(0).toUpperCase() + data.type.slice(1)}
- Location: ${data.location}
- Coordinates: Lat: ${(typeof lat === 'number' && !isNaN(lat)) ? lat.toFixed(4) : '0.0000'}, Lon: ${(typeof lng === 'number' && !isNaN(lng)) ? lng.toFixed(4) : '0.0000'}
- Severity: ${data.severity}
- Area Affected: ${data.area} hectares
- Confidence: ${data.confidence}%
- Detected: ${new Date(data.timestamp).toLocaleString()}

This is an automated alert from the EarthSlight environmental monitoring system.

EarthSlight Team
`;
  return { subject, html: mainHtml, text: mainText };
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Environmental Alert</title>
</head>
<body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
    <div style="background-color: ${severityColor}; color: white; padding: 20px; text-align: center;">
      <h1 style="margin: 0; font-size: 24px;">${data.icon} Environmental Alert</h1>
      <p style="margin: 10px 0 0 0; font-size: 16px;">EarthSlight Monitoring System</p>
    </div>
    <div style="padding: 30px;">
      <p style="margin: 0 0 20px 0; font-size: 16px;">Dear ${user.name || 'User'},</p>
      <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 4px; padding: 15px; margin: 20px 0;">
        <h2 style="margin: 0 0 15px 0; color: ${severityColor}; font-size: 18px;">
          ${data.type.charAt(0).toUpperCase() + data.type.slice(1)} Alert
        </h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 5px 0; font-weight: bold;">Location:</td><td style="padding: 5px 0;">${data.location}</td></tr>
          <tr><td style="padding: 5px 0; font-weight: bold;">Coordinates:</td><td style="padding: 5px 0;">Lat: ${(typeof data.lat === 'number' && !isNaN(data.lat) ? data.lat : 0).toFixed(4)}, Lon: ${(typeof data.lng === 'number' && !isNaN(data.lng) ? data.lng : 0).toFixed(4)}</td></tr>
          <tr><td style="padding: 5px 0; font-weight: bold;">Severity:</td><td style="padding: 5px 0; color: ${severityColor}; font-weight: bold;">${data.severity}</td></tr>
          <tr><td style="padding: 5px 0; font-weight: bold;">Area Affected:</td><td style="padding: 5px 0;">${data.area} hectares</td></tr>
          <tr><td style="padding: 5px 0; font-weight: bold;">Confidence:</td><td style="padding: 5px 0;">${data.confidence}%</td></tr>
          <tr><td style="padding: 5px 0; font-weight: bold;">Detected:</td><td style="padding: 5px 0;">${new Date(data.timestamp).toLocaleString()}</td></tr>
        </table>
      </div>
      <p style="margin: 20px 0; color: #666; font-size: 14px;">
        This is an automated alert from the EarthSlight environmental monitoring system. 
        Please take appropriate action based on the severity and type of the detected event.
      </p>
      <div style="background-color: #f8f9fa; padding: 15px; border-radius: 4px; margin: 20px 0;">
        <p style="margin: 0; font-size: 12px; color: #666; text-align: center;">
          EarthSlight - Environmental Risk Monitoring & Real Estate Prediction<br>
          This email was sent to ${user.email}
        </p>
      </div>
    </div>
  </div>
</body>
</html>`;
  const text = `
Environmental Alert - ${data.type.charAt(0).toUpperCase() + data.type.slice(1)}

Dear ${user.name || 'User'},

An environmental alert has been detected by the EarthSlight monitoring system.

Details:
- Type: ${data.type.charAt(0).toUpperCase() + data.type.slice(1)}
- Location: ${data.location}
- Coordinates: Lat: ${(typeof data.lat === 'number' && !isNaN(data.lat) ? data.lat : 0).toFixed(4)}, Lon: ${(typeof data.lng === 'number' && !isNaN(data.lng) ? data.lng : 0).toFixed(4)}
- Severity: ${data.severity}
- Area Affected: ${data.area} hectares
- Confidence: ${data.confidence}%
- Detected: ${new Date(data.timestamp).toLocaleString()}

This is an automated alert from the EarthSlight environmental monitoring system.

EarthSlight Team
`;
  }

  // Get service status
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      hasCredentials: !!(process.env.EMAIL_USER && process.env.EMAIL_PASS),
      emailUser: process.env.EMAIL_USER || 'not configured',
      service: process.env.EMAIL_SERVICE || 'gmail'
    };
  }
}

module.exports = new EmailService();
