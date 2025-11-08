require('dotenv').config();

// Debug environment variables immediately after loading dotenv
console.log('=== ENVIRONMENT VARIABLES ===');
console.log('MONGO_URI:', process.env.MONGO_URI ? 'Set' : 'Not set');
console.log('DATABASE_URI:', process.env.DATABASE_URI ? 'Set' : 'Not set');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '***' : 'Not set');
console.log('============================');

const express = require('express');
const cors = require('cors'); 
const connectDB = require('./config/db');
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Set fallback values if environment variables are missing
if (!process.env.MONGO_URI && !process.env.DATABASE_URI) {
  console.log('⚠️  No database URI found in environment, using fallback...');
  process.env.MONGO_URI = 'mongodb://127.0.0.1:27017/ecommerce-store';
}

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

// Connect to database
connectDB();

// Increase body size limits to allow large payloads (base64 images, large JSON)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors()); 

// Ensure CORS headers and preflight responses are always present.
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );

  // Preflight handling
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    return res.sendStatus(200);
  }

  next();
});

// Simple request logger to help during smoke tests
app.use((req, res, next) => {
  try {
    const bodyPreview = req.body ? JSON.stringify(req.body).slice(0, 500) : '';
    console.log(`[REQ] ${new Date().toISOString()} ${req.method} ${req.originalUrl} BODY: ${bodyPreview}`);
  } catch (e) {
    // ignore logging errors
  }
  next();
});

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => res.send('API is running...'));

app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/vendor', vendorRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅ Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});