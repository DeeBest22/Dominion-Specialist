import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

// ES Module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3000;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'public/uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

export const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    // Accept images and videos
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed!'), false);
    }
  }
});

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://faithabayomi18:f1vouroluw11972@dominionspecialist.cdp3oi9.mongodb.net/?retryWrites=true&w=majority&appName=dominionspecialist');
    console.log('MongoDB connected...');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

connectDB();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Create uploads directory if it doesn't exist
import fs from 'fs';
const uploadsDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'news-website-secret-key-2025',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ 
    mongoUrl: process.env.MONGODB_URI || 'mongodb+srv://faithabayomi18:f1vouroluw11972@dominionspecialist.cdp3oi9.mongodb.net/?retryWrites=true&w=majority&appName=dominionspecialist',
    ttl: 14 * 24 * 60 * 60 // 14 days
  }),
  cookie: {
    maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
    secure: false, // Set to true in production with HTTPS
    httpOnly: true
  }
}));

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

// Import routes after middleware setup
import authRoutes from './routes/auth.js';
import newsRoutes from './routes/news.js';
import adminRoutes from './routes/admin.js';
import { isAuthenticated } from './middleware/auth.js';

// Routes
app.use('/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/admin', isAuthenticated, adminRoutes);

// Main Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/admin', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// Catch-all route for SPA
app.get('*', (req, res) => {
  // Check if it's an API route
  if (req.path.startsWith('/api') || req.path.startsWith('/auth') || req.path.startsWith('/admin')) {
    return res.status(404).json({ success: false, message: 'Route not found' });
  }
  
  // For other routes, serve the main page
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  
  // Ensure we always send JSON for API routes
  if (req.path.startsWith('/api') || req.path.startsWith('/auth') || req.path.startsWith('/admin')) {
    return res.status(500).json({ 
      success: false, 
      message: 'Server Error', 
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
  
  res.status(500).send('Something went wrong!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
