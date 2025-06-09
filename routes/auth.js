import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Register a new admin user
router.post('/register', async (req, res) => {
  try {
    console.log('Registration attempt:', req.body);
    
    const { username, email, password } = req.body;
    
    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username, email, and password are required' 
      });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'User already exists with this email or username' 
      });
    }
    
    // Create new user
    const user = new User({
      username,
      email,
      password,
      role: 'admin'
    });
    
    await user.save();
    console.log('User created successfully:', user.username);
    
    // Set session
    req.session.userId = user._id;
    
    res.status(201).json({ 
      success: true, 
      message: 'User registered successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Registration failed: ' + err.message 
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    console.log('Login attempt:', req.body);
    
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }
    
    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }
    
    // Set session
    req.session.userId = user._id;
    console.log('Login successful for user:', user.username);
    
    res.json({ 
      success: true, 
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Login failed: ' + err.message 
    });
  }
});

// Check auth status
router.get('/status', (req, res) => {
  console.log('Auth status check - Session:', req.session);
  if (req.session && req.session.userId) {
    return res.json({ 
      success: true, 
      isAuthenticated: true 
    });
  }
  
  res.json({ 
    success: true, 
    isAuthenticated: false 
  });
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout Error:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Logout failed' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Logged out successfully' 
    });
  });
});

export default router;
