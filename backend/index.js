const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('rate-limiter-flexible');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const initializeSocket = require('./socket');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Initialize Socket.io
initializeSocket(io);

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = new rateLimit.RateLimiterMemory({
  points: 100, // 100 requests
  duration: 60, // per 60 seconds
});

app.use((req, res, next) => {
  try {
    limiter.consume(req.ip);
    next();
  } catch (err) {
    res.status(429).json({ message: 'Too many requests' });
  }
});

// MongoDB connection
connectDB();

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Secure Chat API' });
});

// Auth routes
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;