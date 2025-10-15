const express = require('express');
const User = require('../models/User');
const { authenticateToken, generateToken } = require('../middleware/auth');
const emailService = require('../services/emailService');

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ 
        error: 'User with this email already exists' 
      });
    }

    // Create new user with isActive and emailNotifications enabled
    const user = new User({
      name,
      email,
      password,
      isActive: true,
      emailNotifications: true
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        emailNotifications: user.emailNotifications
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'User already exists' });
    }
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ error: 'Account is deactivated' });
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Send alert email to the logged-in user (with deduplication)
    try {
      console.log(`[ALERT] Checking login alert for:`, user.email);
      
      const loginAlertData = {
        type: 'login',
        icon: '🔔',
        severity: 'Info',
        location: 'User Login',
        lat: 0,
        lng: 0,
        timestamp: new Date().toISOString(),
        area: 0,
        confidence: 100,
        message: 'You have successfully logged in to EarthSlight.'
      };
      
      // Generate hash for this login alert (per user)
      const alertHash = `login_${user.email}`;
      
      // Check if login alert was recently sent (within 5 minutes cooldown)
      const LOGIN_COOLDOWN = 5 * 60 * 1000; // 5 minutes
      if (emailService.sentAlerts.has(alertHash)) {
        const lastSentTime = emailService.sentAlerts.get(alertHash);
        const timeSinceLastSent = Date.now() - lastSentTime;
        
        if (timeSinceLastSent < LOGIN_COOLDOWN) {
          console.log(`[ALERT] Skipping duplicate login alert for ${user.email} (sent ${Math.floor(timeSinceLastSent / 1000)}s ago)`);
          // Skip sending duplicate
        } else {
          // Cooldown expired, send alert
          await emailService.sendAlertToUser(user, loginAlertData);
          emailService.sentAlerts.set(alertHash, Date.now());
          console.log(`[ALERT] Login alert sent to:`, user.email);
        }
      } else {
        // First login alert for this user
        await emailService.sendAlertToUser(user, loginAlertData);
        emailService.sentAlerts.set(alertHash, Date.now());
        console.log(`[ALERT] Login alert sent to:`, user.email);
      }
    } catch (emailErr) {
      console.error('Failed to send login alert email:', emailErr);
    }

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        emailNotifications: user.emailNotifications
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    res.json({
      user: req.user
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, emailNotifications } = req.body;
    const updates = {};

    if (name) updates.name = name;
    if (typeof emailNotifications === 'boolean') updates.emailNotifications = emailNotifications;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;