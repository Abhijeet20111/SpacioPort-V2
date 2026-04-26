const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const spaceRoutes = require('./routes/space.routes');
const bookingRoutes = require('./routes/booking.routes');
const wishlistRoutes = require('./routes/wishlist.routes');
const campaignRoutes = require('./routes/campaign.routes');
const inquiryRoutes = require('./routes/inquiry.routes');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:8080'],
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/spaces', spaceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/inquiries', inquiryRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'SpacioPort API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/spacioport')
  .then(() => {
    console.log('✅ Connected to MongoDB (local)');
    app.listen(PORT, () => {
      console.log(`🚀 SpacioPort API running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('\n💡 Make sure MongoDB is installed and running on your PC.');
    console.log('   Download: https://www.mongodb.com/try/download/community');
    console.log('   Start:    mongod --dbpath /path/to/your/data/folder\n');
    process.exit(1);
  });
